import React, { useEffect, useRef, useState } from "react";
import styles from "./TaskCard.module.scss";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Task } from "../../types/task";
import type { BoardState } from "../../types/board";

interface TaskCardProps {
  task: Task;
  columnId: string;
  setBoardData: React.Dispatch<React.SetStateAction<BoardState>>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  columnId,
  setBoardData,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.content);

  useEffect(() => setEditText(task.content), [task.content]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({
        type: "task",
        taskId: task.id,
        columnId,
      }),
    });

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({
        type: "task",
        taskId: task.id,
        columnId,
      }),
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [task.id, columnId]);

  const handleSave = () => {
    const next = editText.trim();
    if (!next) {
      setEditText(task.content);
      setIsEditing(false);
      return;
    }
    setBoardData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [task.id]: { ...prev.tasks[task.id], content: next },
      },
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.content);
    setIsEditing(false);
  };

  return (
    <div ref={ref} className={styles.taskCard}>
      <div className={styles.taskRow}>
        {isEditing ? (
          <input
            className={styles.taskInput}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <p className={styles.taskText}>{task.content}</p>
        )}

        <div className={styles.taskActions}>
          {isEditing ? (
            <>
              <button
                className={styles.iconButton}
                onClick={handleSave}
                title="Save"
              >
                ✔
              </button>
              <button
                className={styles.iconButton}
                onClick={handleCancel}
                title="Cancel"
              >
                ✖
              </button>
            </>
          ) : (
            <button
              className={styles.iconButton}
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              ✎
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
