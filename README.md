# Airbnb-Prime

## About

[<font color=#FF385C>Airbnb-Prime</font>](https://airbnb-prime.herokuapp.com/) is a full-stack application clone of Airbnb deployed on Heroku. The app uses React and Redux on the front-end and Express and Sequelize on the back-end.

### Features of App

- User Authentication required in order for users to be logged in to access certain features.
- Full CRUD features for Creating, Reading, Updating and Deleting of Spots.
- Full CRD features for Creating, Reading, and Deleting of Reviews on Spots.

<br>

## Technologies Used

### Front-end:

- Javascript
- React
- Redux
- Node.js
- HTML
- CSS

### Back-end:

- Javascript
- Express
- Sequelize
- PostgresSQL

<br>

## Application Preview

### Splash Page:

![Splash-Page](./PreviewImages/splash-page.jpg)

<br>

### Spot Details:

![Spot Details](./PreviewImages/spot-details-page.jpg)

<br>

### Host Page:

![Host Page](./PreviewImages/host-page.jpg)

<br>

## How to Launch

### Heroku

Feel free to explore the site on Heroku using this [Link](https://airbnb-prime.herokuapp.com/).

### Locally

If you would like to launch the site locally please do the following:

1. Clone this repo using a terminal by going to a directory where you would like to download and typing `git clone https://github.com/dhoffmann1/AirBnB.git`.

- Alternatively, you may download the zip file and extract it to a folder on your computer.

2. Go into the 'backend' directory and in the terminal type `npm install`.

3. Create a .env in your 'backend' directory and copy paste eveything inside .env.example.

4. Still in your 'backend' directory, load the migrations database using `npx dotenv sequelize db:migrate`.

5. Still in you 'backend' directory, load the seed data into your database using `npx dotenv sequelize db:seed:all`.

6. Type `npm start` to start your backend.

7. Open up a second terminal, go into the 'frontend' directory and in the terminal type `npm install`. Then type `npm start`. If you have Google Chrome, this should automatically launch the browser and direct you to `localhost:3000`. If it did not launch automatically, manually open up a browser and go to `localhost:3000`.

8. Congrats, you have launched the app.
