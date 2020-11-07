// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import * as homeController from './controllers/Home.js';

const route = (app: any) => {
 app.get("/", homeController.index);
 app.post("/", homeController.index);
 app.get("/account/authenticate", homeController._9e885d49);
 app.post("/account/authenticate", homeController._9e885d49);
 app.get("/account/settings", homeController._3cb10a6e);
 app.post("/account/settings", homeController._3cb10a6e);
 app.get("/developer", homeController._b160aa0e);
 app.post("/developer", homeController._b160aa0e);
}

export default route;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.