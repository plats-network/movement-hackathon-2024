import { Router } from "express";
import * as controller from "../controllers/solanaClient.controller";

export const router = Router();

router.post("/account/info", controller.retriveAccount);
router.post("/account", controller.createAccount);
router.put("/account/permission", controller.updatePermission);
router.put("/account/identity", controller.addAddress);
router.put("/account", controller.updateAccount);
router.get("/keypair", controller.createKeypair);
