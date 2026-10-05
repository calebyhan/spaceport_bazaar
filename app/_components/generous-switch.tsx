import { setGenerous } from "@/app/live/actions";
import { readControls } from "@/worker/controls";

// Flips the worker's live generous mode. The form posts the opposite of the
// current state, so a stale page can only ever request one clear change.
export function GenerousSwitch() {
  const { generous } = readControls();
  return (
    <form action={setGenerous} className={generous ? "control on" : "control"}>
      <input type="hidden" name="generous" value={generous ? "off" : "on"} />
      <div>
        <p className="label">Generous mode · {generous ? "On" : "Off"}</p>
        <p className="hint">
          {generous
            ? "Asking only 1:1 and accepting safe 1:1 trades paid from spare stock. Never below par."
            : "Normal pricing: asks a premium when the market allows and accepts only trades that gain value."}
          {" "}Applies from the worker&apos;s next decision.
        </p>
      </div>
      <button type="submit" aria-pressed={generous}>{generous ? "Turn off" : "Turn on"}</button>
    </form>
  );
}
