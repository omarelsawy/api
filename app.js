const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const mongoose = require('mongoose');

mongoose.connect('mongodb://abc123:abc123@ds145563.mlab.com:45563/node_api' , { useNewUrlParser: true });

let db = mongoose.connection;

app.use('/uploads' , express.static('uploads'));
app.use(express.json());
app.use((req , res , next)=>{
   res.header('Access-Control-Allow-Origin' , '*');
   res.header('Access-Control-Allow-Headers' , 'Origin , X-Requested-With , Content-Type , Accept , Authorization');
   if (req.method === 'OPTIONS') {
   	res.header('Access-Control-Allow-Methods' , 'POST , PUT , PATCH , DELETE , GET');
   	return res.status(200).json({});
   }
   next();
});

app.get('/',(req, res) => {
   res.redirect('/products');
});
app.use('/products' , productRoutes);
app.use('/orders' , orderRoutes);
app.use('/users' , userRoutes);

app.use((req , res , next)=>{
   const err = new Error('not found');
   err.status = 404;
   next(err);
});

app.use((error , req , res , next)=>{
   res.status(error.status || 500);
   res.json({
     error: error.message
   });
});

module.exports = app;











