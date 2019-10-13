import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback as OAuth2VerifyCallback } from "passport-oauth2";
import { Strategy as WorbliStrategy, VerifyCallback as WorbliVerifyCallback } from "passport-worbli";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// passport-oauth2
passport.use(new OAuth2Strategy({
  authorizationURL: process.env.WORBLI_OAUTH2_AUTHORIZATION_URL,
  tokenURL: process.env.WORBLI_OAUTH2_TOKEN_URL,
  clientID: process.env.WORBLI_OAUTH2_CLIENT_ID,
  clientSecret: process.env.WORBLI_OAUTH2_CLIENT_SECRET,
  callbackURL: process.env.WORBLI_OAUTH2_CALLBACK_URL,
  scope: process.env.WORBLI_OAUTH2_SCOPE,
}, (accessToken: string, refreshToken: string, profile: any, cb: OAuth2VerifyCallback) => {
  // get worbli user info
  axios.get(process.env.WORBLI_OAUTH2_ME, {
    headers: {
      Authorization: `Bearer ${accessToken}`
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
}));

// passport-worbli
passport.use(new WorbliStrategy({
  clientID: process.env.WORBLI_OAUTH2_CLIENT_ID,
  clientSecret: process.env.WORBLI_OAUTH2_CLIENT_SECRET,
  callbackURL: process.env.WORBLI_OAUTH2_CALLBACK_URL,
  scope: process.env.WORBLI_OAUTH2_SCOPE,
  state: true,
}, (accessToken: string, refreshToken: string, profile: any, cb: WorbliVerifyCallback) => {
  // TODO: Save accessToken for future use
  // TODO: Find or create local user
  cb(null, profile);
}));

passport.serializeUser((user: any, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((id: any, done) => {
  done(null, JSON.parse(id));
});

export default passport;
