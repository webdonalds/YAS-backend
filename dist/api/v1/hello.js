"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/hello', (request, response) => {
    response.send("hello");
});
module.exports = router;
