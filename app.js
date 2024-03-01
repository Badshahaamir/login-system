const express=require("express")
const mysql=require("mysql")

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'form'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.use(express.json());

app.post('/api/users', (req, res) => {
  const { username, email, number } = req.body;
  
  if (!username || !email || !number) {
    return res.status(400).send("Username, email, and number are required");
  }

  connection.query('SELECT * FROM userlogin WHERE username = ?', [username], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      return res.status(400).send("Username already exists");
    }

    connection.query('SELECT * FROM userlogin WHERE email = ?', [email], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        return res.status(400).send("Email already exists");
      }

      connection.query('SELECT * FROM userlogin WHERE number = ?', [number], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          return res.status(400).send("Number already exists");
        }

        connection.query('INSERT INTO userlogin (username, email, number) VALUES (?, ?, ?)', [username, email, number], (err, results) => {
          if (err) throw err;
          res.status(201).send('User added successfully');
        });
      });
    });
  });
});

app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM userlogin', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('SELECT * FROM userlogin WHERE id = ?', [userId], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.json(results[0]);
    }
  });
});

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, number } = req.body;
  connection.query('UPDATE userlogin SET username = ?, email = ?, number=? WHERE id = ?', [username, email, number, userId], (err, results) => {
    if (err) throw err;
    if (results.affectedRows === 0) {
      res.status(404).send('User not found');
    } else {
      res.send('User updated successfully');
    }
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('DELETE FROM userlogin WHERE id = ?', [userId], (err, results) => {
    if (err) throw err;
    if (results.affectedRows === 0) {
      res.status(404).send('User not found');
    } else {
      res.send('User deleted successfully');
    }
  });
});

app.listen(3000,()=>{
    console.log("Server is running at port 3000...");
})