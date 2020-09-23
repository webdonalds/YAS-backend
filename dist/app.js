"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let app = express();
// add router
app.use(require('./api/index'));
let port = 3000;
let server = app.listen(port, function () {
    console.log("App is listening at port %d", port);
});
