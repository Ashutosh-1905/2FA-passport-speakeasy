import User from "../models/user.js";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide username, password",
      });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: "This username already exits.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashPassword,
      isMfaActive: false,
    });

    console.log("new user : ", newUser);
    await newUser.save();

    return res.status(200).json({
      message: "User register successfully.",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error Registering user",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("The authenticated user: ", req.user);

    return res.status(200).json({
      message: "User logged in successfully.",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error login user",
    });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Error during logout." });
      }
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          return res.status(500).json({ error: "Failed to destroy session." });
        }
        return res
          .status(200)
          .json({ message: "User logged out successfully." });
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while logging out.",
    });
  }
};

const authStatus = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({
        message: "User is Authenticated.",
        username: req.user.username,
        isMfaActive: req.user.isMfaActive,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized user" });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error authStatus user",
    });
  }
};

const authenticate = async (req, res, next) => {
  try {
      if (req.isAuthenticated()) return next();
      
      return res.status(401).json({ message: "Unauthorized" });
      
  } catch (error) {
    return res.status(500).json({ message: "authenticate error" });
  }
};

const setup2fa = async (req, res) => {
  try {
    console.log("The req.user is : ", req.user);
    const user = req.user;
    let secret = speakeasy.generateSecret();

    console.log("The secret object is : ", secret);

    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${user.username}`,
      issuer: "ashutoshatoliya@gmail.com",
      // encoding: base32,
    });

    const qrImageurl = await qrcode.toDataURL(url);
   return res.status(200).json({
      message: "2FA setup successful.",
      secret: secret.base32,
      qrcode: qrImageurl,
    });
  } catch (error) {
   return res.status(500).json({
      error: "Error Setting up 2FA.",
    });
  }
};

const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      endcoding: "base32",
      token,
    });

    if (verified) {
      const jwtToken = jwt.sign({ username: user.username }, config.jwtSecret, {
        expiresIn: "1hr",
      });
     return res.status(200).json({ message: "2FA Successful", token: jwtToken });
    } else {
     return res.status(400).json({ message: "Invalid 2FA TOKEN" });
    }
  } catch (error) {
   return res.status(500).json({
      error: "error in verify 2FA",
    });
  }
};

const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();

   return res.status(200).json({
      message: "2FA reset successful.",
    });
  } catch (error) {
   return res.status(500).json({
      error: "Error Reseting 2FA.",
      message: error,
    });
  }
};

export {
  register,
  login,
  logout,
  authStatus,
  authenticate,
  setup2fa,
  verify2FA,
  reset2FA,
};
