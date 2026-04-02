const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoute = require("./routes/chat");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE (FIX FOR RENDER)
app.get("/", (req, res) => {
    res.send("Backend is live and running 🚀");
});

// API ROUTE
app.use("/api/chat", chatRoute);

// PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});