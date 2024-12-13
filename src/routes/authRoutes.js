import { Router } from "express";
import passport from "passport";

import {
    authenticate,
  authStatus,
  login,
  logout,
  register,
  reset2FA,
  setup2fa,
  verify2FA,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.get("/logout", logout);
router.get("/status", authStatus);

router.post("/2fa/setup", authenticate, setup2fa );
router.post("/2fa/verify",authenticate, verify2FA );
router.post("/2fa/reset", authenticate, reset2FA);

export default router;
