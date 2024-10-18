import { userService } from "@/server/service/userService";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headersList = req.headers;
  const referer = headersList.referer;
  const auth = headersList.authorization as string;

  if (!referer || !referer.includes(`${process.env.NEXTAUTH_URL}`) || !auth) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  const checkAuth = await decode({
    token: auth.split(" ")[1],
    secret: process.env.NEXTAUTH_SECRET as string,
  });

  if (!checkAuth) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  if (req.method !== "PATCH") {
    return res.json({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    const { id } = req.query;
    const body = req.body;

    if (body.password.length > 0) {
      body.password = await bcrypt.hash(body.password, 12);
    }

    const user = await userService.updateUser(parseInt(id as string), body);

    return res.json({
      status: 200,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
