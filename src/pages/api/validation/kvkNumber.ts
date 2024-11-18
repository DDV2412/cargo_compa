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
      `https://api.kvk.nl/test/api/v1/basisprofielen/${body.kvkNumber}`,
      {
        method: "GET",
        headers: {
          apiKey: "l7xx1f2691f2520d487b902f4e0b57a0b197",
        },
      },
    );

    const response = await validation.json();

    return res.json({
      status: 200,
      message: response,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
