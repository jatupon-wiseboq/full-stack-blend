// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Request, Response} from "express";
import Componentindex from "./components/index.js";
import Component9e885d49 from "./components/account/authenticate/_9e885d49.js";
import Component3cb10a6e from "./components/account/settings/_3cb10a6e.js";
import Componentb160aa0e from "./components/developer/_b160aa0e.js";

export const index = (req: Request, res: Response) => {
	new Componentindex(req, res, "home/index");
}
export const _9e885d49 = (req: Request, res: Response) => {
	new Component9e885d49(req, res, "home/account/authenticate/_9e885d49");
}
export const _3cb10a6e = (req: Request, res: Response) => {
	new Component3cb10a6e(req, res, "home/account/settings/_3cb10a6e");
}
export const _b160aa0e = (req: Request, res: Response) => {
	new Componentb160aa0e(req, res, "home/developer/_b160aa0e");
}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.