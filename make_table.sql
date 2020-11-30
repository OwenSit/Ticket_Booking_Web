DROP TABLE IF EXISTS seats CASCADE;

DROP TABLE IF EXISTS airport CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE;

DROP TABLE IF EXISTS flights CASCADE;

DROP TABLE IF EXISTS customer CASCADE;

DROP TABLE IF EXISTS book CASCADE;

DROP TABLE IF EXISTS ticket CASCADE;

DROP TABLE IF EXISTS ticket_flights CASCADE;

DROP TABLE IF EXISTS boarding_passes CASCADE;

DROP TABLE IF EXISTS test CASCADE;

DROP TABLE IF EXISTS airport CASCADE;

DROP TABLE IF EXISTS boarding_passes CASCADE;

DROP TABLE IF EXISTS seats CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE;

DROP TABLE IF EXISTS ticket CASCADE;

DROP TABLE IF EXISTS ticket_flights CASCADE;

DROP TABLE IF EXISTS bookings CASCADE;

DROP TABLE IF EXISTS flights CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE;

CREATE TABLE "book" (
    "book_ref" SERIAL,
    "book_date" timestamp WITH time zone,
    "travelling_type" varchar(10),
    PRIMARY KEY ("book_ref")
);

CREATE TABLE "airport" (
    "airport_code" char(3),
    "airport_name" char(40),
    "city" char(20),
    PRIMARY KEY ("airport_code")
);

CREATE TABLE "flights" (
    "flight_id" SERIAL,
    "scheduled_departure" timestamp WITH time zone,
    "scheduled_arrival" timestamp WITH time zone,
    "departure_airport" character(3),
    "stop1_airport" character(3),
    "stop2_airport" character(3),
    "arrival_airport" character(3),
    "status" character varying(20),
    "aircraft_model" char(25),
    "seats_available" integer,
    "seats_booked" integer,
    PRIMARY KEY ("flight_id"),
    FOREIGN KEY ("departure_airport") REFERENCES "airport"("airport_code") ON DELETE CASCADE,
    FOREIGN KEY ("stop2_airport") REFERENCES "airport"("airport_code") ON DELETE CASCADE,
    FOREIGN KEY ("stop1_airport") REFERENCES "airport"("airport_code") ON DELETE CASCADE,
    FOREIGN KEY ("arrival_airport") REFERENCES "airport"("airport_code") ON DELETE CASCADE
);

CREATE TABLE "ticket" (
    "ticket_no" SERIAL,
    "flight_id" integer,
    "book_ref" integer,
    "movie" boolean,
    "meal" boolean,
    "name" char(50),
    "checked_bag" integer,
    "amount_woTax" numeric(10, 2),
    "discount" boolean,
    PRIMARY KEY ("ticket_no"),
    FOREIGN KEY ("book_ref") REFERENCES "book"("book_ref") ON DELETE CASCADE,
    FOREIGN KEY ("flight_id") REFERENCES "flights"("flight_id") ON DELETE CASCADE
);

CREATE TABLE "boarding_passes" (
    "ticket_no" integer,
    "flight_id" integer,
    "boarding_no" SERIAL,
    "seat_no" SERIAL,
    "boarding_time" timestamp WITH time zone,
    "boarding_gate" integer,
    "waitlist" integer,
    "arrivial_time" timestamp WITH time zone,
    "attivial_gate" integer,
    PRIMARY KEY ("ticket_no", "flight_id"),
    FOREIGN KEY ("ticket_no") REFERENCES "ticket"("ticket_no") ON DELETE CASCADE,
    FOREIGN KEY ("flight_id") REFERENCES "flights"("flight_id") ON DELETE CASCADE
);

CREATE TABLE "customer" (
    "customer_id" integer,
    "customer_name" varchar(20),
    "phone" char(15),
    "email" char(50),
    "book_ref" integer,
    PRIMARY KEY ("customer_id"),
    FOREIGN KEY ("book_ref") REFERENCES "book"("book_ref") ON DELETE CASCADE
);

INSERT INTO
    airport
VALUES
    (
        'HOU',
        'George Bush Airport',
        'Houston'
    );

INSERT INTO
    airport
VALUES
    (
        'JFK',
        'John F Kennedy Airport',
        'New York'
    );

INSERT INTO
    airport
VALUES
    (
        'LAX',
        'Los Angeles Airport',
        'Los Angeles'
    );

INSERT INTO
    airport
VALUES
    ('ORD', 'O Hare Airport', 'Chicago');

INSERT INTO
    airport
VALUES
    ('MIA', 'Miami Airport', 'Miami');