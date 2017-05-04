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
          happy_unhappy: o.does_the_couple_seem_happy_or_unhappy,
          orientation: o.is_the_couple_a_samesex_or_heterosexual_ccouple,
          family: o.what_kinds_of_family_relationships_are_depicted_choose_all_that_apply,
          relationship_type: o.what_kinds_of_relationships_are_depicted_in_the_image
        }

        var keywords = obj.happy_unhappy + ' ' + obj.orientation + ' ' + obj.family + ' ' + obj.relationship_type;
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
