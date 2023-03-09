
/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Henrique Toshio Sagara Student ID: 170954218 Date: 2023-03-10
*
*  Online (Cyclic) Link:  https://busy-crab-kimono.cyclic.app
*
********************************************************************************/ 

var express = require("express");
var app = express();
const path = require("path");
const multer = require("multer");
const exphbs = require("express-handlebars");

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

var HTTP_PORT = process.env.PORT || 8080;

//Express built-in "bodyParser" - to access form data in http body
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Import the data-service module
const dataService = require("./data-service");
const { MulterError } = require("multer");

// call this function after the http server starts listening for requests
function onHttpStart() {
console.log("Express http server listening on: " + HTTP_PORT);
}


// setup a 'route' to listen on the default url path (http://localhost)
app.get('/', (req, res) => {
  res.render('home');
});


// setup another route to listen on /about
app.get('/about', (req, res) => {
  res.render('about');
});

// Add route for students/add
app.get('/students/add', (req, res) => {
  res.render('addStudent');
});
  
// Add route for images/add
app.get('/images/add', (req, res) => {
  res.render('addImage');
});

app.get('/students', (req, res) => {
  const status = req.query.status;
  const program = req.query.program;
  const credential = req.query.credential;

  if (status) {
    dataService.getStudentsByStatus(status)
      .then((students) => {
        res.render('students', { students });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error retrieving students");
      });
  } else if (program) {
    dataService.getStudentsByProgramCode(program)
      .then((students) => {
        res.render('students', { students });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error retrieving students");
      });
  } else if (credential) {
    dataService.getStudentsByExpectedCredential(credential)
      .then((students) => {
        res.render('students', { students });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error retrieving students");
      });
  } else {
    dataService.getAllStudents()
      .then((students) => {
        res.render('students', { students });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error retrieving students");
      });
  }
});
  

app.get("/intlstudents", function(req, res){
    dataService.getIntlStudent()
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.send(err);
    });
});


app.get("/programs", function(req, res) {
  dataService.getPrograms()
      .then(function(dataService) {
          if (dataService.length > 0) {
              res.render("programs", {programs: dataService});
          } else {
              res.render("programs", {message: "no results"});
          }
      })
      .catch(function(err) {
          console.log("Error fetching programss:", err);
          res.render("programs", {message: "no results"});
      });
});


app.get("/images", function(req, res){
  dataService.getImages()
    .then(function(images){
      console.log("img", images)
      res.render("images", {images : images});
      // if(images.length > 0){
      //   res.render("images", images);
      // } else{
      //   res.render("images", {message: "no results"});
      // }
  }).catch((err) => {
      console.log("Error fetching images:", err);
      res.render("images", { message: "Error fetching images" });
  });
});

app.get("/student/:value", (req, res) =>
{
  const id = req.params.value;
    dataService.getStudentById(id)
    .then((data) => 
    {
      //res.send(data);
      res.render("student", { student: data }); 
      console.log(data);
    })
    .catch((err) => 
    {
        res.render("student",{message: "no results"}); 
    });
});

app.post("/student/update", (req, res) => {
  dataService.updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error.message);
    });
});




//Set the cloudinary config 
cloudinary.config({
    cloud_name: 'dy49xpi4m',
    api_key: '238756957843678',
    api_secret: '11uWQqTWM8viZalijqfl7cRzpKE',
    secure: true
});

//"upload" variable without any disk storage
const upload = multer(); 

app.post("/images/add", upload.single("imageFile"), function (req, res) {
    if (req.file) {
       let streamUpload = (req) =>
        {
          return new Promise((resolve, reject) => 
          {
             let stream = cloudinary.uploader.upload_stream
             (
                (error, result) => 
                {
                   if (result) {
                      resolve(result);
                   } else {
                      reject(error);
                   }
                }
             );
             streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
       };
 
       async function upload(req) 
       {
          let result = await streamUpload(req);
          console.log(result);
          return result;
       }
 
       upload(req).then((uploaded) => 
       {
          processForm(uploaded.url);
       });
    } 
    else 
    {
       processForm("");
    }
 
    function processForm(imageUrl) 
    {
       dataService.addImage(imageUrl).then((data) =>
       {
            console.log("Image added successfully: ", data);
            res.redirect("/images");
       }).catch((err) =>
       {
            console.log("Error adding image: ", err);
            res.status(500).send("Error adding image: " + err);
       });
    }
 });

//use the new "express-handlebars" module
app.engine('.hbs', exphbs.engine({extname: 'hbs'}));

app.set('view engine', '.hbs');





app.use(function(req, res, next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

app.engine('.hbs', exphbs.engine({
  extname: '.hbs',

  helpers:{
    navLink: function(url, options){
      return '<li' + 
          ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
          '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
    }
  }
}));



 //built-in "express.urlencoded" middleware 
 app.use(express.urlencoded({ extended: true }));

 app.post("/students/add", function(req, res) {
    dataService.addStudent(req.body)
      .then(() => {
        console.log("Student added");
        res.redirect('/students');
      })
      .catch((err) => {
        res.status(500).send("Unable to add student");
      });
  });

 app.use((req, res) =>
 {
    res.status(404).send("<h2>404</h2><p>Page Not Found</p>");
});

// setup http server to listen on HTTP_PORT
dataService.initialize().then(() =>
{
    app.listen(HTTP_PORT, onHttpStart ); 
}).catch((err) =>
{
    res.send('Error', err);
})

