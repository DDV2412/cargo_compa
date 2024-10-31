import bcrypt from "bcrypt";
import { userService } from "@/server/service/userService";
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
    const body = await req.body;

    const checkUser = await userService.getUserByEmail(body.user.email);

    if (!checkUser) {
      const user = await userService.createUser({
        name: body.user.name,
        email: body.user.email,
        image: body.user.image,
        password: await bcrypt.hash(body.user.id, 10),
      });

      await userService.providerCreateLogin({
        userId: user.id,
        type: body.account.type,
        provider: body.account.provider,
        providerAccountId: body.account.providerAccountId,
        access_token: body.account.access_token,
        expires_at: body.account.expires_at,
        scope: body.account.scope,
        token_type: body.account.token_type,
        id_token: body.account.id_token,
      });

      return res.json({
        status: 200,
        message: "User created successfully",
        data: user,
      });
    }

    await userService.providerUpdateLogin(checkUser.id, {
      refresh_token: body.account.access_token,
      refresh_token_expires_in: body.account.expires_at,
    });

    await userService.updateUser(checkUser.id, {
      lastActive: new Date(),
    });

    const password = await bcrypt.compare(body.user.id, checkUser.password);

    if (!password) {
      return res.json({
        status: 401,
        message: "Email or password is incorrect",
      });
    }

    return res.json({
      status: 200,
      message: "User created successfully",
      data: checkUser,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
