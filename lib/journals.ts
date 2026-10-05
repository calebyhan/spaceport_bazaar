import "server-only";

import { closeSync, openSync, readdirSync, readSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

import { readJournal, type Entry } from "@/worker/audit/journal";
import { ReportBuilder, type RunReport } from "@/worker/audit/report";
import { SILENT_AFTER_MS, StatusBuilder, type StatusView } from "@/worker/audit/status";
import { formatTrace, TraceBuilder } from "@/worker/audit/trace";

// The dashboard reads the worker's local journals directly, so a run is
// visible live and afterwards with no database. Every worker, simulator and
// tournament journal lives somewhere under one root (default `.local`).
export type JournalFile = { id: string; path: string; size: number; modifiedAt: number };
export type RunView = {
  file: JournalFile; status: StatusView; report: RunReport;
  live: boolean; entries: number; tornTail: boolean; startedAt: number;
};

const MAX_DEPTH = 6;
const CHUNK_BYTES = 4 << 20;
const CACHE_LIMIT = 64;

export function journalRoot(): string {
  return resolve(process.env.BAZAAR_JOURNAL_ROOT || ".local");
}

// Every `.jsonl` file under the root, newest first.
export function listJournals(root = journalRoot()): JournalFile[] {
  const files: JournalFile[] = [];
  const walk = (dir: string, depth: number) => {
    let names;
    try { names = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of names) {
      const path = join(dir, entry.name);
      if (entry.isDirectory() && depth < MAX_DEPTH) walk(path, depth + 1);
      else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
        const stat = statSync(path);
        files.push({ id: relative(root, path).split(sep).join("/"), path, size: stat.size, modifiedAt: stat.mtimeMs });
      }
    }
  };
  walk(root, 0);
  return files.sort((a, b) => b.modifiedAt - a.modifiedAt || a.id.localeCompare(b.id));
}

// Journal names start with the time the run's file was opened.
export function startedAt(file: JournalFile): number {
  const match = /(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z[^/]*$/.exec(file.id);
  return match ? Date.parse(`${match[1]}T${match[2]}:${match[3]}:${match[4]}.${match[5]}Z`) : file.modifiedAt;
}

// Journals only ever grow, so each file is read once and then only its new
// bytes. A line is parsed once its newline arrives; as in the CLI tools, only
// the final line may fail to parse (a torn write), anywhere else is an error.
class Tail {
  offset = 0;
  rest = Buffer.alloc(0);
  suspect?: string;
  entries = 0;
  readonly status = new StatusBuilder();
  readonly report = new ReportBuilder();

  feed(bytes: Buffer, path: string) {
    const data = this.rest.length ? Buffer.concat([this.rest, bytes]) : bytes;
    const end = data.lastIndexOf(10);
    this.rest = Buffer.from(data.subarray(end + 1));
    if (end < 0) return;
    for (const line of data.subarray(0, end).toString("utf8").split("\n")) {
      if (!line) continue;
      if (this.suspect !== undefined) throw new Error(`Line ${this.entries + 1} of ${path} is not valid JSON`);
      let entry: Entry;
      try { entry = JSON.parse(line); } catch { this.suspect = line; continue; }
      this.entries++;
      this.status.add(entry);
      this.report.add(entry);
    }
  }
}

const tails = new Map<string, Tail>();

function follow(file: JournalFile): Tail {
  let tail = tails.get(file.path);
  // A shorter file was replaced, not appended to: start again.
  if (!tail || file.size < tail.offset) tail = new Tail();
  tails.delete(file.path);
  tails.set(file.path, tail);
  if (tails.size > CACHE_LIMIT) tails.delete(tails.keys().next().value!);
  if (file.size === tail.offset) return tail;
  const fd = openSync(file.path, "r");
  try {
    const chunk = Buffer.alloc(Math.min(CHUNK_BYTES, file.size - tail.offset));
    while (tail.offset < file.size) {
      const read = readSync(fd, chunk, 0, Math.min(chunk.length, file.size - tail.offset), tail.offset);
      if (!read) break;
      tail.feed(chunk.subarray(0, read), file.path);
      tail.offset += read;
    }
  } catch (error) {
    tails.delete(file.path);
    throw error;
  } finally {
    closeSync(fd);
  }
  return tail;
}

export function findJournal(id: string, files = listJournals()): JournalFile | undefined {
  // Only listed files can be opened, so an id can never escape the root.
  return files.find(file => file.id === id);
}

export function loadRun(file: JournalFile, now = new Date()): RunView {
  const tail = follow(file);
  const status = tail.status.view(now);
  return {
    file, status, report: tail.report.report(), live: status.worker === "running",
    entries: tail.entries, tornTail: tail.rest.length > 0 || tail.suspect !== undefined, startedAt: startedAt(file),
  };
}

export type LoadedRun = { run: RunView; error?: undefined } | { run?: undefined; error: string };
export function tryLoadRun(file: JournalFile, now = new Date()): LoadedRun {
  try { return { run: loadRun(file, now) }; } catch (error) { return { error: (error as Error).message }; }
}

// Journals written in the last few seconds: a worker that is still running
// records at least once a second.
export function activeJournals(files = listJournals(), now = Date.now()): JournalFile[] {
  return files.filter(file => now - file.modifiedAt <= SILENT_AFTER_MS).sort((a, b) => a.id.localeCompare(b.id));
}

// A per-offer or per-request trace reads the whole journal on demand; it is
// only asked for one at a time.
export async function traceRun(file: JournalFile, query: { offer?: string; request?: string }) {
  const builder = new TraceBuilder();
  await readJournal(file.path, entry => builder.add(entry));
  const trace = builder.trace(query);
  return { found: trace.found, text: formatTrace(trace, query.offer ? `offer ${query.offer}` : `request ${query.request}`) };
}
