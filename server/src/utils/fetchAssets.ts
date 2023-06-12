import { INasaAsset } from "../types";

export async function fetchAssetById(id: string, userAssets: string[]) {
  try {
    const response = await fetch(` https://images-api.nasa.gov/asset/${id}`);
    if (!response.ok) return null;
    const json = await response.json();
    const items = json.collection.items;
    const liked = userAssets.includes(id);

    const orgItem = items.find((item) => item.href.includes("~orig"));
    if (!orgItem) return null;

    const nasaAsset: INasaAsset = { url: orgItem.href, id, liked };
    return nasaAsset;
  } catch {
    return null;
  }
}

export async function convertAssets(json, userAssets: string[]) {
  const items: any[] = json.collection.items;
  const result: INasaAsset[] = [];

  const fetchPromises = items.map(async (item) => {
    if (!item?.data?.length) return;

    const response = await fetch(item.href);
    if (!response.ok) return;

    const collection: string[] = await response.json();
    const url = collection.find((url) => url.includes("~orig")) ?? "";

    if (url === "") return;

    const { nasa_id } = item.data[0];
    const liked = userAssets.includes(nasa_id);

    result.push({ id: nasa_id, url, liked });
  });

  await Promise.all(fetchPromises);

  return result;
}
