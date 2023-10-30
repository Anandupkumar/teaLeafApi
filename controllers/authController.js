const {
   Users,
   createNewAdminUser,
   getAdminUserByEmail,
   getUserDetailsWithPhone,
} = require("../models/userModel");

const admin = require("firebase-admin");
const serviceAccount = require("../firebaseServiceAccount.json");

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
});

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
            message: "user not registered with this email",
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

const checkNumberExist = async (req, res) => {
   try {
      // Attempt to find an existing user
      const existingUser = await getAdminUserByEmail(req.body.email);

      if (!existingUser) {
         // User with the email does not exists
         res.status(400).json({
            code: 400,
            message: "user not registered with this email",
            data: false,
         });
      } else {
         res.status(200).json({
            code: 200,
            message: "User exists",
            data: true,
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

const verifyOtp = async (req, res) => {
   const idToken = req.body.accessToken;

   try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Retrieve user information
      const user = await admin.auth().getUser(uid);

      const userDetails = await getUserDetailsWithPhone(
         user.providerData[0].phoneNumber
      );

      if (!userDetails) {

         res.status(404).json({
            status: "NOT FOUND",
            code: 404,
            message: "You are not registered with us!",
            data: null,
         });

      } else {
         // Generate a token for the new user
         const token = jwt.sign(
            { userId: userDetails.id, email: userDetails.email },
            "tealeaftoken",
            { expiresIn: "2h" }
         );

         // Respond with user data and token
         res.status(200).json({
            status: "OK",
            code: 200,
            message: "Token verified successfully",
            data: { userDetails: userDetails, token: token },
         });
      }

   } catch (error) {
      // Handle token verification failure
      res.status(404).json({
         status: "NOT FOUND",
         code: 404,
         message: error.message,
         data: null,
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

module.exports = {
   registerUser,
   getAdminUserDetails,
   adminLogin,
   checkNumberExist,
   verifyOtp,
};
