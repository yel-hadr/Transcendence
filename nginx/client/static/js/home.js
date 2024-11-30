import { router } from "./index.js";

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};


const getLeaderBoardChar = (infos) =>{
  const {image, userName, userPoints} = infos;
  return `<div class="leaderboardContentContainer">
  <span>
    <img
      src="https://${window.location.host}/uploads/${image}"
      style="width: 40px; height: 40px"
    />
    ${userName}</span
  >
  <span>${userPoints}</span>
</div>`
}


const getUserInfos = ()=>{
  return new Promise((resolve,reject)=>{
    fetch(`https://${window.location.host}/api/self`, 
      {method:"GET", credentials: 'include', headers:{
        "Authorization": localStorage.getItem("Authorization")
      }}).then(res=>{
        console.log(res)
        if (res.status == 200){

          res.json().then(res=>{
            return resolve(res)
          })
        } else 
            return resolve("error")
    })
  })
}

const setUpLeaderBoard = ()=>{
  const holder ={
    rank:"ko",
    image: "",
    userName:"",
    userPoints:"",
    level:""
  }
  const leaderboardTypeContainer = document.getElementsByClassName("leaderboardTypeContainer");
  for (var i = 0; i < 5; i++) {
    const node = new DOMParser().parseFromString(getLeaderBoardChar(holder), "text/html").body.firstElementChild
    const node2 = new DOMParser().parseFromString(getLeaderBoardChar(holder), "text/html").body.firstElementChild
    node.style.animationDelay =  `calc(1.5s + ${i * 200}ms)` //(i * 200) + "ms";
    node2.style.animationDelay =  `calc(1.5s + ${i * 200}ms)` //(i * 200) + "ms";
    leaderboardTypeContainer[0].appendChild(node)
    leaderboardTypeContainer[1].appendChild(node2)

  }

}

const setUpUserInfos = (infos)=>{
  const homePageUserName = document.getElementById("homePageUserName");
  const homeWelcomeUser = document.getElementById("homeWelcomeUser");
  homePageUserName.textContent = infos.username;
  homeWelcomeUser.textContent = "Hello " + infos.username;
}

const handleSearch = ()=>{
  const searchFormHolder = document.getElementById("searchFormHolder");
  const searchForFriendInput = document.getElementById("searchForFriendInput")
  const searchInputResult = document.getElementById("searchInputResult")
  const searchInputLoadingContainer = document.getElementById("searchInputLoadingContainer")
  searchForFriendInput.addEventListener("input", (e)=>{
    console.log(e.target.value.length)
    document.querySelectorAll(".homePageSearchLinkWrapper").forEach(ele=>{
      ele.remove()
      console.log("Removing")
    })
    if (e.target.value.trim().length > 0)
    searchInputResult.classList.add("showSearchInputResult")
    else if (e.target.value.trim().length === 0) {
      searchInputResult.classList.remove("showSearchInputResult")
      return
    }
    searchInputLoadingContainer.style.display = "flex";
    fetch(`https://${window.location.host}/api/search/${searchForFriendInput.value.trim()}`, {method:"GET", credentials:"include", headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      console.log(res)
      if (res.status === 200){

          searchInputLoadingContainer.style.display = "none";
          res.json().then(res=>{
            console.log(res)
            res.res.forEach(ele=>{
              const node = `
              <div class="homePageSearchLinkWrapper">
                <a class="homePageSearchLink" href="/user?name=${ele.username}" data-link>
                </a>
                <span data-link>${ele.username}</span>
              </div>  
              `
              searchInputResult.insertAdjacentHTML("beforeend", node)
              console.log(ele.username)
            })
          })
        }
        
      })
    })
}


const getFriendRequestTemplate = (infos) =>{
  const {inviter, inviter_id, status} = infos;
  return `
      <li>
      <div class="inviteRequestContainer">
        <p> <span class="inviterUserName">${inviter}</span> sent you a freind request</p>
        <div class="inviteRequestActionsContainer">
          <button class="inviteRequestBtn acceptInviBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
          </button>
          <button class="inviteRequestBtn rejectInviBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
          </button>
        </div>
      </div>
    </li>
  `
}

const acceptInviteRequest = (username)=>{
  const formData = new FormData();
  formData.append("username", username);
  fetch(`https://${window.location.host}/api/accept_friend`, {method:"POST", body: formData, credentials:'include', headers:{
    "Authorization": localStorage.getItem("Authorization")
  }}).then(res=>{
    console.log(res);
    res.json().then(res=>{
      console.log(res)
      const formData = new FormData();
      formData.append("user", username);
      fetch(`https://${window.location.host}/api/create_conv`, {method:"POST", body: formData, credentials:"include", headers:{
        "Authorization": localStorage.getItem("Authorization")
      }}).then(res=>{
        console.log(res);
        res.json().then(res=>{
          console.log(res)
        })
      })
      
    })
  })
}


const getGlobalLeaderBoard = ()=>{
  fetch(`https://${window.location.host}/api/leaderboard`, {method:"GET", credentials:"include", headers:{
    "Authorization": localStorage.getItem("Authorization")
  }}).then(res=>{
    console.log(res);
    if (res.status === 200){
      res.json().then(res=>{
        console.log(res);
        res.success.forEach((ele, idx)=>{
          // console.log(ele);
          if (idx > 10)
            return;
          const node = new DOMParser().parseFromString(getLeaderBoardChar({image: ele.img, userName: ele.username, userPoints: ele.score}), 'text/html').body.firstElementChild;
          document.getElementsByClassName("leaderboardTypeContainer")[0].appendChild(node)
        })
      })
    }
  })
}

const getFLeaderBoard = ()=>{
  fetch(`https://${window.location.host}/api/fleaderboard`, {method:"GET", credentials:"include", headers:{
    "Authorization": localStorage.getItem("Authorization")
  }}).then(res=>{
    console.log(res);
    if (res.status === 200){
      res.json().then(res=>{
        console.log(res);
        res.success.forEach((ele, idx)=>{
          console.log(ele);
          if (idx > 10)
            return;
          const node = new DOMParser().parseFromString(getLeaderBoardChar({image: ele.img, userName: ele.username, userPoints: ele.score}), 'text/html').body.firstElementChild;
          document.getElementsByClassName("leaderboardTypeContainer")[1].appendChild(node)
        })
      })
    }
  })
}



const initHome = async () => {
	handleSearch();
	// setUpLeaderBoard();
	const infos = await getUserInfos();  
	console.log(infos);
	setUpUserInfos(infos);
	// getFriendsRequests();

	// EDITS DYAL LIBI
	const homeOnlinePlayButton = document.getElementById('homeOnlinePlayButton');
	const homeOfflinePlayButton = document.getElementById('homeOfflinePlayButton');
	const PerformanceButton = document.getElementById('PerformanceButton');
	const homePlayTournament = document.getElementById('homePlayTournament');

	homeOnlinePlayButton.addEventListener('click', async () => {
		navigateTo('/gameModes');
	})

	homeOfflinePlayButton.addEventListener('click', async () => {
		navigateTo('/OfflineGame');
	})

  
	PerformanceButton.addEventListener('click', async () => {
		navigateTo('/Statistics');
	})
	homePlayTournament.addEventListener('click', async () => {
		navigateTo('/tournament');
	})
  getGlobalLeaderBoard();
  getFLeaderBoard();
};

export default initHome;
