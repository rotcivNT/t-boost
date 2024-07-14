"use server";

import { MetadataResponseProps } from "@/types/link-metadata";

const apiKey = process.env.JSON_API_KEY;

// const apiUrl = `https://jsonlink.io/api/extract?url=${url}&api_key=${apiKey}`;
export const getLinkMetadata = async (
  url: string
): Promise<MetadataResponseProps | undefined> => {
  const apiUrl = `https://jsonlink.io/api/extract?url=${url}&api_key=${apiKey}`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};
