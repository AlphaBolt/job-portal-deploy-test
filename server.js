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
// options.addArguments('--headless')
// options.addArguments('--disable-gpu')
// options.addArguments("--disable-images")
// options.addArguments("--incognito")
// options.addArguments('--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"')



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
    // console.log(data)

    // Send data back to frontend from here
    const { jobTitle, location } = data;

    // this is working
    // const example = async () => {
    //   let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    //   try {
    //     await driver.get('https://www.google.com/')
    //     await driver.findElement(By.name('q')).sendKeys(`${jobTitle} ${location}`, Key.RETURN)
    //     // await driver.wait(until.titleIs('webdriver - Google Search'), 1000)
    //     const hth = await driver.findElement(By.css("h3"));
    //     const text = await hth.getText();
    //     console.log("Text: ", text);
    //     socket.emit('job_results', text)
        
    //   } finally {
    //     await driver.quit()
    //   }
    // }
    
    // example()


    // Async function for scraping job
    const scrapeJobs = async (website, jobSearchbarTag, locationSearchbarTag, cardTag, jobtitleTag, joblinkTag, locationTag, companyTag, descriptionTag, jobPostedTag, salaryTag) => {
    // const scrapeJobs = async (website, jobSearchbarTag, locationSearchbarTag, cardTag, jobtitleTag) => {
      let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()

      await driver.get(website)
      
      // await driver.wait(until.elementLocated(By.id(locationSearchbarTag)), 3000)
      
      let locationSearchBar = await driver.findElement(By.id(locationSearchbarTag))
      locationSearchBar.clear()
      locationSearchBar.sendKeys(location)

      let jobSearchbar = await driver.findElement(By.id(jobSearchbarTag))
      jobSearchbar.clear()
      await jobSearchbar.sendKeys(jobTitle, Key.RETURN)

      let results = await driver.findElements(By.className(cardTag))

      if(results.length > 0){

        // Looping through results
        for(let i = 0; i < results.length; i++){
          // console.log(results[i])
          
          let job_title = await results[i].findElement(By.className(jobtitleTag)).getText()
          let job_link = await results[i].findElement(By.className(joblinkTag)).getAttribute("href")
          let job_location = await results[i].findElement(By.className(locationTag)).getText()
          let company_name = await results[i].findElement(By.className(companyTag)).getText()
          let description = await results[i].findElement(By.className(descriptionTag)).getText()
          let job_posted = await results[i].findElement(By.className(jobPostedTag)).getText()
          
          let job_salary
          console.log(job_title, job_link, job_location, company_name, description, job_posted)
          
          try{
            job_salary = await result.findElement(By.className(salaryTag))
            job_salary.getText()
          }
          catch(err){
            job_salary = ""
          }
                    
          socket.emit("job_results",
            {
              "name" : company_name,
              "title" : job_title,
              "location": job_location,
              "link" : job_link,
              "description": description,
              "posted" : job_posted,
              "salary" : job_salary
          })


        }

      }

      await driver.quit()
  


    }


    // // Write function call for scrapeJobs
    // // 1. Indeed
    scrapeJobs('https://in.indeed.com/', 'text-input-what', 'text-input-where', 'job_seen_beacon', 'jobTitle', 'jcs-JobTitle', 'css-1p0sjhy', 'css-92r8pb', 'css-9446fg', 'css-qvloho', 'salary-snippet-container')
    // scrapeJobs('https://in.indeed.com/', 'text-input-what', 'text-input-where', 'job_seen_beacon', 'jobTitle')


    // 2. Glassdoor
    // scrapeJobs('https://www.glassdoor.co.in/Job/index.htm', "searchBar-jobTitle", "searchBar-location", "jobCard", 
    // "JobCard_jobTitle___7I6y", "JobCard_jobTitle___7I6y", "JobCard_location__rCz3x", "EmployerProfile_compactEmployerName__LE242",
    // "JobCard_jobDescriptionSnippet__yWW8q", "JobCard_listingAge__Ny_nG", "JobCard_salaryEstimate__arV5J")

    socket.emit('job_results', "Hello from server")


  })

});







const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
  })