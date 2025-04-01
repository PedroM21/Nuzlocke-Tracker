import jwt from "jsonwebtoken";

function runsMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  // Check if there is a token associated with the user
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Remove Bearer prefix from the token if present
  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.split(" ")[1]
    : token;

  // Verify if the toekn is valid
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
  });
}

export default runsMiddleware;
