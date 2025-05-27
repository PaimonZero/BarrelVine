const express = require("express");
const dbConnect = require("./src/config/dbconnect");
import { env } from "./src/config/environment.js";

const app = express();
const port = env.APP_PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();

app.get("/", (req, res) => {
    res.send("Server okay!");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
