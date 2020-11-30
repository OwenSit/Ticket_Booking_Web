const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES

//
app.post("/book", async (req, res) => {
  try {
    const { st } = req.body;
    console.log(st);
    info = st.split(",");

    const newReserve = await pool.query(
      `INSERT INTO tickett (flight_id, movie, meal, name, checked_bag, amount_woTax, discount, phone, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        info[0],
        info[1],
        info[2],
        info[3],
        info[4],
        info[5],
        info[6],
        info[7],
        info[8],
      ]
    );

    res.json(newReserve);
  } catch (err) {
    console.log(err.message);
  }
});

/****************************************************************** */
// flight info:
app.get("/", async (req, res) => {
  try {
    const flightInfo = await pool.query(`SELECT * FROM flights`);
    res.json(flightInfo.rows);
  } catch (err) {
    console.log(err.message);
  }
});
/********************************************************************* */
//get all todo
app.get("/book", async (req, res) => {
  try {
    const allReserve = await pool.query(`SELECT * FROM tickett`);
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
      `SELECT * FROM tickett 
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
      `UPDATE tickett SET name = $1 
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
      `DELETE FROM tickett 
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
