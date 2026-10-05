import { setStrategy } from "@/app/live/actions";
import { readControls } from "@/worker/controls";
import { listStrategies } from "@/worker/strategies";

export function StrategySwitch() {
  const selected = readControls().strategy ?? "baseline";
  return (
    <section className="control" aria-label="Worker strategy">
      <div>
        <p className="label">Strategy for next worker · {selected}</p>
        <p className="hint">Choose before starting the worker. Select baseline, 50% surplus, 25% surplus, or balanced supply. Changes apply on restart; an explicit --strategy flag overrides this choice.</p>
      </div>
      {listStrategies().map(strategy => (
        <form action={setStrategy} key={strategy.name}>
          <input type="hidden" name="strategy" value={strategy.name} />
          <button type="submit" aria-pressed={selected === strategy.name} title={strategy.description}>
            {{ baseline: "Baseline", surplus50: "50% surplus", surplus25: "25% surplus", balanced: "Balanced supply" }[strategy.name]}
          </button>
        </form>
      ))}
    </section>
  );
}
