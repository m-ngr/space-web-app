import { useContext, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import AssetList from "../components/AssetList";
import { Pagination, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function Home() {
  const { user } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [assets, setAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  const fetchAssets = (page: number) => {
    if (searchTerm === "") return;
    return fetch(
      `http://localhost:4000/assets/search?q=${searchTerm}&page=${page}&page_size=12`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .then(() => true)
      .catch(() => false);
  };

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
    const hasAssets = await fetchAssets(page);
    if (hasAssets) {
      setTotalPages(page + 1);
    } else {
      setTotalPages(page);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setTotalPages(3);
    fetchAssets(1);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <SearchBar
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <AssetList assets={assets} />

      {Boolean(assets.length) && (
        <Pagination
          variant="outlined"
          shape="rounded"
          color="primary"
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      )}
    </Paper>
  );
}
