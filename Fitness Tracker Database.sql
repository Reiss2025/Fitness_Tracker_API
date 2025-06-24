-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--

--
-- Table structure for table `FitnessGoals`
--

CREATE TABLE `FitnessGoals` (
  `GoalID` int(255) NOT NULL,
  `GoalDescription` varchar(255) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `Status` varchar(20) NOT NULL,
  `UserID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `FitnessGoals`
--

INSERT INTO `FitnessGoals` (`GoalID`, `GoalDescription`, `StartDate`, `EndDate`, `Status`, `UserID`) VALUES
(1, 'Lose 5 kilograms', '2025-05-15', '2025-06-15', 'in progress', 1),
(2, 'Run a half marathon', '2025-03-01', '2025-08-01', 'in progress', 1),
(3, 'Attend 3 yoga classes per week for 8 weeks', '2025-05-01', '2025-06-26', 'pending', 2),
(4, 'Lose 8% body fat', '2025-02-10', '2025-04-10', 'completed', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Meals`
--

CREATE TABLE `Meals` (
  `MealID` int(255) NOT NULL,
  `Date` date NOT NULL,
  `Time` time(6) NOT NULL,
  `MealDescription` varchar(255) NOT NULL,
  `Calories` int(25) NOT NULL,
  `Protein` int(25) NOT NULL,
  `Carbs` int(25) NOT NULL,
  `Fats` int(25) NOT NULL,
  `UserID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Meals`
--

INSERT INTO `Meals` (`MealID`, `Date`, `Time`, `MealDescription`, `Calories`, `Protein`, `Carbs`, `Fats`, `UserID`) VALUES
(1, '2025-03-12', '08:00:00.000000', 'Porridge', 320, 10, 55, 6, 1),
(2, '2025-03-19', '18:45:00.000000', 'Fish and chips', 800, 32, 70, 45, 1),
(3, '2025-05-19', '13:00:00.000000', 'Grilled chicken sandwich', 480, 35, 45, 18, 2),
(4, '2025-05-12', '13:00:00.000000', 'Mixed leaf salad with grilled chicken', 420, 38, 20, 22, 2);

-- --------------------------------------------------------

--
-- Table structure for table `Recommendations`
--

CREATE TABLE `Recommendations` (
  `RecommendationID` int(255) NOT NULL,
  `RecommendationDescription` varchar(255) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Recommendations`
--

INSERT INTO `Recommendations` (`RecommendationID`, `RecommendationDescription`, `UserID`) VALUES
(1, 'The workout you described as \'5K Run\' burned 40 calories over 30 minutes. To maximize your workout efficiency, try increasing intensity or duration.', 1),
(2, 'The workout you described as \'Upper body strength training\' burned 40 calories over 30 minutes. To maximize your workout efficiency, try increasing intensity or duration.', 1),
(3, 'The meal you described as \'Porridge\' is low in protein. Try adding more meat, fish, or plant-based proteins.', 1),
(4, 'The meal you described as \'Fish and chips\' contains too many carbs compared to protein. Try reducing the carbs and adding more protein-rich foods.', 1),
(5, 'The workout you described as \'Yoga session\' burned 180 calories over 45 minutes. To maximize your workout efficiency, try increasing intensity or duration.', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `UserID` int(255) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Admin` int(2) NOT NULL,
  `Forename` varchar(128) NOT NULL,
  `Surname` varchar(128) NOT NULL,
  `Age` int(100) NOT NULL,
  `Height` int(100) NOT NULL,
  `Weight` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UserID`, `Username`, `Password`, `Admin`, `Forename`, `Surname`, `Age`, `Height`, `Weight`) VALUES
(1, 'user', '$2b$10$M1np/EZV9uKiGEU9e6eyV.hjpP/Y94yoIg8OkljPE8s8sizOgtdx.', 0, 'John', 'Smith', 46, 173, 98),
(2, 'admin', '$2b$10$5oN6fa1HF.rwPc15b50D6uvlAR2A0KoH4CCoFUxiDHVVtf7j3ureq', 1, 'Jess', 'Thompson', 24, 164, 73);

-- --------------------------------------------------------

--
-- Table structure for table `Workouts`
--

CREATE TABLE `Workouts` (
  `WorkoutID` int(255) NOT NULL,
  `Date` date NOT NULL,
  `Time` time(6) NOT NULL,
  `WorkoutDescription` varchar(255) NOT NULL,
  `Duration` int(128) NOT NULL,
  `CaloriesBurnt` int(128) NOT NULL,
  `UserID` int(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Workouts`
--

INSERT INTO `Workouts` (`WorkoutID`, `Date`, `Time`, `WorkoutDescription`, `Duration`, `CaloriesBurnt`, `UserID`) VALUES
(1, '2025-05-18', '07:30:00.000000', '5K Run', 50, 437, 1),
(2, '2025-05-20', '17:00:00.000000', 'Upper body strength training', 30, 40, 1),
(3, '2025-05-21', '18:00:00.000000', 'Yoga session', 45, 180, 2),
(4, '2025-05-19', '16:30:00.000000', 'HIIT cardio session', 30, 300, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `FitnessGoals`
--
ALTER TABLE `FitnessGoals`
  ADD PRIMARY KEY (`GoalID`),
  ADD KEY `GoalsLink` (`UserID`);

--
-- Indexes for table `Meals`
--
ALTER TABLE `Meals`
  ADD PRIMARY KEY (`MealID`),
  ADD KEY `MealsLink` (`UserID`);

--
-- Indexes for table `Recommendations`
--
ALTER TABLE `Recommendations`
  ADD PRIMARY KEY (`RecommendationID`),
  ADD KEY `RecommendationLink` (`UserID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `Workouts`
--
ALTER TABLE `Workouts`
  ADD PRIMARY KEY (`WorkoutID`),
  ADD KEY `WorkoutLink` (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `FitnessGoals`
--
ALTER TABLE `FitnessGoals`
  MODIFY `GoalID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `Meals`
--
ALTER TABLE `Meals`
  MODIFY `MealID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `Recommendations`
--
ALTER TABLE `Recommendations`
  MODIFY `RecommendationID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `UserID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `Workouts`
--
ALTER TABLE `Workouts`
  MODIFY `WorkoutID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `FitnessGoals`
--
ALTER TABLE `FitnessGoals`
  ADD CONSTRAINT `GoalsLink` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `Meals`
--
ALTER TABLE `Meals`
  ADD CONSTRAINT `MealsLink` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `Recommendations`
--
ALTER TABLE `Recommendations`
  ADD CONSTRAINT `RecommendationLink` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `Workouts`
--
ALTER TABLE `Workouts`
  ADD CONSTRAINT `WorkoutLink` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);
COMMIT;
