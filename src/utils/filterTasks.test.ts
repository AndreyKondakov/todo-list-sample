import type { Task } from "../types/task";
import { filterTasks } from "./taskFilters";

const tasks: Task[] = [
  { id: "1", content: "Task A", isComplete: true },
  { id: "2", content: "Task B", isComplete: false },
  { id: "3", content: "Task C", isComplete: false },
];

describe("filterTasks", () => {
  it("returns all tasks when filterStatus = all", () => {
    const result = filterTasks(tasks, "all");
    expect(result).toEqual(tasks);
  });

  it("returns only completed tasks when filterStatus = completed", () => {
    const result = filterTasks(tasks, "completed");
    expect(result).toEqual([{ id: "1", content: "Task A", isComplete: true }]);
  });

  it("returns only incomplete tasks when filterStatus = incomplete", () => {
    const result = filterTasks(tasks, "incomplete");
    expect(result).toEqual([
      { id: "2", content: "Task B", isComplete: false },
      { id: "3", content: "Task C", isComplete: false },
    ]);
  });
});
