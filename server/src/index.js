import 'dotenv/config';
import connectDB from './config/db.js';
import express from 'express';

const app = express();

//Middleware to parse JSON request bodies
app.use(express.json());

//Simple test route
app.get('/health', (req, res) => {
    res.json({ok:true, message: 'FieldSync API is live and healthy'})
});

//Connect to MongoDB
const start = async () => {
    await connectDB();
}

//Start listening on express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`)
});

start();