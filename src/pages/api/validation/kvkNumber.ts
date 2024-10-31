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
      `https://api.overheid.io/v3/suggest/openkvk/${body.kvkNumber}`,
      {
        method: "GET",
        headers: {
          "ovio-api-key": `${process.env.KVK_API_KEY}`,
        },
      },
    );

    const response = await validation.json();

    console.log(response);

    if (response[0].link) {
      const kvkData = await fetch(
        `https://api.overheid.io${response[0].link}`,
        {
          method: "GET",
          headers: {
            "ovio-api-key": `${process.env.KVK_API_KEY}`,
          },
        },
      );

      const kvkResponse = await kvkData.json();

      return res.json({
        status: 200,
        data: kvkResponse,
      });
    } else {
      return res.json({
        status: 404,
        message: "KVK number not found",
      });
    }
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
