// Import all required modules
const Record = require('../modelling/MealRecordValidation');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const records = require('../route/RecordRoutes');

// Controller class that handles meals functions
class MealsRecordController{
  constructor(db){
    //Create database connection
    this.db = db;
  }

  //Read all meals
  async getMeals(req, res){
    try{
      const user = req.user.id;
      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `Meals` WHERE UserID = ?', [user]);

      //Checks there is data in the database
      if(!rows.length > 0){
        const response = new Response(404, false, 'The database connection is valid but there is no data');
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate meal records
      const records = rows.map((row) => {
        const record = new Record(
          row.MealID,
          row.Date,
          row.Time,
          row.MealDescription,
          row.Calories,
          row.Protein,
          row.Carbs,
          row.Fats,
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

  //Read a specific meal
  async getMealById(req, res){
    try{
      //retrieves the meal id number provided and ensures that it is valid
      const user = req.user.id;
      const id = parseInt(req.params.id);
      if(!Number.isInteger(id)){
        const response = new Response(400, false, "ID must be a number");
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Query the database
      const [rows] = await this.db.query('SELECT * FROM `Meals` WHERE MealID = ? AND UserID = ?', [id, user]);

      //Ensures that the requested data exists
      if(rows.length === 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Validate meal records
      const records = rows.map((row) => {
        const record = new Record(
          row.MealID,
          row.Date,
          row.Time,
          row.MealDescription,
          row.Calories,
          row.Protein,
          row.Carbs,
          row.Fats,
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

  //Create a meal
  async postMeal(req, res){
    try{
      const body = await req.body;
      const user = req.user.id;

      //Validate meal record
      const record = new Record(
        0,
        body.Date,
        body.Time,
        body.MealDescription,
        body.Calories,
        body.Protein,
        body.Carbs,
        body.Fats,
        user
      );

      //Query the database
      const [posted] = await this.db.query("INSERT INTO `Meals` (`Date`, `Time`, `MealDescription`, `Calories`, `Protein`, `Carbs`, `Fats`, `UserID`) VALUES (?,?,?,?,?,?,?,?)",[record.getDate(), record.getTime(), record.getMealDescription(), record.getCalories(), record.getProtein(), record.getCarbs(), record.getFats(), user]);

      const recommendation = this.generateRecommendation(record);

      //Query the database
      if (recommendation) {
        await this.db.query("INSERT INTO Recommendations (RecommendationDescription, UserID) VALUES (?, ?)",[recommendation, user]);
      }

      record.setMealID(posted.insertId);

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

  //Update meal
  async patchMeal(req, res){
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
      const [rows] = await this.db.query('SELECT * FROM Meals WHERE MealID = ? AND UserID = ?', [params.id, user]);

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
        body.MealDescription ?? rows[0].MealDescription,
        body.Calories ?? rows[0].Calories,
        body.Protein ?? rows[0].Protein,
        body.Carbs ?? rows[0].Carbs,
        body.Fats ?? rows[0].Fats,
        user
      );

      //Update the database
      await this.db.query("UPDATE Meals SET Date = ?, Time = ?, MealDescription = ?, Calories = ?, Protein = ?, Carbs = ?, Fats = ? WHERE MealID = ? AND UserID = ?",[record.getDate(), record.getTime(), record.getMealDescription(), record.getCalories(), record.getProtein(), record.getCarbs(), record.getFats(), parseInt(params.id), user]);

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

  //Delete meal
  async deleteMeal(req, res){
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
      const [row] = await this.db.query("SELECT * FROM Meals WHERE MealID = ? AND UserID = ?", [id, user]);

      if(!row.length > 0){
        const response = new Response(404, false);
        this.sendFormattedResponse(req, res, response);
        return;
      }

      //Delete the data from the database
      await this.db.query('DELETE FROM Meals WHERE MealID = ? AND UserID = ?', [id, user]);
      
      //Send successful response
      const response = new Response(200, false, `Successfully deleted meal ${id}`);
      this.sendFormattedResponse(req, res, response);
    }
    //Handle server errors
    catch(error){
      const response = new Response(500, false, error.message);
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Generate recommendations
  generateRecommendation(meal) {
    let recommendation = "";

    //check if a meal is high or low in calories
    if (meal.getCalories() > 800) {
        recommendation = `The meal you described as '${meal.getMealDescription()}' is high in calories. You may want to go for a walk or exercise to balance out the calorie intake.`;
    } else if (meal.getCalories() < 300) {
        recommendation = `The meal you described as '${meal.getMealDescription()}' is low in calories. Consider adding more protein to increase your calorie intake.`;
    }

    // Check for micronutrient imbalance
    if (!recommendation) {
        const proteinToCarbsRatio = meal.getProtein() / meal.getCarbs();
        const proteinToFatsRatio = meal.getProtein() / meal.getFats();

        if (meal.getProtein() < 15) {
            recommendation = `The meal you described as '${meal.getMealDescription()}' is low in protein. Try adding more meat or fish to the meal.`;
        } else if (meal.getCarbs() > meal.getProtein() * 2) {
            recommendation = `The meal you described as '${meal.getMealDescription()}' contains too many carbs. Try reducing the carbs and adding more protein-rich foods.`;
        } else if (meal.getFats() > meal.getProtein() * 2) {
            recommendation = `The meal you described as '${meal.getMealDescription()}' contains high amounts of fat. Try reducing the fats and adding more protein-rich foods.`;
        }
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

//Export meals for use in other files
module.exports = MealsRecordController