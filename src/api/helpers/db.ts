import mongoose from 'mongoose';
import mongodb, { MongoClientOptions} from 'mongodb'
const Schema = mongoose.Schema;

interface ConnectOptions extends MongoClientOptions {
    /** Set to false to [disable buffering](http://mongoosejs.com/docs/faq.html#callback_never_executes) on all models associated with this connection. */
    bufferCommands?: boolean;
    /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
    dbName?: string;
    /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
    user?: string;
    /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
    pass?: string;
    /** Set to false to disable automatic index creation for all models associated with this connection. */
    autoIndex?: boolean;
    /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
    autoCreate?: boolean;
  }

import dotenv from 'dotenv'
import path from 'path';
dotenv.config({path: path.join(__dirname, '..','..','.env')})

const username = process.env['DB_USER_KEY']
const password = process.env['DB_USER_SECRET']
const port = process.env['DB_PORT']
const db = "gatewayDB" || process.env['DB_NAME']
const container = 'localhost' || process.env['DB_CT_NAME']

const connectionOptions:ConnectOptions = {
    bufferCommands: true,
    autoIndex: true,
    autoCreate: true,
    user: 'root',
    pass: 'enuXyG5a!EidfFo17vg^ix*VBk1ogncgG$',
    dbName:'Account'
}

const uri = `mongodb://${container}:${port}`;

mongoose.connect(process.env['MONGODB_URI'] || uri  , connectionOptions );
mongoose.Promise = global.Promise;


import account_model from '../models/account.model'
import refresh_model from '../models/refreshToken.model'

export default {
    Account: account_model,
    RefreshToken: refresh_model,
    isValidId
};

function isValidId(id:string) {
    return mongoose.Types.ObjectId.isValid(id);
}