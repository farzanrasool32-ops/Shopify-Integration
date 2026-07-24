const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const integrationRouter = require("./routes/integrationRouter");

const app = express();

app.use(
  "/api/integration/webhooks",
  express.raw({
    type: "application/json",
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", authRouter);
app.use("/api/integration", integrationRouter);

module.exports = app;