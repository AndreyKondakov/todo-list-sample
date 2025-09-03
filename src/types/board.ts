import type { Column } from "./column";
import type { Task } from "./task";

export interface BoardState {
  tasks: { [taskId: string]: Task };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}
