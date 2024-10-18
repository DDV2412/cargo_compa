import bcrypt from "bcrypt";
import { userService } from "@/server/service/userService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headersList = req.headers;
  const referer = headersList.referer;

  if (!referer || !referer.includes(`${process.env.NEXTAUTH_URL}`)) {
    return res.json({
      status: 401,
      message: "Unauthorized access",
    });
  }

  if (req.method !== "POST") {
    return res.json({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    const body = await req.body;

    const user = await userService.forgotPasswordCreateToken(body);

    return res.json({
      status: 200,
      message: "Token created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
