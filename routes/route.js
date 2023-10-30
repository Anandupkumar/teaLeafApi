const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken");


router.get("/", (req, res) => {
   res.status(200).json({ message: "kerivada makkele" });
});
router.post("/user-register", authController.registerUser);
router.post("/admin-login", authController.adminLogin);

router.post("/check-number-exist", authController.checkNumberExist);
router.post("/verify-otp", authController.verifyOtp);

router.get("/get-user-details", verifyToken, authController.getAdminUserDetails);


module.exports = router;
