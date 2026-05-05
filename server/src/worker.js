import "dotenv/config";
import { startTimeoutCron } from "../services/taskTimeoutCron.js";

console.log("Worker started");

startTimeoutCron();
