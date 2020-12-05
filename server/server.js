const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
var crypto = require("crypto");

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

app.post("/book", async (req, res) => {
  try {
    // STEP ONE: generate a new entry in the bookings table:
    const book_info = req.body;
    // console.log(book_info);
    var flight_id = book_info[0].flight_id;
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
    const exist = await pool.query(
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
      var passenger_id = randomValueHex(20);
      const EXIst = await pool.query(
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
      let passenger_name = await book_info[i].name;
      let email = await book_info[i].email;
      let phone = await book_info[i].phone;
      let age = await book_info[i].age;
      await pool.query(
        "INSERT INTO passengers (passenger_id, book_ref, passenger_name, email, phone, age) VALUES($1,$2,$3,$4,$5,$6)",
        [passenger_id, book_ref, passenger_name, email, phone, age]
      );

      // inserting into tickets table:
      var ticket_no = randomValueHex(13);
      var seat_no = "";
      const Exist = await pool.query(
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
      console.log(book_info[i]);
      let movie = await book_info[i].movie;
      let meal = await book_info[i].meal;
      const EXIST = await pool.query(
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
        ["1001"]
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
    }

    // res.json(newReserve);
  } catch (err) {
    console.log(err.message);
  }
});

/****************************************************************** */
// flight info:
app.get("/", async (req, res) => {
  try {
    const flightInfo = await pool.query(
      `SELECT * FROM flights ORDER BY flight_id ASC`
    );
    res.json(flightInfo.rows);
    // console.log(typeof flightInfo.rows[0].scheduled_departure);
  } catch (err) {
    console.log(err.message);
  }
});
/********************************************************************* */
//get all todo
app.get("/book", async (req, res) => {
  try {
    const allReserve = await pool.query(`SELECT * FROM ticket`);
    res.json(allReserve.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get a todo by id
app.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reserve = await pool.query(
      `SELECT * FROM ticket 
                                   WHERE id = $1`,
      [id]
    );
    res.json(reserve.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//update a todo by id
app.put("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateReserve = await pool.query(
      `UPDATE ticket SET name = $1 
                                         WHERE id = $2`,
      [name, id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo by id
app.delete("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteReserve = await pool.query(
      `DELETE FROM ticket 
                                         WHERE id = $1`,
      [id]
    );
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

// set up the server listening at port 5000 (the port number can be changed)
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
