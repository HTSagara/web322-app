const {readFileSync} = require("fs");
const fs = require('fs');



var students ;
var programs ;
var images  ;

function initialize() {
  return new Promise((resolve, reject) => {
    studentData = JSON.parse(readFileSync('./data/students.json'));
    programsData = JSON.parse(readFileSync('./data/programs.json'));
    if(studentData.length === 0){
      reject("Fail to open the file");
    } else{
      // students = [studentData];
      students = studentData;
      resolve();
    }
    if(programsData === 0){
      reject("Fail to open the file")
    }else{
      programs = programsData;
      resolve();
    }
  });
}



function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (students.length === 0) {
      reject("no results returned"); 
      return;
    }
     resolve(students);
  });
}
function getIntlStudent(){
    return new Promise((resolve, reject) => {
      let publish = [];
      students.forEach(student => {
        if (student.isInternationalStudent === true){
          publish.push(student);
        }
      })

      if (publish.length > 0 ){
        resolve(publish);
      } else {
        reject("no result");
      }
    });
  }


function getPrograms() {
  return new Promise((resolve, reject) => {
    if (programs.length === 0) {
      reject("no results returned"); 
      return;
    }
     resolve(programs);
  });
}

function addImage(imageUrl) {
  return new Promise((resolve, reject) => {
     images = imageUrl;
     if(images.length == 0){
      reject('Image URL not found');
     }else{
      resolve();
     }
  });
}

function getImages() {
  return new Promise((resolve, reject) => {
     if (images.length === 0) {
      reject("No results returned");
     } else {
      resolve(images); 
     }
  });
}

  function addStudent(studentData) {
    return new Promise((resolve, reject) => {
      if (typeof studentData.isInternationalStudent === undefined) {
        studentData.isInternationalStudent = false;
      } else {
        studentData.isInternationalStudent = true;
      }
      
      let studentIDArray = students.map(student => Number(student.studentID));
      let maxID = Math.max(...studentIDArray);
      let newID = (maxID + 1).toString();
  
      studentData.studentID = newID;
      students.push(studentData);
      resolve();
    });
  }
  
  function readJSONFile(filepath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }
  
  function getStudentsByStatus(stat) {
    return new Promise((resolve, reject) => {
      let publish = [];
      students.forEach(student => {
        if (student.status === stat){
          publish.push(student);
        }
      })

      if (publish.length > 0 ){
        resolve(publish);
      } else {
        reject("no result");
      }
    });
  }
  
  function getStudentsByProgramCode(programCode) {
    return new Promise((resolve, reject) => {
      let publish = [];
      students.forEach(student => {
        if (student.program === programCode || student.programCode === programCode){
          publish.push(student);
        }
      })

      if (publish.length > 0 ){
        resolve(publish);
      } else {
        reject("no result");
      }
    });
  }
  
  function getStudentsByExpectedCredential(credential) {
    return new Promise((resolve, reject) => {
      let publish = [];
      students.forEach(student => {
        if (student.expectedCredential === credential){
          publish.push(student);
        }
      })

      if (publish.length > 0 ){
        resolve(publish);
      } else {
        reject("no result");
      }
    });
  }
  
  function getStudentById(sid) {
    return new Promise((resolve, reject) => {
      let publish = [];
      students.forEach(student => {
        if (student.studentID === sid){
          publish.push(student);
        }
      })

      if (publish.length > 0 ){
        resolve(publish);
      } else {
        reject("no result");
      }
    });
  }
  

module.exports = {
  initialize,
  getAllStudents,
  getIntlStudent,
  getPrograms,
  addImage,
  getImages,
  addStudent,
  getStudentsByStatus,
  getStudentsByProgramCode,
  getStudentsByExpectedCredential,
  getStudentById
};


