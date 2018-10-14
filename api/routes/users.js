const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login' , (req , res , next)=>{
  User.find({email: req.body.email})
  .exec()
  .then(users=>{
  	if (users.length == 0) {
       return res.status(401).json({
          message: 'auth failed'
       });
  	}
  	bcrypt.compare(req.body.password , users[0].password , (err , response)=>{
       if (err) {
	       return res.status(401).json({
	          message: 'auth failed'
	       });
       }
       if (response) {
       	const token = jwt.sign({
       		email: users[0].email,
       		id: users[0]._id
       	},
       	//process.env.JWT_KEY
       	'secret', 
       	{
          expiresIn: "1h"
       	}
       	);
       	return res.json({
          message: 'success login',
          token: token
       	});
       }
       return res.status(401).json({
	          message: 'auth failed'
	       });
  	});
  })
  .catch(err=>{
      	res.json({
          error: err
      	});
      });
});

router.post('/signup' , (req , res , next)=>{
	User.find({email: req.body.email})
	.exec()
	.then(users=>{
		if (users.length > 0) {
			res.status(409).json({
               message: 'mail exist'
			});
		}
		else{
		      bcrypt.hash(req.body.password , 10 , (err , hash)=>{
		      if (err) {
		      	return res.status(500).json({
		           error: err
		      	});
		      }
		      else{
		          const user = new User({
		          email: req.body.email,
		          password: hash
		          });
		          user.save()
		          .then(result=>{
		          	console.log(result);
		          	res.status(201).json({
		          		message: 'success create'
		          	});
		          })
		          .catch(err=>{
		          	res.json({
		              error: err
		          	});
		          })
		      }
		    });
		}
	})
});

module.exports = router;
