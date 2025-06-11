const express = require('express');
const { google, signin, signout, signup } = require('../controllers/auth_controller');

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);

module.exports = router;
