const router = require("express").Router();
const ctrls = require("@controllers/userController");

// [POST] add user
router.post("/register", ctrls.register);

module.exports = router;
