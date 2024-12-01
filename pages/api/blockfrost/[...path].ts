import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Normalize `path` to an array
  const path = Array.isArray(req.query.path)
    ? req.query.path
    : req.query.path
    ? [req.query.path]
    : []; // Handle `undefined`

  // Join the path segments
  const endpoint = path.join("/");

  const address = `${process.env.BLOCKFROST_MAINNET_URL}/${endpoint}`;

  try {
    const response = await fetch(address, {
      headers: {
        "Content-Type": "application/json",
        project_id: process.env.BLOCKFROST_MAINNET_KEY as string,
      },
      method: req.method,
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Failed to fetch data", details: e });
  }
}
