/*
  Autor:  Manuel Cerda
  Git:    espaciomore
  
  Collect data from a json file containing an array of objects.
  Also, populate a table with those object's properties / key-value pairs.
  
*/
function getData(url,callback) {
  var xmlhttp;

  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      callback( eval(xmlhttp.responseText) );
    }
  }

  xmlhttp.open("GET",url, true);
  xmlhttp.send();
}

var successCallback = function(data) {
  if(!data) return;
  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');

  for (key in data[0]) {
    var th = document.createElement('th');
    th.innerHTML = key;
    thead.appendChild(th);
  };

  var len = data.length;
  for (var i = 0; i < len; i++) {
    var tr = document.createElement('tr');
    if (i%2 === 0) {
      tr.className = 'even';
    } else {
      tr.className = 'odd';
    }
    for (key in data[i]) {
      var td = document.createElement('td');
      var value = data[i][key];
      if ( typeof(value)=='string' && value.match(/[A-Z0-9\-\._]+@[A-Z0-9\-\._]+/i)) {
        var anchor = document.createElement('a');
        anchor.setAttribute('href','mailto:'+value);
        anchor.innerHTML = value;
        td.appendChild(anchor);
      } else {
        td.innerHTML = value;
      };
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  };

  table.appendChild(thead);
  table.appendChild(tbody);

  document.getElementById('tableview').appendChild(table);
}

window.onload = function () {
  getData( "database.json",successCallback );
}
