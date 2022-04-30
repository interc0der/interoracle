import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express'
import http from 'http';
import cors, {CorsRequest} from 'cors';
import constants from './routes/constants'
import path from 'path'
import schema from './schema';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
//import { ApolloServer, gql } from 'apollo-server';

dotenv.config();

//const port = process.env.API_PORT || 4001;

const corsOptions = {
  origin: constants.origins
  // methods: 'GET, POST, OPTIONS'
}  

async function startApolloServer() {
  const app: Express = express();
  const httpServer = http.createServer(app);
  
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  app.use(constants.routes, cors<CorsRequest>(corsOptions));
  app.use(constants.routes, express.json({limit:"1mb"}));
  app.use('/', require(path.join(__dirname, 'routes')));

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer()