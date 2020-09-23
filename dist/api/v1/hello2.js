"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/hello2', (request, response) => {
    response.send("hello2");
});
module.exports = router;
