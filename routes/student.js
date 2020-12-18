var express = require('express');
var router = express.Router();
var studentHelper=require('../helpers/student-helper')
var tutorHelper = require("../helpers/tutor-helper");
const varifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('http://localhost:3000/student/login')
  }
}

var serviceId='	VA78fa3dfbf36775b72869ac68c098fb6d	';
var accountSID='AC3f24b193be18c30011e153db7b47067e';
var authToken='958b21c552bde19d8d13fb8def735708';
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
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/student/login");
});
router.get('/student-home/assignment',(req,res)=>{
  let student = req.session.student;
  tutorHelper.getAssignment().then((topics)=>{
    console.log(topics);
  
  res.render('student/assignment',{student:true,student,topics})
 
    
  })
  
  
  

})
router.get('/student-home/assignment/submit-assignment',(req,res)=>{
  let student = req.session.student;
  console.log(student);
  // let profile=await tutorHelper.getProfileDetails(req.params.id)
  // console.log(profile);
  res.render('student/submit-assignment',{student:true,student})
})
router.post('/student-home/assignment/submit-assignment',(req,res)=>{
  console.log(req.body)
  // let studentId = req.session.student._id;
  // console.log('++++++++++++++++++++++++++++++==',studentId);
 console.log(req.files.Image) //just console il imgum aa contentum varan
 studentHelper.submitAssignment(req.body,(id)=>{

   console.log(req.body)
   // let Price=parseInt(products.Price)
   let image=req.files.Image;
   image.mv('./public/assignment/'+id+'.pdf',(err,done)=>{ //, move cheyth kainjal
     if (!err){
      res.redirect('http://localhost:3000/student/student-home/assignment/submit-assignment')

     }
     else{
       console.log(err)
     }
     
   })
 
 })
})
router.get('/student-home/notes',(req,res)=>{
  let student = req.session.student;
  tutorHelper.getNotes().then((notes)=>{
    console.log(notes);
  
  res.render('student/notes',{student:true,student,notes})
 
    
  })
  
  
  

})


module.exports = router;
