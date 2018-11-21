
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.username;
      var pass= post.password;
      var fname= post.firstname;
      var lname= post.lastname;
      

      var sql = "INSERT INTO `admin`(`first_name`,`last_name`,`username`, `password`) VALUES ('" + fname + "','" + lname + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.username;
      var pass= post.password;
     
      var sql="SELECT  id, username FROM `admin` WHERE `username`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `admin` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};

//----------render profile----
exports.profile = function(req, res){

    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `admin` WHERE `id`='"+userId+"'";          
    db.query(sql, function(err, result){  
       res.render('profile.ejs',{data:result});
    });
 };
   


//.....render viewtranscripts from the dashboard...
 exports.viewtranscripts = function(req, res){

    
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
      return;
    }
 
    var sql="SELECT * FROM `transcript_generated` ";          
    db.query(sql, function(err, rows){  
        if(err){
        console.log("Error Selecting : %s ",err );
        }else{

    res.render('viewtranscripts',{data:rows});}
        
    });
};
 
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `admin` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};

//........getiing the list of users....

exports.list = function(req, res){
    
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
      return;
    }
 
    var sql="SELECT * FROM `user` ";          
    db.query(sql, function(err, rows){  
        if(err){
        console.log("Error Selecting : %s ",err );
        }else{

    res.render('manageusers',{data:rows});}
        
    });
};


 /* Add a new user*/
exports.adduser = function(req, res){
    message = '';
    if(req.method == "POST"){
       var post  = req.body;
       var name= post.username;
       var lname= post.centre_id;
       var pass= post.password;
       var fname= post.name;
       
       
 
       var sql = "INSERT INTO `user`(`username`,`centre_id`,`password`, `name`) VALUES ('" + name + "','" + lname + "','" + pass + "','" + fname + "')";
 
       var query = db.query(sql, function(err, result) {
 
          message = "The new user has been created successfully!.";
          res.render('adduser.ejs',{message: message});
          console.log("User has been created");
       });
 
    } else {
        
       res.render('adduser');
    }
 };
  


  /*edit user details*/
  exports.edit = function(req, res){
    
    var id = req.params.id;
    
    
       
        var sql = ('SELECT * FROM user WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_user',{data:rows});
                
           
         });
         
         //console.log(query.sql);
    }; 

    //saving details after editing
    exports.save_edit = function(req,res){
    
        var input = JSON.parse(JSON.stringify(req.body));
        var id = req.params.id;
        
        req.getConnection(function (err, connection) {
            
            var data = {
                
                name    : input.name,
                address : input.username,
                email   : input.centre_id,
                pass   : input.password 
            
            };
            
            var sql = ("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
            {
      
              if (err)
                  console.log("Error Updating : %s ",err );
             
              res.redirect('/home/manageusers');
              
            });
        
        });
    };


    exports.delete_user = function(req,res){
          
        var id = req.params.id;
           
         var sql = ("DELETE FROM user  WHERE id = ? ",[id], function(err, rows)
           {
               
                if(err)
                    console.log("Error deleting : %s ",err );
               
                res.redirect('/home/manageusers');
                
           });
           
        };
 

  