var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var json2csv = require('json2csv');

request({
  url: 'http://e-service.cwb.gov.tw/HistoryDataQuery/MonthDataController.do?command=viewMain&station=' + process.argv[2] + '&stname=%25E5%25AE%2589%25E5%258D%2597&datepicker=' + process.argv[3],
  method: "GET"
}, function(e,r,b) {
  if(e || !b) { return; }
  var $ = cheerio.load(b);
  var result = [];
  var rows = $("#MyTable tbody tr");
  var contents = [];
  for (var i = 2; i < rows.length; i++) {
    var content = {
      obsTime: $(rows[i]).text().split("\n")[1].split("\t")[2].split("\r")[0],
      stnPres: $(rows[i]).text().split("\n")[2].split("\t")[2].split("\r")[0],
      stnPresMax: $(rows[i]).text().split("\n")[4].split("\t")[2].split("\r")[0],
      stnPresMaxTime: $(rows[i]).text().split("\n")[5].split("\t")[2].split("\r")[0],
      stnPresMin:  $(rows[i]).text().split("\n")[6].split("\t")[2].split("\r")[0],
      stnPresMinTime: $(rows[i]).text().split("\n")[7].split("\t")[2].split("\r")[0],
      temperature: $(rows[i]).text().split("\n")[8].split("\t")[2].split("\r")[0],
      tMax: $(rows[i]).text().split("\n")[9].split("\t")[2].split("\r")[0],
      tMaxTime: $(rows[i]).text().split("\n")[10].split("\t")[2].split("\r")[0],
      tMin: $(rows[i]).text().split("\n")[11].split("\t")[2].split("\r")[0],
      tMinTime: $(rows[i]).text().split("\n")[12].split("\t")[2].split("\r")[0],
      rh: $(rows[i]).text().split("\n")[14].split("\t")[2].split("\r")[0],
      rhMin: $(rows[i]).text().split("\n")[15].split("\t")[2].split("\r")[0],
      rhMinTime: $(rows[i]).text().split("\n")[16].split("\t")[2].split("\r")[0],
      ws: $(rows[i]).text().split("\n")[17].split("\t")[2].split("\r")[0],
      wd: $(rows[i]).text().split("\n")[18].split("\t")[2].split("\r")[0],
      wsGust: $(rows[i]).text().split("\n")[19].split("\t")[2].split("\r")[0],
      wdGust: $(rows[i]).text().split("\n")[20].split("\t")[2].split("\r")[0],
      wGustTime: $(rows[i]).text().split("\n")[21].split("\t")[2].split("\r")[0],
      precp: $(rows[i]).text().split("\n")[22].split("\t")[2].split("\r")[0]
    }
    contents[i-2] = content;
  }
  var fields = ['obsTime', 'stnPres', 'stnPresMax', 'stnPresMaxTime', 'stnPresMin', 'stnPresMinTime', 'temperature',
                'tMax', 'tMaxTime', 'tMin', 'tMinTime', 'rh', 'rhMin', 'rhMinTime', 'ws', 'wd', 'wsGust', 'wdGust',
                'wGustTime', 'precp'];
  var csv = json2csv({ data: contents, fields: fields });

  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
});
