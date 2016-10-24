# CURRENT-C

This app allows a user to create an account, select multiple currency exchange rates, and convert foreign currencies into US dollars. Users can choose to see the increase/decrease of  exchange rates over a period of time by choosing the number of months back to compare the current rate to (6 to 24 months). All chosen currencies are saved to the user's account.

![screenshot](/public/assets/screenshot.png "screenshot")

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Tech notes

This app uses Angular 1.5 for the client with Pure CSS. The backend uses Node.js running an Express server using Passport for authentication.

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
