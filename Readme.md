# Project setup

- npm init
- Folder > src > app.js
- Install Express
- Create .gitignore file > node_modules
- In App.js create server
- <img src="./images/creatingserver.png" alt="Logo" width="600">
  <!-- - ![serverimage](./images/Screenshot2024-12-12121546.png) -->
- Install nodemon

# Git

- Create a git repositary
- Push the code

# Cluster

- Go to mongoDB website
- Create a free M0 cluster
- Create user
- Get the connection string

# MongoDB

- Create a folder - src > config > database.js
- Install mongoose
- in database.js > import mongoose > create async connectDB function > paste dabaseURL mongoDB shell
- <img src="./images/mongoDBdatabase.png" alt="Logo" width="600">
- Export connectDB function to app.js(so that first we will connect to database and then will run the server)
- <img src="./images/databaseInAppjs.png" alt="Logo" width="600">

# Postman

- After creating the differnt api's
- Start Testing on postman
- Workspace > black collection > New > HTTP

# REST API's

- Get, Post, Patch, Delete

# Middleware's

- Create a folder middleware in src folder
- Write a middleware (Middleware > auth.js) for different routes
- To use middleware for route,export from middleware file
- Import middleware in route file and write after the path (eg "./test",userAuth,()={})

# Schemas & Models

- Create a models folder > user.js file
- Write the following code
- <img src="./images/userModelSchema.png" alt="Logo" width="600">

# API's

- Create a Route folder > auth.js file
- Import express > declare route > write a indivisual route > export the route
- <img src="./images/routeFile.png" alt="Logo" width="600">

- Will start writing API'S
- Import User model in API
- for eg we will write signup API
- Here we will create new instance of User model by following image code
- To make it dynamic we will use req.body

---

- To make the API working import it in app.js
- To convert the request data into JSON format add a middleware app.use(express.json())
- Declare a router
- Use the app.use("/") to direct the route to indivisual route

# Writing API

# API's TO BUILD

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connection request router

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- [POST /request/send/:status/:userId]
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
- [POST /request/review/:status/:requestId]

# SETUP

- Create routes folder > user.js file
- Import express
- Import models(Schemas)
- Import Router (const authRouter = express.Router();)
- Export Router (module.exports = authRouter;)

# SIGNUP API

- create a POST signup router
- to take a dynamic inputs we will
- Will now create a new instance of User model
- Declare a user, then new User (Models)
- With the req.body we will be able to take input of all models feild we created
- we will save the user (user.save())
- after signup will send a response res.send("....")
- <img src="./images/signupAPI.png" alt="Logo" width="600">

# FIND USER BY EMAIL

- Create a GET user API route
- declare a const userEmail to store email from req.body.email
- with the help of find method pass {email:userEmail}
- <img src="./images/userAPI.png" alt="Logo" width="600">
-

# FEED API

- Create a GET feed API route
- Just use the find method and pass empty object {}
- <img src="./images/feedAPI.png" alt="Logo" width="600">

# DELETE API

- <img src="./images/DeleteAPI.png" alt="Logo" width="600">

# UPDATE API with id

- <img src="./images/UpdateById.png" alt="Logo" width="600">

# UPDATE API with email

- <img src="./images/updatebyemail.png" alt="Logo" width="600">

# VALIDATION ON SCHEMAS

- Make some feild mandatory with required:true (eg.firstName,email,password..etc)
- With same email there should not be 2 user, using unique:true
- default value, string etc explore all the documentation

- <img src="./images/validationschema.png" alt="Logo" width="600">

- VALIDATE method ,if in gender only value includes male female then write following code in gender schema
- <img src="./images/gendervalidatefeilds.png" alt="Logo" width="600">
- Works only when new instance is created
- if we want to work this on while updating in patch api we should add{ runvalidator:true} parameter

# SANITIZING API

# UPDATE API

- we will validate feild which should be updated
- to validate feild we will retrict req.body to which data should come for updates
- the following code to validate api
- <img src="./images/santitizeapi.png" alt="Logo" width="600">

# Validator external library

- install validator > import in model file
- write in validate paramater
- <img src="./images/validatorlibrary.png" alt="Logo" width="600">

# Adding Validation in Signup API

- If the data is not valid we will not let the user to register to database
- for a validation of API we will write function to another folder > file
- Create a utils folder > validation file
- Follow the following code
- <img src="./images/signupvalidatorfile.png" alt="Logo" width="600">

# ENCRYPYING PASSWORD

- Install package bycrypt

- <img src="./images/bycryptpassword.png" alt="Logo" width="600">

# LOGIN API

- Create login api
- we will get email and password from req.body
- adding validation if entered email is valid or not
- We will find if user is present in our database in User model with help of findOne method
- Here we will compare the password which we got from req.body to which we got from user i.e user.password

- <img src="./images/loginapi.png" alt="Logo" width="600">

# JWT TOKEN & COOKIE PARSAR

- We here creating a token in login api
- After checking the password before login we will set a token so that it will be created as soon as user login
- In a login api in isPasswordCorrect add a
  const token = await jwt.sign({ \_id: user.\_id }, "DEV@123");
  sending token throug req.cookie and will receive through cookie
  res.cookie("token", token);
  just with this 2 line of code we have genrated a token

- <img src="./images/JWTtoken.png" alt="Sample Image" width="600">
- with this we have send token from login

- PROFILE API
- Now we are receiving the token from login API
- To read the cookie token we need external package cookie parser
- Import it and give middleware app.use(cookieParser()) in app.js
- To receive to differnt route we need jwt code
- <img src="./images/cookieparser.png" alt="Sample Image" width="600">

# MIDDLEWARES

- create a folder - src > middlewares > auth.js
- Here we will write the same authentication code we wrote in profile api
- which we will make a common auth which we can use in multiple profiles
- <img src="./images/authMiddleware.png" alt="Sample Image" width="600">

# EXPIRING THE TOKENS AND COOKIES

- In a login API where we have set the jwt.sign
  there we will pass extra a parameter as {Expires in : 7d}
- To expire the cookies we will pass paramater in res.cookies
- <img src="./images/expireTokenCookies.png" alt="Sample Image" width="600">

# SCHEMA METHODS

- we will shift the jwt token code to User Schema file(models > user.js) just for a good pratice
- <img src="./images/userSchemaValidateGetJWT.png" alt="Sample Image" width="600">
- after shifting we have to make certain changes in our login API
- <img src="./images/loginAPIAfterExportingToSchema.png" alt="Sample Image" width="600">

# CONNECTION API

## Sending Connection request API

- creating a seprate Schema - models > connectionRequest
- <img src="./images/connectionRequestModel.png" alt="Sample Image" width="600">
- in a request route make a new api "/request/send/:status/:toUserId",
- <img src="./images/requestConnectionAPI.png" alt="Sample Image" width="600">
- in api need to validate a status type before crteating a instatnce
- <img src="./images/validatingStatus.png" alt="Sample Image" width="600">
- validating the dublicate connection
- <img src="./images/existingConnectionValidate.png" alt="Sample Image" width="600">

# FEED API
