import type { BoardState } from "../types/board";

export const initialData: BoardState = {
  tasks: {
    "task-1": {
      id: "task-1",
      isComplete: false,
      content: "Create new project",
    },
    "task-2": { id: "task-2", isComplete: true, content: "Send CV to company" },
    "task-3": { id: "task-3", isComplete: false, content: "Buy more coffee" },
    "task-4": { id: "task-4", isComplete: false, content: "Sleep at night" },
    "task-5": { id: "task-5", isComplete: false, content: "Something else" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do 📝",
      taskIds: ["task-1", "task-3", "task-5"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress 👨‍💻",
      taskIds: ["task-4"],
    },
    "column-3": { id: "column-3", title: "Done ✅", taskIds: ["task-2"] },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};
