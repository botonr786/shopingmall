const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const registerSchema=new mongoose.Schema({
    first:{
        type:String,
        required:true
    },
    last:{
        type:String,
        required:true
    },
    gmail:{
        type:String,
        required:true
    },
    number:{
      type:String,
      unique:true,
      required:true
    },
    password:{
        type:String,
        required:true
    }
});
registerSchema.pre("save",async function(next){
    try{
       if(this.isModified("password")){
           this.password=await bcrypt.hash(this.password,10);
       }
       next();
    }catch(err){
        console.log("not matching password hash");
    }
})
const register=new mongoose.model("register",registerSchema);
module.exports=register;