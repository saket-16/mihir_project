const jwt = require('jsonwebtoken');


exports.withAuth = (req, res, next) => {
    let token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    if (token.startsWith("Bearer ")) {

      token = token.slice(7, token.length);
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  };