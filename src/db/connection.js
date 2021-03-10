const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/shopingmall",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    console.log("database connection succeess")
})