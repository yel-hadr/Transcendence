

// const initFriendsRequest = (res)=>{
//     console.log(res)
//     const freindRequestsLists = document.getElementById("freindRequestsLists");
//     res.success.forEach(ele=>{
//     const node = new DOMParser().parseFromString(getFriendRequestTemplate(ele), 'text/html').body.firstElementChild;
//     node.getElementsByClassName('acceptInviBtn')[0].addEventListener("click", ()=>{
//     const inviterUserName = node.getElementsByClassName("inviterUserName")[0].textContent
//     acceptInviteRequest(inviterUserName)
//     })
//     freindRequestsLists.appendChild(node);


//     console.log(ele)
// })
// }

// const getFriendsRequests = ()=>{
//     fetch(`https://${window.location.host}/api/friend_invs`, {method:"GET", credentials:"include", headers:{
//     "Authorization": localStorage.getItem("Authorization")
//     }}).then(res=>{
//     console.log(res);
//     res.json().then(initFriendsRequest)
//     })
// }

const createConvo = (username)=>{
    if (!username)
        return;
    const formData = new FormData();
    formData.append("user", username);
    fetch(`https://${window.location.host}/api/create_conv`, {method:"POST", credentials:"include", body:formData, headers:{
        "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
        console.log(res);
        res.json().then(res=>{
            console.log(res)
        })
    })
}



const getNotificationTemplate = (infos)=>{
    const {inviter, inviter_id, status} = infos;
    return `
    <li class="notificationRowContainer">
    <div class="notificationHolder">
      <p> <a class="inviterUserName" href="/user?name=${inviter}" data-link>${inviter} </a> sent you a friend request</p>
      <div class="notificationActionHolder">
        <button class="acceptFriendRequestBtn">
            <div class="notificationLoadingCircle"></div>
          <svg class="notificationCheckSvg" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
        </button>
        <button class="rejectFriendRequestBtn">
            <div class="notificationLoadingCircle"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
        </button>
      </div>
    </div>
  </li>
    `
}

const accpetFriend = (username) => {
    if (!username)
        return;
    return new Promise((resovle, reject)=>{
        const notificationLoadingCircle = document.getElementsByClassName("notificationLoadingCircle")[0];
        const notificationCheckSvg = document.getElementsByClassName("notificationCheckSvg")[0];
        notificationCheckSvg.style.display = 'none';
        notificationLoadingCircle.style.display = 'block';
        
        const formData = new FormData();
        formData.append("username", username);
        fetch(`https://${window.location.host}/api/accept_friend`, {method:"POST", body: formData, credentials:"include", 
        headers:{
            "Authorization": localStorage.getItem("Authorization")
        }}).then(res=>{
            notificationLoadingCircle.style.display = 'none';
            notificationCheckSvg.style.display = 'block';
            console.log(res);
            if (res.status != 200)
                return resovle(false) ;
            res.json().then(res=>{
                if (res.hasOwnProperty("success")) {
                    createConvo(username);
                    return resovle(true);
                }
                return resovle(false);
            })
        })

    })

}

const rejectFriend = (username)=>{
    if (!username)
        return null;
    return new Promise((resovle, reject)=>{
        const formData = new FormData();
        formData.append("username", username);
        fetch(`https://${window.location.host}/api/reject_friend`, {method:"POST", credentials:"include", body: formData, headers:{
            "Authorization": localStorage.getItem("Authorization")
        }}).then(res=>{
            console.log(res);
            if (res.status != 200)
                return resovle(false);
            res.json().then(res=>{
                if (!res.hasOwnProperty("success"))
                    return resovle(false);
                return resovle(true);
            })
        })
    })
}

const appendFriendRequests = (requests)=>{
    const notificationsList = document.getElementById("notificationsList");
    console.log(requests)
    if (!requests.hasOwnProperty("success"))
        return;
    requests.success.forEach(ele=>{
        const node = new DOMParser().parseFromString( getNotificationTemplate(ele) , "text/html").body.firstElementChild;
        node.getElementsByClassName("acceptFriendRequestBtn")[0].addEventListener("click", async ()=>{
            if (await accpetFriend(ele.inviter))
                node.remove();
        })
        node.getElementsByClassName("rejectFriendRequestBtn")[0].addEventListener("click",  async ()=>{
            if (await rejectFriend(ele.inviter));
                node.remove();
        })
        notificationsList.appendChild(node);
    })
}

const fetchFriendRequests = ()=>{
    fetch(`https://${window.location.host}/api/friend_invs`, {method:"GET", credentials:"include",
    headers:{
        "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
        console.log(res)    
        res.json().then((res)=>{
            console.log(res)
            if (res.success.length > 0)
                appendFriendRequests(res);
            else
                document.getElementById("notificationsList").innerHTML = `<p style="color:white">No requests</p>`
        })
        
    })
}

const toogleNotificationsView = ()=>{
    const notificationsContainer = document.getElementById("notificationsContainer");
    document.getElementById("showNotificationBtn").addEventListener("click", ()=>{
        if(notificationsContainer.style.top == '50%')
        notificationsContainer.style.top = '150%';
        else{
            notificationsContainer.style.top = "50%";
            document.querySelectorAll(".notificationRowContainer").forEach(ele=>{
                ele.remove();
            })
            fetchFriendRequests();
        }
    });
}

const appendGameNotification = (gameId)=>{

}

const appendFriendNotification = (who)=>{
    const notification = getNotificationTemplate({inviter: who})
    const node = new DOMParser().parseFromString(notification,"text/html").body.firstElementChild;
    node.getElementsByClassName("acceptFriendRequestBtn")[0].addEventListener("click", async ()=>{
        const x = await accpetFriend(ele.inviter);
        if (x)
            node.remove();
    })
    node.getElementsByClassName("rejectFriendRequestBtn")[0].addEventListener("click", async ()=>{
        if (await rejectFriend(ele.inviter));
            node.remove();
    })
    const notificationsList = document.getElementById("notificationsList");
    
    notificationsList.appendChild(node);


}


const initNotificationHandler = ()=>{
    toogleNotificationsView();
}



export {initNotificationHandler, appendFriendNotification}
