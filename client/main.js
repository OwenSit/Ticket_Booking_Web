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

async function refreshDB() {
  try {
    // GET all todos from "http://localhost:5000/todos"
    const response = await fetch("http://localhost:5000/refreshDB");
    const jsonData = await response.json();

    alert(jsonData);
    location.reload();
  } catch (err) {
    console.log(err.message);
  }
}

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
      <th>${flights.arrival_airport}</th>
      <th>${flights.seats_available}</th>
      <th>${flights.status}</th>
      
      </tr>`;
  });
  todoTable.innerHTML = tableHTML;
};
//lines remove from above
//<th>${flights.stop1_airport}</th>
//<th>${flights.stop2_airport}</th>
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

let fPlan = 0;
/********************************************************************/
//Allow user to select one way, round trip or multiple flights
window.addEventListener("DOMContentLoaded", function () {
  // チェックボックスを全て取得
  var input_flightNum = document.querySelectorAll("input[name=tripPlan]");
  //alert(input_flightNum.length);
  //fPlan = input_flightNum.length;
  if (0 < input_flightNum.length) {
    for (var checkbox of input_flightNum) {
      //alert("checked is "+checkbox.value);
      checkbox.addEventListener("change", function () {
        //alert("Change action");
        if (this.checked) {
          //alert(this.value);
          fPlan = this.value;

          //delete flightid_1 and flightid_2
          //alert("fPlan:"+fPlan);
          for (let i = 0; i <= fPlan; i++) {
            deletefid_ifExist("flightID_" + i.toString());
          }
          deletefid_ifExist("addFid");
          deletefid_ifExist("deleteFid");

          if (fPlan == 1) {
            addInput_of("flightID", 0, "addflight");
          } else if (fPlan == 2) {
            addInput_of("flightID", 0, "addflight");
            addInput_of("flightID", 1, "addflight");
          } else if (fPlan == 3) {
            addInput_of("flightID", 0, "addflight");
            addInput_of("flightID", 1, "addflight");
            addInput_of("flightID", 2, "addflight");
            //<button class="btn btn-warning" type="button" data-toggle="modal" data-target="#edit-modal" onclick="editTodo(${passengers.passenger_id})">Edit</button>
            //create button of "increase # of flights"
            var increaseF = document.createElement("input");
            increaseF.type = "button";
            increaseF.id = "addFid";
            increaseF.classList.add = "addition";
            increaseF.value = "Increse flight";
            increaseF.addEventListener("click", increaseFlight, false);
            var parent = document.getElementById("incdec");
            parent.appendChild(increaseF);
            //create button of "decrese # of flights"
            var decreaseF = document.createElement("input");
            decreaseF.type = "button";
            decreaseF.id = "deleteFid";
            decreaseF.classList.add = "addition";
            decreaseF.value = "Decrease flight";
            decreaseF.addEventListener("click", decreaseFlight, false);
            var parent = document.getElementById("incdec");
            parent.appendChild(decreaseF);
          }
        }
      });
    }
  }
});

async function increaseFlight() {
  addInput_of("flightID", fPlan, "addflight");
  fPlan++;
  //alert("fPlan is "+fPlan);
}
async function decreaseFlight() {
  if (fPlan <= 1) {
    alert("Error: Cant make this action");
    return;
  }
  fPlan = fPlan - 1;
  deletefid_ifExist("flightID_" + fPlan.toString());
  //alert("fPlan is "+fPlan);
}

async function deletefid_ifExist(id_name) {
  if (document.getElementById(id_name) != null) {
    var list_element = document.getElementById(id_name);
    list_element.remove();
  }
}

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
// selectReserve();

// // The following are async function to select, insert, update and delete todos
// // select all the todos
// async function selectReserve() {
//   // use try... catch... to catch error
//   try {
//     // GET all todos from "http://localhost:5000/todos"
//     const response = await fetch("http://localhost:5000/book");
//     const jsonData = await response.json();

//     setReserve(jsonData);
//     displayReserve();
//   } catch (err) {
//     console.log(err.message);
//   }
// }
function addInput_of(input_type, i, id_name) {
  var input_data = document.createElement("input");
  input_data.type = "text";
  input_data.class = "form-control";
  input_data.id = input_type + "_" + i;
  input_data.placeholder = input_type.toUpperCase() + "-" + i;
  var parent = document.getElementById(id_name);
  parent.appendChild(input_data);

  var h1 = document.getElementById(input_data.id);
  h1.style.border = "solid 2px skyblue";
  h1.style.padding = "10px";
  h1.style.width = "100%";

  return input_data.id;
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
  h1.style.backgroundColor = "rgb(94, 255, 234)";

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
  addInput_of("name", inputnum, "input-reserve");
  addInput_of("phone", inputnum, "input-reserve");
  addInput_of("email", inputnum, "input-reserve");
  addInput_of("age", inputnum, "input-reserve");

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

function isInt(str) {
  return !isNaN(str) && Number.isInteger(parseFloat(str));
}

async function addcustomer() {
  let book_info = [];
  //alert("inputnum is " + inputnum);
  for (let i = 0; i < fPlan; i++) {
    //boolet proof the 4 digit of fid
    const fid = document.querySelector("#flightID_" + i).value;
    if (fid.length != 4) {
      alert("[Flight " + i.toString() + "],Please fill 4 digit");
      return;
    }
  }
  for (let index_flight = 0; index_flight < fPlan; index_flight++) {
    for (let i = 0; i < inputnum; i++) {
      let price = 1000;
      var discount = false;
      const fid = document.querySelector("#flightID_" + index_flight).value;
      const card_no = document.querySelector("#card_no").value;
      const name = document.querySelector("#name_" + i).value;
      const pho = document.querySelector("#phone_" + i).value;
      const em = document.querySelector("#email_" + i).value;
      var bg = document.querySelector("#bag_" + i).value;
      var mv = document.querySelector("#movie_" + i).value;
      var ml = document.querySelector("#meal_" + i).value;
      const ag = document.querySelector("#age_" + i).value;
      //alert("index_flight: "+index_flight+" fid:"+ fid+" name: "+name);

      if (card_no.length != 16) {
        alert(
          "[Client " + i.toString() + "],  'Credit Card must be 16 digits'"
        );
        return;
      }
      if (
        fid == "" ||
        card_no == "" ||
        name == "" ||
        pho == "" ||
        em == "" ||
        ag == ""
      ) {
        alert("[Client " + i.toString() + "],  'Please Dont leave any blank'");
        return;
      }
      if (
        isInt(fid) == false ||
        isInt(card_no) == false ||
        isInt(pho) == false ||
        isInt(ag) == false
      ) {
        alert(
          "[Client " +
            i.toString() +
            "],  'Card Number, Flight Id, or Age is not a number'"
        );
        return;
      }
      if (em.indexOf("@") == -1 || em.indexOf(".") == -1) {
        alert(
          "[Client " +
            i.toString() +
            "],  'Type collect Email that inclue '@' and '.''"
        );
        return;
      }
      if (ag < 18 || ag > 56) {
        discount = true;
        price = price * 0.8; //20% off
      }
      if (mv == "Y") {
        price = price + 10;
      }
      if (ml == "Y") {
        price = price + 20;
      }
      price = price + 50 * Number(bg);

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
        party: inputnum,
      };
      // console.log(myDict);
      book_info.push(myDict);
    }
  }
  try {
    // insert new name to "http://localhost:5000/book", with "POST" method
    const body = book_info;
    //const flight_num = fPlan;
    console.log(body);
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

    // display all info and flight by modifying the HTML
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
    var h1 = document.getElementById("bref");
    h1.style.border = "solid 2px red";
    h1.style.padding = "10px";
    h1.style.width = "100%";
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

async function updateTodo(id) {
  const des = infos.filter((infos) => infos.passenger_id === id);
  const name = document.querySelector("#edited-description-name").value;
  const email = document.querySelector("#edited-description-email").value;
  const phone = document.querySelector("#edited-description-phone").value;
  const age = document.querySelector("#edited-description-age").value;
  // check if there is any empty value:
  if ((name == "") | (email == "") | (phone == "") | (age == "")) {
    alert("Oops, no empty box is allowed :)");
  } else {
    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(age);
    let passenger_id = des[0].passenger_id;
    try {
      // update a todo from "http://localhost:5000/todos/${id}", with "PUT" method
      const body = {
        passenger_id: passenger_id,
        passenger_name: name,
        email: email,
        phone: phone,
        age: age,
      };
      console.log(body);
      const response = await fetch(`http://localhost:5000/modify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // refresh the page when updated
      location.reload();
      console.log("hi");
      return false;
    } catch (err) {
      console.log(err.message);
    }
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

const editTodo = (id) => {
  const descrip = infos.filter((infos) => infos.passenger_id === id);
  document.querySelector("#edited-description-name").value =
    descrip[0].passenger_name;
  document.querySelector("#edited-description-email").value = descrip[0].email;
  document.querySelector("#edited-description-phone").value = descrip[0].phone;
  document.querySelector("#edited-description-age").value = descrip[0].age;
  document
    .querySelector("#save-edit-description")
    .addEventListener("click", function () {
      updateTodo(id);
    });
};

async function deleteTodo(id) {
  const descrip = infos.filter((infos) => infos.passenger_id === id);
  console.log(descrip);
  let ticket_no = descrip[0].ticket_no;
  try {
    // delete a todo from "http://localhost:5000/todos/${id}", with "DELETE" method
    const body = {
      ticket_no: ticket_no,
    };
    // console.log(body);
    const deleteTodo = await fetch(`http://localhost:5000/modify`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const jsonData = await deleteTodo.json();
    alert(jsonData);
    // refresh the page when deleted
    location.reload();
    return false;
  } catch (err) {
    console.log(err.message);
  }
}

// function to display customers
const displayTodos = () => {
  const infoTable = document.querySelector("#info-table");
  // display all customers by modifying the HTML in "todo-table"
  let tableHTML = "";
  infos.map((passengers) => {
    tableHTML += `<tr key=${passengers.passenger_id}>
    <th>${passengers.passenger_name}</th>
    <th>${passengers.passenger_id}</th>
    <th>${passengers.flight_id}</th>
    <th>${passengers.status}</th>
    <th>${passengers.ticket_no}</th>
    <th>${passengers.email}</th>
    <th>${passengers.phone}</th>
    <th>${passengers.age}</th>
    <th><button class="btn btn-warning" type="button" data-toggle="modal" data-target="#edit-modal" onclick="editTodo('${passengers.passenger_id}')">Edit</button></th>
    <th><button class="btn btn-danger" type="button" onclick="deleteTodo('${passengers.passenger_id}')">Delete</button></th>
    <th><button class="btn btn-success" type="button" onclick="deleteTodo('${passengers.passenger_id}')">Check In</button></th>
    </tr>`;
  });
  // console.log(passengers);
  infoTable.innerHTML = tableHTML;
};
async function selectInfo(bref) {
  // use try... catch... to catch error
  deletefid_ifExist("showBR"); //delete the previous id that showBR if it exists
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
    //adjsut looks by css dynamically
    var h1 = document.getElementById("showBR");
    h1.style.border = "solid 2px red";
    h1.style.padding = "10px";
    h1.style.width = "100%";
    const jsonData = await response.json();
    // alert(jsonData[0].passenger_name);
    setTodos(jsonData);
    // console.log(infos);
    displayTodos();
  } catch (err) {
    console.log(err.message);
  }
}
