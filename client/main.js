// set global variable todos
let tickett = [];

// function to set todos
const setReserve = (data) => {
  tickett = data;
};

tax = 0.08; //8% tax
/******************************************************************* */

let flights = [];

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
        x.stop1_airport = "N/A";
      }
      if (!x.stop2_airport) {
        x.stop2_airport = "N/A";
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
    <th>${tickett.amount_wotax * (1 + tax)}</th>
    
 
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

// insert a new todo
async function insertCustomer() {
  // read the todo description from input
  const fid = document.querySelector("#flightID").value;
  const name = document.querySelector("#name").value;
  const pho = document.querySelector("#phone").value;
  const em = document.querySelector("#email").value;
  const bg = document.querySelector("#bags").value;
  const mv = document.querySelector("#movie").value;
  const ml = document.querySelector("#meal").value;
  const ag = document.querySelector("#age").value;

  price = 1000;
  dicount = "False";

  if (ag < 18 || ag > 56) {
    dicount = "True";
    price = price * 0.8; //20% off
  }

  //flight_id,movie,meal,name,checked_bag,amount_woTax,discount,phone,emal
  st =
    fid +
    "," +
    mv +
    "," +
    ml +
    "," +
    name +
    "," +
    bg +
    "," +
    price.toString() +
    "," +
    dicount +
    "," +
    pho +
    "," +
    em;

  //alert(st);

  // use try... catch... to catch error
  try {
    // insert new name to "http://localhost:5000/book", with "POST" method
    const body = { st: st };
    const response = await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // refresh the page when inserted
    location.reload();
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
