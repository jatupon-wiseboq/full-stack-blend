// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Request, Response} from "express";
import Componentindex from "./components/index.js";
import Componentb160aa0e from "./components/developer/_b160aa0e.js";
import Component3cb10a6e from "./components/account/settings/_3cb10a6e.js";

export const index = (req: Request, res: Response) => {
	new Componentindex(req, res, "home/index");
}
export const _b160aa0e = (req: Request, res: Response) => {
	new Componentb160aa0e(req, res, "home/developer/_b160aa0e");
}
export const _3cb10a6e = (req: Request, res: Response) => {
	new Component3cb10a6e(req, res, "home/account/settings/_3cb10a6e");
}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.