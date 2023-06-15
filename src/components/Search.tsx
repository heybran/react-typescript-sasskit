import { SearchIcon } from "./Icon";

export default function Search() {
  return (
    <div className="interio-header__search-bar">
      <SearchIcon />
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <input
        id="search-input"
        className="interio-header__search-input"
        type="text"
        placeholder="Search anything..."
        tabIndex={0}
        autoComplete="on"
      />
    </div>
  );
}
