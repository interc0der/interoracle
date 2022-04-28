import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express'
import http from 'http';
import cors, {CorsRequest} from 'cors';
import constants from './routes/constants'
import path from 'path'

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 4001;

const corsOptions = {
  origin: constants.origins
  // methods: 'GET, POST, OPTIONS'
}  

app.use(constants.routes, cors<CorsRequest>(corsOptions));
app.use(constants.routes, express.json({limit:"1mb"}));


app.use('/', require(path.join(__dirname, 'routes')));


const server = http.createServer(app);
server.listen(port, () => {
  console.log('Server is running on port', port);
});
server.on('error', (e) => {
  console.log('Server has received an error', e);
});