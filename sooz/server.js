'use strict';

//The PG package brings in the Client contsructor and it's associated methods.
const pg = require('pg');

//The FS package makes the file system code available for the controller (server.js).
const fs = require('fs');

//This package brings in functions for Node and PostgreSQL to make the controller be able to communicate with the view and the model
const express = require('express');

//This package helps the model, controller and view all share content information in JSON format to render views, update records and create tables in the model via the controller.
const bodyParser = require('body-parser');

//This command checks the systems processing environment for a port and if one isn't readily available, sets the localhost port to 3000.
const PORT = process.env.PORT || 3000;

// This makes all Express package functions available via the variable called "app".
const app = express();

//This connects the controller (server.js) to the model (kilovolt DB).
const conString = 'postgres://localhost:5432/kilovolt';

//This sets the connection between the controller and model.
const client = new pg.Client(conString);
client.connect();
client.on('error', error => {
  console.error(error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

// REVIEW: These are routes for requesting HTML resources.
app.get('/new', (request, response) => {
  response.sendFile('new.html', {root: './public'});
});

// REVIEW: These are routes for making API calls to enact CRUD operations on our database.
app.get('/articles', (request, response) => {

  //This query, within the get method joins the two kilovolt tables within the model for data responses to the controller to deliver to the view, when requested. This is part of the CREATE in CRUD
  client.query(`SELECT * FROM articles INNER JOIN authors ON articles.author_id = authors.author_id;`)
    .then(result => {
      response.send(result.rows);
    })
    .catch(err => {
      console.error(err)
    });
});

app.post('/articles', (request, response) => {
  client.query(

    //This query UPDATES by creating a new record in the authors table in the model (kilovolt DB), if the author doesn't exisit already. If the other does exist, it does nothing. At the end of either action, queryTwo is invoked. This is part of the UPDATE part of CRUD.
    'INSERT INTO authors (author, "authorUrl") VALUES ($1,$2) ON CONFLICT DO NOTHING;',
    [
      request.body.author,
      request.body.authorUrl
    ],
    function(err) {
      if (err) console.error(err);
      // REVIEW: This is our second query, to be executed when this first query is complete.
      queryTwo();
    }
  )

  function queryTwo() {
    client.query(

      //This query retrieves the author name based on the author id (the FOREIGN KEY in the articles table that resides within the model, aka kilovolt DB), as the READ part of CRUD.
      `SELECT author_id FROM authors WHERE author = $1;`,
      [
        request.body.author
      ],
      function(err, result) {
        if (err) console.error(err);

        // REVIEW: This is our third query, to be executed when the second is complete. We are also passing the author_id into our third query.
        queryThree(result.rows[0].author_id);
      }
    )
  }

  function queryThree(author_id) {
    client.query(

      //This SQL query UPDATES the articles table within the kilovolt DB (aka the model) with a new article as part of the UPDATE part of CRUD.
      `INSERT INTO
      articles (title, category, "publishedOn", body, author_id) VALUES ($1, $2, $3, $4, $5);`,
      [
        request.body.title,
        request.body.category,
        request.body.publishedOn,
        request.body.body,
        author_id
      ],
      function(err) {
        if (err) console.error(err);
        response.send('insert complete');
      }
    );
  }
});

app.put('/articles/:id', function(request, response) {

  //As part of the UPDATE part of CRUD, this query updates the author table with new author information.
  client.query(
    `UPDATE authors 
    SET author=$1, "authorUrl"=$2
    WHERE author_id=$3;`,
    [
      request.body.author,
      request.body.authorUrl,
      request.body.author_id
    ]
  )
    .then(() => {

      //When the first part of the update is complete (above in the .query within this .put fuction), this updates the articles table within the kilovolt DB (model) as another part of the UPDATE in CRUD.
      client.query(
        `UPDATE articles 
        SET title=$1, category=$2, "publishedOn"=$3, body=$4 
        WHERE article_id=$5;`),
      [
        request.body.title,
        request.body.category,
        request.body.publishedOn,
        request.body.body,
        request.params.id
      ]
    })
    .then(() => {

      //This sends a message to controller that the updating task is complete.
      response.send('Update complete');
    })
    .catch(err => {
      console.error(err);
    })
});

app.delete('/articles/:id', (request, response) => {

  //This SQL query is the DELETE part of CRUD, and deletes a single record (or row) from the articles table within the kilovolt DB (part of the model).
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
    .then(() => {
      //This sends a message to the controller to confirm the completion of the record delete.
      response.send('Delete complete');
    })
    .catch(err => {
      console.error(err)
    });
});

app.delete('/articles', (request, response) => {
  client.query('DELETE FROM articles')
    .then(() => {
      response.send('Delete complete');
    })
    .catch(err => {
      console.error(err)
    });
});

// REVIEW: This calls the loadDB() function, defined below.
loadDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

//////// ** DATABASE LOADERS ** ////////
////////////////////////////////////////

// REVIEW: This helper function will load authors into the DB if the DB is empty.
function loadAuthors() {
  fs.readFile('./public/data/hackerIpsum.json', 'utf8', (err, fd) => {
    JSON.parse(fd).forEach(ele => {
      client.query(
        'INSERT INTO authors(author, "authorUrl") VALUES($1, $2) ON CONFLICT DO NOTHING;',
        [ele.author, ele.authorUrl]
      )
    })
  })
}

// REVIEW: This helper function will load articles into the DB if the DB is empty.
function loadArticles() {
  client.query('SELECT COUNT(*) FROM articles;')
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('./public/data/hackerIpsum.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(`
            INSERT INTO
            articles(author_id, title, category, "publishedOn", body)
            SELECT author_id, $1, $2, $3, $4
            FROM authors
            WHERE author=$5;
            `,
            [ele.title, ele.category, ele.publishedOn, ele.body, ele.author]
            )
          })
        })
      }
    })
}

// REVIEW: Below are two queries, wrapped in the loadDB() function, which create separate tables in our DB, and create a relationship between the authors and articles tables.
// THEN they load their respective data from our JSON file.

//This is a helper funtion - a function that works within the controller to manage the model.
function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    authors (
      author_id SERIAL PRIMARY KEY,
      author VARCHAR(255) UNIQUE NOT NULL,
      "authorUrl" VARCHAR (255)
    );`
  )
    .then(data => {
      loadAuthors(data);
    })
    .catch(err => {
      console.error(err)
    });

  //This is a helper funtion - a function that works within the controller to manage the model.
  client.query(`
    CREATE TABLE IF NOT EXISTS
    articles (
      article_id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES authors(author_id),
      title VARCHAR(255) NOT NULL,
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL
    );`
  )
    .then(data => {
      loadArticles(data);
    })
    .catch(err => {
      console.error(err)
    });
}
