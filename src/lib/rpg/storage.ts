import {
  SCULPTURE_STORAGE_KEY,
  isSculptureSnapshot,
  type SculptureSnapshot,
} from "./sculpture.ts";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type SculptureLoadResult =
  | { status: "empty" }
  | { status: "ready"; snapshot: SculptureSnapshot }
  | { status: "invalid"; reason: "json" | "schema" }
  | { status: "unavailable" };

export type SculptureWriteResult = { ok: true } | { ok: false };

export function loadSculpture(storage: StorageLike): SculptureLoadResult {
  try {
    const serialized = storage.getItem(SCULPTURE_STORAGE_KEY);
    if (serialized === null) return { status: "empty" };

    let parsed: unknown;
    try {
      parsed = JSON.parse(serialized);
    } catch {
      return { status: "invalid", reason: "json" };
    }

    return isSculptureSnapshot(parsed)
      ? { status: "ready", snapshot: parsed }
      : { status: "invalid", reason: "schema" };
  } catch {
    return { status: "unavailable" };
  }
}

export function saveSculpture(
  storage: StorageLike,
  snapshot: SculptureSnapshot,
): SculptureWriteResult {
  if (!isSculptureSnapshot(snapshot)) return { ok: false };

  try {
    storage.setItem(SCULPTURE_STORAGE_KEY, JSON.stringify(snapshot));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function removeSculpture(storage: StorageLike): SculptureWriteResult {
  try {
    storage.removeItem(SCULPTURE_STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
