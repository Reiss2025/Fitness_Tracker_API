// Import all required modules
const Record = require('../modelling/WorkoutRecordValidation');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const records = require('../route/RecordRoutes');

// Controller class that handles workout functions
class WorkoutRecordController{
  constructor(db){
    //Create database connection
    this.db = db;
  }

  //Read all workouts
  async getWorkouts(req, res){
    try{
      const user = req.user.id;
      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `Workouts` WHERE UserID = ?', [user]);

      //Checks there is data in the database
      if(!rows.length > 0){
        const response = new Response(404, false, 'The database connection is valid but there is no data');
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate workout records
      const records = rows.map((row) => {
        const record = new Record(
          row.WorkoutID,
          row.Date,
          row.Time,
          row.WorkoutDescription,
          row.Duration,
          row.CaloriesBurnt,
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

  //Read a specific workout
  async getWorkoutById(req, res){
    try{
      //retrieves the workout id number provided and ensures that it is valid
      const user = req.user.id;
      const id = parseInt(req.params.id);
      if(!Number.isInteger(id)){
        const response = new Response(400, false, "ID must be a number");
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `Workouts` WHERE WorkoutID = ? AND UserID = ?', [id, user]);

      //Ensures that the requested data exists
      if(rows.length === 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate goal records
      const records = rows.map((row) => {
        const record = new Record(
          row.WorkoutID,
          row.Date,
          row.Time,
          row.WorkoutDescription,
          row.Duration,
          row.CaloriesBurnt,
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

  //Create a workout
  async postWorkout(req, res){
    try{
      const body = await req.body;
      const user = req.user.id;

      //Validate workout record
      const record = new Record(
        0,
        body.Date,
        body.Time,
        body.WorkoutDescription,
        body.Duration,
        body.CaloriesBurnt,
        user
      );

      //Query the database
      const [posted] = await this.db.query("INSERT INTO `Workouts` (`Date`, `Time`, `WorkoutDescription`, `Duration`, `CaloriesBurnt`, `UserID`) VALUES (?,?,?,?,?,?)", [record.getDate(), record.getTime(), record.getWorkoutDescription(), record.getDuration(), record.getCaloriesBurnt(), user]);

      const recommendation = this.generateRecommendation(record);

      //Query the database
      if (recommendation) {
        await this.db.query("INSERT INTO Recommendations (RecommendationDescription, UserID) VALUES (?, ?)",[recommendation, user]);
      }

      record.setWorkoutID(posted.insertId);

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

  //Update workout
  async patchWorkout(req, res){
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
      const [rows] = await this.db.query('SELECT * FROM Workouts WHERE WorkoutID = ? AND UserID = ?', [params.id, user]);

      if(!rows.length > 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Create a new record using updated fields or fall back to existing values from the database
      const record = new Record(
        parseInt(params.id),
        body.Date ?? rows[0].Date,
        body.Time ?? rows[0].Time,
        body.WorkoutDescription ?? rows[0].WorkoutDescription,
        body.Duration ?? rows[0].Duration,
        body.CaloriesBurnt ?? rows[0].CaloriesBurnt,
        user
      );

      //Update the database
      await this.db.query("UPDATE Workouts SET Date = ?, Time = ?, WorkoutDescription = ?, Duration = ?, CaloriesBurnt = ? WHERE WorkoutID = ? AND UserID = ?", [record.getDate(), record.getTime(), record.getWorkoutDescription(), record.getDuration(), record.getCaloriesBurnt(), parseInt(params.id), user]);

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

  //Delete workout
  async deleteWorkout(req, res){
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
      const [row] = await this.db.query("SELECT * FROM Workouts WHERE WorkoutID = ? AND UserID", [id, user]);

      if(!row.length > 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Delete the data from the database
      await this.db.query('DELETE FROM Workouts WHERE WorkoutID = ? AND UserID = ?', [id, user]);
      
      //Send successful response
      const response = new Response(200, false, `Successfully deleted workout ${id}`);
      this.sendFormattedResponse(req, res, response);
    }
    //Handle server errors
    catch(error){
      const response = new Response(500, false, error.message);
      this.sendFormattedResponse(req, res, response);
    }
  }

//Generate recommendations
generateRecommendation(workout) {
    let recommendation = "";

    //Checks if the workout was too long or short
    if (workout.getDuration() < 30) {
        recommendation = `The workout you described as '${workout.getWorkoutDescription()}' lasted for ${workout.getDuration()} minutes. Consider extending your workout to at least 30 minutes for the best results`;
    } else if (workout.getDuration() > 60) {
        recommendation = `The workout you described as '${workout.getWorkoutDescription()}' lasted for ${workout.getDuration()} minutes. You might want to consider shorter, more intense workouts for better results`;
    }

    //Checks how many calories are burnt
    if (workout.getCaloriesBurnt() > 500) {
        recommendation = `The workout you described as '${workout.getWorkoutDescription()}' burned ${workout.getCaloriesBurnt()} calories. Remember to hydrate after intense workout sessions`;
    } else if (workout.getCaloriesBurnt() < 200) {
        recommendation = `The workout you described as '${workout.getWorkoutDescription()}' only burned ${workout.getCaloriesBurnt()} calories. Consider increasing the intensity to get better results`;
    }

    //Checks an adequate amount of calories are burnt
    const durationToCaloriesRatio = workout.getCaloriesBurnt() / workout.getDuration();

    if (durationToCaloriesRatio < 10) {
        recommendation = `The workout you described as '${workout.getWorkoutDescription()}' burned ${workout.getCaloriesBurnt()} calories over ${workout.getDuration()} minutes. You need to increase your workout intensity to see results`;
    } 

    //Return the final recommendation
    return recommendation;
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

//Export workouts for use in other files
module.exports = WorkoutRecordController