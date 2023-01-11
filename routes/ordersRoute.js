const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51MOF6rSBqPHKeC61es8oJPGqhGfzoZphi6LQcOIivT0yH27YETVOn2shknDeulTIY1d1h2yHLlFpX5KQnFk3q6B3004Zw3UO3T"
);
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/orderModel")

router.post("/placeorder", async (req, res) => {
  const { token, subtotal, currentUser, cartItems } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.paymentIntents.create(
      {
        amount: subtotal * 100,

        customer: customer.id,
        receipt_email: token.email,
        setup_future_usage: "off_session",

        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      },
      {
        idempotencyKey: uuidv4(), //means unique payment
      }
    );

    if (payment) {

        const neworder = new Order({
            name:currentUser.name,
            email:currentUser.email,
            userid:currentUser._id,
            orderItems:cartItems,
            orderAmount:subtotal,
            shippingAddress:{
                street : token.card.address_line1,
                city : token.card.address_city,
                country  :token.card.address_country,
                pincode : token.card.address_zip
            },
            transactionId : payment.id
        })

       

        neworder.save()
        console.log("payment",payment)
        res.send("Order placed Successfully");
    } 
    else {
      res.send("Payment Failed");
    }
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" + error });
  }
});


//get user order

router.post("/getuserorders",async(req,res)=>{
  const{userid} = req.body

  try{
    const orders = await Order.find({userid : userid}).sort({_id : -1})
    res.send(orders)
  }
  catch(error){
      return res.status(400).json({message:"Sowmething went wrong"})
  }

})

module.exports = router;
