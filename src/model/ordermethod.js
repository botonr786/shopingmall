const mongoose=require("mongoose");

const orderscema=new mongoose.Schema({
    first:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:true,
        unique:true
    },
    file:{
        type:String
    },
    price:{
      type:String,
      required:true
    }
})
const order=new mongoose.model("order",orderscema);
module.exports=order;