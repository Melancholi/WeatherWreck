# WeatherWreck: Accident and weather visualizer

## Description: 
This project is a web application (MERN Stack) that visualizes car accidents and weather conditions. It displays an interactive map that will allow the user to view accidents, it will have features such as:
>   - Map Display: Accident locations and weather conditions are shown on a map, allowing users to explore data by region.
>   - Search Function: A search bar that lets users filter accidents or weather details by date, location, or severity.
>   - Detailed Charts: Clicking on a point on the map brings up charts with additional information, such as the time of the accident, its severity, and the weather conditions at that time.
>   - Interactive Data: Users can explore the map and charts to see patterns and connections between accidents and weather.

## Attributions (external resources): 
> Datasets used:  
>   - US Weather Events: https://www.kaggle.com/datasets/sobhanmoosavi/us-weather-events  
>        -  Based of this research: https://arxiv.org/abs/1902.06792  
>    - US Car Accidents: https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents   
>         - Based of this research:   
>            - https://arxiv.org/abs/1906.05409 
>            - https://arxiv.org/abs/1909.09638

> ### Licenses
> - Restictions/licenses if any: CC BY_NC_SA 4.0 - Attribution-Noncommercial-Sharelink 4.0 International (https://creativecommons.org/licenses/by-nc-sa/4.0/)

## Structure:
There are two directories in the root of the project.
- WeatherWreck contains all the code neede for runing the project
- Inside you will find 2 directories:
  * The Express server is in server/
  * The React app is in client/
  * The server responsd to API calls and serves the built React app.

## Setup:
1. Git clone https://gitlab.com/dawson-csy3-24-25/520/section2/teams/TeamL-23-IanaMaaraYoury/520-project-purici-feniuc-nelson.git
2. cd 520-project-purici-feniuc-nelson
3. cd WeatherWreck
4. npm run build
5. cd client/
6. npm install
7. cd ..
8. cd server/
9. npm install
10. create a new .env file in server foler & put the string to connect to the db like this:
ATLAS_URI= <...url...>
10. node util/seed.js

## To run the app:
1. cd client/
2. npm run dev
3. cd ..
4. open another console
5. cd server/
6. npm run dev