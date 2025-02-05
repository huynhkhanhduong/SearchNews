const express = require('express');
const mysql = require('mysql2'); 
const app = express();


const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: '123456', 
    database: 'mydb' 
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});


app.set('view engine', 'ejs');
app.set('views', './views'); 


app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    connection.query('SELECT * FROM tintuc', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Lỗi truy vấn cơ sở dữ liệu.');
        }
        console.log("LOGGGGGGGGGGGGGG:", results)
        res.render('index', { results: results });
    });
});


app.post('/search', (req, res) => {
    const title = req.body.title;
    console.log('Searching for:', title);  

    const startTime = Date.now(); 

    const query = 'SELECT * FROM tintuc WHERE title LIKE ?';
    connection.query(query, [`%${title}%`], (err, results) => {
        const endTime = Date.now(); 
        const searchTime = endTime - startTime; 
        if (err) {
            console.error(err);
            return res.status(500).send('Lỗi truy vấn cơ sở dữ liệu.'); 
        }

        res.render('index', { results, searchTime });
    });
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
