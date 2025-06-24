// Import all required modules
const Record = require('../modelling/UserRecordValidation');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const records = require('../route/RecordRoutes');
const bcrypt = require('bcrypt');

// Controller class that handles admin functions
class AdminRecordController{
  constructor(db){
    //Create database connection
    this.db = db;
  }

  //Read all users
  async getUsers(req, res){
    try{
      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `Users`');

      //Checks there is data in the database
      if(!rows.length > 0){
        const response = new Response(404, false, 'The database connection is valid but there is no data');
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate user records
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
      })

      //Send successful response
      const response = new Response(200, true, null, records);
      this.sendFormattedResponse(req, res, response);
    }
    //Handle server errors
    catch(error){
      const response = new Response(500, false, error.message, records);
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Read one user by ID
  async getUserById(req, res){
    try{
      const id = parseInt(req.params.id);
      if(!Number.isInteger(id)){
        const response = new Response(400, false, "ID must be a number");
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [rows] = await this.db.query('SELECT * FROM Users WHERE UserID = ?', [id]);

      if(rows.length === 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate user records
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
      })

      //Send successful response
      const response = new Response(200, true, null, records);
      this.sendFormattedResponse(req, res, response);
    }
    //Handle server errors
    catch(error){
      const response = new Response(500, false, error.message);
      this.sendFormattedResponse(req, res, response);
    }
  }

 //Update the users password
 async postResetPassword(req, res) {
  try {
    if (!req.body || !req.body.NewPassword) {
      const response = new Response(400, false, "New password is required");
      return this.sendFormattedResponse(req, res, response);
    }

    const { NewPassword } = req.body;

    //Ensure id is a number
    const userId = parseInt(req.params.id);
    if (!Number.isInteger(userId)) {
      const response = new Response(400, false, "ID must be a number");
      return this.sendFormattedResponse(req, res, response);
    }

    //Query the database
    const [users] = await this.db.query('SELECT * FROM Users WHERE UserID = ?', [userId]);

    if (users.length === 0) {
      const response = new Response(404, false, "User not found");
      return this.sendFormattedResponse(req, res, response);
    }

    const user = users[0];

    //Validate the new password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
    if (!NewPassword || !passwordRegex.test(NewPassword)) {
      const response = new Response(400, false, "Password must be 8–30 characters long, contain no spaces and include at least one letter and one number");
      return this.sendFormattedResponse(req, res, response);
    }

    //Hash the password
    const hashedNewPassword = await bcrypt.hash(NewPassword, 10);

    //Query the database
    await this.db.query('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedNewPassword, userId]);

    //Send successful response
    const response = new Response(200, true, "Password updated successfully");
    this.sendFormattedResponse(req, res, response);
  } catch (error) {
    console.error("Error resetting password:", error.message, error.stack);

    //Handle server errors
    const response = new Response(500, false, "Error resetting password");
    this.sendFormattedResponse(req, res, response);
  }
}

 //Delete an account by userID
 async deleteUser(req, res) {
  try{
      const id = parseInt(req.params.id);
      if(!Number.isInteger(id)){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [row] = await this.db.query("SELECT UserID FROM Users WHERE UserID = ?", [id]);

      if(!row.length > 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

    //Query the database to remove all data
    await this.db.query('DELETE FROM Workouts WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM Meals WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM FitnessGoals WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM Recommendations WHERE UserID = ?', [id]);
    await this.db.query('DELETE FROM Users WHERE UserID = ?', [id]);

    //Send successful response
    const response = new Response(200, true, "Successfully deleted user");
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

//Export admin for use in other files
module.exports = AdminRecordController