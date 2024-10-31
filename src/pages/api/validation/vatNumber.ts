import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.json({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    const body = req.body;

    const validation = await fetch(
      `https://controleerbtwnummer.eu/api/validate/${body.numberValue}.json`,
      {
        method: "GET",
      },
    );

    const response = await validation.json();

    return res.json({
      status: 200,
      data: response,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
