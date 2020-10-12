import * as express from 'express';
import { Database } from './model/index';

import index from './api/index';

const app:express = express();

// give 'force' option for reinitializing DB
//Database.sync({force:true});
Database.sync();


// add router
app.use(index);


const port = 3000;
const server = app.listen(port, function(){
    console.log('App is listening at port %d', port);
});