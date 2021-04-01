function getJSON() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const s = ss.getSheetByName("data");
    const s2 = ss.getSheetByName("state");

    const url = "https://api.covidtracking.com/v1/states/daily.json";

    const response = UrlFetchApp.fetch(url).getContentText();
    const responseJSON = JSON.parse(response);

    const result = responseJSON.map(r => [r.state, r.death, r.positive, r.date]);
    // cutting data in-half, if needed
    const halfLength = Math.ceil(result.length / 1);
    let halfData = result.splice(0, halfLength);
    dataRange = s.getRange(2, 1, halfData.length, 4).setValues(halfData);

}

function returnData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const s2 = ss.getSheetByName("state");
    const readRange = s2.getRange(1, 1, s2.getLastRow(), s2.getLastColumn()).getDisplayValues();
    const chartData = readRange.map(r => [r[0], parseInt(r[1]), parseInt(r[2])]);
    console.log(chartData)
    chartData[0][2] = "Positive Cases";
    chartData[0][1] = "Deaths";
    console.log(chartData)
    return chartData;
}

function returnData2() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const s2 = ss.getSheetByName("dates");
    const readRange = s2.getRange(1, 1, s2.getLastRow(), 3).getDisplayValues();
    const chartData2 = readRange.map(r => [r[0], parseInt(r[2])]);
    chartData2[0][1] = "Deaths";
    chartData2[0][0] = {
        type: 'date',
        id: 'date'
    };
    console.log(chartData2)
    return chartData2;
}

function returnData3() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const s2 = ss.getSheetByName("dates");
    const readRange = s2.getRange(1, 1, s2.getLastRow(), 5).getDisplayValues();
    const chartData3 = readRange.map(r => [r[0], parseInt(r[2]), parseInt(r[4])]);
    console.log(chartData3)
    chartData3[0][2] = "Cases";
    chartData3[0][1] = "Deaths";
    chartData3[0][0] = {
        type: 'date',
        id: 'date'
    };
    console.log(chartData3)
    return chartData3;
}
