import React, { useEffect, useRef } from "react";
import styles from "./TaskCard.module.scss";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  columnId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnId }) => {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className={styles.taskCard}>
      <p>{task.content}</p>
    </div>
  );
};

export default TaskCard;
