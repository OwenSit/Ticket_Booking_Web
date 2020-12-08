// set global variable todos
let tickett = [];
var inputnum = 1;
// function to set todos
const setReserve = (data) => {
  tickett = data;
};

tax = 0.08; //8% tax
/******************************************************************* */

let flights = [];
var CustoInfo = [];

// let myList = [];
// var myDict = { name: "jenny", age: 23 };
// myList.push(myDict);
// console.log(myList[0].age);

// function to set todos
const setFlights = (data) => {
  flights = data;
};

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

const displayFlights = () => {
  const todoTable = document.querySelector("#flight-table");

  // display all todos by modifying the HTML in "todo-table"
  let tableHTML = "";
  flights.map((flights) => {
    tableHTML += `<tr key=${flights.todflo_id}>
      <th>${flights.flight_id}</th>
      <th>${flights.scheduled_departure}</th>
      <th>${flights.scheduled_arrival}</th>
      <th>${flights.departure_airport}</th>
      <th>${flights.stop1_airport}</th>
      <th>${flights.stop2_airport}</th>
      <th>${flights.arrival_airport}</th>
      <th>${flights.seats_available}</th>
      <th>${flights.status}</th>
      
      </tr>`;
  });
  todoTable.innerHTML = tableHTML;
};

var x;
// select all the flights info
async function flightsInfo() {
  // use try... catch... to catch error
  try {
    // GET all todos from "http://localhost:5000/todos"
    const response = await fetch("http://localhost:5000");
    const jsonData = await response.json();

    setFlights(jsonData);
    console.log(jsonData);
    for (x of jsonData) {
      x.scheduled_arrival = parseISOString(x.scheduled_arrival);
      x.scheduled_departure = parseISOString(x.scheduled_departure);
      if (!x.stop1_airport) {
        x.stop1_airport = "-->";
      }
      if (!x.stop2_airport) {
        x.stop2_airport = "-->";
      }
    }
    displayFlights();
  } catch (err) {
    console.log(err.message);
  }
}

flightsInfo();

/********************************************************************/

// function to display todos
const displayReserve = () => {
  const todoTable = document.querySelector("#reserve-table");

  // display all todos by modifying the HTML in "todo-table"
  let tableHTML = "";
  tickett.map((tickett) => {
    tableHTML += `<tr key=${tickett.ticket_no}>
    <th>${tickett.flight_id}</th>
    <th>${tickett.name}</th>
    <th>${tickett.phone}</th>
    <th>${tickett.email}</th>
    <th>${tickett.checked_bag}</th>
    <th>${tickett.movie}</th>
    <th>${tickett.meal}</th>
    <th>${tickett.amount + tickett.amount * tax}</th>
    
 
    <th><button class="btn btn-danger" type="button" onclick="deleteCustomer(${
      tickett.ticket_no
    })">Delete</button></th>
    </tr>`;
  });
  todoTable.innerHTML = tableHTML;
};

// select all the reserve when the codes first run
selectReserve();

// The following are async function to select, insert, update and delete todos
// select all the todos
async function selectReserve() {
  // use try... catch... to catch error
  try {
    // GET all todos from "http://localhost:5000/todos"
    const response = await fetch("http://localhost:5000/book");
    const jsonData = await response.json();

    setReserve(jsonData);
    displayReserve();
  } catch (err) {
    console.log(err.message);
  }
}
function addInput_of(input_type) {
  var input_data = document.createElement("input");
  input_data.type = "text";
  input_data.class = "form-control";
  input_data.id = input_type + "_" + inputnum;
  input_data.placeholder = input_type.toUpperCase() + "-" + inputnum;
  var parent = document.getElementById("input-reserve");
  parent.appendChild(input_data);

  var h1 = document.getElementById(input_data.id);
  h1.style.border = "solid 2px skyblue";
  h1.style.padding = "10px";
  h1.style.width = "100%";
}
function addSelect_of(input_type) {
  var input_data = document.createElement("select");
  //input_data.type = 'text';
  input_data.class = input_type;
  input_data.id = input_type + "_" + inputnum;
  var parent = document.getElementById("input-reserve");
  parent.appendChild(input_data);

  ///////////////////////////////// HTML and CSS
  var newId = input_type + inputnum;
  var elem = document.getElementById(input_data.id);
  elem.insertAdjacentHTML(
    "beforebegin",
    "<div id = " +
      newId +
      ">" +
      input_type.toUpperCase() +
      "-" +
      inputnum +
      " (Select)</div>"
  );
  var h1 = document.getElementById(newId);
  h1.style.border = "solid 2px skyblue";
  h1.style.padding = "10px";
  ///////////////////////////////////

  return input_data.id;
}
function addOption(txt, va, select) {
  var option = document.createElement("option");
  option.text = txt;
  option.value = va;
  select.appendChild(option);
}

function addForm() {
  addInput_of("name");
  addInput_of("phone");
  addInput_of("email");
  addInput_of("age");

  var select_id = addSelect_of("bag");
  var select = document.getElementById(select_id);
  for (let i = 0; i < 5; i++) {
    addOption(i.toString(), i.toString(), select);
  }

  var select_id = addSelect_of("movie");
  var select = document.getElementById(select_id);
  addOption("No", "N", select);
  addOption("Yes", "Y", select);

  var select_id = addSelect_of("meal");
  var select = document.getElementById(select_id);
  addOption("No", "N", select);
  addOption("Yes", "Y", select);
  ////////////////////////////////////////////////////// HTML and CSS for padding btm
  var newId = "btm_" + inputnum;
  var elem = document.getElementById(select_id);
  elem.insertAdjacentHTML("afterend", "<div id = " + newId + ">" + "</div>");
  var h1 = document.getElementById(newId);
  h1.style.paddingBottom = "10%";

  inputnum++;
}

async function addcustomer() {
  let book_info = [];
  alert("inputnum is " + inputnum);
  for (let i = 0; i < inputnum; i++) {
    let price = 1000;
    var discount = false;
    const fid = document.querySelector("#flightID").value;
    const card_no = document.querySelector("#card_no").value;
    const name = document.querySelector("#name_" + i).value;
    const pho = document.querySelector("#phone_" + i).value;
    const em = document.querySelector("#email_" + i).value;
    var bg = document.querySelector("#bag_" + i).value;
    var mv = document.querySelector("#movie_" + i).value;
    var ml = document.querySelector("#meal_" + i).value;
    const ag = document.querySelector("#age_" + i).value;
    if (ag < 18 || ag > 56) {
      discount = true;
      price = price * 0.8; //20% off
    }

    var myDict = {
      flight_id: fid,
      name: name,
      phone: pho,
      email: em,
      checked_bag: bg,
      movie: mv,
      meal: ml,
      age: ag,
      discount: discount,
      amount: price,
      card_no: card_no,
    };
    book_info.push(myDict);
  }
  try {
    // insert new name to "http://localhost:5000/book", with "POST" method
    const body = book_info;
    const response = await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const info = await response.json();
    // console.log(info[0].book_ref);
    const bookRef = document.querySelector("#bref");
    let bref =
      "PLZ WRITE DOWN BOOKING REF FOR FUTURE INFO CHECKING<br>Booking Reference: ";
    bref += info[0].book_ref + "<br>";
    bref += "Total Tickets Number: " + info.length + "<br>";
    bref += "Flight ID: " + info[0].flight_id + "<br>";
    bref += "Total Amount: $" + info[0].total_amount + "<br>";
    bookRef.innerHTML = bref;
    const todoTable = document.querySelector("#reserve-table");

    // display all todos by modifying the HTML in "todo-table"
    let tableHTML = "";
    for (i = 0; i < info.length; i++) {
      tableHTML += `<tr key=${info.ticket_no}>
    <th>${info[i].name}</th>
    <th>${info[i].passenger_id}</th>
    <th>${info[i].ticket_no}</th>
    <th>${info[i].departure_airport}</th>
    <th>${info[i].arrival_airport}</th>
    <th>${info[i].checked_bag}</th>
    <th>${parseISOString(info[i].boarding_time)}</th>
    <th>${info[i].boarding_gate}</th>
    <th>${parseISOString(info[i].arrival_time)}</th>
    <th>${info[i].arrival_gate}</th>
    <th>${info[i].baggage_claim}</th>
    <th>${info[i].status}</th>
    </tr>`;
    }
    // info.map((info) => {
    //   tableHTML += `<tr key=${info.ticket_no}>
    // <th>${info.name}</th>
    // <th>${info.passenger_id}</th>
    // <th>${info.ticket_no}</th>
    // <th>${info.departure_airport}</th>
    // <th>${info.arrival_airport}</th>
    // <th>${info.checked_bag}</th>
    // <th>${parseISOString(info.boarding_time)}</th>
    // <th>${info.boarding_gate}</th>
    // <th>${parseISOString(info.arrival_time)}</th>
    // <th>${info.arrival_gate}</th>
    // <th>${info.baggage_claim}</th>
    // <th>${info.status}</th>
    // </tr>`;
    // });
    todoTable.innerHTML = tableHTML;
    // refresh the page when inserted
    // location.reload();
    return false;
  } catch (err) {
    console.log(err.message);
  }
}
// delete a todo by id
async function deleteCustomer(id) {
  try {
    // delete a name from "http://localhost:5000/name/${id}", with "DELETE" method
    const deleteCustomer = await fetch(`http://localhost:5000/book/${id}`, {
      method: "DELETE",
    });

    // refresh the page when deleted
    location.reload();
    return false;
  } catch (err) {
    console.log(err.message);
  }
}

//modify info()modify.html
async function showinfo() {
  const bref = document.querySelector("#book_ref").value;
  //alert(bref);
  selectInfo(bref);
}

// set global variable todos
let infos = [];

// function to set customers
const setTodos = (data) => {
  infos = data;
};

// function to display customers
const displayTodos = () => {
  const infoTable = document.querySelector("#info-table");

  // display all customers by modifying the HTML in "todo-table"
  let tableHTML = "";
  infos.map((passengers) => {
    tableHTML += `<tr key=${passengers.passenger_id}>
    <th>${passengers.passenger_id}</th>
    <th>${passengers.passenger_name}</th>
    <th>${passengers.email}</th>
    <th>${passengers.phone}</th>
    <th>${passengers.age}</th>
    <th><button class="btn btn-warning" type="button" data-toggle="modal" data-target="#edit-modal" onclick="editTodo(${passengers.passenger_id})">Edit</button></th>
    <th><button class="btn btn-danger" type="button" onclick="deleteTodo(${passengers.passenger_id})">Delete</button></th>
    </tr>`;
  });
  infoTable.innerHTML = tableHTML;
};
async function selectInfo(bref) {
  // use try... catch... to catch error
  try {
    const body = { bref: bref };
    const response = await fetch("http://localhost:5000/modify", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    var elem = document.getElementById("showinfo");
    elem.insertAdjacentHTML(
      "afterend",
      "<div id = showBR> Booking Reference: " + bref + " </div>"
    );
    const jsonData = await response.json();
    // alert(jsonData[0].passenger_name);

    setTodos(jsonData);
    displayTodos();
  } catch (err) {
    console.log(err.message);
  }
}
