const getUserInfos = (userId) => {
  return new Promise((resolve, reject) => {
    fetch(`https://${window.location.host}/api/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    }).then((res) => {
      console.log(res);
      res.json().then((res) => {
        return resolve(res);
      });
    });
  });
};

const getFriends = ()=>{
  // return new Promise((resolve, reject)=>{
    fetch(`https://${window.location.host}/api/friends`, {method:"GET", credentials:"include", headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      if (res.status === 200){
        res.json().then(res=>{
          console.log(res)
        })
      }else{
        console.log("Some error")
      }
    })
  // })
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
          document.querySelectorAll(".homePageSearchLink").forEach(ele=>{
            ele.remove()
          })
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

const didISentInvite = ()=>{
  return new Promise((resolve, reject)=>{
    fetch(`https://${window.location.host}/api/friend_invs`, {method:"GET", credentials:"include", headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      console.log(res);
      if (res.status === 200) {
        res.json().then(res=>{
          resolve(res);
        }).catch(err=>{
          resolve(false);;
        })
      }else {
        resolve(false);
      }
    })
  })
}

const userFormUserName = ()=>{

}

const getMatchHistory = (userId)=>{
  return new Promise((resolve, reject)=>{
    // alert(userId)
    fetch(`https://${window.location.host}/api/match_history?id=${userId}`, {method:"GET", credentials:"include", headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      if (res.status === 200){
        res.json().then(res=>{
          resolve(res);
        })
      }else {
        resolve(false);
      }
    })
  })
}


const getHistoryTemplate = (user_a, user_b, user_aScore, user_BScore, player_a_state, player_b_state)=>{
  return `
    <div class="userMatchLog">
    <span>${user_a}</span>
    <span>VS</span>
    <span>${user_b}</span>
    <span>${user_a} scored: ${user_aScore}</span>
    <span>${user_b} scored: ${user_BScore}</span>
    <span>${user_a} ${player_a_state}</span>
    <span>${user_b} ${player_b_state}</span>
  </div>
  `
}

const initUser = async () => {
  handleSearch()
  const requestConvBtn = document.getElementById("requestConvBtn");
  const userFullName = document.getElementById("userFullName");
  const userNickName = document.getElementById("userNickName");
  const userProfileImage = document.getElementById("userProfileImage");
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("name");
  if (userId == null) return;
  const userInfos = await getUserInfos(userId);
  console.log(userInfos);

  userFullName.textContent = userInfos.fname + " " + userInfos.lname;
  userNickName.textContent = userInfos.username;
  userProfileImage.src = `https://${window.location.host}/uploads/${userInfos.img}`

  if (!userInfos.friends)
    requestConvBtn.style.display = 'block';

  // getFriends();
  //TODO
  const currentUserInfos = await getUserInfos(userId);
  const checkFriend = await didISentInvite();
  // console.log(currentUserInfos);
  const history = await getMatchHistory(currentUserInfos.user_id);
  console.log(history)
  history.forEach(ele=>{
    const node = new DOMParser().parseFromString(getHistoryTemplate(ele.user_a.username, ele.user_b.username, ele.user_a.score, ele.user_b.score, ele.user_a.status, ele.user_b.status), "text/html").body.firstElementChild;
    document.getElementsByClassName("userProfileMatchHistory")[0].appendChild(node);
  })
  // console.log(currentUserInfos)
  // console.log()

  requestConvBtn.addEventListener("click", ()=>{
    const formData = new FormData();
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("name");
    formData.append("username", userId);
    fetch(`https://${window.location.host}/api/add_friend`, {method:"POST", credentials:"include", body:formData, headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      console.log(res);
      res.json().then(res=>{
        if (res.hasOwnProperty("success")) {
          requestConvBtn.textContent = res.success;
        }
        console.log(res)
      })
    });
  })
};

export default initUser;
