//Import database
const database = require('../config/db');

//Import controllers
const AuthRecordController = require('../controllers/AuthRecordController');
const UserRecordController = require('../controllers/UserRecordController');
const WorkoutRecordController = require('../controllers/WorkoutRecordController');
const MealsRecordController = require('../controllers/MealsRecordController');
const GoalsRecordController = require('../controllers/GoalsRecordController');
const RecommendationsRecordController = require('../controllers/RecommendationsRecordController');
const AdminRecordController = require('../controllers/AdminRecordController');

//Import authentication
const AuthenticateToken = require('../authentication/AuthenticateToken');
const AuthoriseAdmin = require('../authentication/AuthoriseAdmin')

//Create new router
const express = require('express');
const records = express();

//Initialise controllers with a database connection
const AuthController = new AuthRecordController(database);
const UserController = new UserRecordController(database);
const WorkoutController = new WorkoutRecordController(database);
const MealsController = new MealsRecordController(database);
const GoalsController = new GoalsRecordController(database);
const RecommendationsController = new RecommendationsRecordController(database);
const AdminController = new AdminRecordController(database);

//Token authentication instance
const authenticate = AuthenticateToken(AuthController);

//Public routes (no authentication needed)
records.post('/login/', (req, res) => AuthController.postLogin(req, res));
records.post('/register/', (req, res) => AuthController.postRegister(req, res));

//Protected routes (authentication needed)
records.post('/reset-password/', authenticate, (req, res) => AuthController.postReset(req, res));
records.post('/logout/', authenticate, (req, res) => AuthController.postLogout(req, res));

records.get('/profile/', authenticate, (req, res) => UserController.getUsers(req, res));
records.patch('/profile/', authenticate, (req, res) => UserController.patchUsers(req, res));
records.delete('/profile/', authenticate, (req, res) => UserController.deleteUsers(req, res));

records.get('/workouts/', authenticate, (req, res) => WorkoutController.getWorkouts(req, res));
records.get('/workouts/:id', authenticate, (req, res) => WorkoutController.getWorkoutById(req, res));
records.post('/workouts/', authenticate, (req, res) => WorkoutController.postWorkout(req, res));
records.patch('/workouts/:id', authenticate, (req, res) => WorkoutController.patchWorkout(req, res));
records.delete('/workouts/:id', authenticate, (req, res) => WorkoutController.deleteWorkout(req, res));

records.get('/meals/', authenticate, (req, res) => MealsController.getMeals(req, res));
records.get('/meals/:id', authenticate, (req, res) => MealsController.getMealById(req, res));
records.post('/meals/', authenticate, (req, res) => MealsController.postMeal(req, res));
records.patch('/meals/:id', authenticate, (req, res) => MealsController.patchMeal(req, res));
records.delete('/meals/:id', authenticate, (req, res) => MealsController.deleteMeal(req, res));

records.get('/goals/', authenticate, (req, res) => GoalsController.getGoals(req, res));
records.get('/goals/:id', authenticate, (req, res) => GoalsController.getGoalById(req, res));
records.post('/goals/', authenticate, (req, res) => GoalsController.postGoal(req, res));
records.patch('/goals/:id', authenticate, (req, res) => GoalsController.patchGoal(req, res));
records.delete('/goals/:id', authenticate, (req, res) => GoalsController.deleteGoal(req, res));

records.get('/recommendations/', authenticate, (req, res) => RecommendationsController.getRecommendations(req, res));
records.get('/recommendation/:id', authenticate, (req, res) => RecommendationsController.getRecommendationById(req, res));
records.delete('/recommendation/:id', authenticate, (req, res) => RecommendationsController.deleteRecommendation(req, res));

//Private routes (authentication and admin status needed)
records.get('/admin/profiles/', authenticate, AuthoriseAdmin, (req, res) => AdminController.getUsers(req, res));
records.get('/admin/profile/:id', authenticate, AuthoriseAdmin, (req, res) => AdminController.getUserById(req, res));
records.post('/admin/reset-password/:id', authenticate, AuthoriseAdmin, (req, res) => AdminController.postResetPassword(req, res));
records.delete('/admin/profile/:id', authenticate, AuthoriseAdmin, (req, res) => AdminController.deleteUser(req, res));

//Export router
module.exports = records;