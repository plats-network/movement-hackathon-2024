import { Request, Response } from "express";
import { movementClient } from "../services/movementClient.service";
export const retriveAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { platId } = req.body;
        if (typeof platId !== "string") {
            res.status(400).json({ msg: "Invalid plat id", code: 400 });
            return;
        }
        const data = await movementClient.fetchIdentity(platId);
        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};
// export const createKeypair = async (
//     req: Request,
//     res: Response,
// ): Promise<void> => {
//     try {
//         initializeProgram();
//         const keypair = generateKeypair();
//         res.json({ msg: "success", code: 200, data: keypair });
//     } catch (error) {
//         console.log(error);
//         res.json({ msg: error, code: 500 }).status(500);
//     }
// };

export const createAccount = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { platId, address, storeIds } = req.body;

        const success = await movementClient.registerIdentity(
            address,
            platId,
            storeIds,
        );
        res.json({ msg: "success", code: 200, data: success });
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
        const { address, platId, storeIds } = req.body;
        const data = await movementClient.updateIdentity(
            address,
            platId,
            storeIds,
        );
        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};

// export const updatePermission = async (
//     req: Request,
//     res: Response,
// ): Promise<void> => {
//     try {
//         initializeProgram();
//         const { publicKey, platId, permissions } = req.body;
//         const data = await grantPermissions(platId, publicKey, permissions);

//         res.json({ msg: "success", code: 200, data });
//     } catch (error) {
//         console.log(error);
//         res.json({ msg: error, code: 500 }).status(500);
//     }
// };

export const addAddress = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { address, platId, storeIds } = req.body;
        const data = await movementClient.addIdentity(
            address,
            platId,
            storeIds,
        );
        res.json({ msg: "success", code: 200, data });
    } catch (error) {
        console.log(error);
        res.json({ msg: error, code: 500 }).status(500);
    }
};
