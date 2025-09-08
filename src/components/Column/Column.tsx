import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { FuseResultMatch } from "fuse.js";

import { Checkbox } from "../ui/Checkbox/Checkbox";
import Button from "../ui/Button";
import styles from "./Column.module.scss";
import TaskCard from "../TaskCard/TaskCard";
import type { BoardState } from "../../types/board";
import type { Column as ColumnType } from "../../types/column";
import type { Task } from "../../types/task";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  setBoardData: React.Dispatch<React.SetStateAction<BoardState>>;
  searchQuery: string;
  filterStatus: "all" | "completed" | "incomplete";
  matchesMap: Map<string, FuseResultMatch[]>;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  setBoardData,
  searchQuery,
  matchesMap,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [newTask, setNewTask] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(column.title);
  const [isDragOver, setIsDragOver] = useState(false);

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    const el = document.querySelector(
      `[data-tasks-container="${column.id}"]`
    ) as HTMLElement | null;
    if (!el) return;

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({ type: "empty-column", columnId: column.id }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
    });

    return () => cleanupDrop();
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

  const toggleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) newSet.delete(taskId);
      else newSet.add(taskId);
      return newSet;
    });
  };

  const allVisibleSelected =
    tasks.length > 0 && tasks.every((t) => selectedTasks.has(t.id));

  const toggleSelectAllVisible = () => {
    setSelectedTasks((prev) => {
      if (allVisibleSelected)
        return new Set(
          [...prev].filter((id) => !tasks.some((t) => t.id === id))
        );
      const newSet = new Set(prev);
      tasks.forEach((t) => newSet.add(t.id));
      return newSet;
    });
  };

  const markSelectedAsComplete = () => {
    setBoardData((prev) => {
      const newTasks = { ...prev.tasks };
      selectedTasks.forEach((id) => {
        if (newTasks[id]) newTasks[id].isComplete = true;
      });
      return { ...prev, tasks: newTasks };
    });
  };

  const markSelectedAsIncomplete = () => {
    setBoardData((prev) => {
      const newTasks = { ...prev.tasks };
      selectedTasks.forEach((id) => {
        if (newTasks[id]) newTasks[id].isComplete = false;
      });
      return { ...prev, tasks: newTasks };
    });
  };

  const deleteSelected = () => {
    setBoardData((prev) => {
      const newTasks = { ...prev.tasks };
      const newColumns = { ...prev.columns };

      selectedTasks.forEach((id) => {
        delete newTasks[id];
        Object.values(newColumns).forEach((col) => {
          col.taskIds = col.taskIds.filter((tid) => tid !== id);
        });
      });

      return { ...prev, tasks: newTasks, columns: newColumns };
    });

    setSelectedTasks(new Set());
  };

  const handleDeleteColumn = () => {
    setBoardData((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [column.id]: _, ...restCols } = prev.columns;
      const taskIdsToRemove = prev.columns[column.id].taskIds;
      const restTasks = { ...prev.tasks };
      taskIdsToRemove.forEach((id) => delete restTasks[id]);
      return {
        tasks: restTasks,
        columns: restCols,
        columnOrder: prev.columnOrder.filter((cId) => cId !== column.id),
      };
    });
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
          <>
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
                <button
                  className={styles.iconButton}
                  onClick={handleDeleteColumn}
                  title="Delete column"
                >
                  🗑
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      <div className={styles.columnActions}>
        <Button onClick={markSelectedAsComplete}>Make Completed</Button>
        <Button onClick={markSelectedAsIncomplete}>Make Incompleted</Button>
        <Button onClick={deleteSelected}>Delete</Button>
      </div>

      <div className={styles.columnSelector}>
        <Checkbox
          checked={allVisibleSelected}
          label="Select All"
          onChange={toggleSelectAllVisible}
        />
      </div>

      <div className={styles.columnTasksList} data-tasks-container={column.id}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            setBoardData={setBoardData}
            searchQuery={searchQuery}
            matches={matchesMap.get(task.id) || []}
            isSelected={selectedTasks.has(task.id)}
            toggleSelect={() => toggleSelectTask(task.id)}
          />
        ))}
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
