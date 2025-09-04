import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";

import { loadBoard, LOCAL_STORAGE_KEY } from "../../app/store";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Button from "../../components/ui/Button";
import Column from "../../components/Column/Column";
import FilterBar from "../../components/FilterBar/FilterBar";
import styles from "./Board.module.scss";
import type { BoardState } from "../../types/board";
import type { FuseResult, FuseResultMatch } from "fuse.js";
import type { Task } from "../../types/task";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardState>(() => loadBoard());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "incomplete"
  >("all");

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boardData));
    } catch (err) {
      console.error("[Board] save error", err);
    }
  }, [boardData]);

  // Drag & drop
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        if (!source?.data) return;

        const src = source.data as any;
        const target = location.current.dropTargets[0]?.data as any;

        if (src.type === "column" && target?.type === "column") {
          setBoardData((prev) => {
            const newOrder = [...prev.columnOrder];
            const fromIndex = newOrder.indexOf(src.columnId);
            const toIndex = newOrder.indexOf(target.columnId);
            if (fromIndex === -1 || toIndex === -1) return prev;
            newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, src.columnId);
            return { ...prev, columnOrder: newOrder };
          });
        }

        if (src.type === "task" && target?.type === "task") {
          setBoardData((prev) => {
            const fromColumnId = src.columnId;
            const toColumnId = target.columnId;
            if (!fromColumnId || !toColumnId) return prev;

            const fromTasks = [...prev.columns[fromColumnId].taskIds];
            let toTasks =
              fromColumnId === toColumnId
                ? [...fromTasks]
                : [...prev.columns[toColumnId].taskIds];

            const fromIndex = fromTasks.indexOf(src.taskId);
            if (fromIndex !== -1) fromTasks.splice(fromIndex, 1);

            const existingIndex = toTasks.indexOf(src.taskId);
            if (existingIndex !== -1) toTasks.splice(existingIndex, 1);

            const targetEl = document.querySelector(
              `[data-task-id="${target.taskId}"]`
            ) as HTMLElement | null;
            let insertIndex = toTasks.indexOf(target.taskId);
            if (insertIndex === -1) insertIndex = toTasks.length;

            if (targetEl) {
              const rect = targetEl.getBoundingClientRect();
              const middleY = rect.top + rect.height / 2;
              if (location.current.input.clientY > middleY) insertIndex += 1;
            }

            toTasks.splice(insertIndex, 0, src.taskId);

            return {
              ...prev,
              columns: {
                ...prev.columns,
                [fromColumnId]: {
                  ...prev.columns[fromColumnId],
                  taskIds: fromTasks,
                },
                [toColumnId]: { ...prev.columns[toColumnId], taskIds: toTasks },
              },
            };
          });
        }

        if (src.type === "task" && target?.type === "empty-column") {
          setBoardData((prev) => {
            const fromColumnId = src.columnId;
            const toColumnId = target.columnId;
            if (!fromColumnId || !toColumnId) return prev;

            const fromTasks = [...prev.columns[fromColumnId].taskIds];
            const toTasks = [...prev.columns[toColumnId].taskIds];

            const fromIndex = fromTasks.indexOf(src.taskId);
            if (fromIndex !== -1) fromTasks.splice(fromIndex, 1);

            toTasks.push(src.taskId);

            return {
              ...prev,
              columns: {
                ...prev.columns,
                [fromColumnId]: {
                  ...prev.columns[fromColumnId],
                  taskIds: fromTasks,
                },
                [toColumnId]: { ...prev.columns[toColumnId], taskIds: toTasks },
              },
            };
          });
        }
      },
    });
  }, []);

  // Smart search with Fuse.js
  const fuseOptions = {
    keys: ["content"],
    includeMatches: true,
    threshold: 0.4,
  };
  const fuse = new Fuse(Object.values(boardData.tasks), fuseOptions);
  const fuseResults = searchQuery ? fuse.search(searchQuery) : [];

  const matchedTasksMap = new Map<string, FuseResultMatch[]>();
  fuseResults.forEach((res: FuseResult<Task>) => {
    if (res.matches) matchedTasksMap.set(res.item.id, [...res.matches]);
  });

  return (
    <main className={styles.board}>
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className={styles.columnsList}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          if (!column) return null;

          const tasks = column.taskIds
            .map((taskId) => boardData.tasks[taskId])
            .filter((task) => {
              if (!task) return false;
              if (filterStatus === "completed" && !task.isComplete)
                return false;
              if (filterStatus === "incomplete" && task.isComplete)
                return false;
              if (searchQuery && !matchedTasksMap.has(task.id)) return false;
              return true;
            });

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              setBoardData={setBoardData}
              searchQuery={searchQuery}
              matchesMap={matchedTasksMap}
              filterStatus={filterStatus}
            />
          );
        })}

        <div className={styles.addColumnContainer}>
          <Button
            onClick={() => {
              setBoardData((prev) => {
                const id = `column-${Date.now()}`;
                return {
                  ...prev,
                  columns: {
                    ...prev.columns,
                    [id]: { id, title: "New column", taskIds: [] },
                  },
                  columnOrder: [...prev.columnOrder, id],
                };
              });
            }}
          >
            + Add another column
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Board;
