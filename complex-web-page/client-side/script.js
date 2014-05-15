/*
  Author: Manuel Cerda
  Git:    espaciomore
  
  Handle a collection of Users.
  Add, Update, Delete, Find functionalities.
  
*/
function Collection (options) {
  // a mock object of a collection item
  this.mock = options.mock || {};
  // array of elements in the collection
  this.list = options.list;
  // compute everytime to return actual size
  this.size = function(){ return this.list.length; };
  // desired filters
  this.filter = options.filter;
  // returns a list after applying the filter
  this.getList = function(f) {
    var f = f || this.filter;
    if (!f) { return this.list };
    var newList = [];
    var len = this.size();
    for (var i = 0; i < len; i++) {
      filterable = true;
      for (key in f) {
        if (f[key] !== this.list[i][key]) {
          filterable = false;
        }
      }
      if (filterable) { 
        newList.push( this.list[i] );
      };
    }
    return newList;
  };
  // update element in collection
  this.update = function(ele) {
    var len = this.size();
    for (var i = 0; i < len; i++) {
      if (this.list[i]['id'] == ele.id) {
        this.list[i] = ele;
      }
    }
  };
  // add element to collection
  this.create = function(ele) {
    for(key in this.mock) {
      if (ele[key] == undefined) {
        ele[key] = this.mock[key];
      };
    }
    ele['id'] = this.size()+1;
    this.list.push(ele);
  }
  // delete element from collection
  this.delete = function(ele) {
    var len = this.size();
    for (var i = 0; i < len; i++) {
      if (this.list[i]['id'] == ele.id) {
        this.list[i]['status'] = 'deleted';
      }
    }
  };
};

function Grid (options) {
  // name headers accordinglly
  this.headers = options.headers;
  // field's name should map the property
  this.fields = options.fields;

  this.collection = options.collection;

  this.render = function(){
    var data = this.collection.getList();
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    for (i in this.headers) {
      var th = document.createElement('th');
          th.innerHTML = this.headers[i];
      thead.appendChild(th);
    };

    var len = data.length;
    for (var i = 0; i < len; i++) {
      var tr = document.createElement('tr');
          tr.setAttribute('data-id',data[i]['id']);
      for (j in this.fields) {
        var td = document.createElement('td');
        var value = data[i][this.fields[j]];
        td.innerHTML = value == undefined ? '':value;
        tr.appendChild(td);
      }
      var td = document.createElement('td');

      var del = document.createElement('button');
          del.innerHTML = "X";
          del.setAttribute('href','#delete');
          del.className = 'btn-delete';
          del.setAttribute('data-id',data[i]['id']);
      //  add actions
      td.appendChild(del);

      tr.appendChild(td);

      tbody.appendChild(tr);
    };

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
  };
};

function InputGroup(options) {
  this.names = options.names;

  this.getValues = function() {
    var values = {};
    for (var i = this.names.length - 1; i >= 0; i--) {
      values[ this.names[i] ] = document.getElementsByName(this.names[i])[0].value;
    };
    return values;
  };

  this.setValues = function(values) {
    if (values == undefined) { return; };
    for (var i = this.names.length - 1; i >= 0; i--) {
      document.getElementsByName(this.names[i])[0].value = values[ this.names[i] ];
    };
  };

  this.clear = function() {
    var values = {};
    for (var i = this.names.length - 1; i >= 0; i--) {
      values[ this.names[i] ] = '';
    };
    this.setValues( values );
  };
};

var users = new Collection ({
  list: [], 
  filter: {status: 'active'},
  mock: {id:0,name:'fullname',email:'email',password:'',status:'active'}
});
var tableview = new Grid ({
  headers: ['name','email','password'],
  fields: ['name','email','password'],
  collection: users
});
var inputgroup = new InputGroup ({
  names: ['name','email','password','id']
})

function getData(url,callback) {
  var xmlhttp = function(){
    if (window.XMLHttpRequest) { 
      return new XMLHttpRequest(); 
    } else { 
      return new ActiveXObject("Microsoft.XMLHTTP"); 
    }
  }();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { callback( xmlhttp.responseText ); }
  }

  xmlhttp.open("GET",url, true);
  xmlhttp.send();
}

function reloadData() {
  var view = document.getElementById('tableview');
      view.innerHTML = '<table>'+tableview.render().innerHTML+'</table>';
}

function setEvents() {
  var rows = document.getElementsByTagName('tr');
  for (var i = rows.length - 1; i >= 0; i--) {
    rows[i].onclick = function(e){
      var _id = e.currentTarget.dataset.id;
      var data = users.getList( {status:'active',id:parseInt(_id)} )[0];
      inputgroup.setValues(data);
    }
  };

  var sendBtn = document.getElementById('update-create');
  sendBtn.onclick = function(e){
    var userID = document.getElementsByName('id')[0];
    var data = users.getList( {status:'active',id:parseInt(userID.value)} )[0];
        data = data || {};
    var values = inputgroup.getValues();
    data['name'] = values['name'];
    data['email'] = values['email'];
    data['password'] = values['password'];
    if(userID.value != undefined && userID.value != ''){
      users.update( data );
    } else {
      users.create( data );
    }
    inputgroup.clear();
    refresh();
  }

  var clearBtn = document.getElementById('clear');
  clearBtn.onclick = function(e) {
    users.filter = {status: 'active'};
    inputgroup.clear();
    refresh();
  }

  var findBtn = document.getElementById('find');
  findBtn.onclick = function(e) {
    var values = inputgroup.getValues();
    for (key in values) {
      if (values[key] != undefined && values[key]!='') {
        users.filter[key] = values[key];
      };
    }
    refresh();
  }

  var delBtns = document.getElementsByClassName('btn-delete');
  for (var i = delBtns.length - 1; i >= 0; i--) {
    delBtns[i].onclick = function(e){
      var _id = e.currentTarget.dataset.id;
      var data = users.getList( {status:'active',id:parseInt(_id)} )[0];
      users.delete(data);
      inputgroup.clear();
      refresh();
    }
  };
}

function refresh() {
  reloadData();
  setEvents();
}

var successCallback = function( res ) {
  if( res === undefined ) return;
  var data =  eval(res);
  users.list = data; 
  refresh();
}

window.onload = function () {
  getData( "users.json",successCallback );
}
