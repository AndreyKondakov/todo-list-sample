import type { Column } from "./column";
import type { Task } from "./task";

export interface BoardState {
  tasks: { [taskId: string]: Task };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}

export type DragData =
  | { type: "task"; taskId: string; columnId: string }
  | { type: "column"; columnId: string }
  | { type: "empty-column"; columnId: string };
