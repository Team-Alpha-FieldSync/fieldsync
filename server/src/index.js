import express from 'express';

const app = express();

//Middleware to parse JSON request bodies
app.use(express.json());

//Simple test route
app.get('/health', (req, res) => {
    res.json({ok:true, message: 'FieldSync API is live and healthy'})
});

//Start listening
const PORT = 4000;
app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`)
});