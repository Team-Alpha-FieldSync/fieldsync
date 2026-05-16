import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers/index.js'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { getUserFromRequest } from './middleware/auth.js';

const start = async () => {
    //Connect to MongoDB
    await connectDB();

    //Initiate Express server
    const app = express();

    //Initiate Apollo Server(Connect to schema and resolvers)
    const apollo = new ApolloServer({
        typeDefs,
        resolvers,
    });
    
    //Starting Apollo Server
    await apollo.start();
    
    //Mounting Apollo Server at /graphql
    app.use(
        '/graphql',
        cors({origin: process.env.CLIENT_URL || '*'}),
        express.json(),
        expressMiddleware(apollo, {
            context: async ({req}) => ({
                user: getUserFromRequest(req),
            }),
        })
    );
    
    //Health Check
    app.get('/health', (req, res) => {
        res.json({ok:true, message: 'FieldSync API is live and healthy'})
    });
    
    
    //Start listening on servers
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>{
        //Express Server
        console.log(`Server running on http://localhost:${PORT}`)
        //Apollo Server
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
}

start();