import { Grid } from "@mui/material";
import Asset from "./Asset";

const AssetList = ({ assets, onLike }) => {
  return (
    <Grid container spacing={2} sx={{ marginY: "20px" }}>
      {assets.map((item) => (
        <Grid item xs key={item.id}>
          <Asset asset={item} onLike={onLike} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AssetList;
