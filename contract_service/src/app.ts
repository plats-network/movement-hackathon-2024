import dotenv from "dotenv";
dotenv.config();
import express from "express";
import logger from "morgan";
import * as path from "path";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { router as solanaRoute } from "./routes/solanaClient.route";
// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/v1/internal", solanaRoute);
app.use("/api/v1/health", async (req, res) => {
    res.json("OK");
});

app.use(errorNotFoundHandler);
app.use(errorHandler);
