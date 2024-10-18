import { userService } from "@/server/service/userService";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headersList = req.headers;
  const auth = headersList.authorization as string;

  if (!auth) {
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

  if (req.method !== "DELETE") {
    return res.json({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    const { id } = req.query;

    const user = await userService.deleteUser(parseInt(id as string));

    return res.json({
      status: 200,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
