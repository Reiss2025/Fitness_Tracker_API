// Import all required modules
const database = require('../config/db');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');

//Function to check if the user is an admin
async function AuthoriseAdmin(req, res, next) {
  const userId = req.user?.id;

  //Check if the userID exists
  if (!userId) {
    const response = new Response(400, false, "User ID is missing from request");
    return sendFormattedResponse(req, res, response);
  }

  try {
    //Query database to get the users admin status
    const query = 'SELECT Admin FROM Users WHERE UserID = ?';
    const [results] = await database.execute(query, [userId]);

    //If a user is not found return 404
    if (results.length === 0) {
      const response = new Response(404, false, "User not found");
      return sendFormattedResponse(req, res, response);
    }

    //If the user is not an admin return 403
    if (results[0].Admin !== 1) {
      const response = new Response(403, false, "User is not authorised as an admin");
      return sendFormattedResponse(req, res, response);
    }

    //If the user is an admin allow access to the route
    next();
  } 
  //Handle server errors
  catch (error) {
    const response = new Response(500, false, "Error checking user admin status");
    return sendFormattedResponse(req, res, response);
  }
}

//Send the response in the users specified format
function sendFormattedResponse(req, res, response) {
  const acceptHeader = req.headers['accept'] || '';

  if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
    const xmlResponse = new XMLResponse(response.code, response.toCache, response.message, response.data);
    xmlResponse.send(res);
  } else {
    //Sends response in JSON by default
    response.send(res);
  }
}

//Export admin authorisation for use in other files
module.exports = AuthoriseAdmin;
