import { SearchIcon } from "./Icon"

export default function Search() {
  return (
    <div className="search-bar">
      <SearchIcon />
      <label htmlFor="hearder-search-input" className="sr-only">Search</label>
      <input 
        id="header-search-input"
        className="search-bar__input"
        type="text" 
        placeholder={`Try "Table", "Sofa", "Chair"`} 
        tabIndex={0}
        autoComplete="on"
      />
    </div>
  )
}