// Import all required modules
const Record = require('../modelling/AuthRecordValidation');
const Response = require('../responses/JSON_Response');
const XMLResponse = require('../responses/XML_Response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenBlacklist = require('../authentication/TokenBlacklist');

//Import variables
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

// Controller class that handles authentication functions
class AuthRecordController {
  constructor(db) {
    //Create database connection
    this.db = db;
  }

  //Create an account
  async postRegister(req, res) {
    try {
      const body = req.body;
      let record;

      try {
        //Validate auth records
        record = new Record(
          0,
          body.Username,
          body.Password,
          body.Forename,
          body.Surname,
          body.Age,
          body.Height,
          body.Weight
        );
      } catch (validationError) {
        const response = new Response(400, false, validationError.message);
        return this.sendFormattedResponse(req, res, response);
      }

      //Query the database
      const [existingUsers] = await this.db.query('SELECT * FROM Users WHERE Username = ?',[record.getUsername()]);

      //Check if the user name already exsists
      if (existingUsers.length > 0) {
        const response = new Response(409, false, "Username already exists");
        return this.sendFormattedResponse(req, res, response);
      }

      //Hash password
      const hashedPassword = await bcrypt.hash(record.getPassword(), 10);

      //Query the database
      const [result] = await this.db.query(`INSERT INTO Users (Username, Password, Forename, Surname, Age, Height, Weight) VALUES (?, ?, ?, ?, ?, ?, ?)`,[record.getUsername(), hashedPassword, record.getForename(), record.getSurname(), record.getAge(), record.getHeight(), record.getWeight()]);

      record.setUserID(result.insertId);

      //Send successful response
      const response = new Response(201, false, "User registered successfully", record.asObject());
      this.sendFormattedResponse(req, res, response);
    } 
    //Handle server errors
    catch (error) {
      const response = new Response(500, false, "Error registering user");
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Account login
  async postLogin(req, res) {
    try {
      const username = req.body.username || req.body.Username;
      const password = req.body.password || req.body.Password;

      //Check username and password has been provided
      if (!username || !password) {
        const response = new Response(400, false, "Username and Password are required");
        return this.sendFormattedResponse(req, res, response);
      }

      //Query the database
      const [users] = await this.db.query('SELECT * FROM Users WHERE Username = ?', [username]);

      if (users.length === 0) {
        const response = new Response(401, false, "Invalid credentials");
        return this.sendFormattedResponse(req, res, response);
      }

      const user = users[0];

      //check if the pasword is valid
      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (!isPasswordValid) {
        const response = new Response(401, false, "Invalid credentials");
        return this.sendFormattedResponse(req, res, response);
      }

      //If the password is valid generate a token
      const token = jwt.sign(
        { id: user.UserID, username: user.Username },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      const PasswordFiller = "Password123";

      //Validate auth records
      const record = new Record(
        user.UserID,
        user.Username,
        PasswordFiller,
        user.Forename,
        user.Surname,
        user.Age,
        user.Height,
        user.Weight
      );

      //Send successful response
      const response = new Response(200, false, "Login successful", {
        token,
        user: record.asObject()
      });

      this.sendFormattedResponse(req, res, response);
    } 
    //Handle server errors
    catch (error) {
      const response = new Response(500, false, "Error during login");
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Token logout
  async postLogout(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      //If no token is provided error 401 is output
      if (!token) {
        const response = new Response(401, false, "Token is required");
        return this.sendFormattedResponse(req, res, response);
      }

      //Adds the provided token to the black list
      tokenBlacklist.add(token);

      //Send successful response
      const response = new Response(200, true, "User logged out successfully");
      this.sendFormattedResponse(req, res, response);
    } 
    //Handle server errors
    catch (error) {
      const response = new Response(500, false, "Error logging out user");
      this.sendFormattedResponse(req, res, response);
    }
  }

  //Reset password
  async postReset(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      //Check both old and current passwords are provided
      if (!currentPassword || !newPassword) {
        const response = new Response(400, false, "Current and new passwords are required");
        return this.sendFormattedResponse(req, res, response);
      }

      //check the new password is appropriate
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
      if (!passwordRegex.test(newPassword)) {
        const response = new Response(400,false,"Password must be 8–30 characters long, contain no spaces and include at least one letter and one number");
        return this.sendFormattedResponse(req, res, response);
      }

      //Query the database
      const [users] = await this.db.query('SELECT * FROM Users WHERE UserID = ?', [userId]);

      if (users.length === 0) {
        const response = new Response(404, false, "User not found");
        return this.sendFormattedResponse(req, res, response);
      }

      const user = users[0];

      //Check current password is correct
      const isPasswordValid = await bcrypt.compare(currentPassword, user.Password);
      if (!isPasswordValid) {
        const response = new Response(401, false, "Current password is incorrect");
        return this.sendFormattedResponse(req, res, response);
      }

      //Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      //Query the database
      await this.db.query('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedNewPassword, userId]);

      //Send successful response
      const response = new Response(200, true, "Password updated successfully");
      this.sendFormattedResponse(req, res, response);
    } 
    //Handle server errors
    catch (error) {
      const response = new Response(500, false, "Error resetting password");
      this.sendFormattedResponse(req, res, response);
    }
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

  //Checks if token is blacklisted
  isTokenBlacklisted(token) {
    return tokenBlacklist.has(token);
  }
}

//Export authorisation for use in other files
module.exports = AuthRecordController;
