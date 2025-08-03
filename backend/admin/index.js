const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const appRouter = require("./app/route"); 
const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cookieParser());
const origin = "http://localhost:3000";

app.use(
  cors({
    origin: origin, 
    credentials: true,             
  })
);

app.use("/api", appRouter);

app.listen(PORT, () => console.log(`server is running on ${PORT}......`));
