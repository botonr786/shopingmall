const socket=io();
const form=document.getElementById("send-container");
const messageInput=document.getElementById("messageInp");
const messageContainer=document.querySelector(".containerd");

var audio=new Audio('images/rin.mp3');

const append=(message,position)=>{
    const messageElement=document.createElement("div");
    messageElement.innerText=message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=="left"){
        audio.play();
    }
}
//send data to display
form.addEventListener("submit",(e)=>{
 e.preventDefault();
 const message=messageInput.value;
 append(`You:${message}`,'right');
 socket.emit("send",message);
 messageInput.value="";
})
const first=prompt("Enter Your name to join");
socket.emit("new-user-joined",first);

//display new user join
socket.on("user-joined",name=>{
    append(`${name} joined the chat`,'right')
}) 
//recive message
socket.on("receive",data=>{
    append(`${data.name}: ${data.message}`,'left')
})

//leve the chat
// socket.on("left",end=>{
//     append(`${end} left the chat`,'left')
// })
socket.on("left",name=>{
    append(`${name} left the chat`,'left')
}) 
