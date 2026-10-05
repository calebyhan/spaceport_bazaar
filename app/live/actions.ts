'use server';

import { revalidatePath } from "next/cache";

import { readControls, writeControls } from "@/worker/controls";

// The dashboard runs on the worker's machine; the worker reads this file
// before every decision, so the switch applies without a restart.
export async function setGenerous(formData: FormData) {
  writeControls({ ...readControls(), generous: formData.get("generous") === "on" });
  revalidatePath("/live");
}
