import prisma from "../../../prisma/client";

export const userRepo = {
  createUser: async (userData: any) => {
    try {
      // Create user
      const user = await prisma.user.create({
        data: userData,
      });

      return user;
    } catch (error: any) {
      console.log(error);
      if (error.code === "P2002") {
        throw new Error(`A user with this email already exists.`);
      } else {
        // Handler error message
        throw new Error("Something went wrong");
      }
    }
  },
  getUsers: async () => {
    // Get all users
    try {
      return await prisma.user.findMany({
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  getUserById: async (userId: number) => {
    // Get user by id
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  getUserByEmail: async (email: string) => {
    // Get user by email
    try {
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  updateUser: async (userId: number, userData: any) => {
    // Update user
    try {
      if (userData.remember !== undefined) {
        userData.remember = Boolean(userData.remember);
      }

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: userData,
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  deleteUser: async (userId: number) => {
    // Delete user
    try {
      return await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  providerCreateLogin: async (account: any) => {
    try {
      const { userId, ...res } = account;
      return await prisma.account.create({
        data: {
          userId,
          ...res,
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  providerUpdateLogin: async (userId: number, account: any) => {
    try {
      return await prisma.account.update({
        where: {
          userId,
        },
        data: account,
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  verifyUser: async (email: string) => {
    try {
      const token = await prisma.verificationToken.findFirst({
        where: {
          email,
        },
      });

      if (!token) {
        throw new Error("Invalid token");
      }

      if (token.expires < new Date()) {
        throw new Error("Token expired");
      }

      await prisma.verificationToken.deleteMany({
        where: {
          email,
        },
      });

      return await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  verifyUserCreateToken: async (data: any) => {
    try {
      return await prisma.verificationToken.create({
        data: data,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  },
  forgotPasswordCreateToken: async (data: any) => {
    try {
      const uniqueToken = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      return await prisma.resetToken.create({
        data: {
          email: data.email,
          token: uniqueToken,
          expires: new Date(Date.now() + 3600 * 1000),
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  forgotPasswordVerifyToken: async (data: any) => {
    try {
      const checkToken = await prisma.resetToken.findFirst({
        where: {
          token: data.token,
        },
      });

      if (!checkToken) {
        throw new Error("Invalid token");
      }

      if (checkToken.expires < new Date()) {
        throw new Error("Token expired");
      }

      await prisma.resetToken.deleteMany({
        where: {
          token: data.token,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          email: checkToken.email,
        },
      });

      return await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          password: data.password,
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  checkDocument: async (document: any) => {
    try {
      const whereClause: { [key: string]: any } = {};

      for (const key in document) {
        if (document.hasOwnProperty(key)) {
          whereClause[key] = document[key];
        }
      }

      return await prisma.companyProfile.findFirst({
        where: whereClause,
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  completeData: async (userId: number, data: any) => {
    try {
      await prisma.companyProfile.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          ...data,
        },
      });

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          acceptedDate: new Date(),
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
};
