var express = require('express');
var router = express.Router();
var studentHelper=require('../helpers/student-helper')

var serviceId='VA677df19ccda8484f48a57b3d064f124a	';
var accountSID='ACb4e558db93af0d4fabe6e699dc041613';
var authToken='34a6b35bc1abeca0eb534092438cf0c9';
const twilio=require('twilio')(accountSID,authToken)


router.get('/login', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect('http://localhost:3000/student/student-home')
  }else{
    res.render('student/login',{'logginErr':req.session.logginErr});
    req.session.logginErr=false

  }
 
  
   
  
  
  
  
  
  
  
});
router.post('/otp-send',(req,res)=>{
  // res.session.studentNum = req.body.phone
  // res.session.studentNum = req.body.phone
  console.log( req.body.phone);
  console.log('=========api call===========');
  studentHelper.sendOtp(req.body.phone).then((data)=>{
    // req.session.otpId = otp_id;
    // console.log(true);
    console.log(data);
    res.json({status:true})
  }).catch(()=>{
    res.json({status:false})
  })

})
router.post('/verify-otp',(req,res)=>{
  console.log(req.body);
  console.log('#####################api cal+++++++++++++++++++');
  studentHelper.verifyOtp( req.body.num, req.body.otp).then((response)=>{
    console.log('--------------',response.status);
    
    if (response.status === 'approved'){
      studentHelper.getEachStudents(req.body.num).then((response)=>{
        if(response.status){
         
          req.session.student = response.student;
          req.session.loggedIn = true;
          let student = req.session.student;
          console.log(req.session);
          console.log( student);
          console.log('otp is approved');
        //  res.re("/student/student-home");
        //  res.redirect("http://localhost:3000/student/student-home");


        } else{
            req.session.logginErr=true
            // res.json({status:false})
            
         
      
            
          }
       
        res.json({status:true})

      }).catch(()=>{
        res.json({status:false})
      })
    
     
    }else{
      res.json({status:false})
    }
   
   
    // 
   
  
  })

})
router.get('/student-home',(req,res)=>{
  let student = req.session.student;
  console.log(req.session);
  console.log('00000000000',student);
  res.render("student/student-home",{student});

})
// router.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/student/login");
// });
module.exports = router;
