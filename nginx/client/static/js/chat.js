import { appendSendMessage, appendReceivedMessage } from "./chatHelp.js";
import { OnlineState_, socket } from "./sockets.js";

const scrollToBottom = (ele) => {
  ele.scrollTo(0, ele.scrollHeight);
};

var selectedFiles = [];
var loadedImages = [];
var convID = null;

var selectedUserId = null;
// const formatAMPM = (date) => {
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? "pm" : "am";
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? "0" + minutes : minutes;
//   var strTime = hours + ":" + minutes + " " + ampm;
//   return strTime;
// };

const readImage = (fileImage) => {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader();
    fileReader.onload = () => {
      resolve({ state: true, data: fileReader.result });
    };
    fileReader.onerror = (e) => {
      reject({ state: false, desc: "Error reading the image" });
    };
    fileReader.readAsDataURL(fileImage);
  });
};

const messagesEvents = () => {
  const openFileInputBtn = document.getElementById("openFileInputBtn");
  const fileMessageInput = document.getElementById("fileMessageInput");
  const openEmogiesSelectorBtn = document.getElementById(
    "openEmogiesSelectorBtn"
  );
  const emogiesContainer = document.getElementById("emogiesContainer");
  const emogieBtn = document.querySelectorAll(".emogieBtn");
  const messageTextArea = document.getElementById("messageTextArea");
  const emogiesCloser = document.getElementById("emogiesCloser");
  const chatDiscutionContentContainer = document.getElementById(
    "chatDiscutionContentContainer"
  );
  const discutionOptionList = document.getElementById("discutionOptionList");

  const openFileSelector = (e) => {
    fileMessageInput.click();
  };

  const openImage = (e) => {
    console.log(e.target);
  };

  const handleNewImage = async (e) => {
    for (const file of e.target.files) {
      if (selectedFiles.length >= 3) break;

      var img = await readImage(file);
      loadedImages.push(img.data);
      const listItem = document.createElement("li");
      listItem.classList.add("selectedImage");
      const imgEle = document.createElement("img");
      imgEle.src = img.data;
      imgEle.title = file.name;

      listItem.appendChild(imgEle);

      imgEle.addEventListener("click", openImage);
      // var html = `<li><img src="${img.data}" style="width: 30px; height: 30px;" title="${file.name}" /></li>`;
      discutionOptionList.appendChild(listItem);
      // insertAdjacentHTML("beforeend", html);
      selectedFiles.push(file);
      console.log(file);
    }
  };

  fileMessageInput.addEventListener("change", handleNewImage);

  const openEmogiesSelector = () => {
    if (emogiesContainer.classList.contains("initEmogieSelector")) {
      emogiesContainer.classList.remove("initEmogieSelector");
      emogiesContainer.classList.add("showEmogiesContainer");
      emogiesCloser.style.display = "block";
    } else if (emogiesContainer.classList.contains("showEmogiesContainer")) {
      emogiesContainer.classList.remove("showEmogiesContainer");
      emogiesContainer.classList.add("hideEmogieContainer");
    } else if (emogiesContainer.classList.contains("hideEmogieContainer")) {
      emogiesContainer.classList.remove("hideEmogieContainer");
      emogiesContainer.classList.add("showEmogiesContainer");
      emogiesCloser.style.display = "block";
    }
  };

  emogieBtn.forEach((ele) => {
    ele.addEventListener("click", () => {
      console.log(messageTextArea.selectionStart);
      messageTextArea.value += ele.textContent;
      messageTextArea.focus();
      //   messageTextArea.setSelectionRange(messageTextArea.value.length);
    });
  });

  emogiesCloser.addEventListener("click", (e) => {
    if (e.target.id === "emogiesCloser") {
      emogiesContainer.classList.remove("showEmogiesContainer");
      emogiesContainer.classList.add("hideEmogieContainer");
      e.target.style.display = "none";
      messageTextArea.focus();
    }
  });

  openFileInputBtn.addEventListener("click", openFileSelector);
  openEmogiesSelectorBtn.addEventListener("click", openEmogiesSelector);
  scrollToBottom(chatDiscutionContentContainer);
};

const handleSendMessage = (ele) => {
  const chatDiscutionContentContainer = document.getElementById(
    "chatDiscutionContentContainer"
  );
  const sendMessageBtn = document.getElementById("sendMessageBtn");
  const messageTextArea = document.getElementById("messageTextArea");



  
  sendMessageBtn.addEventListener("click", appendSendMessage);
  messageTextArea.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const message = appendSendMessage();
      if (!message)
        return;
      socket.send(
        JSON.stringify({
          message: message,
          type: "chat",
          sender_id: ele.user,
          conv_id: ele.conv_id
          
        })
      );
    }
  });
};

const getConversationContainer = (ele, delay, id) => {

  var msDelay = (delay * 100) + 300;
  const { fullName, msg, time, isOnline, profileImage } = ele;
  return `<div id="ContainerConv_${id}" class="discussionContainer" style="animation-delay:${msDelay + 'ms'}">
        <div class="profileImageContainer">
          <span style="display:none" id="onlineNotifiy_${id}"></span>
          <img src="https://${window.location.host}/uploads/${profileImage}" style="width:60px; height: 60px" draggable="false"/>
        </div>
        <div class="convDetailsContainer">
          <span></span>
          <span>${fullName}</span>
          <span class="conv_${id}">${msg}</span>
        </div>
      </div>`;
};

const pageFunctionality = () => {
 
  const gotBackToChatsContainer = document.getElementById(
    "gotBackToChatsContainer"
  );
  const goToMoreOptions = document.getElementById("goToMoreOptions");
  const goBackToChatFromUserInfos = document.getElementById(
    "goBackToChatFromUserInfos"
  );
  const goBackToDiscutionsFromUserInfo = document.getElementById(
    "goBackToDiscutionsFromUserInfo"
  );

  gotBackToChatsContainer.addEventListener("click", () => {
    chatWrapperContainer.style.transform = `translateY(0px)`;
  });
  goToMoreOptions.addEventListener("click", () => {
    chatWrapperContainer.style.transform = `translateY(-200%)`;
  });
  goBackToChatFromUserInfos.addEventListener("click", () => {
    chatWrapperContainer.style.transform = `translateY(-100%)`;
  });
  goBackToDiscutionsFromUserInfo.addEventListener("click", () => {
    chatWrapperContainer.style.transform = `translateY(0px)`;
  });
};



const initConversation = async (conv_id, userId, img) => {
  console.log("conv_id", conv_id);
  await fetch(`https://${window.location.host}/api/messages?conv_id=${conv_id}`, {
    method: "GET",
    headers: { "Authorization": localStorage.getItem("Authorization") },
  }).then((res) => {
    if (res.status != 200) {
      
      return;
    }
    res.json().then((res) => {
      document.querySelectorAll(".sentMsgContainer").forEach(ele=>{
        ele.remove()
      })
      document.querySelectorAll(".receivedMsgContainer").forEach(ele=>{
        ele.remove()
      })
      res.success.forEach((ele) => {
        if (ele.sender_id != userId) {
          appendSendMessage(ele.message, img);
        }else
          appendReceivedMessage(ele.message, img);
      })
      // console.log("hello from chat :" , res);
    });
  });
};


const onselectUser = (ele) => {
  const activeConversationWrapper = document.getElementById("activeConversationWrapper");
  const chatUserInfoImgHolder = document.getElementById("chatUserInfoImgHolder");
  initConversation(ele.conv_id, ele.user, ele.profileImage);
  activeConversationWrapper.innerHTML = `
      <span id="activeConversationUserName">${ele.fullname}</span>
        <span>AKA ${ele.username}</span>
      <span class="conversationOnlineState" id="OnlineState_${ele.conv_id}" style="color:${ele.online == 'online' ? "green"  : "red"}">${ele.online}</span>
      `
      chatUserInfoImgHolder.style.display = "flex";
      
      chatUserInfoImgHolder.innerHTML = `
      <img src="https://${window.location.host}/uploads/${ele.profileImage}">
      <span>${ele.fullname}</span>
      <span>AKA ${ele.username}</span>
      <ul id="chatFoptions">
        <li class="chatMobileOptions" id="goBackToChatFromUserInfos"><button>Back to chats</button></li>
        <li class="chatMobileOptions" id="goBackToDiscutionsFromUserInfo"> <button>Back to Discussion</button></li>
        
      </ul>
      `

}
var isFirst = true;
const createConversation = (ele, idx) => {
  
  ele.date = new Date(ele.date).toLocaleString();
  const node = new DOMParser().parseFromString(getConversationContainer({
    userId: ele.user,
    fullName: ele.fullname,
    msg: ele.last_message,
    isOnline: ele.online,
    time: ele.date,
    profileImage: ele.profileImage,
    nickName: ele.username,
  },0, ele.conv_id), "text/html").body.firstElementChild;
  document.getElementById("conversationListContainer").appendChild(node);

  node.addEventListener("click", () => {
    if (convID != ele.conv_id)
      isFirst = true;
    else if (OnlineState_ != "")
      ele.online = OnlineState_;
      isFirst = false;
    console.log("OnlineState_", OnlineState_);

    onselectUser(ele);
    handleSendMessage(ele);
    //<li><button id="${ele.user}">Block</button></li>
    const x = document.getElementById("chatFoptions");
    const y = new DOMParser().parseFromString("<li><button>Block</button></li>", 'text/html').body.firstElementChild;
    y.addEventListener("click", blockUser);
    x.appendChild(y);

    localStorage.setItem("ativeUser", ele.user)

    document.getElementById("chatDiscutionOptionsContainer").style.animation = "chatBoxSlideUp 400ms ease-in-out forwards";
    
    convID = ele.conv_id;
    selectedUserId = ele.user;
  });

};
const chat = ()=>{
  
  fetch(`https://${window.location.host}/api/convos`, {method:"GET", headers:{
    "Authorization": localStorage.getItem("Authorization")
  }}).then(res=>{
    if (res.status != 200) {
      return
    }
    console.log("hello from chat :" , res);
    res.json().then(res=>{
      res.success.forEach((ele)=>{
        createConversation(ele);
      })
    })
  })
}


const blockUser = ()=>{
  // console.log(localStorage.getItem("ativeUser"));
  
  const formData = new FormData();
  formData.append("user_id", localStorage.getItem("ativeUser"));
  fetch(`https://${window.location.host}/api/block`, {method:"POST", credentials:"include", body:formData, headers:{
    "Authorization": localStorage.getItem("Authorization")
  } }).then(res=>{
    if (res.status === 200){
      res.json().then(res=>{
        console.log(res);
      })
    }
  })
  
}

const initChat = () => {
  pageFunctionality();
  messagesEvents();
  chat();
  // testRecFunc();
  // document.getElementById("chatBlockUserBtn").addEventListener("click", blockUser);
};

export { initChat , convID};
