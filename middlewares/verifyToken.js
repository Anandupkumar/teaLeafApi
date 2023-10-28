const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
   const bearerHeader = req.headers.authorization;
   // console.log(req.headers.authorization);
   if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      //   req.token = bearerToken;

      jwt.verify(bearerToken, "tealeaftoken", (err, authData) => {
         if (err) {
            res.status(403).json({
               code: 403,
               message: "UnAutherized.",
               data: "",
            });
         } else {
            req.authData = authData;
         }
      });
      next();
   } else {
      res.status(403).json({
         code: 403,
         message: "UnAutherized.",
         data: "",
      });
   }
};

module.exports = { verifyToken };
