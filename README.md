# Northcoders News API

### Introduction

Northcoders News is a Reddit-style website, with a RESTful API. It has a database of articles created by users, with functionality to add comments to articles. It is possible to vote (up or down) on all articles and comments. For further information on the API's routes check the Routes heading below. The API is built using [Node.js](https://nodejs.org/en/) (v9.11.1), [MongoDB](https://www.mongodb.com/) (v3.6.3), [Express](https://expressjs.com/) (v4.14.0) and [Mongoose](http://mongoosejs.com/) (v5.0.11). The testing suite is comprised of [Mocha](https://mochajs.org/) (v5.1.0), [Chai Assertion Library](http://www.chaijs.com/) (v4.1.2) and the npm package [Supertest](https://www.npmjs.com/package/supertest) (v3.0.0). **Try it out on Heroku [here](https://nc-news-timhamrouge.herokuapp.com/api/).** The Database is hosted on [MLab](https://mlab.com/).

## Getting Started

In order to get a local copy of the project for testing and development purposes, please follow these steps:

#### Installation

Ensure you have the following installed:

[Node.js](https://nodejs.org/en/)

```
npm --v
```

[MongoDB](https://www.mongodb.com/download-center#community)

```
mongo --version
```

[git](https://git-scm.com/downloads)

```
git --version
```

Clone this repository:

```
git clone https://github.com/timhamrouge/BE-FT-northcoders-news
```

Navigate (cd) into the cloned repository, then install all dependencies using node:

```
 npm install
```

Run MongoDB to give the API access to the local database:

```
mongod
```

NOTE: At this point you will need to create a config folder at root level for the test and development process.env.NODE_ENV.

process.env.NODE_ENV will need to default to 'development'. You can do this by creating an index file that will fetch the DB_URL and PORT from the appropriate config file, depending on the node enviroment that is being run. You can do this with the following code:

```
process.env.NODE_ENV = process.env.NODE_ENV || "development";
module.exports = require(`./${process.env.NODE_ENV}`);
```

In a _new_ terminal window, seed the development database:

```
npm run seed:dev
```

Run the server on your local machine:

```
npm run development
```

This will allow the API to be accessed through the PORT specified in your development config file.

### Running the tests

In order to run the tests on the various endpoints you will need to install:

[Mocha](https://mochajs.org/)

```
npm i mocha
```

The [Chai Assertion Library](http://www.chaijs.com/)

```
npm i chai
```

The npm package [Supertest](https://www.npmjs.com/package/supertest)

```
npm i supertest
```

There is no need to seed the test database before running the tests and it will be seeded before every test is run, nor will you need to set a PORT for test in your config folder as supertest will handle this with it's virtual server. Should you wish to seed the test database manually, you can with the following command:

```
npm run seed:text
```

To run the test, run the following:

```
npm t
```

### Routes

The following routes are available on the API:

```
GET /api
```

Serves an HTML page with documentation for all the available endpoints

```
GET /api/topics
```

Get all the topics

```
GET /api/topics/:topic_id/articles
```

Return all the articles for a certain topic

```
GET /api/articles
```

Returns all the articles

```
GET /api/:article_id
```

Get an individual article

```
GET /api/articles/:article_id/comments
```

Get all the comments for a individual article

```
POST /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: {"comment": "This is my new comment"}

```
PUT /api/articles/:article_id
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: /api/articles/:article_id?vote=up

```
PUT /api/comments/:comment_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: /api/comments/:comment_id?vote=down

```
DELETE /api/comments/:comment_id
```

Deletes a comment

```
GET /api/users
```

Returns a JSON object with all users

```
GET /api/users/:username
```

Returns a JSON object with the profile data for the specified user

## Authors

* **Tim Hamrouge**
