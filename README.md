# api-time-tracking
> Express.js RESTful API for logging and reporting daily tasks.

- [Features](https://github.com/ccalvarez/api-time-tracking#features)
- [API description](https://github.com/ccalvarez/api-time-tracking#api-description)
- [Hosting](https://github.com/ccalvarez/api-time-tracking#hosting)
- [Environment variables](https://github.com/ccalvarez/api-time-tracking#environment-variables)
- [Project setup](https://github.com/ccalvarez/api-time-tracking#project-setup)

## Features

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)

## API description
> Base URL: http://localhost:9000/.netlify/functions/server

|Verb| Route| Description| Request body example
|:---|:-----|:-----------|:-------------|
|POST|/users|User Sign up|<code>{ "email": "test@domain.com", "password": "testPassword" }</code>|
|POST|/users/login|User Login|<code>{ "email": "test@domain.com",    "password": "testPassword" }</code>|
|POST|/projects|Create project|<code>{ "name": "My new project",    "userId": "5c1591a080980742861d7ef6" }</code>|
|POST|/tasks|Create task|<code>{ "description": "My new task", "projectId": "5c1591a080980742861d7ef6",	"userId": "5c1591a080980742861d7ef6",	"start": true, "includeInReport": true }</code>|
|PATCH|/tasks|Change task's state to running, paused or finished|<code>{	"taskId": "5c1591a080980742861d7ef6",	"state": "finished" }</code>|
|GET|/users/:userId/projects|Get projects by user||
|GET|/users/:userId/tasks|Get tasks by user||
|POST|/users/:userId/report|Get tasks report by user|<code>{ "start": "2019-01-01T06:00:00Z",	"end": "2019-02-01T06:00:00Z" }</code>|

## Hosting

- [Netlify](https://www.netlify.com/) with [Lambda Functions](https://www.netlify.com/docs/functions/) 🌶️:fire:

## Environment variables

This application uses the [Dotenv](https://www.npmjs.com/package/dotenv) npm package to load environment variables.
To run the application you have to:

- Copy the `.env.copy` file as `.env`
- Edit the `.env` file to set the values for the environment variables

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start:lambda
```

## License
[MIT](https://github.com/ccalvarez/api-time-tracking/blob/master/LICENSE)
