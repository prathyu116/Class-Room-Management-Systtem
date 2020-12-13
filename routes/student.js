var express = require('express');
var router = express.Router();
var studentHelper=require('../helpers/student-helper')

var serviceId='VA677df19ccda8484f48a57b3d064f124a	';
var accountSID='ACb4e558db93af0d4fabe6e699dc041613';
var authToken='34a6b35bc1abeca0eb534092438cf0c9';
const twilio=require('twilio')(accountSID,authToken)


router.get('/login', function(req, res, next) {
  // let student = req.session.student;
  if(req.session.loggIn){
    res.redirect("http://localhost:3000/student/student-home");

  }
  else{
    res.render('student/login',{'logginErr':req.session.loggErr});
    req.session.loggErr=false
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
  })

})
router.post('/verify-otp',(req,res)=>{
  console.log(req.body);
  console.log('#####################api cal+++++++++++++++++++');
  studentHelper.verifyOtp( req.body.num, req.body.otp).then((response)=>{
    console.log('--------------',response.status);
    if (response.status === 'approved'){
      req.session.loggedIn = true;
      req.session.student = response1.student;
      let student = req.session.student;
      console.log(student);
      console.log('otp is approved');
      // res.json(true)
      //  res.redirect("/student/student-home");  
    }
    // else{
    //   req.session.logginErr=true
    //   // res.json({status:false})
      
    //   // res.redirect("/student/login");

      
    // }
    res.json(response)
  
  })

})
router.get('/student-home',(req,res)=>{
  let student = req.session.student;
  res.render("student/student-home",{student});

})
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/student/login");
});
module.exports = router;
