const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
var crypto = require("crypto");
var fs = require("fs");

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function makeLetter(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeNumber(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeSeatID() {
  let number = makeNumber(2);
  let letter = makeLetter(1);
  return letter.concat(number);
}
function makeGateID() {
  let number = makeNumber(2);
  let letter = makeLetter(1);
  return letter.concat(number);
}

//function code taken from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
function randomValueHex(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, len)
    .toUpperCase(); // return required number of characters
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
// middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES
app.get("/refreshDB", async (req, res) => {
  try {
    var sql = fs.readFileSync("make_table.sql").toString();
    const comitRefresh = await pool.query(sql);
    //console.log(sql);
    res.json("refresh successfully!");
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/book", async (req, res) => {
  try {
    // mega-list for response
    var Res = [];

    // STEP ONE: generate a new entry in the bookings table:
    const book_info = req.body;
    // console.log(book_info);
    var pass_ids = [];
    var first_passengerID = "";
    // var flight_id = book_info[0].flight_id;
    var book_ref = randomValueHex(6);
    var boarding_gate = makeGateID();
    let EXist = await pool.query(
      "SELECT boarding_gate FROM boarding_info where boarding_gate=$1",
      [boarding_gate]
    );
    while ((await EXist.rows[0]) != null) {
      console.log("Oops, same boarding_gate number has been generated");
      boarding_gate = makeGateID();
      EXist = await pool.query(
        "SELECT boarding_gate FROM boarding_info where boarding_gate=$1",
        [boarding_gate]
      );
    }
    var arrival_gate = makeGateID();
    EXist = await pool.query(
      "SELECT arrival_gate FROM arrival_info where arrival_gate=$1",
      [arrival_gate]
    );
    while ((await EXist.rows[0]) != null) {
      console.log("Oops, same arrival_gate number has been generated");
      arrival_gate = makeGateID();
      EXist = await pool.query(
        "SELECT arrival_gate FROM arrival_info where arrival_gate=$1",
        [arrival_gate]
      );
    }
    var baggage_claim = makeGateID();
    EXist = await pool.query(
      "SELECT baggage_claim FROM arrival_info where baggage_claim=$1",
      [baggage_claim]
    );
    while ((await EXist.rows[0]) != null) {
      console.log("Oops, same baggage_claim number has been generated");
      baggage_claim = makeGateID();
      EXist = await pool.query(
        "SELECT baggage_claim FROM arrival_info where baggage_claim=$1",
        [baggage_claim]
      );
    }
    let exist = await pool.query(
      "SELECT book_ref FROM bookings where book_ref=$1",
      [book_ref]
    );

    //make sure the book_ref is not repeating:
    // finish generate book_ref:
    while (exist.rows[0] != null) {
      console.log("Oops, same book_ref has been generated");
      book_ref = randomValueHex(6);
      exist = await pool.query(
        "SELECT book_ref FROM bookings where book_ref=$1",
        [book_ref]
      );
    }

    // now calculate the total amount:
    var total_amount = 0;
    for (i = 0; i < book_info.length; i++) {
      total_amount += book_info[i].amount;
    }
    // insert the info to the bookings table:
    await pool.query(
      "INSERT INTO bookings (book_ref, book_date, total_amount) VALUES ($1,now(),$2)",
      [book_ref, total_amount]
    );

    // STEP TWO: create passenger entries for everybody in the passengers table:
    for (i = 0; i < book_info.length; i++) {
      var flight_id = book_info[i].flight_id;
      var myDict = {};
      var passenger_id = randomValueHex(20);

      let EXIst = await pool.query(
        "SELECT passenger_id FROM passengers where passenger_id=$1",
        [passenger_id]
      );

      //make sure the book_ref is not repeating:
      // finish generate book_ref:
      while (EXIst.rows[0] != null) {
        console.log("Oops, same passenger_id has been generated");
        passenger_id = randomValueHex(20);
        EXIst = await pool.query(
          "SELECT passenger_id FROM passengers where passenger_id=$1",
          [passenger_id]
        );
      }
      if (i == 0) {
        first_passengerID = passenger_id;
      }
      let passenger_name = await book_info[i].name;
      let email = await book_info[i].email;
      let phone = await book_info[i].phone;
      let age = await book_info[i].age;

      if (i < book_info[0].party) {
        pass_ids[i] = passenger_id;
        await pool.query(
          "INSERT INTO passengers (passenger_id, book_ref, passenger_name, email, phone, age) VALUES($1,$2,$3,$4,$5,$6)",
          [passenger_id, book_ref, passenger_name, email, phone, age]
        );
      } else {
        num = i;
        while (num >= book_info[0].party) {
          num = num - book_info[0].party;
        }
        passenger_id = pass_ids[num];
      }

      // inserting into tickets table:
      var ticket_no = randomValueHex(13);
      var seat_no = "";
      let Exist = await pool.query(
        "SELECT ticket_no FROM tickets where ticket_no=$1",
        [ticket_no]
      );
      while (Exist.rows[0] != null) {
        console.log("Oops, same ticket_no has been generated");
        ticket_no = randomValueHex(13);
        Exist = await pool.query(
          "SELECT ticket_no FROM tickets where ticket_no=$1",
          [ticket_no]
        );
      }
      await pool.query(
        "INSERT INTO tickets (ticket_no, book_ref, passenger_id) VALUES ($1,$2,$3)",
        [ticket_no, book_ref, passenger_id]
      );
      seat_no = makeSeatID();
      // console.log(book_info[i]);
      let movie = await book_info[i].movie;
      let meal = await book_info[i].meal;
      let EXIST = await pool.query(
        "SELECT seat_no FROM seats where seat_no=$1",
        [seat_no]
      );
      while (EXIST.rows[0] != null) {
        console.log("Oops, same seat_no has been generated");
        seat_no = makeSeatID();
        EXIST = await pool.query("SELECT seat_no FROM seats where seat_no=$1", [
          seat_no,
        ]);
      }
      await pool.query(
        "INSERT INTO seats (seat_no, flight_id, passenger_id, fare_conditions, movie, meal) VALUES($1,$2,$3,$4,$5,$6)",
        [seat_no, flight_id, passenger_id, "Economy", movie, meal]
      );

      // create ticket_flights entries:
      let amount = await book_info[i].amount;
      await pool.query(
        "INSERT INTO ticket_flights (ticket_no, flight_id, fare_conditions, amount) VALUES($1, $2, $3, $4)",
        [ticket_no, flight_id, "Economy", amount]
      );
      // create boarding_info entries:
      let checked_bag = await book_info[i].checked_bag;

      let scheduled_departure = await pool.query(
        "SELECT scheduled_departure FROM flights WHERE flight_id=$1",
        [flight_id]
      );
      scheduled_departure = scheduled_departure.rows[0].scheduled_departure;
      var date = new Date(scheduled_departure);
      date.setHours(date.getHours() - 1);
      let boarding_time = date.toISOString();
      await pool.query(
        "INSERT INTO boarding_info (ticket_no, flight_id, seat_no, checked_bag, boarding_time, boarding_gate) VALUES ($1,$2,$3,$4,$5,$6)",
        [
          ticket_no,
          flight_id,
          seat_no,
          checked_bag,
          boarding_time,
          boarding_gate,
        ]
      );

      // create arrival_info entry:
      let scheduled_arrival = await pool.query(
        "SELECT scheduled_arrival FROM flights WHERE flight_id=$1",
        [flight_id]
      );
      let arrival_time = await scheduled_arrival.rows[0].scheduled_arrival;
      await pool.query(
        "INSERT INTO arrival_info (ticket_no, flight_id, arrival_time, arrival_gate, baggage_claim) VALUES ($1, $2, $3, $4, $5)",
        [ticket_no, flight_id, arrival_time, arrival_gate, baggage_claim]
      );
      // update flight table with the abailable_seats and booked_seats:
      await pool.query(
        "UPDATE flights SET seats_available=seats_available-1, seats_booked=seats_booked+1 WHERE flight_id=$1",
        [flight_id]
      );
      let fetched_airports = await pool.query(
        "SELECT departure_airport, stop1_airport, stop2_airport, arrival_airport, status FROM flights WHERE flight_id=$1",
        [flight_id]
      );
      fetched_airports = fetched_airports.rows[0];
      // finalize the response mega-list:
      myDict["name"] = passenger_name;
      myDict["book_ref"] = book_ref;
      myDict["passenger_id"] = passenger_id;
      myDict["ticket_no"] = ticket_no;
      myDict["departure_airport"] = fetched_airports.departure_airport;
      myDict["stop1_airport"] = fetched_airports.stop1_airport;
      myDict["stop2_airport"] = fetched_airports.stop2_airport;
      myDict["arrival_airport"] = fetched_airports.arrival_airport;
      myDict["status"] = fetched_airports.status;
      myDict["seat_no"] = seat_no;
      myDict["boarding_time"] = boarding_time;
      myDict["boarding_gate"] = boarding_gate;
      myDict["arrival_time"] = arrival_time;
      myDict["arrival_gate"] = arrival_gate;
      myDict["baggage_claim"] = baggage_claim;
      myDict["total_amount"] = total_amount;
      myDict["flight_id"] = flight_id;
      myDict["checked_bag"] = checked_bag;

      Res.push(myDict);
    }
    var transaction_id = randomValueHex(20);
    let exiST = await pool.query(
      "SELECT transaction_id FROM transactions where transaction_id=$1",
      [transaction_id]
    );

    //make sure the book_ref is not repeating:
    // finish generate book_ref:
    while (exiST.rows[0] != null) {
      console.log("Oops, same transaction_id has been generated");
      transaction_id = randomValueHex(20);
      exiST = await pool.query(
        "SELECT transaction_id FROM transactions where transaction_id=$1",
        [transaction_id]
      );
    }
    let card_no = book_info[0].card_no; // card number for the first cumtomer(who is paying the whole transaction :(
    let pid = first_passengerID; // passneger_id for the first customer
    await pool.query(
      "INSERT INTO transactions (transaction_id, passenger_id, card_number, total_amount) VALUES($1,$2,$3,$4)",
      [transaction_id, pid, card_no, total_amount]
    );

    // console.log(Res);
    // send the mega-list back to client:
    res.json(Res);

    // res.json(newReserve);
  } catch (err) {
    console.log(err.message);
  }
});

// flight info:
app.get("/", async (req, res) => {
  try {
    await pool.query(`SET search_path TO MPA09A`);
    const flightInfo = await pool.query(
      `SELECT * FROM flights WHERE seats_available>0 ORDER BY flight_id ASC`
    );
    res.json(flightInfo.rows);
    // console.log(typeof flightInfo.rows[0].scheduled_departure);
  } catch (err) {
    console.log(err.message);
  }
});
/********************************************************************* */
//get all todo
// app.get("/book", async (req, res) => {
//   try {
//     const allReserve = await pool.query(`SELECT * FROM ticket`);
//     res.json(allReserve.rows);
//   } catch (err) {
//     console.log(err.message);
//   }
// });

app.put("/modify", async (req, res) => {
  try {
    const { bref } = req.body;
    console.log(bref);

    const allReserve = await pool.query(
      "SELECT * FROM passengers JOIN tickets ON tickets.passenger_id=passengers.passenger_id JOIN ticket_flights ON tickets.ticket_no=ticket_flights.ticket_no JOIN flights on ticket_flights.flight_id=flights.flight_id WHERE tickets.book_ref =$1 AND tickets.deleted =FALSE ",
      [bref]
    );
    // console.log(allReserve);
    res.json(allReserve.rows);
    //res.json("halloe from server");
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/modify", async (req, res) => {
  try {
    const custoInfo = req.body;
    // console.log(custoInfo);
    let passenger_id = custoInfo.passenger_id;
    let passenger_name = custoInfo.passenger_name;
    let email = custoInfo.email;
    let phone = custoInfo.phone;
    let age = custoInfo.age;

    await pool.query(
      "UPDATE passengers SET passenger_name=$1, email=$2, phone=$3, age=$4 WHERE passenger_id=$5",
      [passenger_name, email, phone, age, passenger_id]
    );

    res.json("Succeed");
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/modify", async (req, res) => {
  try {
    const custoInfo = req.body;
    ticket_no = custoInfo.ticket_no;
    console.log(custoInfo);
    await pool.query("UPDATE tickets SET deleted=TRUE WHERE ticket_no=$1", [
      ticket_no,
    ]);
    res.json("Successfully Process Ticket " + ticket_no);
  } catch (err) {
    console.log(err.message);
  }
});

//get a todo by id
// app.get("/book/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const reserve = await pool.query(
//       `SELECT * FROM ticket
//                                    WHERE id = $1`,
//       [id]
//     );
//     res.json(reserve.rows);
//   } catch (err) {
//     console.log(err.message);
//   }
// });

//update a todo by id
// app.put("/book/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;
//     const updateReserve = await pool.query(
//       `UPDATE ticket SET name = $1
//                                          WHERE id = $2`,
//       [name, id]
//     );
//     res.json("Todo was updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//delete a todo by id
// app.delete("/book/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteReserve = await pool.query(
//       `DELETE FROM ticket
//                                          WHERE id = $1`,
//       [id]
//     );
//     res.json("Todo was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });
/****************************************************************** */

// set up the server listening at port 5000 (the port number can be changed)
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
