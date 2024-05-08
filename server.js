// This is server
const express = require('express')
const path = require('path')
const { Server } = require("socket.io");
const http = require('http');
// const { Builder, Browser, By, Key, until } = require('selenium-webdriver') // Selenium


const app = express()
const server = http.createServer(app);
const io = new Server(server);

// Serving static files such as images, css and js
app.use('/static', express.static('static'))


//  Handling Routes .....................................................
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/home.html'))
})

app.get('/jobs', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/jobs/jobs.html'))
})

app.get('/saved_jobs', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/jobs/saved_jobs.html'))
})

app.get('/details', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/social/detail.html'))
})

app.get('/settings', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/social/setting.html'))
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/social/about.html'))
})

app.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/sign/signup.html'))
})

app.get('/signout', function (req, res) {
  res.sendFile(path.join(__dirname, './templates/sign/signout.html'))
})


// .........................................................................................



io.on('connection', socket =>{

  socket.on('job_search', user_input => {
    console.log(user_input)

    // Send data back to frontend from here
    socket.emit('job_results', "Hello from server")

  })

});








server.listen(3000, () => {
    console.log(`App listening on port http://localhost:${3000}`)
  })