"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.use('/v1', require('./v1/hello'));
module.exports = router;
