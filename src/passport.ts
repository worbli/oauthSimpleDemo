import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyFunction, VerifyCallback } from "passport-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";

const verifyFunction: VerifyFunction = (accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback) => {
  console.log("[verifyFunction] accessToken =", accessToken);
  console.log({accessToken, refreshToken, profile});
  cb(null, {id: 111});
}

passport.use(new OAuth2Strategy({
  authorizationURL: "http://localhost:5000/oauth",
  tokenURL: "http://localhost:5000/api/oauth/access_token",
  clientID: "5d8a1d2fc8f5b97fd8d9ad5f",
  clientSecret: "application-secret",
  callbackURL: "http://127.0.0.1:3030/worbli/callback-oauth2",
  scope: "email profile address phone",
}, verifyFunction));

export default passport;
