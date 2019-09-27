import { Router } from "express";
import passport from "passport";
// import Tokens from "csrf";
// import HttpStatus from "http-status-codes";
// import axios from "axios";

const router = Router();
// const tokens = new Tokens();

/* GET users listing. */
// router.get("/login", (req, res) => {
//   req.session.worbli_secret = tokens.secretSync();

//   const url = new URL("http://localhost:5000/oauth");
//   url.searchParams.append("client_id", "5d8a1d2fc8f5b97fd8d9ad5f");
//   url.searchParams.append("redirect_uri", "http://127.0.0.1:3030/worbli/callback");
//   url.searchParams.append("scope", "email profile address phone");
//   url.searchParams.append("state", tokens.create(req.session.worbli_secret));
//   res.redirect(url.toString());
// });

// router.get("/callback", (req, res) => {
//   if (!tokens.verify(req.session.worbli_secret, req.query.state)) {
//     res.status(HttpStatus.BAD_REQUEST).send({
//         message: "Invalid anti-forgery CSRF response!",
//     });
//     return;
//   }

//   if (req.query.error) {
//     switch (req.query.error) {
//       case "access_denied":
//         return res.status(HttpStatus.UNAUTHORIZED).send({
//             message: "The user did not authorize the request.",
//         });
//     }
//   }

//   axios.post("http://localhost:5000/oauth/access_token", {

//   }).then((response) => {

//   });
// });

router.get("/login-oauth2", passport.authenticate("oauth2"));

router.get("/callback-oauth2", passport.authenticate("oauth2", {
  failureRedirect: "/unauthorized",
  successRedirect: "/user",
}));

export default router;
