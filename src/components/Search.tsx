import { SearchIcon } from "./Icon";
import styles from "./Search.module.css";

export default function Search() {
  return (
    <div className={styles.search}>
      <SearchIcon />
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <input
        id="search-input"
        className={styles.input}
        type="text"
        placeholder="Search anything..."
        tabIndex={0}
        autoComplete="on"
      />
    </div>
  );
}
