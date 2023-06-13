import { useEffect, useState, useContext } from "react";
import AssetList from "../components/AssetList";
import { Pagination, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function Favourites() {
  const { user } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [assets, setAssets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  useEffect(() => {
    fetch(
      `http://localhost:4000/assets/liked?page=${currentPage}&page_size=12`,
      {
        credentials: "include",
      }
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setAssets(data))
      .then(() => setTotalPages(currentPage + 1))
      .catch(() => setTotalPages(currentPage));
  }, [currentPage]);

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
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
      <Typography component="h2" variant="h4">
        My Favourite Assets
      </Typography>

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
