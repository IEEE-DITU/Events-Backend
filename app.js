const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const clubRoute = require('./routes/clubRoute'); // Import the club routes
const eventRoute = require('./routes/eventRoute');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use('/auth', authRoute);
app.use('/clubs', clubRoute); // Use the club routes
app.use('/event', eventRoute);

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});

