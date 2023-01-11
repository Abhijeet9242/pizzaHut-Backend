const express = require("express")
const app = express();
const cors = require('cors');

//middleware
app.use(express.json());
app.use(cors());

const pizzasRoute = require("./routes/pizzasRoute")
const userRoute = require("./routes/userRoute")
const ordersRoute = require("./routes/ordersRoute")

app.use("/pizzas",pizzasRoute)
app.use("/users",userRoute)
app.use("/orders",ordersRoute)

app.get("/",(req,res)=>{
    res.send("server working")
})


module.exports = app