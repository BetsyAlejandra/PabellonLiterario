const express = require('express');
import { registerUser, loginUser, logOut, profile } from "../controllers/authController.js";
import {authRequired} from "../middlewares/validateToken.js";
import {validateSchema} from '../middlewares/validatorSc.js ';
import {registerSchema, loginSchema} from '../schemas/authSchema.js';
const router = express.Router();


router.post('/register', validateSchema(registerSchema), registerUser);
router.post('/login', validateSchema(loginSchema), loginUser);
router.post('/logout', logOut);

router.get('/profile', authRequired, profile);

module.exports = router;