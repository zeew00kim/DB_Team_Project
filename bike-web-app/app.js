// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const app = express();
// const port = 5500;

// app.use(cors());

// const connection = mysql.createConnection({
//     host: 'localhost',      
//     user: 'root',           
//     password: 'root', 
//     database: 'madangdb'
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Database connection failed: ' + err.stack);
//         return;
//     }
//     console.log('Connected to database.');
// });

// app.get('/bikes', (req, res) => {
//     const query = 'SELECT * FROM Bike';``
//     connection.query(query, (error, results) => {
//         if (error) {
//             return res.status(500).send(error);
//         }
//         res.json(results);
//     });
// });

// app.get('/bikeTypes', (req, res) => {
//     const query = 'SELECT * FROM BikeType';
//     connection.query(query, (error, results) => {
//         if (error) {
//             return res.status(500).send(error);
//         }
//         res.json(results);
//     });
// });

// app.get('/bikeSubTypes', (req, res) => {
//     const query = 'SELECT * FROM BikeSubType';
//     connection.query(query, (error, results) => {
//         if (error) {
//             return res.status(500).send(error);
//         }
//         res.json(results);
//     });
// });

// app.get('/brands', (req, res) => {
//     const query = 'SELECT * FROM Brand';
//     connection.query(query, (error, results) => {
//         if (error) {
//             return res.status(500).send(error);
//         }
//         res.json(results);
//     });
// });

// app.get('/materials', (req, res) => {
//     const query = 'SELECT * FROM Material';
//     connection.query(query, (error, results) => {
//         if (error) {
//             return res.status(500).send(error);
//         }
//         res.json(results);
//     });
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
