const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
   destination: function(req , file , cb){
     cb(null , 'uploads');
   },
   filename: function(req , file , cb){
     cb(null , Date.now() +file.originalname);
   }
});

const fileFilter = (req , file , cb) => {
   //reject a file
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
       cb(null , true);
   }
   else{
       cb(null , false);
   }
};
const upload = multer({
   storage:storage ,
   limits: {
   fileSize : 1024 *1024 * 5
   },
   fileFilter : fileFilter
});

router.get('/' , (req,res,next)=>{
  Product.find()
  .select('name price _id productImage')
  .exec()
  .then(docs=>{
      const response = {
        count: docs.length,
        products: docs.map(doc=>{
          return {
            name: doc.name,
            price: doc.price,
            id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'get',
              url: 'http://localhost:3000/products/'+doc._id
            }
          }
        })
      }
      res.json(response);
  })
  .catch(err => res.json(err));
});

router.get('/:id' , (req,res,next)=>{
	Product.findById(req.params.id)
  .select('name price _id productImage')
	.exec()
	.then(doc =>{ console.log(doc)
       res.status(200).json(doc);
	})
	.catch(err => res.json(err));
});

router.post('/' , checkAuth , upload.single('productImage') , (req,res,next)=>{
  //console.log(req.file);
    const product = new Product({
    	name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });
    product.save()
    .then(result => {
    	res.json({
        message: "success",
        product: product
        });
    })
    .catch(err=> res.json(err));
});

router.patch('/:id' , (req,res,next)=>{
  const updateOps = {};
  for(const val of req.body){
    updateOps[val.propName] = val.value;
  }
  Product.update({_id: req.params.id} , {$set: updateOps})
  .exec()
  .then(doc =>{
       res.status(200).json(doc);
  })
  .catch(err => res.json(err));
});

router.delete('/:id' , (req,res,next)=>{
    Product.remove({_id: req.params.id})
    .exec()
    .then(result=>{
      res.json(result)
    })
    .catch(err=>{
      res.json(err);
    });
});

module.exports = router;













