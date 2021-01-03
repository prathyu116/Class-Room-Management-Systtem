var db = require("../config/connection");
var collection = require("../config/collection");
var objectId = require("mongodb").ObjectID;
const { response } = require("express");

module.exports = {
  // doLogin:(tutorData)=>{
  //   let emailDb= "prathyu@gmail.com"
  //   // let emailDb= db.get().collection(collection.TUTOR_LOGIN).findOne({Email:"prathyu@gmail.com"},{"Email":"prathyu@gmail.com"})
  //   let passwordDb= "123"
  //   // let passwordDb= db.get().collection(collection.TUTOR_LOGIN).findOne({Password:"123"},{"Password":"123"})

  //     if(emailDb===tutorData.Email && passwordDb===tutorData.Password){
  //     console.log('login succesful');
  //     }else{
  //       console.log('failed');
  //     }

  // }
  doLogin: (userData) => {
    let loginStatus = false;
    let response = {};
    console.log(userData);
    return new Promise(async (resolve, reject) => {
      let user = await db.get().collection(collection.TUTOR_LOGIN).findOne({ name: userData.Name });
      if (user) {
        db.get()
          .collection(collection.TUTOR_LOGIN)
          .findOne({ password: userData.Password })
          .then((status) => {
            if (status) {
              console.log("suucusfully logined");
              response.user = user;
              response.status = true;
              resolve(response);
            } else {
              console.log("logine failed - password incorrect");
              resolve({ status: false });
            }
          });
      } else {
        console.log("failed-user not found");
        resolve({ status: false });
      }
    });
  },
  getProfile: () => {
    return new Promise(async (resolve, reject) => {
      let profile = await db.get().collection(collection.TUTOR_PROFILE).find().toArray();
      resolve(profile);
      console.log(profile);
    });
  },
  getProfileDetails: (profId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.TUTOR_PROFILE)
        .findOne({ _id: objectId(profId) })
        .then((profile) => {
          resolve(profile);
        });
    });
  },
  updateProfile: (profId, profDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.TUTOR_PROFILE)
        .updateOne(
          { _id: objectId(profId) },
          {
            $set: {
              Name: profDetails.Name,
              Gender:profDetails.Gender,
              Job: profDetails.Job,
              Class: profDetails.Class,
              Address: profDetails.Address,
              Mob: profDetails.Mob,
              Email: profDetails.Email
            }
          }).then((response) => {
          resolve();
        })
    })
  },
  getAllStudent:()=>{
    return new Promise((resolve,reject)=>{
    let students= db.get().collection(collection.STUDENT_COLLECTION).find().toArray();
      resolve(students);
      console.log(students);

    })
  },
  getEachStudents:(profId)=>{

    return new Promise(async(resolve,reject)=>{
      let students = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ _id: objectId(profId) })
      resolve(students);
      console.log(students);

    })
  },
  addStudents:(student)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.STUDENT_COLLECTION).insertOne(student).then((data)=>{
       
        resolve(data.ops[0]);

    })
    
  })

  },
  getStudentDetails:(stuId)=>{
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.STUDENT_COLLECTION)
        .findOne({ _id: objectId(stuId) })
        .then((student) => {
          resolve(student);
        });
    });

  } ,
  updateStudent:(profId,Details)=>{
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.STUDENT_COLLECTION)
        .updateOne(
          { _id: objectId(profId) },
          {
            $set: {
              Name: Details.Name,
              Gender: Details.Gender,
              Rollno:Details.Rollno,
            
              DOB: Details.Dob,
            
              Phone: Details.Phone,
              Email: Details.Email
            }
          }).then((response) => {
          resolve();
        })
    })

  },
   deleteProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.STUDENT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
          resolve(response)
      })
  })
  },
  getAssignment:()=>

  {
    return new Promise(async(resolve,reject)=>{
      let topics = await db.get().collection(collection.ASSIGNMENT_TOPIC).find().toArray();
      resolve(topics);
      console.log(topics);

    })
  },
  addAssignment:(assignments,callback)=>{

    db.get().collection(collection.ASSIGNMENT_TOPIC).insertOne(assignments).then((data)=>{
      // db.Price=parseInt(Price)
      // console.log(Price)
      // console.log(data.Price);

      callback(data.ops[0]._id);

  })
  },
  deleteTopics:(proId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.ASSIGNMENT_TOPIC).removeOne({_id:objectId(proId)}).then((response)=>{
        resolve(response)
    })
      


    })
   

  },
  getNotes:()=>

  {
    return new Promise(async(resolve,reject)=>{
      let notes = await db.get().collection(collection.NOTES_COLLECTIONS).find().toArray();
      resolve(notes);
      console.log(notes);

    })
  },
  addNotes:(notes,callback)=>{

    db.get().collection(collection.NOTES_COLLECTIONS).insertOne(notes).then((data)=>{
      // db.Price=parseInt(Price)
      // console.log(Price)
      // console.log(data.Price);

      callback(data.ops[0]._id);

  })
  },
  deleteNotes:(notesId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.NOTES_COLLECTIONS).removeOne({_id:objectId(notesId)}).then((response)=>{
        resolve(response)
    })
      


    })
   

  },
  getAnnouncement:()=>{
    return new Promise(async(resolve,reject)=>{
      let announcement = await db.get().collection(collection.ANNOUNCEMENT).find().toArray();
      resolve(announcement);
      console.log(announcement);

    })

  },
  addAnnouncement:(announcement)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.ANNOUNCEMENT).insertOne(announcement).then((data)=>{
        resolve(data.ops[0]);
      
      })
    })
    
    
  },
  addattendance:(date)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.STUDENT_COLLECTION).updateOne(
        {},
  { $set: {"Date":date} },
  
      ).then((response)=>{
        resolve();

      })
        // db.Price=parseInt(Price)
        // console.log(Price)
        // console.log(data.Price);
  
       

    
    
  })

  },
  getStudentDetail:(date)=>{
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.STUDENT_COLLECTION)
        .findOne({ date:date })
        .then((student) => {
          resolve(student);
        });
    });

  },
  addEvent:(events)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.EVENTS_COLLECTIONS).insertOne(events).then((data)=>{
       
        resolve(data.ops[0]);

    })
    
  })
},
  getPresentStudents:()=>{
    return new Promise(async(resolve,reject)=>{
    let students=await db.get().collection(collection.STUDENT_COLLECTION).find({ Date: '2020-12-26'}).toArray();
   
      resolve(students);
      console.log(students);

    })
  },
  addPhoto:(photo,callback)=>{
    // console.log('0000000000000000000000000000000',stassignments);
    // // stassignments.studId=objectId(stassignments.studId)
    // console.log('0000000000000000000000000000000',stassignments);
    
            db.get().collection(collection.PHOTO_COLLECTIONS).insertOne(photo).then((data)=>{
              // db.Price=parseInt(Price)
              // console.log(Price)
              // console.log(data.Price);
        
              callback(data.ops[0]._id);
        
          })

  }
  
}

//acc-ACbd8f3608849dca6cb4c7ce98f3ad388b,auth--fbd92d89b6423bcf923e82a5a2ac14c9