//Response class to standardize responses in JSON
class Response {
  constructor(code, toCache = false, msg = null, data = null){
    this.code = code;
    this.toCache = toCache;
    this.message = msg;
    this.data = data;
    this.responseBody = {};
  
    //If a message is not provided a default message is set
    if(!msg){
      switch(code){
        case 200:
          this.message = 'Success 200';
          break;
        case 201:
          this.message = 'Success 201, Resource Created';
          break;
        case 400:
          this.message = 'Error 400, Bad Request';
          break;
        case 401:
          this.message = 'Error 401, Authenticaion Required';
          break;
        case 403:
          this.message = 'Error 403, Forbidden Resource';
          break;
        case 404:
          this.message = 'Error 404, Resource Not Found';
          break;
        case 405:
          this.message = 'Error 405, Request Not Supported';
          break;
        case 409:
          this.message = 'Error 509, Resource Conflict';
          break;
        case 500:
          this.message = 'Error 500, Internal Server Error';
          break;
        default:
          this.message = 'Unknown Status Code';
          break;
      }
    }
  }

  //Sends response in JSON format
  send(res) {
    if(this.toCache)
      res.setHeader('Cache-Control', 'max-age=60');
    else
      res.setHeader('Cache-Control', 'no-store');
    
    //Build response body
    this.responseBody = {
      status: this.code,
      message: this.message
    };

    //Include data if it exists
    if(this.data){
      this.responseBody.data = this.data;
    }

    //Set response header
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(this.code).json(this.responseBody);
  }
}

//Export class for use in other files
module.exports = Response;