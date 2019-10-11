import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/login-oauth2", passport.authenticate("worbli"));

router.get("/callback-oauth2", passport.authenticate("worbli", {
  failureRedirect: "/unauthorized",
  successRedirect: "/user",
}));

export default router;
