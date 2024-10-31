import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.json({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");

    const filename = `exportdate/exportdate_${year}${month}${day}${hour}.js`;

    const validation = await fetch(
      `https://ec.europa.eu/taxation_customs/dds2/eos/${filename}`,
      {
        method: "GET",
      },
    );

    return res.json({
      status: validation.status,
      message: validation.statusText,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
