// Import all required modules
const RecordException = require('./RecordException');

//Class to validate authentication records
class AuthRecordValidation {
  constructor(UserID, Username, Password, Forename, Surname, Age, Height, Weight) {
    this.setUserID(UserID);
    this.setUsername(Username);
    this.setPassword(Password);
    this.setForename(Forename);
    this.setSurname(Surname);
    this.setAge(Age);
    this.setHeight(Height);
    this.setWeight(Weight);
  }

  //Validate and set variables. If a variable is not valid an exception will be thrown
  setUserID(UserID) {
    if (UserID === null || !Number.isInteger(UserID) || UserID < 0) {
      throw new RecordException('Error, UserID must be a positive integer');
    }
    this.UserID = UserID;
  }

  setUsername(Username) {
    const usernameRegex = /^[a-zA-Z0-9_]{1,30}$/;
    if (!Username || !usernameRegex.test(Username)) {
      throw new RecordException('Error, Username must be 1–30 characters and contain only letters, numbers, or underscores');
    }
    this.Username = Username;
  }

  setPassword(Password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
    if (!Password || !passwordRegex.test(Password)) {
      throw new RecordException('Error, Password must be 8–30 characters long, contain no spaces and include at least one letter and one number');
    }
    this.Password = Password;
  }

  setForename(Forename) {
    if (!Forename || typeof Forename !== 'string' || Forename.trim() === '') {
      throw new RecordException('Error, Forename is required');
    }
    this.Forename = Forename.trim();
  }

  setSurname(Surname) {
    if (!Surname || typeof Surname !== 'string' || Surname.trim() === '') {
      throw new RecordException('Error, Surname is required');
    }
    this.Surname = Surname.trim();
  }

  setAge(Age) {
    if (Age === null || !Number.isInteger(Age) || Age < 0 || Age > 150) {
      throw new RecordException('Error, Age must be an integer');
    }
    this.Age = Age;
  }

  setHeight(Height) {
    if (Height === null || typeof Height !== 'number' || Height <= 0) {
      throw new RecordException('Error, Height must be a positive number');
    }
    this.Height = Height;
  }

  setWeight(Weight) {
    if (Weight === null || typeof Weight !== 'number' || Weight <= 0) {
      throw new RecordException('Error, Weight must be a positive number');
    }
    this.Weight = Weight;
  }

  //Create getters
  getUserID() {
    return this.UserID;
  }

  getUsername() {
    return this.Username;
  }

  getPassword() {
    return this.Password;
  }

  getForename() {
    return this.Forename;
  }

  getSurname() {
    return this.Surname;
  }

  getAge() {
    return this.Age;
  }

  getHeight() {
    return this.Height;
  }

  getWeight() {
    return this.Weight;
  }

  //Return object representation
  asObject() {
    return {
      UserID: this.getUserID(),
      Username: this.getUsername(),
      Forename: this.getForename(),
      Surname: this.getSurname(),
      Age: this.getAge(),
      Height: this.getHeight(),
      Weight: this.getWeight()
    };
  }
}

//Export validation for use in other files
module.exports = AuthRecordValidation;
