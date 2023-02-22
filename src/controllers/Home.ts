// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Request, Response} from "express";
import {ActionHelper} from "./helpers/ActionHelper";
import {WorkerHelper} from "./helpers/WorkerHelper";
import {SchedulerHelper} from "./helpers/SchedulerHelper";
import {SitemapHelper} from "./helpers/SitemapHelper";
import {Project} from "./helpers/ProjectConfigurationHelper";
import {loc} from "./helpers/LocalizationHelper";

import Componentindex from "./components/index";
import Component9e885d49 from "./components/account/authenticate/_9e885d49";
import Component3cb10a6e from "./components/account/settings/_3cb10a6e";
import Component7bc56453 from "./components/demo/guestbook/_7bc56453";
import Componentb160aa0e from "./components/development/workarounds/_b160aa0e";

export const index = (req: Request, res: Response) => {
  new Componentindex(req, res, "home/index");
}
export const _9e885d49 = (req: Request, res: Response) => {
  new Component9e885d49(req, res, "home/account/authenticate/_9e885d49");
}
export const _3cb10a6e = (req: Request, res: Response) => {
  new Component3cb10a6e(req, res, "home/account/settings/_3cb10a6e");
}
export const _7bc56453 = (req: Request, res: Response) => {
  new Component7bc56453(req, res, "home/demo/guestbook/_7bc56453");
}
export const _b160aa0e = (req: Request, res: Response) => {
  new Componentb160aa0e(req, res, "home/development/workarounds/_b160aa0e");
}

SitemapHelper.register('/', 'weekly', 1);
SitemapHelper.register('/account/authenticate', 'weekly', 0.8);
SitemapHelper.register('/development/workarounds', 'weekly', 0.8);

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.