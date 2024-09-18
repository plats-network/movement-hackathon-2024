import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const retriveAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    res.json("Hello World!");
};

export const createAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    res.json("Create Account");
};

export const updateAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    res.json("Update Account");
};
