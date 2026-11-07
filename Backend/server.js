const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) =>{
    res.json({message: "One Piece is real"});
});

app.listen(PORT, () =>{
    console.log(`Server is running at http://localhost:${PORT}`);    
});