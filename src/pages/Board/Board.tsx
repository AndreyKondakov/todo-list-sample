import React, { useState } from "react";

import { initialData } from "../../data/initialData";
import Column from "../../components/Column/Column";
import styles from "./Board.module.scss";
import Button from "../../components/ui/Button";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState(initialData);

  return (
    <main className={styles.board}>
      <div className={styles.columnsList}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column?.taskIds?.map(
            (taskId) => boardData.tasks[taskId]
          );
          if (!column) return;
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
        <div className={styles.addColumnContainer}>
          <Button onClick={() => {}}>+ Add another column</Button>
        </div>
      </div>
    </main>
  );
};

export default Board;
