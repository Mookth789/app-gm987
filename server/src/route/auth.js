import express from ("express");
const router = express.Router();

const {
  register,
  login,
  currentUser,
  loginLine,
  loginFacebook
} = require("../Controllers/auth");
const { auth, adminCheck } = require("../Middleware/auth");

// http://localhost:5000/api/register
router.post("/register", register);
router.post("/login", login);
router.post("/login-line", loginLine);
router.post("/login-facebook", loginFacebook);
router.post("/current-user", auth, currentUser);
router.post("/current-admin", auth, adminCheck, currentUser);

module.exports = router;
