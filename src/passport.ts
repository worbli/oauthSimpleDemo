import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback as OAuth2VerifyCallback } from "passport-oauth2";
import { Strategy as WorbliStrategy, VerifyCallback as WorbliVerifyCallback } from "passport-worbli";
import { Issuer, Strategy as OpenIDStrategy, TokenSet, UserinfoResponse } from "openid-client";
import dotenv from "dotenv";
import axios from "axios";

// const OpenIDStrategy = require("passport-openid").Strategy;

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

      const { id, user } = response.data;

      var profile = {
        id: id,
        displayName: [
          (user && user.fname) || "",
          (user && user.mname) || "",
          (user && user.lname) || "",
        ].join(" "),
        name: {
          givenName: (user && user.fname) || "",
          middleName: (user && user.mname) || "",
          familyName: (user && user.lname) || "",
        },
        gender: (user && user.gender) || "",
        emails: [
          {
            value: (user && user.email) || "",
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

// OpenID
const issuer = new Issuer({
  issuer: "https://oauth.worbli.io",
  authorization_endpoint: process.env.WORBLI_OAUTH2_OPENID_URL,
  userinfo_endpoint: process.env.WORBLI_OAUTH2_USER_INFO_URL,
  jwks_uri: process.env.WORBLI_OAUTH2_JWKS_URL,
});

const client = new issuer.Client({
  client_id: process.env.WORBLI_OAUTH2_CLIENT_ID,
  client_secret: process.env.WORBLI_OAUTH2_CLIENT_SECRET,
  redirect_uris: [process.env.WORBLI_OAUTH2_OPENID_REDIRECT_URL],
  response_types: ["id_token"],
});

passport.use(new OpenIDStrategy({
  client: client,
}, async (tokenset: TokenSet, userInfo: UserinfoResponse, done: any) => {
  try {
    done(null, {
      id: userInfo.sub,
      displayName: userInfo.name || "",
      name: {
        givenName: userInfo.given_name || "",
        middleName: userInfo.middle_name || "",
        familyName: userInfo.family_name || "",
      },
      gender: userInfo.gender || "",
      emails: [
        {
          value: userInfo.email || ""
          // type:
        }
      ],
    });
  } catch(error) {
    console.error(error);
    done(error);
  }
}));
// end OpenID

passport.serializeUser((user: any, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((id: any, done) => {
  done(null, JSON.parse(id));
});

export default passport;
