import { Request, Response } from "express";
import {
    initializeProgram,
    fetchIdentity,
    registerIdentity,
    updateIdentity,
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

        const { publicKey } = req.query;
        if (typeof publicKey !== "string") {
            res.status(400).json({ msg: "Invalid publicKey", code: 400 });
            return;
        }
        const data = await fetchIdentity(publicKey as string);
        res.json({ msg: "success", code: 200, data });
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
            secretNameBalance,
            secretNameVolume,
            secretNameTwitter,
            storeIdBalance,
            storeIdVolume,
            storeIdTwitter,
        } = req.body;
        const data = await updateIdentity(
            publicKey,
            platId,
            storeIdBalance,
            secretNameBalance,
            storeIdVolume,
            secretNameVolume,
            storeIdTwitter,
            secretNameTwitter,
        );
        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};
