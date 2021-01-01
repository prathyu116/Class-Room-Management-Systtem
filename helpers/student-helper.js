var db = require("../config/connection");
var collection = require("../config/collection");
var objectId = require("mongodb").ObjectID;
var serviceId='	VA977ba045087f70ffa5af380fcc033bc2';
var accountSID='ACbd8f3608849dca6cb4c7ce98f3ad388b';
var authToken='fbd92d89b6423bcf923e82a5a2ac14c9';
const twilio=require('twilio')(accountSID,authToken)
var Razorpay=require('razorpay');

var instance = new Razorpay({
    key_id: 'rzp_test_kDfKK3zMnYvdVZ',
    key_secret: '1ON0EUyK1ZG5y27kup6kMwVN',
  });

module.exports={
    // serviceId:'VA677df19ccda8484f48a57b3d064f124a	',
    // accountSID:'ACb4e558db93af0d4fabe6e699dc041613',
    // authToken:'34a6b35bc1abeca0eb534092438cf0c9'
    sendOtp:(phone)=>{
        console.log(phone)
        
      

        return new Promise(async(resolve, reject) => {
            let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ Phone: phone });
            if (!student) reject()
                twilio.verify.services(serviceId).verifications.create({
                    to:"+91"+phone,
                   
                    channel:'sms'
                  }).then((data)=>{
                     
                      resolve(data)
                   
                    
                  })
                //   .catch((error)=>{
                //     reject(error)
                // })
               

                

            
          
        })
    },
    verifyOtp:(number, otp)=>{
        let loginStatus = false;
   
        return new Promise(async(resolve, reject) => {
            // let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ Phone: number });
            // if (!student) reject()
            
                twilio.verify.services(serviceId).verificationChecks.create({
                    to:"+91"+number,
                    code:otp
                  }).then((verification_checks)=>{
                      console.log(verification_checks);
                      if(verification_checks.valid){
                       
                       
                 
                          resolve(verification_checks)
                      }else{
                          console.log('incorrect otp');
                          resolve({status:false})
                      }
                      
                    
                    });
             

            
           
        })
        
    },
    getEachStudents:(number)=>{
        let response = {};

        return new Promise(async(resolve,reject)=>{
          let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ Phone: number })
          if(student){
           
            db.get().collection(collection.STUDENT_COLLECTION).findOne({ Phone: number })
            .then((status)=>{
                if (status) {
                    response.student = student;
                    response.status = true;
                    resolve(response);

                }
               
              })
          }
         
    
        })
    },
    submitAssignment:(stassignments,callback)=>{
        console.log('0000000000000000000000000000000',stassignments);
stassignments.studId=objectId(stassignments.studId)
console.log('0000000000000000000000000000000',stassignments);

        db.get().collection(collection.SUBMITTED_ASSIGNMENT).insertOne(stassignments).then((data)=>{
          // db.Price=parseInt(Price)
          // console.log(Price)
          // console.log(data.Price);
    
          callback(data.ops[0]._id);
    
      })
    },
    getSubmitAssignment:(studId)=>{
       
        return new Promise(async(resolve,reject)=>{
            let subassignment = await db.get().collection(collection.SUBMITTED_ASSIGNMENT).find({studId:objectId(studId)}).toArray();
            resolve(subassignment);
            console.log('ssssssssssssssssssssssssssssss',subassignment);
      
          })

    },
    getEvents:()=>{
        return new Promise(async(resolve,reject)=>{
            let Events = await db.get().collection(collection.EVENTS_COLLECTIONS).find().toArray();
            resolve(Events);
            console.log(Events);
      
          })

    },
    payment:(paymentDetails)=>{
        return new Promise((resolve, reject) => {
            db.get()
              .collection(collection.PAYMENT_COLLECTION)
              .insertOne(paymentDetails)
              .then((response) => {
                console.log(response.ops[0]);
                resolve(response.ops[0]._id);
              });
          });

    },
    //key id rzp_test_kDfKK3zMnYvdVZ
    //key secre 1ON0EUyK1ZG5y27kup6kMwVN
    generateRazorpay:(paymentId, total)=>{
        return new Promise((resolve,reject)=>{
            let response = {};
            var options = {
              amount: total,  // amount in the smallest currency unit
              currency: "INR",
              receipt:""+ paymentId
            };
            instance.orders.create(options, function(err, order) {
                response.status = true;
              console.log('+++NEW ORDER+++',order)
              resolve(order)
              });
              // 
            })
         
        
    }

  
   
    
    
}