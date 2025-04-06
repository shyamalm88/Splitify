const passport = require("passport");
const jwt = require("jsonwebtoken");

// Middleware to authenticate with JWT
exports.authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to authenticate with local strategy
exports.authenticateLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: info ? info.message : "Invalid credentials",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to validate JWT token
exports.validateToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
