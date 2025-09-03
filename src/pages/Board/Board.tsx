import React, { useState, useEffect } from "react";
import styles from "./Board.module.scss";
import Column from "../../components/Column/Column";
import Button from "../../components/ui/Button";
import { initialData } from "../../data/initialData";
import type { BoardState } from "../../types/board";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const LOCAL_STORAGE_KEY = "todo-board-v3";

function loadBoard(): BoardState {
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

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardState>(() => loadBoard());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boardData));
    } catch (err) {
      console.error("[Board] save error", err);
    }
  }, [boardData]);

  // drag & drop
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

        if (src.type === "task" && target) {
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

            let insertIndex = toTasks.length;
            if (target.type === "task") {
              const targetIndex = toTasks.indexOf(target.taskId);
              if (targetIndex !== -1) insertIndex = targetIndex;
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
                [toColumnId]: {
                  ...prev.columns[toColumnId],
                  taskIds: toTasks,
                },
              },
            };
          });
        }
      },
    });
  }, []);

  return (
    <main className={styles.board}>
      <div className={styles.columnsList}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          if (!column) return null;

          const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              setBoardData={setBoardData}
            />
          );
        })}

        <div className={styles.addColumnContainer}>
          <Button
            onClick={() =>
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
              })
            }
          >
            + Add another column
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Board;
