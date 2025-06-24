// Import all required modules
const Record = require('../modelling/GoalRecordValidation');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const records = require('../route/RecordRoutes');

// Controller class that handles goals functions
class GoalsRecordController{
  constructor(db){
    //Create database connection
    this.db = db;
  }

  //Read all goals
  async getGoals(req, res){
    try{
      const user = req.user.id;
      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `FitnessGoals` WHERE UserID = ?', [user]);

      //checks there is data in the database
      if(!rows.length > 0){
        const response = new Response(404, false, 'The database connection is valid but there is no data');
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate goal records
      const records = rows.map((row) => {
        const record = new Record(
          row.GoalID,
          row.GoalDescription,
          row.StartDate,
          row.EndDate,
          row.Status,
          row.UserID
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

  //Read a specific goal
  async getGoalById(req, res){
    try{
      //retrieves the goal id number provided and ensures that it is valid
      const user = req.user.id;
      const id = parseInt(req.params.id);
      if(!Number.isInteger(id)){
        const response = new Response(400, false, "ID must be a number");
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `FitnessGoals` WHERE GoalID = ? AND UserID = ?', [id, user]);

      //Ensures that the requested data exists
      if(rows.length === 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate goal records
      const records = rows.map((row) => {
        const record = new Record(
          row.GoalID,
          row.GoalDescription,
          row.StartDate,
          row.EndDate,
          row.Status,
          row.UserID
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

  //Create a goal
  async postGoal(req, res){
    try{
      const body = await req.body;
      const user = req.user.id;

      //Validate goal records
      const record = new Record(
        0,
        body.GoalDescription,
        body.StartDate,
        body.EndDate,
        body.Status,
        user
      );

      //Query the database
      const [posted] = await this.db.query("INSERT INTO `FitnessGoals` (`GoalDescription`, `StartDate`, `EndDate`, `Status`, `UserID`) VALUES (?,?,?,?,?)",[record.getGoalDescription(), record.getStartDate(), record.getEndDate(), record.getStatus(), user]);

      record.setGoalID(posted.insertId);

      //Send successful response
      const response = new Response(201, false, null, record.asObject());
      this.sendFormattedResponse(req, res, response);
    }
    //Handle server errors
    catch(error){
      const response = new Response(500, false, error.message);
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Update Goal
  async patchGoal(req, res){
    try{
      const body = await req.body;
      const params = await req.params;
      const user = req.user.id;

      //Checks id is received and valid
      if(!params.id){
        const response = new Response(400, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [rows] = await this.db.query('SELECT * FROM FitnessGoals WHERE GoalID = ? AND UserID = ?', [params.id, user]);

      if(!rows.length > 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Create a new record using updated fields or fall back to existing values from the database
      const record = new Record(
        parseInt(params.id),
        body.GoalDescription ?? rows[0].GoalDescription,
        body.StartDate ?? rows[0].StartDate,
        body.EndDate ?? rows[0].EndDate,
        body.Status ?? rows[0].Status,
        user
      );

      //Update the database
      await this.db.query("UPDATE FitnessGoals SET GoalDescription = ?, StartDate = ?, EndDate = ?, Status = ? WHERE GoalID = ? AND UserID = ?",[record.getGoalDescription(), record.getStartDate(), record.getEndDate(), record.getStatus(), parseInt(params.id), user]);

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

  //Delete goal
  async deleteGoal(req, res){
    try{
      //gets the provided number and checks it is an integer
      const user = req.user.id;
      const id = parseInt(req.params.id);
      if(!Number.isInteger(id)){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database and ensure the entry exists
      const [row] = await this.db.query("SELECT * FROM FitnessGoals WHERE GoalID = ? AND UserID = ?", [id, user]);

      if(!row.length > 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Delete the data from the database
      await this.db.query('DELETE FROM FitnessGoals WHERE GoalID = ? AND UserID = ?', [id, user]);
      
      //Send successful response
      const response = new Response(200, false, `Successfully deleted goal ${id}`);
      this.sendFormattedResponse(req, res, response);
    }
    //Handle server errors
    catch(error){
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

//Export goals for use in other files
module.exports = GoalsRecordController;