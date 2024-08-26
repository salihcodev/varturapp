import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "main.log");

const logToFile = (message: string) => {
  const logEntry = `[${new Date().toISOString()}] ${message}\n`;

  // Ensure the logs directory exists
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  }

  // Append the log entry to the file
  fs.appendFileSync(logFilePath, logEntry, "utf8");
};

export default logToFile;
