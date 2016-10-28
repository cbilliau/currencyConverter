# CURRENT-C - MEAN stack

![screenshot](/public/assets/screenshot4.png "screenshot")

## Overview

CURRENT-C was created to quickly determine currency exchange values for the US Dollar. This app allows a user to create an account, select multiple currency exchange rates, and convert foreign currency rates into US dollar amounts. Users can choose to see the percentage increase/decrease of exchange rates over a period of time by choosing the number of months back to compare the current rate to (6 to 24 months). All chosen currencies are saved to the user's account.


## Use Case

Why is this app useful? There are two basic users who would use this app. The first, is the person who is monetarily involved in currency markets and regularly or occasionally buys and sells currencies in hopes of profiting from changes in exchange rates. The second, are business travelers and vacationers who regularly travel to foreign countries and have acquired different currencies in their travels and wish to know how much money they have in US dollars.


## Design

![screenshot](/public/assets/uidraw.png "UIdrawing")

This app was designed to be visually simple and straight forward. Graphics were kept at a minimum and only used if they would enhance the conveyance of information, such as in the use of country flags along the names of currencies. Colors chosen were purposely subdued and complimentary, again, to keep visual distractions to a minimum.


## Tech notes

![screenshot](/public/assets/uiflow.png "UIflow")

* The app is built using the MEAN stack. The front-end is built using AngularJS, the back-end using NodeJS with ExpressJS as the web server and MongoDB as the database.

* The app draws currency exchange rates from Fixer.io (http://fixer.io). This API is one of only a few free currency exchange rates API that provides current and historical rate data published by the European Central Bank.

* Data is refreshed every time: the app is opened, a currency is added/removed, and when historical rates are called.

* An API to access the database has been constructed in ExpressJS with 2 key endpoints. The first compares sign-in/log-in data with the user database and the second pulls saved user currency choices.

* All routing is handled in the front-end by Angular 1.5.


## Development Roadmap

This is v1.0 of the app. Future enhancements are expected to include:

* Inclusion of a jQuery/Sparklines graphing tool to replace currency percentage change.

* User account will store US Dollar amount entered.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

A step by step series of examples that tell you have to get a development env running.

1. Clone this repo.

2. cd into the project directory and run 'npm install'.

4. Run 'node server.js'.

5. Open a browser at localhost:8080.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


## Acknowledgments

* http://fixer.io - Fixer.io is a free JSON API for current and historical foreign exchange rates published by the European Central Bank.
