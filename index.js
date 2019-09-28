const express = require('express');

const server = express();

server.use(express.json());

//Middleware Global
server.use((req, res, next) => {
  console.log('LOG');
  console.time();
  console.log(`Logs ${req.method} URL:${req.url}`);
  next();
  console.timeEnd();
});

function chechUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }
  return next();
}

function chechUserInArray(req, res, next) {
  const user = users[req.params.id];
  if (!users[req.params.id]) {
    return res.status(404).json({ error: 'User not fount in array' });
  }
  req.user = user;
  return next();
}

const users = ['Diego', 'Robson', 'Victor'];
server.get('/user/:id', chechUserInArray, (req, res) => {
  //Query Param
  const { id } = req.params;
  return res.json(req.user);
});

server.get('/users', (req, res) => {
  return res.json(users);
});

server.post('/users', chechUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put('/user/:id', chechUserInArray, chechUserExists, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  users[id] = name;
  return res.json(users);
});

server.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  users.slice(id, 1);
  return res.json(users);
});

server.listen(3000);
