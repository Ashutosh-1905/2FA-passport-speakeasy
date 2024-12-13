import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) return done(null, false, { message: "User not found." });

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  try {
    console.log("We are inside serializeUser.", user._id);
    // const user = await User.findById(_id);
    done(null, user._id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (_id, done) => {
  try {
    console.log("We are inside deserializeUser.", _id);
      const user = await User.findById(_id);
      if (!user)
        return done(new Error("User not found during deserialization"));
    done(null, user);
  } catch (error) {
     console.error("Error in deserializeUser:", error);
    done(error);
  }
});
