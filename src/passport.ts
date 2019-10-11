import passport from "passport";
import { Strategy as WorbliStrategy, VerifyCallback } from "passport-worbli";
import dotenv from "dotenv";

dotenv.config();

passport.use(new WorbliStrategy({
  clientID: process.env.WORBLI_OAUTH2_CLIENT_ID,
  clientSecret: process.env.WORBLI_OAUTH2_CLIENT_SECRET,
  callbackURL: process.env.WORBLI_OAUTH2_CALLBACK_URL,
  scope: process.env.WORBLI_OAUTH2_SCOPE,
}, (accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback) => {
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
