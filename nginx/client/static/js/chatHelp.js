const scrollToBottom = (ele) => {
    ele.scrollTo(0, ele.scrollHeight);
  };

const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

const getMesgDisplayer = (txt, image, time, isSent) => {
    if (isSent) {
    return `<div class="sentMsgContainer">
        <div class="sentMsgHolder">
            <p>${txt.replaceAll("\n", "<br>")}</p>

        </div>
        </div>`;
    } else {
    return `<div class="receivedMsgContainer">
        <div class="receivedMsgHolder">
            <p>${txt.replaceAll("\n", "<br>")}</p>
        </div>
        <div class="receivetMsgImageContainer">
            <img src="https://${window.location.host}/uploads/${image}" style="width: 40px; height: 40px" />
        </div>
        </div>`;
    }
};

const appendSendMessage = (msg, img)=>{
    const chatDiscutionContentContainer = document.getElementById("chatDiscutionContentContainer");
    const messageTextArea = document.getElementById("messageTextArea");
    // if (messageTextArea.value.trim().length === 0)
    //   return;
    var htmlEles;
    if (!msg  && messageTextArea.value.trim().length === 0)
        return
    if (msg)
        htmlEles = getMesgDisplayer(msg.trim(), img, formatAMPM(new Date), true);
    else
        htmlEles = getMesgDisplayer(messageTextArea.value.trim(), img, formatAMPM(new Date), true);
    chatDiscutionContentContainer.insertAdjacentHTML("beforeend", htmlEles);
    const holder = messageTextArea.value;
    messageTextArea.value = "";
    scrollToBottom(chatDiscutionContentContainer);
    return holder;
}


const appendReceivedMessage = (msg, img)=>{
    
    const chatDiscutionContentContainer = document.getElementById("chatDiscutionContentContainer");
    if (!chatDiscutionContentContainer)
        return;
    if (!msg)
        return;
    const htmlEles = getMesgDisplayer(msg.trim(), img, formatAMPM(new Date), false);
    chatDiscutionContentContainer.insertAdjacentHTML("beforeend", htmlEles);

    scrollToBottom(chatDiscutionContentContainer);
}

export {appendSendMessage, appendReceivedMessage}

// ${
//     loadedImages.length > 0
//       ? `<div class="chatImgsContainer">
//         ${loadedImages
//           .map((ele) => {
//             return `<img src="${ele}"/>`;
//           })
//           .join(" ")}
//       </div>`
//       : ""
//   } 