# hw4
 DBhw4 Web-app

Group number: MPA09A

Run the program:
1. Please run the server by command 'node server.js' in repository 'server'
2. Please run client.html using live server 
3. To go modify.html(checking or modify ticket) from client.html, Press 'CUSTOMER & CLERK Check & Edit your Booking Info'
4. To go client.html(booking ticket) from modify.html, Press 'Booking new ticket' 


Reservation:
1. Select your flight Plan - OneWay, RoundTrip, or MultipleFlight
   -[OneWay] : only one flight ID required
   -[RoundTrip] : Two flight ID required
   -[MultipleFlight] : one to as many as flight you wish to book (Press Increase Flight to add flight, Press Decrese Flight to drop a flight)
2. Type 4 digits flight ID corresponding to flight schedule appear above
3. Type 16 digits Credit Card infomation 
4. Type fisrt passenger's Name, Phon number(integer), email(required '@' and '.'), and age(integer).
5. Select number of bags, movie and meal option 
6. Add members flying with if desire to, follow instruction 4-5
7. Once double check all infomation filled, press 'Book Ticket'
8. Your booking information will appear, REMEMBER to keep your Booking Reference


Modify:
1. Type your Booking Reference(6 digits) in txt box
2. Press 'Show my booking info' and your booking info appear
    -[Edit]: You are allowed to edit Name, phone, email, and age
    1. Press 'Edit' of the person you wish to make change
    2. Change the info mation and Press 'Save Changes'
    3. Type your Booking reference again and you'll see the changes made
    -[Delete]:
    1. Press 'Delete' of the person you wich to delete
    2. Type your Booking reference again and you'll see the changes made
    -[CheckIn]:
    1. Press 'Check In' of the person you wich to Check in
    2. Type your Booking reference again and you'll see the changes made

Refresh Data Base:
You can refresh the database by press 'Refresh DB'
All the booking info will be deleted

Logout:
You can refresh the page by pressing 'Log Out'
