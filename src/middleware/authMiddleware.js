const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes by verifying JWT token
 */
const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Middleware to authorize specific roles
 * @param  {...string} roles - Allowed roles (e.g., "admin", "teacher", "student")
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied, insufficient permissions" });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };
