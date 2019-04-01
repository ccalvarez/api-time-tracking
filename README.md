# api-time-tracking
> Express.js RESTful API for logging and reporting daily tasks.

## Features

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)

## API Description

|Verb| Route| Description| Route example| Request body example
|:---|:-----|:-----------|:-------------|:--------------------|
|POST|/users|User Sign up|http://localhost:9000/.netlify/functions/server/users|<code>{ "email": "test@domain.com",    "password": "test" }</code>|
|POST|/users/login|User Login|http://localhost:9000/.netlify/functions/server/users/login|<code>{ "email": "test@domain.com",    "password": "test" }</code>|
|POST|/projects|Create project|http://localhost:9000/.netlify/functions/server/projects|<code>{ "name": "My new project",    "userId": "5c1591a080980742861d7ef6" }</code>|
|POST|/tasks|Create task|http://localhost:9000/.netlify/functions/server/tasks|<code>{ "description": "My new task", "projectId": "5c1591a080980742861d7ef6",	"userId": "5c1591a080980742861d7ef6",	"start": true, "includeInReport": true }</code>|
|PATCH|/tasks|Change task's state (running, paused, finished)|http://localhost:9000/.netlify/functions/server/tasks|<code>{	"taskId": "5c1591a080980742861d7ef6",	"state": "finished" }</code>|
|GET|/users/:userId/projects|Get projects by user|http://localhost:9000/.netlify/functions/server/users/5c1591a080980742861d7ef6/projects||
|GET|/users/:userId/tasks|Get tasks by user|http://localhost:9000/.netlify/functions/server/users/5c1591a080980742861d7ef6/tasks||
|POST|/users/:userId/report|Get tasks report by user|http://localhost:9000/.netlify/functions/server/users/5c1591a080980742861d7ef6/report|<code>{ "start": "2019-01-01T06:00:00Z",	"end": "2019-02-01T06:00:00Z" }</code>|

## Hosting

- [Netlify](https://www.netlify.com/) with [Lambda Functions](https://www.netlify.com/docs/functions/) 🌶️:fire:

## Important

This application uses the [Dotenv](https://www.npmjs.com/package/dotenv) npm package to load environment variables.
To run the application, copy the `.env.copy` file as `.env` and edit the latter to set appropriate values for the environment variables.

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
