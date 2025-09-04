import React from "react";
import styles from "./FilterBar.module.scss";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterStatus: "all" | "completed" | "incomplete";
  setFilterStatus: (value: "all" | "completed" | "incomplete") => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterButtons}>
        <button
          className={filterStatus === "all" ? styles.active : ""}
          onClick={() => setFilterStatus("all")}
        >
          All
        </button>
        <button
          className={filterStatus === "completed" ? styles.active : ""}
          onClick={() => setFilterStatus("completed")}
        >
          Completed
        </button>
        <button
          className={filterStatus === "incomplete" ? styles.active : ""}
          onClick={() => setFilterStatus("incomplete")}
        >
          Incomplete
        </button>
      </div>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default FilterBar;
