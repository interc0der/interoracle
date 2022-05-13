import dotenv from 'dotenv'
import path from 'path';

dotenv.config({path: path.join(__dirname, '..','..','..','.env')})
console.log(path.join(__dirname, '..','..','..','.env'))

export default process.env