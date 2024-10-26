const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5500;

// CORS 설정 (클라이언트에서 API 호출이 가능하도록)
app.use(cors());

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',      // 데이터베이스 서버 호스트
    user: 'root',           // 데이터베이스 사용자 이름
    password: 'root', // 데이터베이스 비밀번호
    database: 'madangdb' // 데이터베이스 이름
});

// 데이터베이스 연결
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 자전거 데이터를 가져오는 API 엔드포인트
app.get('/bikes', (req, res) => {
    const query = 'SELECT * FROM Bike';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// BikeType 테이블 데이터 가져오기
app.get('/bikeTypes', (req, res) => {
    const query = 'SELECT * FROM BikeType';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// BikeSubType 테이블 데이터 가져오기
app.get('/bikeSubTypes', (req, res) => {
    const query = 'SELECT * FROM BikeSubType';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// Brand 테이블 데이터 가져오기
app.get('/brands', (req, res) => {
    const query = 'SELECT * FROM Brand';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// Material 테이블 데이터 가져오기
app.get('/materials', (req, res) => {
    const query = 'SELECT * FROM Material';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
