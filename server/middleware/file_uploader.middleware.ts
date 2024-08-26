import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.memoryStorage();
const upload: any = multer({ storage });

// FILE UPLOAD MIDDLEWARE HANDLER.
export default defineEventHandler(async (event) => {
  if (
    event.node.req.method === "POST" ||
    (event.node.req.method === "PUT" &&
      event.node.req.headers["content-type"]?.startsWith("multipart/form-data"))
  ) {
    // Handle the upload and form data
    await new Promise<void>((resolve, reject) => {
      upload.single("picture")(event.node.req, event.node.res, (err: any) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const file = (event.node.req as any).file;

    if (!file || !file.buffer) {
      throw new Error("File data not found or invalid.");
    }

    try {
      // Resizing..
      const resizedImageBuffer = await sharp(file.buffer)
        .resize(3200, 3200)
        .toBuffer();

      // Manage upload dir
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // set the file finally
      const fileName = `${Date.now()}-${file.originalname}`;
      const outputPath = path.join(uploadsDir, fileName);
      fs.writeFileSync(outputPath, resizedImageBuffer);

      // construct the full URL to access the file
      const protocol = event.node.req.headers["x-forwarded-proto"] || "http";
      const host = event.node.req.headers.host;

      // sent the file to handler via the <context>
      event.context.fileUrl = `${protocol}://${host}/uploads/${fileName}`;
    } catch (err) {
      console.error("Error processing the file:", err);
      throw new Error("File processing failed.");
    }

    // sent also the rest <form data> props.
    const formData = Object.assign({}, (event.node.req as any).body);
    event.context.formData = formData;
  }
});
