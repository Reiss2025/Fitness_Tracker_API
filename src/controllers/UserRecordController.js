// Import all required modules
const Record = require('../modelling/UserRecordValidation');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const tokenBlacklist = require('../authentication/TokenBlacklist');

// Controller class that handles users functions
class UserRecordController{
  constructor(db){
    //Create database connection
    this.db = db;
  }

  //Read all users
  async getUsers(req, res){
    try {
      const user = req.user.id;
      //Query the database
      const [rows] = await this.db.query('SELECT UserID, Forename, Surname, Age, Height, Weight FROM `Users` WHERE UserID = ?',[user]);

      //Checks there is data in the database
      if (!rows.length > 0) {
        const response = new Response(404, false, 'The database connection is valid but there is no data');
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate users records
      const records = rows.map((row) => {
        const record = new Record(
          row.UserID,
          row.Forename,
          row.Surname,
          row.Age,
          row.Height,
          row.Weight
        );

        return record.asObject();
      });

      //Send successful response
      const response = new Response(200, true, null, records);
      this.sendFormattedResponse(req, res, response);
    } 
    //Handle server errors
    catch (error) {
      const response = new Response(500, false, error.message);
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Update a user
  async patchUsers(req, res){
    try{
      const body = await req.body;
      const user = req.user.id;

      //Checks id is received and valid
      if(!user){
        const response = new Response(400, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [rows] = await this.db.query('SELECT UserID, Forename, Surname, Age, Height, Weight FROM Users WHERE UserID = ?', [user]);

      if(!rows.length > 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Create a new record using updated fields or fall back to existing values from the database
      const record = new Record(
        parseInt(user),
        body.Forename ?? rows[0].Forename,
        body.Surname ?? rows[0].Surname,
        body.Age ?? rows[0].Age,
        body.Height ?? rows[0].Height,
        body.Weight ?? rows[0].Weight
      );

      //Update the database
      await this.db.query("UPDATE Users SET Forename = ?, Surname = ?, Age = ?, Height = ?, Weight = ? WHERE UserID = ?", [record.getForename(), record.getSurname(), record.getAge(), record.getHeight(), record.getWeight(), parseInt(user)]);

      //Send successful response
      const response = new Response(200, false, null, record);
      this.sendFormattedResponse(req, res, response);
    }
    //Handle server errors
    catch(error){
      const response = new Response(500, false, error.message);
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Delete user
 async deleteUsers(req, res) {
  try {
    //gets the provided number and checks it is an integer
    const id = parseInt(req.user.id);
    if (!Number.isInteger(id)) {
      const response = new Response(404, false);
      this.sendFormattedResponse(req, res, response);
      return;
    }

    //Query the database and ensure the entry exists
    const [row] = await this.db.query("SELECT UserID FROM Users WHERE UserID = ?", [id]);

    if (!(row.length > 0)) {
      const response = new Response(404, false);
      this.sendFormattedResponse(req, res, response);
      return;
    }

    //Delete the data from the database
    await this.db.query('DELETE FROM Workouts WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM Meals WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM FitnessGoals WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM Recommendations WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM Users WHERE UserID = ?', [id]);

    //Logs the user out by blacklisting the token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      tokenBlacklist.add(token);
    }

    //Send successful response
    const response = new Response(200, true, "Successfully deleted user and logged out");
    this.sendFormattedResponse(req, res, response);
  } 
  //Handle server errors
  catch (error) {
    const response = new Response(500, false, error.message);
    this.sendFormattedResponse(req, res, response);
  }
}

//Send the response in the users specified format
sendFormattedResponse(req, res, response) {
  const acceptHeader = req.headers['accept'] || '';

  if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
    const xmlResponse = new XMLResponse(response.code, response.toCache, response.message, response.data);
    xmlResponse.send(res);
  } else {
    // Defaults to JSON
    response.send(res);
  }
}
}

//Export users for use in other files
module.exports = UserRecordController