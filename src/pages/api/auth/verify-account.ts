import { userService } from "@/server/service/userService";
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";

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

    const token = await encode({
      secret: process.env.NEXTAUTH_SECRET as string,
      token: {
        email: body.user.email,
        iat: new Date(Date.now() * 1000),
        exp: new Date(Date.now() + 3600 * 1000),
      },
    });

    const data = {
      email: body.user.email,
      token,
      expires: new Date(Date.now() + 3600 * 1000),
    };

    const user = await userService.verifyUserCreateToken(data);

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
