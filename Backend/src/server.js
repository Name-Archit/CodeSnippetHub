const express = require("express");
const app = express();

app.use(express.json());

const snippetRoutes = require("./routes/snippetRoutes");

app.use("/api/snippets", snippetRoutes);

app.get("/", (req, res) => {
    res.send("Your API is LIVE");
});

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
});