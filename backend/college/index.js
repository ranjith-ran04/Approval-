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
app.use(express.urlencoded({ extended: true }));
app.use("/api", appRouter);
app.get("/test",(req,res)=>{console.log("test postman")
  res.send("postman testing");
});

app.listen(PORT, () => console.log(`server is running on ${PORT}......`));
