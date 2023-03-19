# incedo-artist-search

This project is developed by Malek Cherif as a submission for incedo technical test.


The goal of this project is to fetch artists a list of artists by name
based on Last.FM API. The format of response can be either JSON or CSV.


## Endpoints 

1. `/artist/populate`: this endpoint populates a JSON file name random_artists.json.
This file is used in case lastFm API returns an empty list.


2. `/artist/search`: takes a search query, limit and page to return a list of artists.
This list is gathered from lastFM and in case the response is empty, we return random items from the JSON file.


3. `/artist/download`: works similarly to /artists/search, but it takes in addition a file name and 
returns a CSV file with the list of artists under the provided file name.
If ran from postman, the response will be just a text with the file content, but it will download 
the CSV file if called from a ***browser***.

## How to run the project
1. Install the dependencies with `npm install` command.


2. In order to run the project in development environment with hot reload, run 
`npm run start:dev`.


3. You can alternatively just build the project with `npm run build` and run it with `npm run run:dev`.


4. Call `/artist/populate` to populate the FallBack json file.