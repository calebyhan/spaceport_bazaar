---
title: "Real Run Logging and Analysis Note"
status: "Operational checklist"
last_updated: "2026-09-22"
---

# Real Run Logging and Analysis Note

## Prime directive

Log enough to reconstruct every observation, decision, command, result, and
subsequent state transition after the run. Logging must never block the socket
receive loop, delay a lifesaving action, or expose an access token.

Never log:

- bearer tokens or authorization headers;
- credential-file contents;
- secrets embedded in environment variables;
- unredacted connection diagnostics that include credentials.

## Run manifest

Create one immutable manifest when connecting:

- local run-record ID and server `run_id`;
- our station ID and display name;
- protocol version and selected WebSocket subprotocol;
- application version or Git commit;
- Protobuf schema checksum/version;
- UTC connection time and monotonic process start time;
- endpoint host and port, without credentials;
- complete public rules;
- initial phase, tick, world version, and snapshot sequence;
- initial self observation and directory;
- policy name, configuration, thresholds, and feature flags;
- whether an LLM or human advisory layer was enabled and its version.

Do not silently overwrite this record after the run starts. Record subsequent
configuration changes as events.

## Raw message journal

For every inbound and outbound WebSocket message, preserve:

- UTC timestamp;
- monotonic timestamp or elapsed milliseconds;
- connection/session ID;
- direction;
- message type;
- raw binary payload or a lossless safe encoding;
- decoded Protobuf representation;
- payload byte length;
- run ID and request ID when present;
- tick, world version, and snapshot sequence when present;
- decode or validation errors.

Also record WebSocket open, subprotocol confirmation, ping, pong, close,
reconnect, authentication failure, and session-fencing events.

Raw records should be append-only. Derived tables can be regenerated later.

## Authoritative snapshot record

For every received state, persist the complete permitted snapshot, including:

- phase and outcome;
- self inventory, health, `failed_once`, and `first_failure_tick`;
- last production and last unmet upkeep;
- upkeep and all cumulative counters;
- every visible offer and its status;
- every public advertisement and its status;
- every visible transaction;
- every stored request result;
- the live rules, even if unchanged.

Do not reconstruct inventory by applying transactions to the previous state.
Store each state as the authoritative replacement supplied by the server.

## Decision journal

Give each decision cycle a local `decision_id`. Record:

- triggering event/message;
- exact snapshot sequence and world version used;
- strategy mode: Critical, Guarded, Stable, Surplus, or Endgame;
- per-resource current stock, upkeep, conservative production forecast, and
  projected reserve;
- worst-case open outgoing commitments;
- confirmed incoming resources and unconfirmed opportunities separately;
- predicted shortage tick and health impact by resource;
- local and collective-risk classifications;
- counterparty beliefs, confidence, recency, and supporting evidence;
- all candidate actions considered;
- reasons candidates were rejected;
- selected action or reason for waiting;
- expected benefit, risk, information value, and confidence;
- command/action capacity remaining;
- whether a newer state invalidated the decision before send.

If an LLM contributes, record its structured input, output, model identifier,
latency, and any post-processing or safety rejection. Do not send hidden or
unauthorized state to it.

## Command lifecycle

For each gameplay command, link the following with `request_id` and
`decision_id`:

1. Decision completed.
2. Command validated locally.
3. Command serialized.
4. Command sent.
5. Server result or protocol error received.
6. First subsequent authoritative state received.
7. Intended effect observed, rejected, expired, accepted, or superseded.

Record timestamps at each stage so we can measure:

- decision latency;
- send-to-result latency;
- result-to-state latency;
- offer response and settlement latency;
- reconnect recovery time.

For retries, record the original request reference and whether the payload is
byte-for-byte or semantically identical. Never treat a replayed historical
`OK` result as evidence that its object is currently active.

## Market-observation timeline

Maintain derived events for analysis without replacing the raw journal:

- advertisement appeared, changed, disappeared, or expired;
- offer created, accepted, withdrawn, expired, failed, or ended with the run;
- transaction settled;
- command rejected and result code;
- supplier response or non-response;
- resource entered or left a risk threshold;
- production surprise relative to forecast;
- shortage and health change;
- counterparty disappeared from active market behavior;
- possible collective scarcity signal;
- phase or rules change.

Absence is evidence only with context. Record how long an advertisement or
offer remained visible and how many usable response opportunities occurred.

## Tick summary

Produce one derived summary per tick:

- opening and closing inventory;
- production, consumed upkeep, and unmet upkeep;
- health change;
- open outgoing commitment total;
- incoming offer value and accepted value;
- imports and exports during the tick;
- advertisements by resource and direction;
- commands used versus the live per-tick limit;
- expiries, rejections, and settlement failures;
- selected mode and bottleneck;
- estimated local survival horizon;
- estimated collective-risk level.

## Operational implementation notes

- Use a single WebSocket owner.
- Put logging behind a bounded, non-blocking queue or fast append-only writer.
- Preserve ordering with local sequence numbers in addition to timestamps.
- Flush important records on result, state, reconnect, phase change, and run
  end, but avoid synchronous disk/network work on the receive path.
- If the log sink falls behind, preserve raw messages and critical decisions
  before optional derived analytics.
- Record dropped-log counters and storage errors explicitly.
- Keep server facts, policy memory, forecasts, and annotations in separate
  fields.
- Use UTC for cross-machine comparison and a monotonic clock for latency.

## End-of-run capture

At `FINISHED`, `ABORTED`, disconnect, or operator shutdown, record:

- final authoritative state and outcome;
- whether P01 ever failed;
- collective success if supplied;
- final inventory and health;
- cumulative production, consumption, unmet upkeep, imports, and exports;
- fully supplied and shortage ticks;
- first failure tick and longest shortage streak;
- all unresolved offers and advertisements;
- command/result counts by code;
- reconnects, protocol errors, and dropped-log counts;
- local strategy configuration and final policy memory;
- validator/instructor report if one is provided.

Take a final `sync` only if the phase, connection, and live protocol rules make
it safe and useful. Do not issue unnecessary economic commands after the run.

## Post-run questions

Use the journal to answer:

1. Which resource first became structurally scarce?
2. Were shortages caused by total supply, timing, distribution, or slow
   settlement?
3. Which public signals preceded health risk?
4. Which counterparties were responsive and reliable by resource?
5. Did our advertisements attract useful offers?
6. Did we overcommit or hold an unnecessarily large reserve?
7. Were any offers safe when posted but unsafe when later accepted?
8. Which expiries or rejections were avoidable?
9. Did our aid improve collective resilience without threatening P01?
10. Where did the policy's forecast differ from observed production?
11. How often did a newer snapshot invalidate a pending decision?
12. Which conclusions are supported by direct evidence versus inference?

Preserve the raw journal even after producing a report so future strategy
versions can be replayed against the same observations.

