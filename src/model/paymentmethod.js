const mongoose=require("mongoose");

const paymentSchema=new mongoose.Schema({

    holder:{
        type:String,
        required:true
    },
    cardnumber:{
        type:String,
        required:true,
        unique:true
    },
    curent:{
        type:String,
        required:true
    },
    expire:{
        type:String,
        required:true
    }

});
const payment=new mongoose.model("payment",paymentSchema);
module.exports=payment;