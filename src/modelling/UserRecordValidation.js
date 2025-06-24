// Import all required modules
const RecordException = require('./RecordException');

//Class to validate user records
class Record {
  constructor(UserID, Forename, Surname, Age, Height, Weight){
    this.setUserID(UserID);
    this.setForename(Forename);
    this.setSurname(Surname);
    this.setAge(Age);
    this.setHeight(Height);
    this.setWeight(Weight);
  }

  //Validate and set variables. If a variable is not valid an exception will be thrown
  setUserID(UserID) {
    if(UserID === null || !Number.isInteger(UserID)){
      throw new RecordException('Error, ID must be a number');
    }
    return this.UserID = UserID;
  }

  setForename(Forename){
    if(!Forename || Forename.length === 0 || Forename.length > 30 || Forename.includes(' ')){
      throw new RecordException('Error, Forename must not contain spaces and be between 1 and 30 characters');
    }
    return this.Forename = Forename;
  }

  setSurname(Surname){
    if(!Surname || Surname.length === 0 || Surname.length > 30 || Surname.includes(' ')){
      throw new RecordException('Error, Surname must not contain spaces and be between 1 and 30 characters');
    }
    return this.Surname = Surname;
  }

  setAge(Age) {
    if(Age === null || !Number.isInteger(Age)){
      throw new RecordException('Error, Age must be a number');
    }
    return this.Age = Age;
  }

  setHeight(Height) {
    if(Height === null || !Number.isInteger(Height)){
      throw new RecordException('Error, Height must be a number');
    }
    return this.Height = Height;
  }

  setWeight(Weight) {
    if(Weight === null || !Number.isInteger(Weight)){
      throw new RecordException('Error, Weight must be a number');
    }
    return this.Weight = Weight;
  }

  //Create getters
  getUserID(){
    return this.UserID;
  }

  getForename(){
    return this.Forename;
  }

  getSurname(){
    return this.Surname;
  }

  getAge(){
    return this.Age;
  }

  getHeight(){
    return this.Height;
  }

  getWeight(){
    return this.Weight;
  }

  //Return object representation
  asObject(){
    return {
      UserID: this.getUserID(),
      Forename: this.getForename(),
      Surname: this.getSurname(),
      Age: this.getAge(),
      Height: this.getHeight(),
      Weight: this.getWeight()
    }
  }
}

//Export validation for use in other files
module.exports = Record;
