import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

import Meed from "meed";

function extractImage(content: string) {
  const $ = cheerio.load(content);
  return $("img").attr("src") || "";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Configure Meed with a custom fetch implementation
    const meed = new Meed({
      fetch: (url, options) => {
        const sanitizedOptions = {
          ...options,
          headers: {
            ...options?.headers,
            cookie: "", // Ensure no cookies are sent
          },
        };
        return fetch(url, sanitizedOptions);
      },
    });

    // Fetch the Medium feed
    const feed = await meed.user("@HalalADAPool");

    // Format the feed response
    const formattedFeed = feed.map((post: any) => {
      return {
        title: post.title,
        link: post.link,
        date: post.date,
        thumbnail: extractImage(post.content),
      };
    });

    // Respond with the formatted feed
    res.status(200).json(formattedFeed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch Medium feed" });
  }
}
