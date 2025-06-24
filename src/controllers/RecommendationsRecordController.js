// Import all required modules
const Record = require('../modelling/RecommendationsRecordValidation');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const records = require('../route/RecordRoutes');

// Controller class that handles recommendations functions
class RecommendationsRecordController {
  constructor(db) {
    //Create database connection
    this.db = db;
  }

  //Read all recommendations
  async getRecommendations(req, res) {
    try {
      const user = req.user.id;
      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `Recommendations` WHERE UserID = ?', [user]);

      //Checks there is data in the database
      if (rows.length === 0) {
        const response = new Response(404, false, 'The database connection is valid but there is no data');
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate recommendations records
      const recommendations = rows.map((row) => {
        const record = new Record(
          row.RecommendationID,
          row.RecommendationDescription,
          row.UserID
        );

        return record.asObject();
      });

      //Send successful response
      const response = new Response(200, true, null, recommendations);
      this.sendFormattedResponse(req, res, response);
    } 
    //Handle server errors
    catch (error) {
      const response = new Response(500, false, error.message, []);
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Read a specific recommendation
  async getRecommendationById(req, res) {
    try {
      //retrieves the meal id number provided and ensures that it is valid
      const user = req.user.id;
      const id = parseInt(req.params.id);
      if (!Number.isInteger(id)) {
        const response = new Response(400, false, "ID must be a number");
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `Recommendations` WHERE RecommendationID = ? AND UserID = ?', [id, user]);

      //Ensures that the requested data exists
      if (rows.length === 0) {
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate goal records
      const recommendations = rows.map((row) => {
        const record = new Record(
          row.RecommendationID,
          row.RecommendationDescription,
          row.UserID
        );

        return record.asObject();
      });

      //Send successful response
      const response = new Response(200, true, null, recommendations);
      this.sendFormattedResponse(req, res, response);
    } 
    //Handle server errors
    catch (error) {
      const response = new Response(500, false, error.message);
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Delete a recommendation
  async deleteRecommendation(req, res) {
    try {
      //gets the provided number and checks it is an integer
      const user = req.user.id;
      const id = parseInt(req.params.id);
      if (!Number.isInteger(id)) {
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database and ensure the entry exists
      const [row] = await this.db.query("SELECT * FROM `Recommendations` WHERE RecommendationID = ? AND UserID = ?", [id, user]);

      if (row.length === 0) {
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Delete the data from the database
      await this.db.query('DELETE FROM `Recommendations` WHERE RecommendationID = ? AND UserID = ?', [id, user]);

      //Send successful response
      const response = new Response(200, false, `Successfully deleted recommendation ${id}`);
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

//Export recommendations for use in other files
module.exports = RecommendationsRecordController;
