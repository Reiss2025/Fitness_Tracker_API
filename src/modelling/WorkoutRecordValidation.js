// Import all required modules
const RecordException = require('./RecordException');

//Class to validate workout records
class Record {
  constructor(WorkoutID, Date, Time, WorkoutDescription, Duration, CaloriesBurnt, UserID){
    this.setWorkoutID(WorkoutID);
    this.setDate(Date);
    this.setTime(Time);
    this.setWorkoutDescription(WorkoutDescription);
    this.setDuration(Duration);
    this.setCaloriesBurnt(CaloriesBurnt);
    this.setUserID(UserID);
  }

//Validate and set variables. If a variable is not valid an exception will be thrown
  setWorkoutID(WorkoutID) {
    if(WorkoutID === null || !Number.isInteger(WorkoutID)){
      throw new RecordException('Error, ID must be a number');
    }

    return this.WorkoutID = WorkoutID;
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

  setWorkoutDescription(description) {
    if (!description || typeof description !== 'string' || description.trim().length === 0 || description.length > 200) {
      throw new RecordException('Error, Workout Description must be provided and no more than 200 characters');
    }

    return this.WorkoutDescription = description.trim();
  }

  setDuration(Duration) {
    if (typeof Duration !== 'number' || Duration <= 0 || Duration > 300){
       throw new RecordException('Error, Duration must be a number between 1 and 300');
    }

    return this.Duration = Duration;
  }

  setCaloriesBurnt(CaloriesBurnt) {
    if (typeof CaloriesBurnt !== 'number' || CaloriesBurnt <= 0 || CaloriesBurnt > 5000){
      throw new RecordException('Error, CaloriesBurnt must be a number between 1 and 5000')
    }

    return this.CaloriesBurnt = CaloriesBurnt;
  }

  setUserID(UserID) {
    if(UserID === null || !Number.isInteger(UserID)){
      throw new RecordException('Error, ID must be a number');
    }

    return this.UserID = UserID;
  }

  //Create getters
  getWorkoutID(){
    return this.WorkoutID;
  }

  getDate(){
    return this.Date;
  }

  getTime(){
    return this.Time;
  }

  getWorkoutDescription(){
    return this.WorkoutDescription;
  }

  getDuration(){
    return this.Duration;
  }

  getCaloriesBurnt(){
    return this.CaloriesBurnt;
  }

  getUserID(){
    return this.UserID;
  }

  //Return object representation
  asObject(){
    return {
      WorkoutID: this.getWorkoutID(),
      Date: this.getDate(),
      Time: this.getTime(),
      WorkoutDescription: this.getWorkoutDescription(),
      Duration: this.getDuration(),
      CaloriesBurnt: this.getCaloriesBurnt()
    }
  }
}

//Export validation for use in other files
module.exports = Record;