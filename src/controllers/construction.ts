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
export const html = (req: Request, res: Response) => {

    res.render("construction/area/html/index", {
    });

};
export const data = (req: Request, res: Response) => {

    res.render("construction/area/data/index", {
    });

};