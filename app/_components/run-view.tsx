import Link from "next/link";

import type { RunView } from "@/lib/journals";
import { amounts, resourceNames } from "@/worker/audit/journal";

import { LineChart } from "./line-chart";

type Resource = (typeof resourceNames)[number];
type Bundle = Record<Resource, string | number | bigint>;
const resourceLabel: Record<Resource, string> = { water: "Water", food: "Food", components: "Components" };

export const runHref = (id: string, query = "") => `/runs/${id.split("/").map(encodeURIComponent).join("/")}${query}`;
export const ms = (value?: number) => value === undefined ? "n/a" : `${Math.round(value).toLocaleString("en")} ms`;
const seconds = (value?: number) => value === undefined ? "?" : `${(value / 1000).toFixed(1)} s`;
export function formatTime(value: number | string | undefined): string {
  if (value === undefined) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "medium" }).format(new Date(value));
}

export function runState(run: RunView): { label: string; tone: "live" | "done" | "warn" } {
  if (run.live) return { label: "Live", tone: "live" };
  if (run.report.outcome?.phase === "FINISHED" || run.report.outcome?.runSummaryWritten) return { label: "Finished", tone: "done" };
  return { label: "Stopped", tone: "warn" };
}

export function resultOf(run: RunView): { label: string; tone: "good" | "bad" | "none" } {
  const o = run.report.outcome;
  if (!o) return { label: "No snapshot", tone: "none" };
  return o.failed ? { label: `Failed at tick ${o.firstFailureTick}`, tone: "bad" } : { label: o.phase === "FINISHED" ? "Survived" : "Alive", tone: "good" };
}

function Tile({ label, value, detail, tone }: { label: string; value: React.ReactNode; detail: React.ReactNode; tone?: string }) {
  return (
    <article className={`card tile${tone ? ` tone-${tone}` : ""}`}>
      <p className="label">{label}</p>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function Panel({ label, title, children, className = "" }: { label: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`.trim()} aria-label={title}>
      <p className="label">{label}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Table({ head, rows, empty = "None." }: { head: string[]; rows: React.ReactNode[][]; empty?: string }) {
  if (!rows.length) return <p className="empty">{empty}</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function RunHeader({ run, eyebrow }: { run: RunView; eyebrow: string }) {
  const state = runState(run), r = run.report;
  const details = [r.station, r.strategy && `strategy ${r.strategy}`, r.policy, r.commit && `commit ${r.commit.slice(0, 7)}`].filter(Boolean);
  return (
    <header className="hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="run-title">{r.run ?? "Unidentified run"}</h1>
      <p className="subtitle">{details.join(" · ")}</p>
      <p className="subtitle small">Journal <code>{run.file.id}</code> · opened {formatTime(run.startedAt)} · {run.entries.toLocaleString("en")} records</p>
      <span className={`status status-${state.tone}`}>{state.label}</span>
      {run.tornTail ? <p className="notice">The journal ends in a partly written line (a live or interrupted worker); it was skipped.</p> : null}
    </header>
  );
}

// What the worker is doing right now, from the newest records.
export function LiveStatus({ run }: { run: RunView }) {
  const v = run.status, c = v.connection;
  return (
    <Panel label="Right now" title="Live operating picture" className="live">
      <dl className="facts">
        <div><dt>Worker</dt><dd>{v.worker}; last record {seconds(v.lastRecordMs)} ago</dd></div>
        {v.lifecycle ? <div><dt>Lifecycle</dt><dd>{v.lifecycle.stage} for {seconds(v.lifecycle.sinceMs)}: {v.lifecycle.reason}</dd></div> : null}
        {c ? <div><dt>Clock</dt><dd>tick {c.tick}/{c.duration}, {c.phase}, connection epoch {c.epoch ?? "?"}, snapshot {seconds(c.snapshotMs)} old{c.stale ? <span className="badge warn">Stale</span> : null}</dd></div> : null}
      </dl>
      {c && v.reserves ? (
        <>
          <div className="meter" role="progressbar" aria-label="Run progress" aria-valuemin={0} aria-valuemax={Number(c.duration)} aria-valuenow={Number(c.tick)}>
            <span style={{ width: `${Math.min(100, (100 * Number(c.tick)) / Math.max(1, Number(c.duration)))}%` }} />
          </div>
          <dl className="inventory four">
            <div><dt>Health</dt><dd>{v.reserves.health}</dd>{v.reserves.failed ? <p className="badge bad">Failed</p> : null}</div>
            {v.reserves.resources.map(r => (
              <div key={r.resource}>
                <dt>{resourceLabel[r.resource]}</dt><dd>{r.stock}</dd>
                <p className="hint">reserve {r.target}{r.short ? <span className="badge bad">Short</span> : null}</p>
              </div>
            ))}
          </dl>
          <div className="columns">
            <div>
              <h3>Pending commands</h3>
              <Table head={["Request", "Command", "Waiting"]} rows={v.pending.map(p => [<code key="id">{p.requestId.slice(0, 8)}</code>,
                p.action, <>{seconds(p.ageMs)}{p.uncertain ? <span className="badge warn">Uncertain</span> : null}</>])} />
            </div>
            <div>
              <h3>Open offers</h3>
              <Table head={["Offer", "With", "We pay", "We get", "Left"]} rows={v.offers.map(o => [
                <Link key="id" href={runHref(run.file.id, `?offer=${encodeURIComponent(o.id)}`)}>{o.id}</Link>,
                `${o.outgoing ? "to" : "from"} ${o.counterparty}`, amounts(o.pay), amounts(o.get), `${o.ticksLeft} ticks`])} />
            </div>
          </div>
        </>
      ) : <p className="empty">No snapshot recorded yet.</p>}
    </Panel>
  );
}

export function Outcome({ run }: { run: RunView }) {
  const r = run.report, o = r.outcome!, result = resultOf(run);
  const shortTicks = r.history.filter(h => resourceNames.some(res => h.unmet[res] > 0));
  const rejected = r.commands.results - r.commands.ok;
  return (
    <section className="grid tiles" aria-label="Outcome">
      <Tile label="Result" value={result.label} tone={result.tone} detail={`Health ${o.finalHealth} · lost ${o.healthLost}`} />
      <Tile label="Ticks" value={`${o.lastTick} / ${o.duration}`}
        detail={`${o.phase} · collective success ${o.collectiveSuccess === undefined ? "not reported" : o.collectiveSuccess ? "yes" : "no"}`} />
      <Tile label="Short ticks" value={shortTicks.length} tone={shortTicks.length ? "bad" : undefined}
        detail={shortTicks.length ? `first at tick ${shortTicks[0].tick}` : "every tick fully supplied"} />
      <Tile label="Trades" value={r.trades.length} detail={`with ${Object.keys(r.partners).length} partners`} />
      <Tile label="Commands sent" value={r.commands.sent} detail={`${r.commands.ok} accepted · ${rejected} rejected`} />
      <Tile label="Disconnects" value={r.disconnections.length} detail={`${r.stale.length} stale periods`} />
      <Tile label="Server response p95" value={ms(r.responsiveness.responseP95Ms)} detail={`median ${ms(r.responsiveness.responseMedianMs)}`} />
      <Tile label="Final stock" value={resourceNames.reduce((n, res) => n + Number(o.finalInventory[res]), 0)} detail={amounts(o.finalInventory)} />
    </section>
  );
}

export function History({ run }: { run: RunView }) {
  const h = run.report.history, ticks = h.map(t => t.tick);
  const short = h.filter(t => resourceNames.some(r => t.unmet[r] > 0)).map(t => t.tick);
  return (
    <Panel label="History" title="Resources and health per tick">
      <h3>Closing stock</h3>
      <LineChart label="Closing stock of water, food and components per tick" ticks={ticks} flagged={short} flagLabel="Shortage tick"
        series={resourceNames.map(r => ({ key: r, label: resourceLabel[r], values: h.map(t => t[r]) }))} />
      <h3>Health</h3>
      <LineChart label="Health per tick" ticks={ticks} flagged={short} flagLabel="Shortage tick" maxValue={100}
        series={[{ key: "health", label: "Health", values: h.map(t => t.health) }]} />
      <details>
        <summary>Every tick as a table</summary>
        <Table head={["Tick", "Water", "Food", "Components", "Health", "Missing"]} rows={h.map(t => [t.tick, t.water, t.food, t.components, t.health,
          resourceNames.filter(r => t.unmet[r] > 0).map(r => `${t.unmet[r]} ${r}`).join(", ")])} />
      </details>
    </Panel>
  );
}

const sum = (bundles: Bundle[], r: Resource) => bundles.reduce((n, b) => n + Number(b[r]), 0);
export function Trading({ run }: { run: RunView }) {
  const r = run.report;
  const offerLink = (offer: string) => <Link href={runHref(run.file.id, `?offer=${encodeURIComponent(offer)}`)}>{offer}</Link>;
  return (
    <Panel label="Trading" title="Completed trades">
      <Table head={["Resource", "Paid out", "Received", "Net"]} empty="No trades completed." rows={r.trades.length ? resourceNames.map(res => {
        const paid = sum(r.trades.map(t => t.pay), res), got = sum(r.trades.map(t => t.get), res), net = got - paid;
        return [resourceLabel[res], paid, got, <span key="net" className={net > 0 ? "up" : net < 0 ? "down" : undefined}>{net > 0 ? `+${net}` : net}</span>];
      }) : []} />
      {r.trades.length ? (
        <>
          <h3>By counterparty</h3>
          <Table head={["Counterparty", "Trades", "We paid", "We got"]} rows={Object.entries(r.partners).map(([id, p]) => [id, p.trades, amounts(p.paid as Bundle), amounts(p.got as Bundle)])} />
          <details>
            <summary>All {r.trades.length} trades</summary>
            <Table head={["Tick", "Counterparty", "Direction", "We paid", "We got", "Offer"]} rows={r.trades.map(t => [t.tick, t.counterparty,
              t.outgoing ? "our offer" : "we accepted", amounts(t.pay), amounts(t.get), offerLink(t.offer)])} />
          </details>
        </>
      ) : null}
    </Panel>
  );
}

export function Problems({ run }: { run: RunView }) {
  const r = run.report;
  return (
    <Panel label="Problems" title="Shortages, rejections and disconnects">
      <h3>Shortages</h3>
      <Table head={["Resource", "Ticks short", "Units missing", "First short", "Longest streak", "Lowest stock (tick)"]} rows={r.shortages.map(x => [
        resourceLabel[x.resource], x.ticksShort, x.unitsMissing, x.firstShortTick ?? "—", x.longestStreak, x.lowestStock === undefined ? "—" : `${x.lowestStock} (${x.lowestAtTick})`])} />
      <h3>Rejected requests</h3>
      <Table head={["Result", "Count", "Examples"]} rows={Object.entries(r.rejected).map(([code, x]) => [<code key="code">{code}</code>, x.count, x.examples.join("; ")])} />
      {r.controlErrors.length ? <p className="hint">Control errors: {r.controlErrors.map(e => `code ${e.code}${e.requestId ? ` (request ${e.requestId})` : ""}`).join(", ")}.</p> : null}
      <h3>Disconnected periods</h3>
      <Table head={["From", "To", "Duration", "Ticks missed", "Close code", "Cause", "Reconnects"]} rows={r.disconnections.map(d => [
        formatTime(d.from), d.to ? formatTime(d.to) : "end of journal", ms(d.durationMs), d.ticksMissed ?? "unknown", d.closeCode, d.cause ?? "", d.attempts])} />
      {r.stale.length ? <p className="hint">Stale periods: {r.stale.map(x => `tick ${x.tick} (${x.reason})`).join("; ")}.</p> : null}
      {r.failures.length ? (
        <>
          <h3>Failures</h3>
          <ul className="plain">{r.failures.map((f, i) => {
            const failure = f as { category: string; code: string; message: string };
            return <li key={i}><code>{failure.category} {failure.code}</code> {failure.message}</li>;
          })}</ul>
        </>
      ) : null}
    </Panel>
  );
}

export function Responsiveness({ run }: { run: RunView }) {
  const r = run.report, x = r.responsiveness;
  return (
    <Panel label="Responsiveness" title="Decisions and server responses">
      <Table head={["Measure", "Value"]} rows={[
        ["Decisions (of which waits)", `${r.commands.decisions} (${r.commands.waits})`],
        ["Server response median / p95", `${ms(x.responseMedianMs)} / ${ms(x.responseP95Ms)} over ${x.responses} responses`],
        ["Decision time median / p95", `${ms(x.decisionMedianMs)} / ${ms(x.decisionP95Ms)}`],
        ["Missed deadlines (decision / response)", `${x.missedDeadlines.decision} / ${x.missedDeadlines.response}`],
        ["Commands cancelled before sending / uncertain", `${r.commands.cancelled} / ${r.commands.uncertain}`],
      ]} />
    </Panel>
  );
}

export function Downloads({ run }: { run: RunView }) {
  const id = encodeURIComponent(run.file.id);
  return (
    <p className="downloads">
      Download the report as <a href={`/api/runs/report?id=${id}&format=md`}>Markdown</a> or <a href={`/api/runs/report?id=${id}&format=json`}>JSON</a>.
    </p>
  );
}

export function Trace({ target, text }: { target: string; text: string }) {
  return (
    <Panel label="Trace" title={target} className="trace">
      <pre>{text}</pre>
    </Panel>
  );
}

// The whole page body for one run: live picture first while it runs, then
// the report sections that are worth reading after it finishes.
export function RunBody({ run }: { run: RunView }) {
  if (!run.report.outcome) return (<><LiveStatus run={run} /><p className="empty">No snapshot was recorded, so there is nothing to summarise yet.</p></>);
  return (
    <>
      {run.live ? <LiveStatus run={run} /> : null}
      <Outcome run={run} />
      <History run={run} />
      <Trading run={run} />
      <Problems run={run} />
      <Responsiveness run={run} />
      <Downloads run={run} />
    </>
  );
}
