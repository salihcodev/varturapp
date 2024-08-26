import { PrismaClient } from "@prisma/client";
import logToFile from "../utils/log-to-file.uril.ts";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const requestInfo = `Method: ${event.req.method}, URL: ${event.req.url}`;

    // Log to the database
    await prisma.log.create({
      data: {
        action: `REQUEST`,
        entity: `Request`,
        entity_id: 1,
        message: requestInfo,
      },
    });

    // Log to the file
    logToFile(`REQUEST: ${requestInfo}`);
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error";
    console.log(`ERROR`, errorMessage);

    // Log to the database
    await prisma.log.create({
      data: {
        action: `ERROR`,
        entity: `Error`,
        entity_id: 0,
        message: errorMessage,
      },
    });

    // Log to the file
    logToFile(`ERROR: ${errorMessage}`);
  }
});
