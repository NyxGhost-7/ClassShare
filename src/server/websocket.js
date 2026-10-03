import {WebSocketServer} from "ws";

const wss = new WebSocketServer({
    port:process.env.PORT
})

wss.on("connection",(socket)=>{
    console.log("User Connected Succesfull");
    socket.on("message",(message)=>{
        const data = message.toString();

        console.log(data)
        wss.clients.forEach((client)=>{
            if(client.readyState == 1){
                client.send(data)
            }
        })
    })

    socket.on("close",()=>{
        console.log("Client is Dissconected")
    })
})