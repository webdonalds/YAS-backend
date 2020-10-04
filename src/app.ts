import * as express from 'express';
import { Database } from './model/index';


let app:express = express();

// give 'force' option for reinitializing DB
Database.sync({force:true});


// add router
app.use(require('./api/index'));


let port:number = 3000;
let server = app.listen(port, function(){
    console.log("App is listening at port %d", port);
})