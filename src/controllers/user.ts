import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import {User, UserDocument, AuthToken} from "../models/User";
import {Request, Response, NextFunction} from "express";
import {IVerifyOptions} from "passport-local";
import {WriteError} from "mongodb";
import {check, sanitize, validationResult} from "express-validator";
import "../config/passport";
import "babel-polyfill";

/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/account/authenticate");
  });
};

/**
 * GET /account/delete
 * Delete user account.
 */

export const getDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as UserDocument;
  
  User.remove({_id: user.id}, (err) => {
    if (err) {
      return next(err);
    }
    req.logout(() => {
      res.redirect("/");
    });
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export const getOauthUnlink = (req: Request, res: Response, next: NextFunction) => {
  const {provider} = req.params;
  const user = req.user as UserDocument;
  
  User.findById(user.id, (err, user: any) => {
    if (err) {
      return next(err);
    }
    
    user[provider] = undefined;
    user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
    user.save((err: WriteError) => {
      if (err) {
        return next(err);
      }
      res.redirect("/account/settings");
    });
  });
};