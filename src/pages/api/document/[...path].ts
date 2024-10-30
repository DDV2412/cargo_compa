import { createReadStream, ReadStream, statSync } from "fs";
import mime from "mime";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.json({
        status: 405,
        message: "Method not allowed",
      });
    }

    const url = new URL(req.url || "", `http://${req.headers.host}`);

    const path = url.pathname.replace("/api/document/", "").split("/");

    const filePath = join(process.cwd(), "public", "document", ...path);

    const fileStat = statSync(filePath);

    if (fileStat.isFile()) {
      const mimeType = mime.getType(filePath) || "application/octet-stream";
      const fileStream: ReadStream = createReadStream(filePath);

      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", fileStat.size);
      fileStream.pipe(res);
    } else {
      res.status(404).send("Not found");
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}
