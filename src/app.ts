import * as express from 'express';



let app:express = express();

// add router
app.use(require('./api/index'));


let port:number = 3000;
let server = app.listen(port, function(){
    console.log("App is listening at port %d", port);
})