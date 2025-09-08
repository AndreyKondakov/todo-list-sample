import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { FuseResultMatch } from "fuse.js";

import { Checkbox } from "../ui/Checkbox/Checkbox";
import { highlightMatch } from "../../utils/highlight";
import styles from "./TaskCard.module.scss";
import type { BoardState } from "../../types/board";
import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  columnId: string;
  setBoardData: React.Dispatch<React.SetStateAction<BoardState>>;
  searchQuery?: string;
  matches?: FuseResultMatch[];
  isSelected?: boolean;
  toggleSelect?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  columnId,
  setBoardData,
  searchQuery,
  isSelected = false,
  toggleSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.content);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => setEditText(task.content), [task.content]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({ type: "task", taskId: task.id, columnId }),
    });
    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({ type: "task", taskId: task.id, columnId }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
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

  const toggleComplete = () => {
    setBoardData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [task.id]: { ...prev.tasks[task.id], isComplete: !task.isComplete },
      },
    }));
  };

  const handleDeleteTask = () => {
    setBoardData((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [task.id]: _, ...restTasks } = prev.tasks;
      const updatedColumns = Object.fromEntries(
        Object.entries(prev.columns).map(([colId, col]) => [
          colId,
          {
            ...col,
            taskIds: col.taskIds.filter((id) => id !== task.id),
          },
        ])
      );
      return {
        ...prev,
        tasks: restTasks,
        columns: updatedColumns,
      };
    });
  };

  return (
    <div
      ref={ref}
      data-task-id={task.id}
      className={`${styles.taskCard} ${isDragOver ? styles.dragOver : ""} ${
        task.isComplete ? styles.isComplete : ""
      }`}
    >
      <div className={styles.taskRow}>
        <div className={styles.taskCheckboxes}>
          <Checkbox
            checked={isSelected}
            onChange={toggleSelect}
            className={styles.isSelected}
          />
        </div>

        <div className={styles.taskContent}>
          {isEditing ? (
            <input
              className={styles.taskInput}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          ) : (
            <p className={styles.taskText}>
              {highlightMatch(task.content, searchQuery ?? "")}
            </p>
          )}
        </div>

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
            <>
              <Checkbox
                checked={task.isComplete}
                onChange={toggleComplete}
                variant="secondary"
              />
              <button
                className={styles.iconButton}
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                ✎
              </button>
              <button
                className={styles.iconButton}
                onClick={handleDeleteTask}
                title="Delete task"
              >
                🗑
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
