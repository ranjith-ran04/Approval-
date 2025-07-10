const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const appRouter = require("./app/route"); 
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,             
  })
);

app.use("/api", appRouter);

app.listen(PORT, () => console.log(`server is running on ${PORT}......`));
