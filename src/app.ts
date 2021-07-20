import * as express from 'express';
import * as cors from 'cors';
import { Database } from './model/index';
import * as morgan from 'morgan';

import index from './api/index';

const app = express();

// give 'force' option for reinitializing DB
//Database.sync({force:true});
Database.sync();

// cors
app.use(cors());

// add access log logger
app.use(morgan('combined'));

// add router
app.use(express.json({
    limit : '10mb'
}));
app.use(index);


const port = 3000;
const server = app.listen(port, function () {
    console.log('App is listening at port %d', port);
});