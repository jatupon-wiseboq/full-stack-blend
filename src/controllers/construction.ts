import {Request, Response} from "express";
import {UserDocument, User} from "../models/User";

/**
 * GET /editor
 * Editor page.
 */
export const index = async (req: Request, res: Response) => {
    let user = req.user as UserDocument;
    if (req.query.evaluation === 'business') user = await User.findOne({email: 'evaluation+business@softenstorm.com'});
    if (req.query.evaluation === 'premium') user = await User.findOne({email: 'evaluation+premium@softenstorm.com'});
    if (req.query.evaluation === 'basic') user = await User.findOne({email: 'evaluation+basic@softenstorm.com'});
    if (req.query.evaluation === 'community') user = await User.findOne({email: 'evaluation@softenstorm.com'});
    
    if (!user) {
    	res.redirect('/account/authenticate');
    } else {
	    res.render("construction/index", {
	    	user: user
	    });
    }
};

/**
 * GET /editor/construction/area
 * Construction area page.
 */
export const html = async (req: Request, res: Response) => {
    let user = req.user as UserDocument;
		if (!user) user = await User.findOne({email: 'evaluation@softenstorm.com'});
		
		if (!user) {
    	res.redirect('/account/authenticate');
    } else {
	    res.render("construction/area/html/index", {
	    	user: user
	    });
    }
};