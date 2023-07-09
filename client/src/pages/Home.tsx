import { useContext, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import AssetList from "../components/AssetList";
import { Pagination, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function Home() {
  const { user } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [assets, setAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  const fetchAssets = async (page: number) => {
    if (searchTerm === "") return;
    const response = await fetch(
      `https://server-space.onrender.com/assets/search?q=${searchTerm}&page=${page}&page_size=12`,
      {
        credentials: "include",
      }
    );

    const json = await response.json();

    if (response.ok && json.length) {
      setAssets(json);
      setTotalPages(page + 1);
      setPageError("");
    } else {
      setAssets([]);
      setTotalPages(page);
      setPageError(page === 1 ? "No Assets to view" : "No More Assets to view");
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchAssets(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
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
        flexGrow: 1,
      }}
    >
      <SearchBar
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {!pageError && <AssetList assets={assets} onLike={null} />}

      {pageError && (
        <Typography color="error" sx={{ paddingY: "200px" }}>
          {pageError}
        </Typography>
      )}

      <Pagination
        sx={{ marginTop: "auto", paddingY: "20px" }}
        variant="outlined"
        shape="rounded"
        color="primary"
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
      />
    </Paper>
  );
}
