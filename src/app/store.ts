import { initialData } from "../data/initialData";
import type { BoardState } from "../types/board";

export const LOCAL_STORAGE_KEY = "todo-board-v3";

export function loadBoard(): BoardState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw) as BoardState;
  } catch (err) {
    console.error("[Board] load error", err);
    return initialData;
  }
}
