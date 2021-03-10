const express=require("express");
const app=express();

const http=require("http").createServer(app);
const port=process.env.PORT || 3000;
const connect=require("./db/connection");
const path=require("path");
const hbs=require("hbs")
const bcrypt=require("bcrypt");
const multer=require("multer");
const fs=require("fs");
const registermodel=require("./model/registermodel");
const order=require("./model/ordermethod");
const payment=require("./model/paymentmethod")


const public_static=path.join(__dirname,"../public")
app.use(express.static(public_static));

app.set("views",path.join(__dirname,"../templets/views"))
app.set("view engine",'hbs');

const partial_static=path.join(__dirname,"../templets/partils");
app.set("view engine","hbs");
hbs.registerPartials(partial_static);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"../public/upload")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})
const upload=multer({storage:storage});

app.get("/",(req,res)=>{
    res.render("index");
})
//register
app.get("/register",async(req,res)=>{
    res.render("register");
})
app.post("/register",async(req,res)=>{
    try{
     const password=req.body.password;
     const conpass=req.body.conpass;
     if(password===conpass){
         const regis=new registermodel({
             first:req.body.first,
             last:req.body.last,
             gmail:req.body.gmail,
             number:req.body.number,
             password:req.body.password
         })
         const final=await regis.save();
         res.render("index");
     }
    }catch(err){
        res.send("error")
    }
})
//login
app.get("/login",async(req,res)=>{
    try{
        res.render("login")
    }catch(err){
        res.send("error came");
    }
});
app.post("/login",async(req,res)=>{
    try{
      const gmail=req.body.gmail;
      const password=req.body.password;

      const matchgmail=await registermodel.findOne({gmail:gmail});
      const pass=bcrypt.compare(password,matchgmail.password,(err,data)=>{
          if(err)throw err;
          if(data){
              res.render("index");
          }else(
              res.send("not matching")
          )
      })
    }catch(err){
        res.send("invalid login page")
    }
})
//order get
app.get("/order",async(req,res)=>{
    try{
     res.render("order");
    }catch(err){
        res.send("not order matching")
    }
})
app.post("/order",upload.single("file"),async(req,res)=>{
    try{
        const imagefile=req.file.filename;
        const orderin=new order({
            first:req.body.first,
            number:req.body.number,
            price:req.body.price,
            file:imagefile
        })
        await orderin.save();
        res.redirect("order");
    }catch(err){
        res.send("not post");
    }
})
//display the page
app.get("/shoping",async(req,res)=>{
    try{
       const orderinsert=await order.find((err,data)=>{
           if(!err){
               res.render("shoping",{
                   order:data
               })
           }
       })
    }catch(err){
        res.send("not view");
    }
})

//login change
app.get("/logincng",async(req,res)=>{
    res.render("logincng");
})
app.post("/logincng",async(req,res)=>{
    try{
       const gmail=req.body.gmail;
       const password=req.body.password;

       const gmailmatch=await registermodel.findOne({gmail:gmail});
       const passwordmatch=bcrypt.compare(password,gmailmatch.password,(err,data)=>{
           if(err) throw err;
           if(data){
               res.render("whatapp");
           }
       })
    }catch(err){
        res.send("error came");
    }
})
//product edit and dekete
app.get("/display",async(req,res)=>{
    try{
       const orderinsert=await order.find((err,data)=>{
           if(!err){
               res.render("display",{
                   order:data
               })
           }
       })
    }catch(err){
        res.send("not view");
    }
})
//whatapp use
app.get("/whatapp",async(req,res)=>{
    res.render("whatapp");
})
//edit get
app.get("/edit/:id",async(req,res)=>{
    const id=req.params.id;
    const editup=await order.findById(id,(err,data)=>{
        if(!err){
            res.render("edit",{
                order:data
            })
        }
    })
})
//edit post
app.post("/edit",upload.single("file"),async(req,res)=>{
    try{
        const imagefile=req.file.filename;
        const postedit=await order.findByIdAndUpdate(req.body.id,{
            first:req.body.first,
            number:req.body.number,
            price:req.body.price,
            file:imagefile
        })
        const finalupload=await postedit.save((err,data)=>{
            if(!err){
                res.redirect("shoping");
            }
        })
    }catch(err){
        res.send("not edai");
    }
})
//search option
app.post("/search",async(req,res)=>{
    try{
     const search=req.body.search;

     const searchin=await order.find({first:{$regex:search,$options:'$i'}},(err,data)=>{
        if(!err){
            res.render("shoping",{
                order:data
            });
        }
    })
    }catch(err){
        res.send("not search");
    }
})

//order views price

app.get("/orderview/:id",async(req,res)=>{
    try{
       const id=req.params.id;
       const vieworder=await order.findById(id,(err,data)=>{
           if(!err){
               res.render("orderview",{
                   order:data
               })
           }
       })
    }catch(err){
        res.send("not view order");
    }
})

//payment get

app.get("/payment",async(req,res)=>{
    res.render("payment");
})

app.post("/payment",async(req,res)=>{
    try{
       
        const paymentgetawy=await payment({
            holder:req.body.holder,
            cardnumber:req.body.cardnumber,
            curent:req.body.curent,
            expire:req.body.expire
        });
        const inserpayment=await paymentgetawy.save((err,data)=>{
            if(!err){
                res.redirect("payment");
            }
        })
    }catch(err){
        res.send("Error came");
    }
})

//carere page
app.get("/carrerpage",async(req,res)=>{
    try{
       res.render("carrerpage");
    }catch(err){
        res.send("Error page")
    }
})

//deketed
app.get("/:id",async(req,res)=>{
  try{
     const id=req.params.id;
     const delteid=await order.findByIdAndDelete(id,(err,data)=>{
         if(!err){
             res.redirect("display");
         }
     })
  }catch(err){
      res.send("error came");
  }
})
//socket using
// const io=require("socket.io")(http)
// const users={};
// io.on("connection",socket=>{
//     socket.on("new-user-joined",name=>{
//         console.log("new user",name);
//         users[socket.id]=name;
//         socket.broadcast.emit("user-joined",name)
//     });
//     socket.on("send",message=>{
//         socket.broadcast.emit("receive",{message:message,name:users[socket.id]})
//     })
//     //discunnect
//     socket.on("disconnect",message=>{
//         socket.broadcast.emit('left',users[socket.id]);
//         delete users[socket.id];
//     })
// })

 
http.listen(port,()=>{
    console.log("Server Is Running")
});