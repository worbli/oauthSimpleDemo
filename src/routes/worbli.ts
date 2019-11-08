import { Router } from "express";
import passport from "passport";

const router = Router();

// passport-oauth2
router.get("/login-oauth2", passport.authenticate("oauth2"));
router.get("/callback-oauth2", passport.authenticate("oauth2", {
  failureRedirect: "/unauthorized",
  successRedirect: "/user",
}));

// passport-worbli
router.get("/login-worbli", passport.authenticate("worbli"));
router.get("/callback-worbli", passport.authenticate("worbli", {
  failureRedirect: "/unauthorized",
  successRedirect: "/user",
}));

// passport-openid
router.get('/login-openid', passport.authenticate('authorize.worbli.io'));
router.get('/callback-openid', passport.authenticate('authorize.worbli.io', {
  failureRedirect: '/unauthorized' ,
  successRedirect: '/user',
}));

export default router;
