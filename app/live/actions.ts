'use server';

import { revalidatePath } from "next/cache";

import { readControls, writeControls } from "@/worker/controls";

// The dashboard runs on the worker's machine; generosity applies from
// the next decision without a restart.
export async function setGenerous(formData: FormData) {
  writeControls({ ...readControls(), generous: formData.get("generous") === "on" });
  revalidatePath("/live");
}

// Match the catalog on the server; never trust a submitted strategy name.
export async function setStrategy(formData: FormData) {
  const { getStrategy } = await import("@/worker/strategies");
  const name = formData.get("strategy");
  if (typeof name !== "string") throw new Error("Choose a strategy");
  writeControls({ ...readControls(), strategy: getStrategy(name).name });
  revalidatePath("/live");
}
