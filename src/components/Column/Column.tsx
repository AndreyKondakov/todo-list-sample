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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({
        type: "column",
        columnId: column.id,
      }),
    });

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({
        type: "column",
        columnId: column.id,
      }),
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [column.id]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setBoardData((prev) => {
      const id = `task-${Date.now()}`;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [id]: { id, content: newTask.trim(), isComplete: false },
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

  return (
    <div ref={ref} className={styles.column}>
      <header className={styles.columnHeader}>
        <h2 className={styles.title}>{column.title}</h2>
      </header>
      <div className={styles.columnTasksList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={column.id} />
        ))}
      </div>
      <hr className={styles.columnDivider} />
      <form className={styles.columnForm} onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default Column;
