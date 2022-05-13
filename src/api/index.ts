import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express'
import http from 'http';
import cors, {CorsRequest} from 'cors';
import constants from './constants'
import path from 'path'
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
//import { ApolloServer, gql } from 'apollo-server';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/error';

import rootValue from './schema/root/index'
import resolvers from './schema/resolvers/index'
import typeDefs from './schema/types/index'

dotenv.config();

const port = process.env['API_PORT'] || 4001;

const corsOptions = {
  origin: constants.origins
  // methods: 'GET, POST, OPTIONS'
}  

async function startApolloServer() {
  const app: Express = express();
  const httpServer = http.createServer(app);
  
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        //rootValue,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser()); 


    app.use(constants.routes, cors<CorsRequest>(corsOptions));
    app.use(constants.routes, express.json({limit:"1mb"}));

    // api routes
    app.use('/', require(path.join(__dirname, 'routes', 'root.routes.ts')));

    app.use(errorHandler);

    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>(resolve => httpServer.listen({ port: port }, resolve));

    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer()
