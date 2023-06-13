import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useState } from "react";

const Asset = ({ asset }) => {
  const { url, id } = asset;
  const [like, setLike] = useState<boolean>(asset.liked);

  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;
  const isImage = imageRegex.test(url);

  const handleLikeClick = () => {
    const method = like ? "DELETE" : "POST";
    setLike(!like);
    fetch(`http://localhost:4000/assets/${id}`, {
      method,
      credentials: "include",
    });
  };

  return (
    <Card sx={{ maxWidth: 345, minWidth: 300 }}>
      <CardActionArea>
        {isImage ? (
          <CardMedia component="img" height="350" src={url} />
        ) : (
          <CardMedia component="video" height="350" src={url} controls />
        )}
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color={like ? "error" : "success"}
          onClick={handleLikeClick}
        >
          {like ? "Remove from fav" : "Add to fav"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Asset;
