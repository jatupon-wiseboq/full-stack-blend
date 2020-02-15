import {Request, Response} from "express";

/**
 * GET /
 * Construction page.
 */
export const index = (req: Request, res: Response) => {

    res.render("construction/area", {
    });

};
