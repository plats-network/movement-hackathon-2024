import { Router } from "express";
import * as controller from "../controllers/solanaClient.controller";

export const router = Router();

router.post("/account/info", controller.retriveAccount);
router.post("/account", controller.createAccount);
router.put("/account", controller.updateAccount);
