var axios = require("axios");
var inquirer = require("inquirer");
var fs = require("fs");
var generateHTML = require("./generateHTML");
var pdf = require('html-pdf');
var options = { format: 'Letter' };

inquirer
  .prompt([
    /* Pass your questions in here */
    {
        type:"input",
        message:"What is your github user name?",
        name:"githubusername"
    },
    {
        type:"list",
        message:"What is your fav color",
        choices:["Red","Blue","Oranger","Yellow"],
        name:"favcolor"
    }
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
    console.log(answers.githubusername,answers.favcolor)
    githubuser(answers.githubusername,answers.favcolor)
  })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.log("Error")
    } else {
      // Something else when wrong
      console.log("Invalid")
    }
  });

  function githubuser(githubusername,favcolor){
    axios.get("https://api.github.com/users/" + githubusername)
    .then(function(apiresponse){
    console.log(apiresponse.data)
    var data ={
      username : apiresponse.data.login,
      image: apiresponse.data.avatar_url,
      followers: apiresponse.data.followers,
      following: apiresponse.data.following,
      email: apiresponse.data.email,
      blog: apiresponse.data.blog,
      location: apiresponse.data.location,
      starred: apiresponse.data.starred_url,
      favcolor: favcolor
    }
    console.log(data)
    return generateHTML(data) 
    })
    .then(function(htmlfile){
      console.log(htmlfile)
     fs.writeFile("index.html", htmlfile, function(err,res) {
       if (err) 
       throw "err"
       const htmldata = fs.readFileSync("./index.html","utf8");
       pdf.create(htmldata, options).toFile('./portfolio.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res ,"PDF FILE cREATED"); // { filename: '/app/portfolio.pdf' }
      });
     })
    })
  };
