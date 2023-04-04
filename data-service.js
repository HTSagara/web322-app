const Sequelize = require('sequelize');

var sequelize = new Sequelize('rfpwttrx', 'rfpwttrx', 'BL0jR9AhNK73as74De5Ab2sbjjJv3tnv', {
  host: 'suleiman.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  },
  query: { raw: true },
  pool: {
      max: 10,
      min: 0,
      idle: 10000
  }
});




var Student = sequelize.define('Student',{
  studentID: {
    type: Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true 
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  isInternationalStudent: Sequelize.BOOLEAN,
  expectedCredential: Sequelize.STRING,
  status: Sequelize.STRING,
  registrationDate: Sequelize.STRING
});

var Image = sequelize.define('Image', {
  imageId: {
    type: Sequelize.STRING,
    primaryKey: true  
  },
  imageUrl: Sequelize.STRING,
  version: Sequelize.INTEGER,
  width: Sequelize.INTEGER,
  height: Sequelize.INTEGER,
  format: Sequelize.STRING,
  resourceType: Sequelize.STRING,
  uploadedAt: Sequelize.DATE,
  originalFileName: Sequelize.STRING,
  mimeType: Sequelize.STRING
});

var Program = sequelize.define('Program', {
  programCode: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  programName: Sequelize.STRING
})

//define a relationship between Students and Programs, specifically
Program.hasMany(Student, {foreignKey: 'program'});

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject('unable to sync the database');
    })
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    Student.findAll()
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject('no results returned')
    })
  });
}

function getPrograms() {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(function()
      {
        Program.findAll()
      .then((data) => {
        resolve(data);
      })
    })
    .catch((err) => {
      reject('no results returned')
      console.log(err)
    })
  });
}

function getStudentsByStatus(status) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        status: status
      }
    })
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject('no results returned')
    })
  });
}
  
function getStudentsByProgramCode(program) {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(function() {
      Student.findAll({ 
        where: { program: program }
      })
      .then(function(data){
          resolve(data);
      })
    })
    .catch(function(err) {
      reject(err);
    });
  });
}
  
function getStudentsByExpectedCredential(credential) {
  return new Promise((resolve, reject) => {
    sequelize.sync()
    .then(function(){
      Student.findAll({
          where: { expectedCredential: credential}
        })
        .then(function(data){
          resolve(data);
        })
    })
    .catch(function(err){
      reject(err);
    })
  });
}

function getStudentById(sid)
{
   return new Promise((resolve, reject) =>{
    sequelize.sync()
    .then(function() {
      Student.findAll({
        where: {studentID: sid}
      })
      .then(function(data){
        resolve(data[0])
      })
    })
    .catch(function(err){
      reject('Student not found', err)
    })
   })
}



function addStudent(studentData) {
  studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;
  for(let i in studentData){
    if(studentData[i] === ""){
      studentData[i] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Student.create(studentData)
    .then(() => {
      resolve('Student created successfully')
    })
    .catch((err) => {
      reject('unable to create student')
    })
  });
}

function updateStudent(studentData) {
  studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;
  for(let i = 0; i < studentData.length; i++){
    if (studentData.hasOwnProperty(i) && studentData[i] === "") {
          studentData[i] = null;
        }
  }
  return new Promise((resolve, reject) => {
    Student.update(studentData, {
      where: {
        studentID: studentData.studentID
      }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to update student" + err);
        console.log(studentData)
      });
  });
}

function addImage(imageData) {
  return new Promise((resolve, reject) => {
    Image.create(imageData)
    .then((data) => {
      console.log(data)
      resolve(data);
    }).catch((err) => {
      reject("Unable to create image\n" + err);
    });
  });
}

function getImages() {
  return new Promise((resolve, reject) => {
    Image.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned\n" + err);
      });
  });
}

function addProgram(programData){
  return new Promise((resolve, reject) => {
    for(let i in programData){
      if(programData[i] && programData.hasOwnProperty(i) === ""){
        programData[i] = null;
      }
    }
    Program.create(programData)
    .then(() => {
      resolve()
    })
    .catch((err) => {
      reject('unable to create program')
      console.log(err);
    })
  })
}

function updateProgram(programData){
  return new Promise((resolve, reject) => {
    for(let i = 0; i< programData.length; i++){
      for(let i = 0; i < programData.length; i++){
        if(programData[i] = ""){
          programData[i] = null;
        }
      } 
    }
    Program.update(programData, {
      where: {programCode: programData.programCode}
    })
    .then((programData) => {
      resolve(programData);
    })
    .catch((err) => {
      reject("Unable to update student: " + err);
    })
  })
}

function getProgramByCode(pcode){
  return new Promise((resolve, reject) => {
    sequelize.sync()
    .then(() => {
      Program.findAll({
        where: {programCode: pcode}
      })
      .then((data) => {
        resolve(data[0])
      })
    })
    .catch((err) => {
      reject(err);
    })
  })
}

function deleteProgramByCode(pcode)
{
  return new Promise((resolve, reject) =>
  {
    sequelize.sync().then(() =>
    { 
      Program.destroy(
        { 
          where: { programCode: pcode }
        }).then(function()
        {
          console.log( pcode, " deleted");
           resolve();
        })

    }).catch((err) =>
    {
      reject("Fail to delete this program: ", err);
    });

  });
}

function deleteStudentById(id)
{
  return new Promise((resolve, reject)=>
  {
    sequelize.sync().then(function()
    { 
      Student.destroy(
        { 
          where: { studentID: id }
        }).then(() =>
        {
          console.log(id, " deleted");
           resolve();
        })

    }).catch((err) =>
    {
      reject("Fail to delete this program: ", err);
    });

  });

}

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

module.exports = {
  initialize,
  getAllStudents,
  getPrograms,
  addImage,
  getImages,
  addStudent,
  getStudentsByStatus,
  getStudentsByProgramCode,
  getStudentsByExpectedCredential,
  getStudentById,
  updateStudent,
  addProgram,
  updateProgram,
  getProgramByCode,
  deleteProgramByCode,
  deleteStudentById,
  ensureLogin
};


