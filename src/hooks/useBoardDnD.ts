import { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { BoardState, DragData } from "../types/board";

export const useBoardDnD = (
  setBoardData: React.Dispatch<React.SetStateAction<BoardState>>
) => {
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        if (!source?.data) return;

        const src = source.data as DragData;
        const target = location.current.dropTargets[0]?.data as
          | DragData
          | undefined;

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
            const toTasks =
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
  }, [setBoardData]);
};
