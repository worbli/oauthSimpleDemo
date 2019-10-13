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
  callbackURL: "http://127.0.0.1:3030/worbli/callback-oauth2",
  scope: process.env.WORBLI_OAUTH2_SCOPE,
}, (accessToken: string, refreshToken: string, profile: any, cb: OAuth2VerifyCallback) => {
  // get worbli user info
  axios.get(process.env.WORBLI_OAUTH2_ME, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .then((response) => {
    // normalize user info to passport profile
    var profile = {
      // id: String(response.data.id);
      displayName: [response.data.fname, response.data.mname, response.data.lname].join(" "),
      name: {
        givenName: response.data.fname,
        middleName: response.data.mname,
        familyName: response.data.lname
      },
      gender: response.data.gender,
      emails: [
        {
          value: response.data.email,
          // type:
        }
      ],
    };

  // TODO: Save accessToken for future use
  // TODO: Find or create local user
  cb(null, profile);
  })
  .catch((error) => {
    cb(error);
  });
}));

// passport-worbli
passport.use(new WorbliStrategy({
  clientID: process.env.WORBLI_OAUTH2_CLIENT_ID,
  clientSecret: process.env.WORBLI_OAUTH2_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3030/worbli/callback-worbli",
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
