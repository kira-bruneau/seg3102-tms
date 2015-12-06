var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('db/db.sqlite3');
var crypto = require('crypto');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Send out single page app to user');
});

/* Register User */
app.put('/user', function(req, res) {
  var params = req.body;
  var query =
        'INSERT INTO users (id, password, salt, name, email) ' +
        'VALUES ($id, $password, $salt, $name, $email)';

  var salt = crypto.randomBytes(32);
  var hashedPassword =
        crypto.createHash('sha256')
        .update(params.password + salt)
        .digest('binary');

  db.run(query, {
    $id: params.id,
    $password: hashedPassword,
    $salt: salt,
    $name: params.name,
    $email: params.email
  }, function(err) {
    if (err) {
      res.status(500).json({error: err});
      return;
    }

    res.send();
  });
});

/* Instructor Login / Student Login */
app.post('/login', function(req, res) {
  var params = req.body;
  var query = 'SELECT id, password, salt FROM users WHERE id = $id';
  db.all(query, {
    $id: params.id
  }, function(err, users) {
    if (err) {
      res.status(500).json({error: err});
      return
    }

    if (users.length === 0)  {
      res.status(401).json({error: 'invalid username'});
      return;
    }

    var user = users[0];
    var hashedPassword =
          crypto.createHash('sha256')
          .update(params.password + user.salt)
          .digest('binary');

    if (hashedPassword !== user.password) {
      res.status(401).send({error: 'invalid password'});
      return;
    }

    res.send();
  });
});

/* Instructor Logout / Student Logout */
app.post('/logout', function(req, res) {
  res.send('Logout');
});

/* Create Project */
app.put('/project', function(req, res) {

});

/* Setup Parameters */
app.post('/project', function(req, res) {
  res.send('Setup parameters');
});

/* List projects */
app.post('/project', function(req, res) {
  res.send('Setup parameters');
});

/* Visualize Student Teams */
app.get('/teams', function(req, res) {
  res.send('List teams');
});

// Create Team
app.put('/team', function(req, res) {
  res.send('Team created');
});

// Join Team / Accept New Students
app.post('/team', function(req, res) {
  res.send('Manage single team');
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('TMS app listening at http://%s:%s', host, port);
});
