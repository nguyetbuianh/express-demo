# English Learning App - Backend

A backend service for an **English learning application**, built with **Node.js + Express**.  
This project manages users, courses, lessons, vocabularies, exercises, and tracks learner progress.

---

## Features

-  **User Management**: Register, login, authentication (JWT)
-  **Course & Lesson Management**: Organize English courses and lessons
-  **Exercises & Options**: Multiple-choice, quizzes for vocabulary & grammar
-  **Vocabulary**: Words with meaning, example, audio, and image
-  **Payments**: Subscription and payment tracking
-  **Progress Tracking**: Save learning progress of users
-  **Role-based Access Control**: (student, teacher, admin)

---

## Project Structure
project-root
├── src
│ ├── config/ # App configuration (DB, env)
│ ├── controllers/ # Handle requests & responses
| ├── dtos/  # Data Transfer Objects (validation & typing for requests/responses)
| ├── lib/ # uploadImage
│ ├── middlewares/ # Authenticate, Authorize, asyncHandler, error handling, validate body request, verify param Id
│ ├── migrations/ # Database migrations
| ├── models/ # Data models (BaseEntity, Course, Exercise, ExerciseOption, Lesson, Payment, Progress, User, Vocabulary)
│ ├── routes/ # Express routes
│ ├── services/ # Business logic
│ ├── utils/ # Helpers (appError, pagination, response)
│ └── index.ts # App entry point
├── uploads/ # Static files (images)
├── .env # Environment variables
├── .gitignore # Files ignored by Git
├── app.ts
├── index.ts
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md

---

## Database Models
### User
- `id`, `email`, `password`, `fullName`, `role`, `avatarUrl`, `refreshToken`, `createAt`
- One-to-Many with **Course**
- One-to-Many with **Progress**
- One-to-Many with **Payment**
  
### Course
- `id`, `title`, `description`, `level`, `price`, `createAt`
- Many-to-One with **User**
- One-to-Many with **Lesson**
- One-to-Many with **Payment**

### Lesson
- `id`, `title`, `content`, `videoUrl`, `audioUrl`, `imageUrl`, `createAt`
- One-to-Many with **Vocabulary**
- One-to-Many with **Exercise**
- One-to-Many with **Progress**

### Vocabulary
- `id`, `word`, `meaning`, `example`, `audio_url`, `image_url`
- Many-to-One with **Lesson**

### Exercise
- `id`, `question`, `type`
- Many-to-One with **Lesson**
- One-to-Many with **ExerciseOption**

### ExerciseOption
- `id`, `optionText`, `isCorrect`
- Many-to-One with **Exercise**

### Payment
- `id`, `amount`, `status`, `createdAt`
- Many-to-One with **User**
- Many-to-One with **Course**

### Progress
- `id`, `score`, `complete`
- Many-to-One with **User** 
- Many-to-One with **Lesson** 

---

## Installation

1. Clone repo:
     git clone https://github.com/nguyetbuianh/express-demo.git
     cd express-demo
3. Install dependencies:
     npm install
4. Configure environment variables (.env):
      DB_HOST=your_DB_HOST
      DB_PORT=5432
      DB_USER=your_DB_USER  
      DB_PASSWORD=your_password               
      DB_NAME=postgres                       
      PORT=3000
      JWT_SECRET=your_JWT_SECRET
      JWT_REFRESH_SECRET=your_JWT_REFRESH_SECRET
5. Run migrations (if using TypeORM/Prisma):
     npm run migration:run
6. Start server:
     npm run dev

## API Endpoints
### User
POST /users/register --> Register a new user account
POST /users/login --> Authenticate user and return tokens
POST /users/refresh --> Refresh access token using a valid refresh token  

### Courses
GET /courses --> Fetch all courses
GET /courses/details/:courseId -->  Fetch detailed information of a course
GET /courses/student --> Fetch all courses enrolled by the authenticated student 
GET /courses/student/:courseid --> Fetch detailed information of a course for the authenticated student  
GET /courses/teacher --> Fetch all courses created by the authenticated teacher  
GET /courses/teacher/:courseId --> Fetch detailed information of a course for the authenticated teacher  
POST /courses --> Create a new course
PUT /courses/:courseId --> Update an existing course  
DELETE /courses/:courseId --> Delete a course

## Lessons
GET /lessons --> Fetch all lessons
GET /lessons/course/:courseId --> Fetch all lessons by course ID
GET /lessons/:lessonId --> Fetch lesson details
POST /lessons --> Create a new lesson
PUT /lessons/lessonId --> Update an existing lesson 
DELETE /lessons/lessonId --> Delete a lesson

## Payments
GET /payments --> Fetch all payments
GET /payments/by-user --> Fetch all payments of the authenticated user  
GET /payments/:courseId/has-access --> Check if the authenticated user has paid for the course and has access.
POST /payments --> Create a new payment  
PATCH /payments/:paymentId/status --> Update the status of a payment  

## Progress
GET /progress/my-progress --> Fetch progress of the authenticated user  
GET /progress/lesson/:lessonId/my-progress --> Fetch lesson progress of the authenticated user 
GET /progress/:progressId --> Fetch the progress details
GET /progress/user/:userId --> Fetch all progress of a specific user  
GET /progress/:userId/lesson/:lessonId --> Fetch lesson progress of a specific student 
POST /progress --> Create a new progress
PUT /progress/:progressId --> Update an existing progress
DELETE /progress/progressId --> Delete a progress

## Vocabularies
GET /vocabularies/lessons/:lessonId --> Fetch all vocabularies of a specific lesson  
GET /vocabularies/:vocabularyId --> Fetch vocabulary details
POST /vocabularies/lessons/:lessonId --> Create a new vocabulary for a lesson 
PUT /vocabularies/:vocabularyId --> Update an existing vocabulary 
DELETE /vocabularies/:vocabularyId --> Delete a vocabulary

## Exercises
GET /exercises/lesson/:lessonId --> Fetch all exercises of a specific lesson  
GET /exercises/:exerciseId --> Fetch exercise details
POST /exercises/:lessonId --> Create a new exercise for a lesson 
PUT /exercises/:exerciseId --> Update an existing exercise
DELETE /exercises/:exerciseId --> Delete a exercise

## Exercise-options
POST /exercise-options/:exerciseId --> Create a new exercise option
PUT /exercise-options/:exerciseOptId --> Update an existing exercise option
DELETE /exercise option/:exerciseOptId --> Delete a exercise option





