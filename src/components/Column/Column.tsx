import React, { useEffect, useRef, useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import styles from "./Column.module.scss";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Column as ColumnType } from "../../types/column";
import type { Task } from "../../types/task";
import type { BoardState } from "../../types/board";
import Button from "../ui/Button";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  setBoardData: React.Dispatch<React.SetStateAction<BoardState>>;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, setBoardData }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [newTask, setNewTask] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(column.title);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => setTitleText(column.title), [column.title]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({ type: "column", columnId: column.id }),
    });

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({ type: "column", columnId: column.id }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [column.id]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setBoardData((prev) => {
      const id = `task-${Date.now()}`;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [id]: { id, content: text, isComplete: false },
        },
        columns: {
          ...prev.columns,
          [column.id]: {
            ...prev.columns[column.id],
            taskIds: [...prev.columns[column.id].taskIds, id],
          },
        },
      };
    });

    setNewTask("");
  };

  const saveTitle = () => {
    const next = titleText.trim();
    if (!next) {
      setTitleText(column.title);
      setIsEditingTitle(false);
      return;
    }
    setBoardData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [column.id]: { ...prev.columns[column.id], title: next },
      },
    }));
    setIsEditingTitle(false);
  };

  const cancelTitle = () => {
    setTitleText(column.title);
    setIsEditingTitle(false);
  };

  return (
    <div
      ref={ref}
      className={`${styles.column} ${isDragOver ? styles.dragOver : ""}`}
    >
      <header className={styles.columnHeader}>
        {isEditingTitle ? (
          <div className={styles.titleRow}>
            <input
              className={styles.titleInput}
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              autoFocus
            />
            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                onClick={saveTitle}
                title="Save"
              >
                ✔
              </button>
              <button
                className={styles.iconButton}
                onClick={cancelTitle}
                title="Cancel"
              >
                ✖
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{column.title}</h2>
            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                onClick={() => setIsEditingTitle(true)}
                title="Edit column title"
              >
                ✎
              </button>
            </div>
          </div>
        )}
      </header>

      <div className={styles.columnTasksList}>
        {tasks.map((task) =>
          task ? (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              setBoardData={setBoardData}
            />
          ) : null
        )}
      </div>

      <hr className={styles.columnDivider} />

      <form className={styles.columnForm} onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          className={styles.addTaskInput}
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default Column;
