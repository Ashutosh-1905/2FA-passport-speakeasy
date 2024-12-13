import express from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import config from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js";

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};

// middlewares

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: config.sessionSecret || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// routes

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "2FA Password running",
  });
});

app.use(globalErrorHandler);
export default app;
