import type { Task } from "../types/task";

export const filterTasks = (
  tasks: Task[],
  filterStatus: "all" | "completed" | "incomplete"
) =>
  tasks.filter((task) => {
    if (!task) return false;
    if (filterStatus === "completed" && !task.isComplete) return false;
    if (filterStatus === "incomplete" && task.isComplete) return false;
    return true;
  });
