import { NextFunction, Request, Response } from "express";
import { INasaAsset } from "../types";

// ex: /endpoint?q=moon&page=2&page_size=10;
export async function search(req: Request, res: Response) {
  const q = req.query.q;
  if (!q) return res.sendStatus(204); // no content

  let page = parseInt(req.query.page as string);
  page = page > 0 ? page : 1;
  let page_size = parseInt(req.query.page_size as string);
  page_size = page_size > 0 ? page_size : 10;

  const response = await fetch(
    `https://images-api.nasa.gov/search?q=${q}&page=${page}&page_size=${page_size}&media_type=image,video`
  );

  const json = await response.json();

  if (!response.ok) {
    return res.status(response.status).json(json);
  }

  res.json(await convertAssets(json));
}

async function convertAssets(json) {
  const items: any[] = json.collection.items;
  const result: INasaAsset[] = [];

  const fetchPromises = items.map(async (item) => {
    if (!item?.data?.length) return;

    const response = await fetch(item.href);
    if (!response.ok) return;

    const { title, media_type, description, nasa_id } = item.data[0];
    const collection: string[] = await response.json();

    let media_url = collection.find((url) => url.includes("~orig")) ?? "";
    if (media_url === "") {
      const ext = media_type === "video" ? ".mp4" : ".jpg";
      media_url = collection.find((url) => url.includes(ext)) ?? "";
    }

    result.push({
      collection_url: item.href,
      media_url,
      title,
      media_type,
      description,
      nasa_id,
    });
  });

  await Promise.all(fetchPromises);

  return result;
}
