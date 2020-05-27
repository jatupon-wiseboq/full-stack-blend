import {Request, Response} from "express";

/**
 * GET /editor
 * Editor page.
 */
export const index = (req: Request, res: Response) => {

    res.render("construction/index", {
    });

};

/**
 * GET /editor/construction/area
 * Construction area page.
 */
export const area = (req: Request, res: Response) => {

    res.render("construction/area/iframe/index", {
    });

};