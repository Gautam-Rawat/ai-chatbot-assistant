const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoute = require("./routes/chat");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTE
app.use("/api/chat", chatRoute);

// TEST ROUTE (IMPORTANT)
app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});