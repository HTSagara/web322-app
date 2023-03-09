const {readFileSync} = require("fs");
const fs = require('fs');



var students ;
var programs ;
var images = [] ;

function initialize() {
  return new Promise((resolve, reject) => {
    const studentsData = JSON.parse(readFileSync('./data/students.json'));
    const programsData = JSON.parse(readFileSync('./data/programs.json'));
    if(!studentsData || studentsData.length === 0){
      reject("Fail to open the file");
    } else{
      students = studentsData;
    }
    if(!programsData || programsData.length === 0){
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
     images.push(imageUrl);
     if(images.length == 0){
      reject('Image URL not found');
     }else{
      resolve(images);
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
  
  function getStudentById(sid)
  {
     return new Promise((resolve, reject) =>
     {
       var id = students.filter
       ((students) => students.studentID === sid);
 
         if (id)
         {
             resolve(id[0]);
         } 
         else 
         {
             reject("no results returned");
         }
     })
 }

function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
    const index = students.findIndex((student) => students.studentID === studentData.studentID);
    if (index === -1) {
      reject(new Error("Student not found"));
    } else {
      students[index].firstName = studentData.firstName;
      students[index].lastName = studentData.lastName;
      students[index].email = studentData.email;
      students[index].phone = studentData.phone;
      students[index].addressStreet = studentData.addressStreet;
      students[index].addressCity = studentData.addressCity;
      students[index].addressState = studentData.addressState;
      students[index].addressPostal = studentData.addressPostal;
      students[index].status = studentData.status;
      // students[index].program = studentData.program;
      students[index].isInternationalStudent = studentData.isInternationalStudent;
      students[index].expectedCredential = studentData.expectedCredential;
      students[index].registrationDate = studentData.registrationDate;
      resolve();
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
  getStudentById,
  updateStudent
};


