import { useState, useEffect } from "react";
import { loadBoard, LOCAL_STORAGE_KEY } from "../../app/store";
import Button from "../../components/ui/Button";
import Column from "../../components/Column/Column";
import FilterBar from "../../components/FilterBar/FilterBar";
import styles from "./Board.module.scss";
import { useBoardDnD } from "../../hooks/useBoardDnD";
import { useBoardSearch } from "../../hooks/useBoardSearch";
import { filterTasks } from "../../utils/taskFilters";
import type { BoardState } from "../../types/board";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardState>(() => loadBoard());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "incomplete"
  >("all");

  useBoardDnD(setBoardData);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boardData));
    } catch (err) {
      console.error("[Board] save error", err);
    }
  }, [boardData]);

  // Smart search
  const matchedTasks = useBoardSearch(
    Object.values(boardData.tasks),
    searchQuery
  );

  const handleCreateNewColumn = () =>
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

          const tasks = filterTasks(
            column.taskIds.map((taskId) => boardData.tasks[taskId]),
            filterStatus
          ).filter((task) => !searchQuery || matchedTasks.has(task.id));

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              setBoardData={setBoardData}
              searchQuery={searchQuery}
              matchesMap={matchedTasks}
              filterStatus={filterStatus}
            />
          );
        })}

        <div className={styles.addColumnContainer}>
          <Button onClick={handleCreateNewColumn}>+ Add another column</Button>
        </div>
      </div>
    </main>
  );
};

export default Board;
