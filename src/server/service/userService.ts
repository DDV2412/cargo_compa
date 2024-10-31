import { userRepo } from "../repo/userRepo";
import { getMailTemplate } from "@/utils/getMailTemplate";
import { sendMailServer } from "@/lib/mail";
import { decode } from "next-auth/jwt";

export const userService = {
  createUser: async (userData: any) => {
    // Create a new user
    return await userRepo.createUser(userData);
  },
  getUsers: async () => {
    // Get all users
    return await userRepo.getUsers();
  },
  getUserById: async (userId: number) => {
    // Get user by id
    return await userRepo.getUserById(userId);
  },
  getUserByEmail: async (email: string) => {
    // Get user by email
    return await userRepo.getUserByEmail(email);
  },
  updateUser: async (userId: number, userData: any) => {
    // Update user
    return await userRepo.updateUser(userId, userData);
  },
  deleteUser: async (userId: number) => {
    // Delete user
    return await userRepo.deleteUser(userId);
  },
  providerCreateLogin: async (account: any) => {
    return await userRepo.providerCreateLogin(account);
  },
  providerUpdateLogin: async (userId: number, account: any) => {
    return await userRepo.providerUpdateLogin(userId, account);
  },
  verifyUser: async (tokenData: string) => {
    const token = await decode({
      secret: process.env.NEXTAUTH_SECRET as string,
      token: tokenData,
    });

    if (!token) {
      throw new Error("Invalid token");
    }

    return await userRepo.verifyUser(token.email as string);
  },
  verifyUserCreateToken: async (data: any) => {
    const token = await userRepo.verifyUserCreateToken(data);

    const user = await userService.getUserByEmail(data.email);

    const getTemplate = getMailTemplate({
      name: user?.name || "",
      link: process.env.NEXTAUTH_URL as string,
      heading: "Verify your account",
      messageContentHtml: `
                    <p>Thank you for signing up with Cargo Compa. To complete your registration, please enter the
                        verification code below on the verification page:</p>
                    <div style="text-align:center;margin:24px 0">
                        <a href="${process.env.NEXTAUTH_URL}/verify-account/${token.token}" style="background-color:#3b82f6;color:#ffffff;display:inline-block;font-size:16px;font-weight:600;line-height:48px;text-align:center;text-decoration:none;width:200px;border-radius:8px">Verify Account</a>
                    </div>
                    <p>This code will expire in 1 hour. If you did not request this code, please disregard this email.
                    </p>`,
    });

    return sendMailServer({
      email: user?.email || data.email,
      subject: "Please Verify Your Account to Complete Your Registration",
      text: `Your verification code is ${token.token}`,
      htmlContent: getTemplate,
    });
  },
  forgotPasswordCreateToken: async (data: any) => {
    const token = await userRepo.forgotPasswordCreateToken(data);

    const getTemplate = getMailTemplate({
      name: token?.email || "",
      link: process.env.NEXTAUTH_URL as string,
      heading: "Reset your password",
      messageContentHtml: `
            <p>We received a request to reset your password for your Cargo Compa account. To reset your password, please enter the
              verification code below on the password reset page:</p>
            <div style="text-align:center;margin:24px 0">
              <h2 style="font-size:24px;font-weight:600">${token.token}</h2>
            </div>
            <p>This code will expire in 1 hour. If you did not request this code, please disregard this email.
            </p>`,
    });

    return sendMailServer({
      email: token?.email || data.email,
      subject: "Reset Your Password",
      text: `Your password reset code is ${token.token}`,
      htmlContent: getTemplate,
    });
  },
  forgotPasswordVerifyToken: async (tokenData: any) => {
    return await userRepo.forgotPasswordVerifyToken(tokenData);
  },
  checkDocument: async (document: any) => {
    return await userRepo.checkDocument(document);
  },
  completeData: async (userId: number, data: any) => {
    return await userRepo.completeData(userId, data);
  },
};
