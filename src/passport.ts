import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyFunction, VerifyCallback } from "passport-oauth2";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const verifyFunction: VerifyFunction = (accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback) => {
  axios.get(process.env.WORBLI_OAUTH2_ME, {
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
  authorizationURL: process.env.WORBLI_OAUTH2_AUTHORIZATION_URL,
  tokenURL: process.env.WORBLI_OAUTH2_TOKEN_URL,
  clientID: process.env.WORBLI_OAUTH2_CLIENT_ID,
  clientSecret: process.env.WORBLI_OAUTH2_CLIENT_SECRET,
  callbackURL: process.env.WORBLI_OAUTH2_CALLBACK_URL,
  scope: process.env.WORBLI_OAUTH2_SCOPE,
}, verifyFunction));

passport.serializeUser((user: any, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((id: any, done) => {
  done(null, JSON.parse(id));
});

export default passport;
