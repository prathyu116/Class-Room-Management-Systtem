var db = require("../config/connection");
var collection = require("../config/collection");
var objectId = require("mongodb").ObjectID;
var serviceId='VA677df19ccda8484f48a57b3d064f124a	';
var accountSID='ACb4e558db93af0d4fabe6e699dc041613';
var authToken='34a6b35bc1abeca0eb534092438cf0c9';
const twilio=require('twilio')(accountSID,authToken)

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
    }
    
    
}