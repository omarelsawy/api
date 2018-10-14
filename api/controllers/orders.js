const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req,res,next)=>{
  Order.find()
  .select('product quantity _id')
  .exec()
  .then(docs=>{
      const response = {
        count: docs.length,
        orders: docs.map(doc=>{
          return {
            productId: doc.product,
            quantity: doc.quantity,
            id: doc._id,
          }
        })
      }
      res.json(response);
  })
  .catch(err => res.json(err));
}

exports.orders_create_order = (req,res,next)=>{
     Product.findById(req.body.productId)
    .then(product=>{
        const order = new Order({
        quantity: req.body.quantity,
        product: req.body.productId
    });
    return order.save();
    })
    .then(result => {
    	res.json({
        message: "success",
        order: result
        });
    })
    .catch(err=> res.json(err));
}




