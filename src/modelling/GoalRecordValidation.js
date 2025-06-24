// Import all required modules
const RecordException = require('./RecordException');

//Class to validate goal records
class Goal {
  constructor(GoalID, GoalDescription, StartDate, EndDate, Status, UserID) {
    this.setGoalID(GoalID);
    this.setGoalDescription(GoalDescription);
    this.setStartDate(StartDate);
    this.setEndDate(EndDate);
    this.setStatus(Status);
    this.setUserID(UserID);
  }

  //Validate and set variables. If a variable is not valid an exception will be thrown
  setGoalID(GoalID) {
    if (GoalID === null || !Number.isInteger(GoalID)) {
      throw new RecordException('Error, GoalID must be a positive number');
    }

    return this.GoalID = GoalID;
  }

  setGoalDescription(description) {
    if (!description || typeof description !== 'string' || description.trim().length === 0 || description.length > 200) {
      throw new RecordException('Error, Goal Description must be provided and no more than 200 characters');
    }

    return this.GoalDescription = description.trim();
  }

  setStartDate(date) {
    const parsedDate = new Date(date);

    if (!date || isNaN(parsedDate.getTime())) {
      throw new RecordException('Error, Start Date is invalid or not provided');
    }

    const now = new Date();

    const formattedDate = parsedDate.toISOString().split('T')[0];

    return this.StartDate = formattedDate;
  }

  setEndDate(date) {
    const parsedDate = new Date(date);

    if (!date || isNaN(parsedDate.getTime())) {
      throw new RecordException('Error, End Date is invalid or not provided');
    }

    const startDate = new Date(this.StartDate);
    if (parsedDate < startDate) {
      throw new RecordException('Error, End Date cannot be before Start Date');
    }

    const formattedDate = parsedDate.toISOString().split('T')[0];

    return this.EndDate = formattedDate;
  }

  setStatus(status) {
    const validStatuses = ['pending', 'in progress', 'completed', 'cancelled'];

    if (!status || typeof status !== 'string' || !validStatuses.includes(status.toLowerCase())) {
      throw new RecordException('Error, Status must be one ofthe following: pending, in progress, completed, cancelled');
    }

    return this.Status = status.toLowerCase();
  }

  setUserID(UserID) {
    if (UserID === null || !Number.isInteger(UserID)) {
      throw new RecordException('Error, UserID must be a number');
    }

    return this.UserID = UserID;
  }

  //Create getters
  getGoalID() {
    return this.GoalID;
  }

  getGoalDescription() {
    return this.GoalDescription;
  }

  getStartDate() {
    return this.StartDate;
  }

  getEndDate() {
    return this.EndDate;
  }

  getStatus() {
    return this.Status;
  }

  getUserID() {
    return this.UserID;
  }

  //Return object representation
  asObject() {
    return {
      GoalID: this.getGoalID(),
      GoalDescription: this.getGoalDescription(),
      StartDate: this.getStartDate(),
      EndDate: this.getEndDate(),
      Status: this.getStatus()
    };
  }
}

//Export validation for use in other files
module.exports = Goal;