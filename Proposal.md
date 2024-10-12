# WeatherWreck : Impact of Weather on US Accidents
## Data
[Issue Dataset](https://gitlab.com/dawson-csy3-24-25/520/section2/teams/TeamL-23-IanaMaaraYoury/520-project-purici-feniuc-nelson/-/issues/1)
2 Datasets: one from Us Weather Events and one from US Car Accidents which in 
combination can show us correlations to what weather conditions cause the most 
accidents on roads.

## API
GET /api/accidents :
This endpoint retrieves accidents details based on date & location of the accident.

GET /api/weather:
This endpoint retrives weather events details based on location & date of the events.

GET /api/accidents/state:
This endpoint retrieves accidents details based on the state of where the accident.
happened.

GET /api/weather/state:
This endpoint retrieves accidents details based on the state of where the event.
happened.

GET /api/weather/date:
This endpoint retrives weather events details based on date of the events.

GET /api/accidents/date:
This endpoint retrieves accidents details based on date of the accident.

GET /api/weather/type:
This endpoint retrives weather events details based on the type of event. ( rain,
storm, snow).

GET /api/accidents/severity:
This endpoint retrieves accidents details based on severity of the accident( 1 
to 4 where 1 is the least severe).

## Visualizations
1. Map of Accidents vs Weather Conditions 
Story :
  - By creating a dynamic map that shows location of accidents using color based 
  markers for weather conditions, the user will discover which areas are more 
  problematic ( accident-prone) during certain weather conditions. This also, can
  make them discover what location are more affected by certain conditons.

2. Graph of correlations between Weather & Accidents.
Story:
 - We're going to create a bar graph to display the pourcentage of accidents that
  occurs under certain weather conditons. This will informate the user about the 
  correlation of weather conditions & accidents. This graph will show what
  conditions represent most risks for car accidents.

3. Pie Chart of the Severity degree
Story 
  - This Pie chart will helps the user undetrand how certain weather conditions 
  can lead to more severe accidents or repercussions on victims. The user will 
  understand what weather he should be more careful in when choosing the drive.
## Views

## Functionality

## Features and Priorities

## Dependencies
