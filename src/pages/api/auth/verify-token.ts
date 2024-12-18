import { userService } from "@/server/service/userService";
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";

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
    const body = await req.body;

    const user = await userService.verifyUser(body.token);

    return res.json({
      status: 200,
      message: "User verified successfully",
      data: user,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
