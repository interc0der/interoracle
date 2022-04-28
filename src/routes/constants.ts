import dotenv from 'dotenv';
dotenv.config();

const origins = [
            `http://localhost:${process.env.API_PORT}`,
          ]

const routes = [
  '/db/search/:value',
  '/db/users/query',
]

const constants = {
    routes, 
    origins
}

export default constants
