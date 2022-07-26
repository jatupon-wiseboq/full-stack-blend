// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import * as homeController from './controllers/Home';

const route = (app: any) => {
 app.get("/", homeController.index);
 app.post("/", homeController.index);
 app.put("/", homeController.index);
 app.delete("/", homeController.index);
 app.get("/account/authenticate", homeController._9e885d49);
 app.post("/account/authenticate", homeController._9e885d49);
 app.put("/account/authenticate", homeController._9e885d49);
 app.delete("/account/authenticate", homeController._9e885d49);
 app.get("/account/settings", homeController._3cb10a6e);
 app.post("/account/settings", homeController._3cb10a6e);
 app.put("/account/settings", homeController._3cb10a6e);
 app.delete("/account/settings", homeController._3cb10a6e);
 app.get("/development/workarounds", homeController._b160aa0e);
 app.post("/development/workarounds", homeController._b160aa0e);
 app.put("/development/workarounds", homeController._b160aa0e);
 app.delete("/development/workarounds", homeController._b160aa0e);
}

export default route;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.