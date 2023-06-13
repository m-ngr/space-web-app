import { IconButton, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({ onSearch, searchTerm, setSearchTerm }) {
  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <IconButton color="primary" onClick={handleSearch}>
        <Search />
      </IconButton>
    </div>
  );
}
