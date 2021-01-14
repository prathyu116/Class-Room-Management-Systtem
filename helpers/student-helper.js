var db = require("../config/connection");
var collection = require("../config/collection");
var objectId = require("mongodb").ObjectID;
var serviceId='	VA977ba045087f70ffa5af380fcc033bc2';
var accountSID='ACbd8f3608849dca6cb4c7ce98f3ad388b';
var authToken='fbd92d89b6423bcf923e82a5a2ac14c9';
const twilio=require('twilio')(accountSID,authToken)
var Razorpay=require('razorpay');
var paypal=require('paypal-rest-sdk')
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYE4_1iQK-_ahUGwBzTD8TzFgdOdZAgSHUTsG3n5nnfkpRsTCGVxXVIkNrsu1_ZuoYi1ZwDNEiB6f1T-',
  'client_secret': 'EE2PDJMRakQX_yKrb_UvcbIGdLs5Tib6penMjHEFB4mrbuc9Vsxq_cky3rxg70JXAltYp9HATRc0Hmtc'
});
var instance = new Razorpay({
    key_id: 'rzp_test_kDfKK3zMnYvdVZ',
    key_secret: '1ON0EUyK1ZG5y27kup6kMwVN',
  });

module.exports={
  doLogin: (userData) => {
    let loginStatus = false;
    let response = {};
    console.log(userData);
    return new Promise(async (resolve, reject) => {
      let student = await db.get().collection(collection.STUDENT_LOGIN).findOne({ Name: userData.Name });
      if (student) {
        db.get()
          .collection(collection.STUDENT_LOGIN)
          .findOne({ Password: userData.Password })
          .then((status) => {
            if (status) {
              console.log("suucusfully logined");
              response.student = student;
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
    getPhoto:()=>{
        return new Promise(async(resolve,reject)=>{
            let photos = await db.get().collection(collection.PHOTO_COLLECTIONS).find().toArray();
            resolve(photos);
            console.log(photos);
      
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
              amount: total *100,  // amount in the smallest currency unit
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
         
        
    },
    create_payment:(amount)=>{
      return new Promise((resolve,reject)=>{
        var create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "http://localhost:3000/student/student-home",
              "cancel_url": "http://cancel.url"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                      "name": "item",
                      "sku": "item",
                      "price": amount,
                      "currency": "USD",
                      "quantity": 1
                  }]
              },
              "amount": {
                  "currency": "USD",
                  "total": amount
              },
              "description": "This is the payment description."
          }]
      };
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            for(let i=0;i<payment.links.length;i++){
              if(payment.links[i].rel==='approval_url'){
                
                resolve(payment.links[i].href)
              }
            }
        }
    });
      

      })

    }

  
   
    
    
}