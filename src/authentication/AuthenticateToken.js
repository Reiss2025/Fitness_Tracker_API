// Import all required modules
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('./TokenBlacklist');

//Import variables
const JWT_SECRET = process.env.JWT_SECRET;

//Function to authenticate jwt tokens
const authenticateToken = () => {
  return (req, res, next) => {
    //Extract the token from the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //If no token is provided return 401
    if (!token) {
      const response = new Response(401, false, "Authentication token required");
      return sendFormattedResponse(req, res, response);
    }

    //If token is blacklisted return 401
    if (tokenBlacklist.has(token)) {
      const response = new Response(401, false, "Authentication token logged out");
      return sendFormattedResponse(req, res, response);
    }

    //Verify token using the jwt secret
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        const response = new Response(403, false, "Invalid or expired token");
        return sendFormattedResponse(req, res, response);
      }

      //If the token is valid attach the user's id to the request object
      req.user = user;

      //If the user is authorised allow access to the route
      next();
    });
  };
};

//Send the response in the users specified format
function sendFormattedResponse(req, res, response) {
  const acceptHeader = req.headers['accept'] || '';
  if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
    const xmlResponse = new XMLResponse(response.code, response.toCache, response.message, response.data);
    xmlResponse.send(res);
  } else {
    response.send(res);
  }
}

//Export authorisation for use in other files
module.exports = authenticateToken;
