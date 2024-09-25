import { Request, Response } from "express";
import {
    initializeProgram,
    fetchIdentity,
    registerIdentity,
    updateIdentity,
    grantPermissions,
    addIdentity,
    generateKeypair,
} from "../services/solanaClient.service";
/**
 * GET /
 * Home page.
 */
export const retriveAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        initializeProgram();

        const { platId } = req.body;
        if (typeof platId !== "string") {
            res.status(400).json({ msg: "Invalid plat id", code: 400 });
            return;
        }
        const data = await fetchIdentity(platId as string);
        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};
export const createKeypair = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        initializeProgram();
        const keypair = generateKeypair();
        res.json({ msg: "success", code: 200, data: keypair });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};

export const createAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        initializeProgram();
        console.log(req.body);
        const { platId, publicKey } = req.body;
        const keys = await registerIdentity(publicKey, platId);
        res.json({ msg: "success", code: 200, data: keys });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};

export const updateAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        initializeProgram();
        const {
            publicKey,
            platId,
            storeIdBalance,
            storeIdVolume,
            storeIdTwitter,
        } = req.body;
        const data = await updateIdentity(
            publicKey,
            platId,
            storeIdBalance,
            storeIdVolume,
            storeIdTwitter,
        );
        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};

export const updatePermission = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        initializeProgram();
        const { publicKey, platId, permissions } = req.body;
        const data = await grantPermissions(platId, publicKey, permissions);

        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};

export const addAddress = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        initializeProgram();
        const { publicKey, platId } = req.body;
        const data = await addIdentity(platId, publicKey);
        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};
