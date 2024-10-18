import { NextApiRequest, NextApiResponse } from "next";

interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}
import { decode } from "next-auth/jwt";
import path from "path";
import { createRouter, expressWrapper } from "next-connect";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "public", "images");

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = createRouter<NextApiRequest, NextApiResponse>();

// @ts-ignore
handler.use(upload.single("image"));

handler.post(async (req, res) => {
  const headersList = req.headers;
  const auth = headersList.authorization as string;

  const checkAuth = await decode({
    token: auth.split(" ")[1],
    secret: process.env.NEXTAUTH_SECRET as string,
  });

  if (!checkAuth) {
    return res.status(401).json({
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
    // @ts-ignore
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const imagePath = `/api/images/${file.filename}`;

    return res.status(200).json({
      message: "File uploaded successfully",
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: imagePath,
      },
    });
  } catch (error: any) {
    console.error("Error during file upload:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

export default handler.handler();
