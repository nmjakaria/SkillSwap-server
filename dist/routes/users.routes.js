"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
router.get("/me", auth_1.requireAuth, users_controller_1.getMe);
router.patch("/me", auth_1.requireAuth, users_controller_1.updateMe);
exports.default = router;
