import { appendReceivedMessage } from './chatHelp.js';
import { convID } from './chat.js';
import { appendFriendNotification } from './notificationsHandler.js';
var socket = null;
var OnlineState_ = "";


const connectToSocket = (roomName = 'chat', id, token, conv_id) => {
  if (socket != null) {
    socket.close();
  }
  const url = `wss://${window.location.host}/ws/${roomName}/`;
  const query_string = `?token=${token}&id=${id}`;

  socket = new WebSocket(url + query_string);
  socket.onopen = (e) => {
    console.log("connected to the socket");
  };
  socket.onmessage = (e) => {

    var id = convID;
    const jsss = JSON.parse(e.data);
    console.log("fome inde "+id);

    if (jsss.type === 'chat_message')
    {
      document.getElementById("chatSvgIcon").style.color = "orange";
      if (jsss.conv_id == id) {
        appendReceivedMessage(jsss.message, jsss.profile_image);
        
      }
      document.getElementsByClassName(`conv_${jsss.conv_id}`)[0].textContent = jsss.message;
    }
    else if (jsss.type === 'notification')
    {
      console.log( `user ${jsss.sender_id} is ${jsss.message}`);
    }
    else if (jsss.type === 'online_status')
    {
      const OnlineState = document.getElementById(`OnlineState_${jsss.conv_id}`);
      OnlineState_ = jsss.message;
      if (OnlineState){
        OnlineState.textContent = "online";
        OnlineState.style.color = "green";
      }
      console.log( `user ${jsss.conv_id} is ${jsss.message}`);
    }
    else if (jsss.type === 'offline_status')
    {
      const OnlineState = document.getElementById(`OnlineState_${jsss.conv_id}`);
      OnlineState_ = jsss.message;
      if (OnlineState){
        OnlineState.textContent = "offline";
        OnlineState.style.color = "red";
      }
      console.log( `user ${jsss.sender_id} is ${jsss.message}`);
    }
    console.log(jsss);
  };
  socket.onclose = (e) => {
    // in case of closing the socket i need to reconnect to the socket as long as the user is logged in
    // socket.send(JSON.stringify({
    //   type: "online_status",
    //   message: "online",
    //   sender_id: conv_id
    // }));
    console.log("socket closed", e);
  };
  socket.onerror = (e) => {
    console.log("error from the socket", e);
  };
};



const initSockets = (id)=>{
    if (!id)
        return;
    connectToSocket('chat', id, localStorage.getItem("Authorization"));
}

export {initSockets, socket, convID, OnlineState_};