const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const appRouter = require("./app/route"); 
const app = express();
const PORT = 5000;
const {uploadsRoot} = require("../common/uploadHelper");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,             
  })
);

app.use("/api", appRouter);
app.use("/api/uploads", express.static(uploadsRoot));

app.listen(PORT, () => console.log(`server is running on ${PORT}......`));
