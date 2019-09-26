import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyFunction, VerifyCallback } from "passport-oauth2";
import axios from "axios";

const verifyFunction: VerifyFunction = (accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback) => {
  axios.get("http://localhost:5000/api/oauth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
  .then((response) => {
    cb(null, {
      ...response.data,
      accessToken
    });
  })
  .catch((error) => {
    cb(error);
  });
}

passport.use(new OAuth2Strategy({
  authorizationURL: "http://localhost:5000/oauth",
  tokenURL: "http://localhost:5000/api/oauth/access_token",
  clientID: "5d8a1d2fc8f5b97fd8d9ad5f",
  clientSecret: "application-secret",
  callbackURL: "http://127.0.0.1:3030/worbli/callback-oauth2",
  scope: "email profile address phone",
}, verifyFunction));

passport.serializeUser((user: any, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((id: any, done) => {
  done(null, JSON.parse(id));
});

export default passport;
