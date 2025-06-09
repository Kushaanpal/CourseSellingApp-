import jwt from 'jsonwebtoken';

function adminMiddleware(req, res, next) {
  // Check if the Authorization header exists and starts with 'Bearer '
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Unauthorized, JWT token is required" });
  }

  // Extract token from 'Bearer <token>'
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
    
    // Attach user ID to request object
    req.adminId = decoded.id;
    next(); // Proceed to next middleware or route
  } catch (err) {
    // Return error if token is invalid
    return res.status(401).json({ message: "Unauthorized, JWT token is invalid" });
  }
}

export default adminMiddleware;
