const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attaches decoded token to req object

      console.log("User role:", req.user.role);  // Debugging 
      console.log("Allowed roles:", allowedRoles);  // Debugging 

      // Check if the user has one of the allowed roles
      // if (!allowedRoles.includes(req.user.role)) {
      //   return res.status(403).json({ message: "Forbidden: Access is denied" });
      // }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
