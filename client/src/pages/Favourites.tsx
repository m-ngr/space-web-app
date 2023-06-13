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
  const [totalPages, setTotalPages] = useState(1);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  useEffect(() => {
    const fetchFavs = async () => {
      const response = await fetch(
        `http://localhost:4000/assets/liked?page=${currentPage}&page_size=12`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        setAssets(await response.json());
        setTotalPages(currentPage + 1);
        setPageError("");
      } else {
        setAssets([]);
        setTotalPages(currentPage);
        setPageError(
          currentPage === 1
            ? "No Fav Assets to view"
            : "No More Fav Assets to view"
        );
      }
    };

    fetchFavs();
  }, [currentPage]);

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

  const handleOnLike = (id) => {
    setAssets(assets.filter((item) => item.id !== id));
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
      <Typography component="h2" variant="h4">
        My Favourite Assets
      </Typography>

      {!pageError && <AssetList assets={assets} onLike={handleOnLike} />}

      {pageError && (
        <Typography color="error" sx={{ paddingY: "200px", flexGrow: 1 }}>
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
