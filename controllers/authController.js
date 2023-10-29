const {
   Users,
   createNewAdminUser,
   getAdminUserByEmail,
} = require("../models/userModel");

const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
   try {
      // Attempt to find an existing user
      const existingUser = await getAdminUserByEmail(req.body.email);

      if (!existingUser) {
         // User doesn't exist, create a new user
         const result = await createNewAdminUser(req.body);

         // Generate a token for the new user
         const token = jwt.sign(
            { userId: result.id, email: result.email },
            "tealeaftoken",
            { expiresIn: "1h" }
         );

         res.status(200).json({
            code: 200,
            message: "admin created successfully",
            data: { data: result, token: token },
         });
      } else {
         // User with the same email already exists
         res.status(400).json({
            code: 400,
            message: "user already exists with this email",
            data: "",
         });
      }
   } catch (error) {
      // Handle any errors that occur during the process
      res.status(400).json({
         code: 400,
         message: "Error! Something went wrong.",
         data: "",
      });
   }
};

const adminLogin = async (req, res) => {

   try {
      // Attempt to find an existing user
      const existingUser = await getAdminUserByEmail(req.body.email);

      if (!existingUser) {

         // User with the email does not exists
         res.status(400).json({
            code: 400,
            message: "user already exists with this email",
            data: "",
         });
      } else {

         // Generate a token for the new user
         const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            "tealeaftoken",
            { expiresIn: "2h" }
         );

         res.status(200).json({
            code: 200,
            message: "admin login successfully",
            data: { data: existingUser, token: token },
         });
      }
   } catch (error) {
      // Handle any errors that occur during the process
      res.status(400).json({
         code: 400,
         message: "Error! Something went wrong.",
         data: "",
      });
   }
};

const getAdminUserDetails = async (req, res) => {
   res.status(200).json({
      code: 200,
      message: "done",
      data: { data: req.authData },
   });
};

module.exports = { registerUser, getAdminUserDetails, adminLogin };
