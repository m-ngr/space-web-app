import { Grid } from "@mui/material";
import Asset from "./Asset";

const AssetList = ({ assets }) => {
  return (
    <Grid container spacing={2} sx={{ marginY: "20px" }}>
      {assets.map((item) => (
        <Grid item xs key={item.id}>
          <Asset asset={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AssetList;
