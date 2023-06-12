import { NextFunction, Request, Response } from "express";
import { convertAssets, fetchAssetById } from "../utils/fetchAssets";

// ex: /search?q=moon&page=2&page_size=10&type=image;
export async function search(req: Request, res: Response) {
  let { q, type } = req.query;
  if (!q) return res.sendStatus(204); // no content

  if (!type || (type !== "image" && type !== "video")) {
    type = "image,video";
  }

  let page = parseInt(req.query.page as string);
  page = page > 0 ? page : 1;
  let pageSize = parseInt(req.query.page_size as string);
  pageSize = pageSize > 0 ? pageSize : 10;

  const response = await fetch(
    `https://images-api.nasa.gov/search?q=${q}&page=${page}&page_size=${pageSize}&media_type=${type}`
  );

  const json = await response.json();

  if (!response.ok) {
    return res.status(response.status).json(json);
  }

  res.json(await convertAssets(json, req.user?.assets!));
}

// ex: /liked?page=2&page_size=10
export async function getLikedAsset(req: Request, res: Response) {
  let page = parseInt(req.query.page as string);
  page = page > 0 ? page : 1;
  let pageSize = parseInt(req.query.page_size as string);
  pageSize = pageSize > 0 ? pageSize : 10;
  const skip = (page - 1) * pageSize;

  const assetSubset = req.user?.assets.slice(skip, skip + pageSize)!;

  if (assetSubset.length === 0) {
    return res.status(400).json({ error: "No more assets to view" });
  }

  const assetPromises = assetSubset.map((id) =>
    fetchAssetById(id, assetSubset)
  );
  let nasaAssets = await Promise.all(assetPromises);
  nasaAssets = nasaAssets.filter((res) => res);

  return res.json(nasaAssets);
}

export async function getAsset(req: Request, res: Response) {
  const id = req.params.id;
  const asset = await fetchAssetById(id, req.user?.assets!);

  if (!asset) {
    return res.status(400).json({ error: "Invalid Id" });
  }

  return res.json(asset);
}

export async function likeAsset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const asset = await fetchAssetById(id, req.user?.assets!);

    if (!asset) {
      return res.status(400).json({ error: "Invalid Id" });
    }

    if (asset.liked) {
      return res.status(400).json({ error: "Asset already liked" });
    }

    req.user?.assets.push(id);
    await req.user?.save();

    return res.json({ message: "Asset liked successfully" });
  } catch (error) {
    next(error);
  }
}

export async function unlikeAsset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid Id" });

    const index = req.user?.assets.indexOf(id)!;
    if (index === -1) {
      return res.status(400).json({ error: "Asset is not liked" });
    }

    req.user?.assets.splice(index, 1);
    await req.user?.save();

    return res.json({ message: "Asset unliked successfully" });
  } catch (error) {
    next(error);
  }
}
