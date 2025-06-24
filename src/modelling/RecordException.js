//Class to handle exceptions
class RecordException extends Error {
  constructor(message) {
    super(message);
    this.name = 'RecordException';
  }
}

//Export record exception for use in other files
module.exports = RecordException;