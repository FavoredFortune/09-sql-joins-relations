# Kilovolt Blog Lab 9

**Author**: Jeremy Crawford and Suzanne Richman
**Version**: 1.0.5 (1.0.5 onwards completed by Suzanne Richman alone)

## Overview
This product is designed to give users a consistent reading and navigation experience across mobile and desktop devices, with content ordered by most recent first and sortable by both author or category. Additionally, users who want to add articles to the blog with the submit button may now do so and the model database will be updated with their new article that they'll then be able to see on the home page with a page refresh. The articles are now stored and available via a database on a model instead of just from local storage. There is also now a full system architecture in place to support a more flexible and efficient application with a view (the two HTML pages), a controller (server.js) and a model (kilovold DB).

## Getting Started

The user would need to
* Create the index.html file.
* Get the icons from IcoMoon (including all related files and CSS).
* Get the normalize.css from github.com/necolas/normalize.css.
* Search and find images of bacon, baseball, and cats.
* Add filler text with all article properities for each one as an object literal into an array on a file called blogArticles.js (or eventually in to a database as rows in a table).
* Build CSS files according to SMACSS methodology.
* Include link to jQuery library (CDN).
* Create the articles as objects within an array with consistent property values.
* Create a constructor function to make the article array accessible to the constructor's method.
* Use jQuery to access and clone HTML elements of the DOM and populate those elements with content from the article array.
* Create forEach loops to generate new object instances and then append them to the DOM.
* Create an array of objects to hold the content generation for the DOM for each object.
* Create a JS file to generate a more interactive view of the DOM (selecting authors, catagories and hiding/showing full articles as well as navigating the long page as if it was a multipage website).
* Add Handlebars library and use it to create a tempalte for the HTML articles.
* Add the Higlight JS library and related CSS styling to have the ability to highlight content.
* Create a new HTML page to handle article submissions that offers a form to create an article and ability to preview content.
* Connect the new HTML page to the exisiting blog page and update articleView.js, as well as articles.js to render content correctly across both pages.
* Be sure to write DRY code and leverage the libraries used.
* Regularly use console logs, Chrome developer console tools and the help of others to identify and correct all coding and rendering erros.
* Convert the blogArticle.js to JSON file, hackerIpsum.json.
* Next the user will need to install several npm packages including Express and nodemon, fs, bodyparser, pg. 
* The user needs to be sure to create a proper .gitignore file.
* Change all functions to arrow functions where possible and contextual this is not used.
* Install postgreSQL to your system.
* Create a kilovolt database to store your articles and authors tables. 
* Write SQL queries to connect the database to the controller for use by the view.
* Write jQuery and JS to leverage the new Node and JS packages and libraries to make sure all created content in the database (model), is accessible by the controller (server.js) and that the view (the HTML files) may make requests of the data and recieve the data in a way that is easy to consume for any end user. 

## Architecture

We used IcoMoon icon font for navigation icons. We included the jQuery, Handlebars, Hightlight JS, and Railcasts libraies, with related CSS as needed. We installed and used Express, pg, fs and nodemon npm JS packages. We installed and used postgreSQL. We worked to create a RESTful website application. We used Chrome, and nodemon to analyze and inspect the view and the controller. We used the postgreSQL shell to check model. Project is built used HTML, CSS, JavaScript, Node and SQL. We used CRUD testing to ensure the entire system architecture is working as expected for both our developer and end users.

## Change Log
02-23-2018
9 am comitted new file structure
11 am comitted new readme, and intial query work
12 pm commited nearly complete query work
1:15 pm commited nearly complete work so we could submit for lab due date

02-24-2018
1:15pm Commited new package-lock.json and new branch for doing my own resubmit based on my own fork.
3:30pm Commited updates to the server.js based on work to-date from Friday's pair partner programming and then my own notes from code review in class, as well as updates to my readme.
5:13pm Updates to server.js with CRUD testing has .put method working now, but while backend continues to improve, front end still isn't working. 


## Credits and Collaborations
* Thanks to our instructors and TAs and our classmates, with special thanks to Nick.
* The following libraries were used: jQuery,Highlight JS, Handlebars and Railcast.
* We referenced the jQuery cheat sheet: https://oscarotero.com/jquery/
* We used HandleBars library.
* We referenced our text book: Jon Duckett - JavaScript and JQuery.
* We used Node documentation: https://nodejs.org/en/
* We referenced the SQL Language cheat sheet througout our work that was provided by our instructor, as well as the SQL query demo she shared from the day before. 
* For help remembering COUNT command structure in SQL: https://www.brentozar.com/archive/2014/02/count-number-rows-table-sql-server/
* Special thanks to Beverly for helping me trouble shoot my .put function in my controler and catching missing quotes around authorUrl. 
    
