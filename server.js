// Packages
const express = require('express');
const app = express();
const port = 1100;
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const crypto = require('crypto');
const bodyParser = require('body-parser');

// Body Parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Connection to database
const con = mysql.createConnection({
    host: "193.190.238.37", // Database URL
    user: "1920PROGESS076", // User to login with
    password: "21489756", // Password to DB
    database: "1920PROGESS076", // Database name
    multipleStatements: true
});

// Access to folders
app.use('/css/', express.static(path.join(__dirname, '/../css/'))); // CSS
app.use('/fonts/', express.static(path.join(__dirname, '/../fonts/'))); // Fonts
app.use('/image/', express.static(path.join(__dirname, '/../image/'))); // Image
app.use('/js/', express.static(path.join(__dirname, '/../js/'))); // JS

// Pages on website
app.get('/deliveries', (req, res) => {
    res.sendFile(path.join(__dirname + 'Deliveries.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + 'home.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + 'home.html'));
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + 'login.html'));
});


// Pages to return certain response:

    // Execute query
    // SELECT playerId, name FROM Player WHERE name LIKE '%a%';
    con.query(`SELECT playerId, name FROM Gebruiker WHERE lower(name) LIKE ? LIMIT 0,5;`, ['%' + term + '%'], function (err, result, fields) {
        if (err) throw err;

        // Send data back
        res.send(result);
    });




// Function to return all Players, sorted
app.get("/getSortedPlayers", (req, res) => {
    const q = req.query.q;
    con.query("SELECT * FROM Gebruiker ORDER BY " + q + " DESC", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
});


// Function to register a user
app.post('/registerUser', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username.trim() == '' || password.trim() == '') {
        res.send('invalid');
        res.end();
        return;
    }

    // Check if username exists
    con.query('SELECT name FROM Gebruiker WHERE name=?;', [username], (err, result, fields) => {
        if(err) throw err;
        if (result.length > 0) { // Username already used
            res.send('user_exists');
            res.end();
            return;
        } else { // Username not used
            // Hash password
            password = crypto.createHash('md5').update(password).digest('hex');

            // Add Player
            con.query('INSERT INTO Gebruiker (name, password, account_created) VALUES(?, ?, ?);', [username, password, new Date().toISOString().substring(0, 10)], (err, result, fields) => {
                // Finished
                res.send('user_added');
                res.end();
                return;
            });
        }
    });

});


// Function to get all information about a Player
app.get('/getcompleteplayer', (req, res) => {
    const term = req.query.playerId;

    let sql = `SELECT * FROM Gebruiker WHERE klantennummer=${term};
    `;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;

        // Send data back
        res.send(result);
    });
});


// Function for login/authentication
app.post('/auth', (req, res) => {
    let uname = req.body.uname;
    let psw = req.body.psw;
    let hashedP = crypto.createHash('md5').update(psw).digest('hex');   // Hash password

    // If username and password set
    if (uname && hashedP) {
        con.query('SELECT * FROM Gebruiker WHERE naam = ? AND paswoord = ?', [uname, hashedP], function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0) res.send(String(results[0].playerId));
            else res.send('-1');
            res.end();
        });
    } else {
        res.send('-2');
        res.end();
    }
});


// Enable server
app.listen(port, () => console.log(`MY App listening on port ${port}!`));