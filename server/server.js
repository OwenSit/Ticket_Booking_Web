const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
var crypto = require("crypto");

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
    var book_ref = randomValueHex(6);
    const exist = await pool.query(
      "SELECT book_ref FROM bookings where book_ref=$1",
      [book_ref]
    );

    //make sure the book_ref is not repeating:
    // finish generate book_ref:
    while (exist.rows[0] == true) {
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

    // create a book_ref entry:

    // const book_ref = await pool.query()

    // const newReserve = await pool.query(
    //   `INSERT INTO ticket (flight_id, movie, meal, name, checked_bag, amount_wotax, discount, phone, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    //   [
    //     info[0],
    //     info[1],
    //     info[2],
    //     info[3],
    //     info[4],
    //     info[5],
    //     info[6],
    //     info[7],
    //     info[8],
    //   ]
    // );
    // // update the seatnumber attribute:
    // await pool.query(
    //   "UPDATE flights SET seats_available = seats_available-1, seats_booked = seats_booked+1 WHERE flight_id=$1",
    //   [st[0]]
    // );
    // const departTime = await pool.query(
    //   "SELECT scheduled_departure FROM flights WHERE flight_id=$1",
    //   [st[0]]
    // );
    // const arrivalTime = await pool.query(
    //   "SELECT scheduled_arrival FROM flights WHERE flight_id=$1",
    //   [st[0]]
    // );
    // const ticketNO = newReserve.rows.ticket_no;
    // const flightID = st[0];

    // //insert new entry into boarding_passes:

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
    console.log(typeof flightInfo.rows[0].scheduled_departure);
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
