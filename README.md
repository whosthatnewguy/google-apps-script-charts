# Google Chart gallery made with Google Apps Script, Google Sheets, and The COVID Tracking Project Data API
## Overview
A gallery of three Google Charts developed using Javascript, HTML, CSS, and MDB 5 Bootstrap components: https://script.google.com/macros/s/AKfycbwDXRbv1xvvHKcquUm-0PmDwBLDuIVZp0oqmO609YPbiQcLtLY/exec

This README file contains information on setting up the API endpoint and rendering each chart using Google Sheets as a backend.

## Connect to The COVID Tracking Project public data API
In the Apps Script editor, create a function using the `UrlFetchApp` service to issue an HTTP request and recieve JSON object response from the data API:
```javascript
function getJSON() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName("data");
  const s2 = ss.getSheetByName("state");

  const url = "https://api.covidtracking.com/v1/states/daily.json";

  const response = UrlFetchApp.fetch(url).getContentText();
  const responseJSON = JSON.parse(response);
```
Then, map JSON object to new array and write data to Google Sheets:
```javascript
  const result = responseJSON.map(r => [r.state, r.death, r.positive, r.date]);
  dataRange = s.getRange(2,1,result.length,4).setValues(result)
}
```
## Return data from backend
Here, create a function to get cleaned data from the spreadsheet, map/parse number data as integers, and return the values:
```javascript
function returnData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s2 = ss.getSheetByName("state");
  const readRange = s2.getRange(1,1,s2.getLastRow(),s2.getLastColumn()).getDisplayValues();
  const chartData = readRange.map(r => [r[0],parseInt(r[1]),parseInt(r[2])]);
  chartData[0][2] = "Positive Cases";
  chartData[0][1] = "Deaths";
  return chartData;
}
```
## Load chart libraries, loader, Maps API key, and register callback
In order to draw the `geochart`, a Google Maps API key is necessary. You can create a Google Cloud Platform project and generate an API key [here](https://developers.google.com/maps/gmp-get-started). In the HTML of the webpage below, we load each chart package and register a callback function to execute when the charts finish loading:
```javascript
<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
		<script type="text/javascript">
      google.charts.load('current', {
        'packages':['geochart','calendar','line'],
        mapsApiKey:'YOUR_MAPS_API_KEY'
      });
       google.charts.setOnLoadCallback(getData);
```
Next, we register a callback to our backend `returnData()` function:
```javascript
function getData() {
        google.script.run.withSuccessHandler(drawSeriesChart).returnData();
      }
```
## Callback to create charts and populate data tables
Here, we pass the data from our backend function into the data table, set chart options, instantiate and draw the chart, then pass the chart options as arguments:
```javascript
function lineChart(returnData) {
        const data = new google.visualization.arrayToDataTable(returnData);
        const options = {
          chart: {
            title: 'COVID Positive Cases & Deaths Per Day',
            },
            hAxis: {
              scaleType: 'log',
            },
            width: 1200,
            height: 600,
            animation: {
              startup: true,
              duration: 20000,
              easing: 'in'
              }
            }
        const chart = new google.charts.Line(document.getElementById('chart_div'));
        chart.draw(data,google.charts.Line.convertOptions(options));
      };
```
This process is repeated ad nauseam for each chart until your eyes bleed. Then, the chart object is placed within a `div` in the HTML of the webpage:
```javascript
 <body>
    <div id="chart_div" style="width:400; height:300"></div>
  </body>
</html>
```
## References 
[The Covid Tracking Project](https://covidtracking.com/data/api)

[Google Charts](https://developers.google.com/chart)

[Google Maps Platform](https://developers.google.com/maps/gmp-get-started)

## Author
[jopringle](https://github.com/whosthatnewguy)

Please feel free to contact me with any suggestions or questions.

## Changelog
* v1.0.1 (April 1, 2021)
