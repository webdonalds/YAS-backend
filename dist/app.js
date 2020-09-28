"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const index_1 = require("./model/index");
let app = express();
// give 'force' option for reinitializing DB
// Database.sync({force:true});
index_1.Database.sync();
// add router
app.use(require('./api/index'));
let port = 3000;
let server = app.listen(port, function () {
    console.log("App is listening at port %d", port);
});
