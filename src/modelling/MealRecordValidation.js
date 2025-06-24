// Import all required modules
const RecordException = require('./RecordException');

//Class to validate meal records
class Meal {
  constructor(MealID, Date, Time, MealDescription, Calories, Protein, Carbs, Fats, UserID) {
    this.setMealID(MealID);
    this.setDate(Date);
    this.setTime(Time);
    this.setMealDescription(MealDescription);
    this.setCalories(Calories);
    this.setProtein(Protein);
    this.setCarbs(Carbs);
    this.setFats(Fats);
    this.setUserID(UserID);
  }

  //Validate and set variables. If a variable is not valid an exception will be thrown
  setMealID(MealID) {
    if (MealID === null || !Number.isInteger(MealID)) {
      throw new RecordException('Error, MealID must be a number');
    }

    return this.MealID = MealID;
  }

  setDate(date) {
    const parsedDate = new Date(date);

    if (!date || isNaN(parsedDate.getTime())) {
      throw new RecordException('Error, date is invalid or not provided');
    }

    const now = new Date();
    if (parsedDate > now) {
      throw new RecordException('Error, date can not be in the future');
    }

    const formattedDate = parsedDate.toISOString().split('T')[0];

    return this.Date = formattedDate;
  }

  setTime(time) {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)/;
    const match = time.trim().match(timePattern);

    if (!match) {
      throw new RecordException('Error, time must be in HH:mm format');
    }

    const formattedTime = `${match[1]}:${match[2]}`;

    return this.Time = formattedTime;
  }

  setMealDescription(description) {
    if (!description || typeof description !== 'string' || description.trim().length === 0 || description.length > 200) {
      throw new RecordException('Error, Meal Description must be provided and no more than 200 characters');
    }

    return this.MealDescription = description.trim();
  }

  setCalories(Calories) {
    if (typeof Calories !== 'number' || Calories <= 0 || Calories > 5000) {
      throw new RecordException('Error, Calories must be a number between 1 and 5000');
    }

    return this.Calories = Calories;
  }

  setProtein(Protein) {
    if (typeof Protein !== 'number' || Protein < 0 || Protein > 500) {
      throw new RecordException('Error, Protein must be a number between 0 and 500');
    }

    return this.Protein = Protein;
  }

  setCarbs(Carbs) {
    if (typeof Carbs !== 'number' || Carbs < 0 || Carbs > 500) {
      throw new RecordException('Error, Carbs must be a number between 0 and 500');
    }

    return this.Carbs = Carbs;
  }

  setFats(Fats) {
    if (typeof Fats !== 'number' || Fats < 0 || Fats > 200) {
      throw new RecordException('Error, Fats must be a number between 0 and 200');
    }

    return this.Fats = Fats;
  }

  setUserID(UserID) {
    if (UserID === null || !Number.isInteger(UserID)) {
      throw new RecordException('Error, UserID must be a number');
    }

    return this.UserID = UserID;
  }

  //Create getters
  getMealID() {
    return this.MealID;
  }

  getDate() {
    return this.Date;
  }

  getTime() {
    return this.Time;
  }

  getMealDescription() {
    return this.MealDescription;
  }

  getCalories() {
    return this.Calories;
  }

  getProtein() {
    return this.Protein;
  }

  getCarbs() {
    return this.Carbs;
  }

  getFats() {
    return this.Fats;
  }

  getUserID() {
    return this.UserID;
  }

  //Return object representation
  asObject() {
    return {
      MealID: this.getMealID(),
      Date: this.getDate(),
      Time: this.getTime(),
      MealDescription: this.getMealDescription(),
      Calories: this.getCalories(),
      Protein: this.getProtein(),
      Carbs: this.getCarbs(),
      Fats: this.getFats()
    };
  }
}

//Export validation for use in other files
module.exports = Meal;
