import Fuse from "fuse.js";
import type { Task } from "../types/task";
import type { FuseResult, FuseResultMatch } from "fuse.js";

export const useBoardSearch = (tasks: Task[], searchQuery: string) => {
  const fuseOptions = {
    keys: ["content"],
    includeMatches: true,
    threshold: 0.4,
  };

  const fuse = new Fuse(tasks, fuseOptions);
  const fuseResults = searchQuery ? fuse.search(searchQuery) : [];

  const matchedTasksMap = new Map<string, FuseResultMatch[]>();
  fuseResults.forEach((res: FuseResult<Task>) => {
    if (res.matches) matchedTasksMap.set(res.item.id, [...res.matches]);
  });

  return matchedTasksMap;
};
