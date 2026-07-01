const express = require("express");
require("dotenv").config();
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoues");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);


const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});