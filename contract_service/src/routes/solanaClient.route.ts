import { Router } from "express";
import * as controller from "../controllers/solanaClient.controller";

export const router = Router();

router.get("/account", controller.retriveAccount);
router.post("/account", controller.createAccount);
router.put("/account", controller.updateAccount);
