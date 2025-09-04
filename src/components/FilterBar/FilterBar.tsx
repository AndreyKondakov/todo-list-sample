import React from "react";
import styles from "./FilterBar.module.scss";
import Button from "../ui/Button";

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
        <Button
          isActive={filterStatus === "all" ? true : false}
          onClick={() => setFilterStatus("all")}
        >
          All
        </Button>
        <Button
          isActive={filterStatus === "completed" ? true : false}
          onClick={() => setFilterStatus("completed")}
        >
          Completed
        </Button>
        <Button
          isActive={filterStatus === "incomplete" ? true : false}
          onClick={() => setFilterStatus("incomplete")}
        >
          Incomplete
        </Button>
      </div>
      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
