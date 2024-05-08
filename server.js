// This is server
const express = require('express')
const path = require('path')
const { Server } = require("socket.io");
const http = require('http');

const app = express()
const server = http.createServer(app);
const io = new Server(server);

// Serving static files such as images, css and js
app.use('/static', express.static('static'))


 // Selenium
const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('--headless')




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

  socket.on('job_search', data => {
    console.log(data)

    // Send data back to frontend from here
    const { jobTitle, location } = data;

    // this is working
    const example = async () => {
      // let driver = await new Builder().forBrowser(Browser.CHROME).build()
      let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
      try {
        await driver.get('https://www.google.com/')
        await driver.findElement(By.name('q')).sendKeys(jobTitle, Key.RETURN)
        // await driver.wait(until.titleIs('webdriver - Google Search'), 1000)
        // const hth = await driver.findElement(By.tagName('h3'));
        const hth = await driver.findElement(By.css("h3"));
        const text = await hth.getText();
        console.log("Text: ", text);
        socket.emit('job_results', text)
        
      } finally {
        await driver.quit()
      }
    }
    
    example()



    socket.emit('job_results', "Hello from server")

  })

});







const port = process.env.PORT || 3000
server.listen(3000, () => {
    console.log(`App listening on port http://localhost:${3000}`)
  })