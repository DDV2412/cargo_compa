import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb } from "pdf-lib";
import dayjs from "dayjs";

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

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
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
handler.use(upload.single("signature"));

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
    const signaturePath = req.file.path;

    const body = req.body;

    if (!signaturePath) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const templatePath = path.resolve("./public/template/template.pdf");
    const pdfBuffer = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const signatureBytes = fs.readFileSync(signaturePath);
    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    const signatureWidth = 190;
    const signatureHeight = 40;

    const pages = pdfDoc.getPages();
    const marginX = 110;
    const marginY = 20;

    [0, 1, 2].forEach((pageIndex) => {
      if (pageIndex < pages.length) {
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        if (pageIndex === 0) {
          page.drawText(body.kvk, {
            x: 150,
            y: height - 225,
            size: 10,
            color: rgb(0, 0, 0),
          });
          page.drawText(body.eori, {
            x: 150,
            y: height - 245,
            size: 10,
            color: rgb(0, 0, 0),
          });
        }

        page.drawImage(signatureImage, {
          x: width - signatureWidth - marginX,
          y: marginY,
          width: signatureWidth,
          height: signatureHeight,
        });
      }
    });

    const pdfBytes = await pdfDoc.save();

    const dateStr = dayjs().format("YYYY-MM-DD");
    const safeName = body.kvk.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${safeName}_${dateStr}.pdf`;

    const outputDir = path.resolve("./public/document");
    const outputPath = path.join(outputDir, fileName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, pdfBytes);

    fs.unlinkSync(signaturePath);

    return res.status(200).json({
      message: "File uploaded successfully",
      file: {
        path: process.env.NEXTAUTH_URL + "/api/document/" + fileName,
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
