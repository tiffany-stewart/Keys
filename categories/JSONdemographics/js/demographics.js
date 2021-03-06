var json;
function csvJSON(csv) {
 var lines = csv.split("\n");
 var result = [];
 var headers = lines[0].split(",");
 for (var i = 1; i < lines.length; i++) {
   var obj = {};
   var currentline = lines[i].split(",");
   for (var j = 0; j < headers.length; j++) {
     obj[headers[j]] = currentline[j];
   }
   result.push(obj);
 }
 return result
}
function upload(file) {
 if (file.type.match(/text\/csv/) || file.type.match(/vnd\.ms-excel/)) {
   oFReader = new FileReader();
   oFReader.onloadend = function() {
     json = csvJSON(this.result);
     json.forEach(function(o){
       var obj = {
         objID: o.system_identifier,
         imgurl: o.image_url,
         labels: o.do_either_of_the_following_labels_apply_to_the_people_in_the_image,
         count: o.how_many_people_are_in_the_image,
         age: o.what_is_the_age_range_of_the_people_in_the_image__choose_all_that_apply,
         ethnicity: o.what_is_the_ethnicity_of_the_people_in_the_image__choose_all_that_apply,
         gender: o.what_is_the_gender_of_the_people_in_the_image,
         type: o.what_is_the_photo_type_of_the_image__choose_all_that_apply,
         position: o.what_physical_position_are_the_people_in
       }


        var keywords = obj.labels + ' ' + obj.count + ' ' + obj.age + ' ' + obj.ethnicity + ' ' + obj.gender + ' ' + obj.type + ' ' + obj.position;
        console.log(keywords);

        var unique_id = obj.objID;
        console.log(unique_id);

        var image_link = obj.imgurl;
        console.log(image_link);


        $('#keytable').append('<tr class="header"><th class="keyheader"> IMAGE URL </th> <th class="keyheader"> IMAGE ID </th> <th class="keyheader"> KEYWORDS </th></tr>   <tr><td>' + image_link + '</td> <td>' + unique_id + '</td> <td>' + keywords + '</td>')


     });
   };
   oFReader.readAsText(file);
 } else {
   alert("This file does not seem to be a CSV");
 }
}


$(document).ready(function() {

  function exportTableToCSV($table, filename) {

    var $rows = $table.find('tr:has(td)'),

      // Temporary delimiter characters unlikely to be typed by keyboard
      // This is to avoid accidentally splitting the actual contents
      tmpColDelim = String.fromCharCode(11), // vertical tab character
      tmpRowDelim = String.fromCharCode(0), // null character

      // actual delimiter characters for CSV format
      colDelim = '","',
      rowDelim = '"\r\n"',

      // Grab text from table into CSV formatted string
      csv = '"' + $rows.map(function(i, row) {
        var $row = $(row),
          $cols = $row.find('td');

        return $cols.map(function(j, col) {
          var $col = $(col),
            text = $col.text();

          return text.replace(/"/g, '""'); // escape double quotes

        }).get().join(tmpColDelim);

      }).get().join(tmpRowDelim)
      .split(tmpRowDelim).join(rowDelim)
      .split(tmpColDelim).join(colDelim) + '"';

    // Deliberate 'false'
    if (false && window.navigator.msSaveBlob) {

      var blob = new Blob([decodeURIComponent(csv)], {
        type: 'text/csv;charset=utf8'
      });


      window.navigator.msSaveBlob(blob, filename);

    } else if (window.Blob && window.URL) {
      // HTML5 Blob
      var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8'
      });
      var csvUrl = URL.createObjectURL(blob);

      $(this)
        .attr({
          'download': filename,
          'href': csvUrl
        });
    } else {
      // Data URI
      var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

      $(this)
        .attr({
          'download': filename,
          'href': csvData,
          'target': '_blank'
        });
    }
  }


  $(".export").on('click', function(event) {
    // CSV
    var args = [$('#dvData>table'), 'export.csv'];

    exportTableToCSV.apply(this, args);


  });
});


$(document).ready(function() {
  $('#jsonOutput > h1').hover(function() {
    $(this).css('letter-spacing', '20px');
  });
});
