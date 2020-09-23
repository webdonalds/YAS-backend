"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/hello', (request, response) => {
    console.log(request);
    response.send("Hello! I'm Node.js!");
});
module.exports = router;
