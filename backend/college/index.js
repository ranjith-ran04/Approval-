const express = require("express");
const cors = require("cors");
const appRouter = require("./app/route");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api", appRouter);

app.listen(PORT, () => console.log(`server is running on ${PORT}......`));
