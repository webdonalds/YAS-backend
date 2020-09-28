"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
// FIXME : 타입스트립트로 디렉토리자체를 모듈로 불러오는게 안되는거같은데... 방법 찾아보기
router.use('/v1', require('./v1/hello'));
router.use('/v1', require('./v1/test'));
module.exports = router;
