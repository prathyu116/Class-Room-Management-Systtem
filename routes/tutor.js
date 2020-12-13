const { response } = require("express");
var express = require("express");
var router = express.Router();
var tutorHelper = require("../helpers/tutor-helper");
// const varifyLogin=(req,res,next)=>{
//   if(req.session.loggedIn){
//     next()
//   }else{
//     res.redirect('/login')
//   }
// }

/* GET users listing. */
router.get("/login", function (req, res) {
  
  
  if(req.session.loggedIn){
    res.redirect("tutor-home");

  }
  else{
    res.render("tutor/login",{'logginErr':req.session.logginErr});
    req.session.logginErr=false




  
  }
   
  
  
 
});

router.get('/tutor-home',(req,res)=>{
  let user = req.session.user;
  console.log(user);
  res.render("tutor/tutor-home", { user,tutor:true });

})


router.post("/login", (req, res) => {
  console.log(req.body);
  tutorHelper.doLogin(req.body).then((response) => {
    console.log(response);
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      let user = req.session.user;
      console.log(user);
      res.redirect("tutor-home");  
        // res.send('hiiiiiiii')



     
    } else {
      req.session.logginErr=true
      res.redirect("/tutor/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/tutor/login");
});
router.get('/tutor-home/profile',(req,res)=>{
  let user = req.session.user;
  tutorHelper.getProfile().then((profile)=>{
    console.log(profile);
    res.render('tutor/view-profile',{user,tutor:true,profile})

  })
  


})
router.get('/tutor-home/profile/edit-profile/:id',async(req,res)=>{
  let user = req.session.user;
  let profile=await tutorHelper.getProfileDetails(req.params.id)
  console.log(profile);
  res.render('tutor/edit-profile',{tutor:true,user,profile})
})
router.post('/tutor-home/profile/edit-profile/:id',(req,res)=>{
  console.log(req.params.id);
  console.log(req.body);
  console.log(req.files.Image);
  tutorHelper.updateProfile(req.params.id,req.body).then((response)=>{
    let Image=req.files.Image
    Image.mv('./public/tutor-imags/'+req.params.id+'.jpg',(err,done)=>{ //, move cheyth kainjal
      if (!err){
        res.render('admin/add-product')

      }
      else{
        console.log(err)
      }
      
    })
   console.log(response);
    res.redirect("/tutor/tutor-home/profile");
    // res.send('hiiiiiiii')
    
  })

})
router.get('/tutor-home/students',async(req,res)=>{
  let user = req.session.user;
 let students=await tutorHelper.getAllStudent(req.params.id).then((students)=>{
    res.render('tutor/view-students',{user,tutor:true,students})

  })
  

})
  router.get('/tutor-home/students/add-students',async(req,res)=>{
    // let user = req.session.user;
    // let profile=await tutorHelper.getProfileDetails(req.params.id)
    // console.log(profile);
    res.render('tutor/add-students',{tutor:true})
  })
  router.post('/tutor-home/students/add-students',(req,res)=>{
    let user = req.session.user;
   
    console.log(req.body);
    tutorHelper.addStudents(req.body).then((response)=>{
      console.log(response)
      
      res.redirect('/tutor/tutor-home/students')
    })
  
  })
  router.get('/edit-student/:id',async(req,res)=>{
    let user = req.session.user;
    let student=await tutorHelper.getStudentDetails(req.params.id)
  console.log(student);
  // res.render('tutor/edit-profile',{tutor:true,user,profile})
    res.render('tutor/edit-student',{tutor:true,user,student})
  })
  router.post('/tutor-home/students/edit-student/:id',(req,res)=>{
    console.log(req.params.id);
    console.log(req.body);
   
    tutorHelper.updateStudent(req.params.id,req.body).then((response)=>{
     
     
     console.log(response);
      res.redirect("http://localhost:3000/tutor/tutor-home/students");
      // res.send('hiiiiiiii')
      
    })
  
  })
  router.get('/view-each-stusent/:id',(req,res)=>{
    let user = req.session.user;
    console.log(req.body);
  tutorHelper.getEachStudents(req.params.id).then((students)=>{
    console.log(students);
    res.render('tutor/view-each-stusent',{user,tutor:true,students})

  })
})
  
  router.get('/delete-product/:id',(req,res)=>{
    let user = req.session.user;
    let proId=req.params.id
    console.log(proId);
    tutorHelper.deleteProduct(proId).then((response)=>{
      res.redirect('/tutor/tutor-home/students')
    })
  })
  router.get('/tutor-home/assignment',(req,res)=>{
    let user = req.session.user;
    
    tutorHelper.getAssignment().then((topics)=>{
      console.log(topics);
    res.render('tutor/assignment',{tutor:true,user,topics})

   
      
    })
    
    

  })
  router.get('/tutor-home/assignment/add-assignment',(req,res)=>{
    let user = req.session.user;
    // let profile=await tutorHelper.getProfileDetails(req.params.id)
    // console.log(profile);
    res.render('tutor/add-assignment',{tutor:true,user})
  })


  router.post('/tutor-home/assignment/add-assignment',(req,res)=>{
    console.log(req.body)
   console.log(req.files.Image) //just console il imgum aa contentum varan
   tutorHelper.addAssignment(req.body,(id)=>{
 
     console.log(req.body)
     // let Price=parseInt(products.Price)
     let image=req.files.Image;
     image.mv('./public/tutor-imags/'+id+'.pdf',(err,done)=>{ //, move cheyth kainjal
       if (!err){
        res.redirect('http://localhost:3000/tutor/tutor-home/assignment')
 
       }
       else{
         console.log(err)
       }
       
     })
   
   })
 })
 router.get('/delete-assignment/:id',(req,res)=>{
  let user = req.session.user;
  let proId=req.params.id
  console.log(proId);
  tutorHelper.deleteTopics(proId).then((response)=>{
    res.redirect('/tutor/tutor-home/assignment')
  })
})

module.exports = router;

// outer.post('/tutor-home/profile/edit-profile/:id',(req,res)=>{
//   console.log(req.params.id);
//   console.log(req.body);
//   console.log(req.files.Image);
//   tutorHelper.updateProfile(req.params.id,req.body).then((response)=>{
//     let Image=req.files.Image
//     Image.mv('./public/tutor-imags/'+req.params.id+'.jpg',(err,done)=>{ //, move cheyth kainjal
//       if (!err){
//         res.render('admin/add-product')

//       }
//       else{
//         console.log(err)
//       }
      
//     })
//    console.log(response);
//     res.redirect("/tutor/tutor-home/profile");
//     // res.send('hiiiiiiii')
    
//   })

