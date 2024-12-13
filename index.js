import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
  connectDB();
  const port = config.port || 4000;

  app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
  });

  process.on("unhandledRejections", (err, promise) => {
    console.log(`Logged Error: ${err}`);
    server.close(() => process.exit(1));
  });
};

startServer();
