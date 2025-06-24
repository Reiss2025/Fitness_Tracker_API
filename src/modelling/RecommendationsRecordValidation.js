// Import all required modules
const RecordException = require('./RecordException');

//Class to validate recommendation records
class Recommendation {
  constructor(RecommendationID, RecommendationDescription, UserID) {
    this.setRecommendationID(RecommendationID);
    this.setRecommendationDescription(RecommendationDescription);
    this.setUserID(UserID);
  }

  //Validate and set variables. If a variable is not valid an exception will be thrown
  setRecommendationID(RecommendationID) {
    if (RecommendationID === null || !Number.isInteger(RecommendationID)) {
      throw new RecordException('Error, RecommendationID must be a number');
    }

    return this.RecommendationID = RecommendationID;
  }

  setRecommendationDescription(description) {
    if (!description || typeof description !== 'string' || description.trim().length === 0 || description.length > 200) {
      throw new RecordException('Error, Recommendation Description must be provided and no more than 200 characters');
    }

    return this.RecommendationDescription = description.trim();
  }

  setUserID(UserID) {
    if (UserID === null || !Number.isInteger(UserID)) {
      throw new RecordException('Error, UserID must be a number');
    }

    return this.UserID = UserID;
  }

//Create getters
  getRecommendationID() {
    return this.RecommendationID;
  }

  getRecommendationDescription() {
    return this.RecommendationDescription;
  }

  getUserID() {
    return this.UserID;
  }

  //Return object representation
  asObject() {
    return {
      RecommendationID: this.getRecommendationID(),
      RecommendationDescription: this.getRecommendationDescription(),
    };
  }
}

//Export validation for use in other files
module.exports = Recommendation;
