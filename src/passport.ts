import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback as OAuth2VerifyCallback } from "passport-oauth2";
import { Strategy as WorbliStrategy, VerifyCallback as WorbliVerifyCallback } from "passport-worbli";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// passport-oauth2
passport.use(new OAuth2Strategy({
  clientID: process.env.WORBLI_OAUTH2_CLIENT_ID,
  clientSecret: process.env.WORBLI_OAUTH2_CLIENT_SECRET,
  callbackURL: "/worbli/callback-oauth2",
  scope: "user.email user.dob user.gender user.fname user.lname iddoc.number iddoc.type iddoc.state iddoc.date addressdoc.type addressdoc.country addressdoc.date addressdoc.line1 addressdoc.line2 addressdoc.town addressdoc.state addressdoc.zip",
  state: true,

  authorizationURL: process.env.WORBLI_OAUTH2_AUTHORIZATION_URL,
  tokenURL: process.env.WORBLI_OAUTH2_TOKEN_URL,
}, (accessToken: string, refreshToken: string, profile: any, cb: OAuth2VerifyCallback) => {
  // get worbli user info
  axios.get(process.env.WORBLI_OAUTH2_ME, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then((response) => {
      // normalize user info to passport profile
      // http://www.passportjs.org/docs/profile/
      // https://tools.ietf.org/html/draft-smarr-vcarddav-portable-contacts-00
      var profile = {
        // id: String(response.data.id);
        displayName: [response.data.user.fname, response.data.user.mname, response.data.user.lname].join(" "),
        name: {
          givenName: response.data.user.fname,
          middleName: response.data.user.mname,
          familyName: response.data.user.lname
        },
        gender: response.data.user.gender,
        emails: [
          {
            value: response.data.user.email,
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
  callbackURL: "/worbli/callback-worbli",
  scope: "user.email user.dob user.gender user.fname user.lname iddoc.number iddoc.type iddoc.state iddoc.date addressdoc.type addressdoc.country addressdoc.date addressdoc.line1 addressdoc.line2 addressdoc.town addressdoc.state addressdoc.zip",

  authorizationURL: process.env.WORBLI_OAUTH2_AUTHORIZATION_URL,
  tokenURL: process.env.WORBLI_OAUTH2_TOKEN_URL,
  userProfileURL: process.env.WORBLI_OAUTH2_ME,
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
