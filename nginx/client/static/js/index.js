import Home from "../views/Home.js";
import Posts from "../views/Posts.js";
import Profile from "../views/Profile.js";
import Play from "../views/Play.js";
import Tournament from "../views/Tournament.js";
import Practice from "../views/Practice.js";
import Sign from "../views/Sign.js";
import Chat from "../views/Chat.js";
import User from "../views/User.js";
import PasswordReset from "../views/PasswordReset.js";
import CallBackView from "../views/CallBack.js";
import GameModes from "../views/GameModes.js";
import Game from "../views/Game.js"
import TournamentViewPage from "../views/TournamentViewPage.js";
import OfflineGame from "../views/OfflineGame.js";
import Statistics from "../views/Statistics.js";


import initSigning from "./signing.js";
import initHome from "./home.js";
import initPlay from "./play.js";
import { initChat } from "./chat.js";
import initProfile from "./profile.js";
import initUser from "./user.js";
import initPasswordRestoration from "./passwordRestor.js";
import initCallBack from "./callBack.js";
import initGameModes from "./gameModes.js";
import startGame from "./game.js"
import { initSockets, socket } from "./sockets.js";
import initTournament from "./tournaments.js";
import tournamentHub from "./tournamentHub.js";
import { initNotificationHandler } from "./notificationsHandler.js";
import startOfflineGame from "./offlineGame.js";
import initStatistics from "./statistics.js";


var isFirstTime = true;

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

var is_socket_open = false;
const checkAuth = () => {
  return new Promise((resolve, reject) => {
    fetch(`https://${window.location.host}/api/self`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status == 200) {
          res.json().then((res) => {
            if (!is_socket_open){
              is_socket_open = true;
            }
			
			      initSockets(res.id);
            return resolve({ state: true, desc: "User is authenticated", username: res.username });
          });
        } else if (res.status == 401) {
          res.json().then((res) => {
            console.log(res);
            if (!res.hasOwnProperty("token"))
              return resolve({
                state: false,
                desc: "User is not authenticated",
              });
            else {
              // alert("Okey this one")
              localStorage.setItem("Authorization", "Bearer " + res.token);
              if (!is_socket_open){
                is_socket_open = true;
			}
			        initSockets(res.id);	
              return resolve({ state: false, token: res.token });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err)
        alert("Server is down");
      });
  });
};

const selectJsFile = (match) => {


  if (match === 0) {
    initHome();
  } else if (match === 1) {
    // viewScript.src = "./js/profile.js";
    // viewScript.onload = () => {
      initProfile();
    // };
  } else if (match === 2) {
    viewScript.src = "./js/play.js";
    viewScript.onload = () => {
      initPlay();
    };
  } else if (match === 3) {
    
    // viewScript.src = "./js/tounament.js";
    // viewScript.onload = () => {
		initTournament();
    // };
  } else if (match === 5) {
    // viewScript.src = "./js/signing.js";
    // viewScript.onload = () => {
      initSigning();
    // };
  } else if (match === 6) {
    // viewScript.src = "./js/chat.js";
    // viewScript.onload = () => {
      initChat();
    // };
  } else if (match === 7) {
    // viewScript.src = "./js/user.js";
    // viewScript.onload = () => {
      initUser();
    // };
  } else if (match === 8) {
    // viewScript.src = "./js/passwordRestor.js";
    // viewScript.onload = () => {
      initPasswordRestoration();
    // }
  } else if (match === 9){
    // viewScript.src = "./js/callBack.js";
    // viewScript.onload = () => {
      initCallBack();
    // }
  } else if (match === 10){
    // viewScript.src = "./js/gameModes.js";
    // viewScript.onload = () => {
      initGameModes();
    // }
  } else if (match === 11){
    // viewScript.src = "./js/game.js";
    // viewScript.onload = () => {
      startGame();
    // }
  } else if (match === 12) {
	    tournamentHub();
  } else if (match === 13) {
		startOfflineGame();
  } else if (match === 14) {
	initStatistics();
  }
  // else {
  //   const homeRm = document.querySelectorAll([`[src="./static/js/home.js"]`]);
  //   homeRm.forEach((ele) => {
  //     ele.remove();
  //   });
  // }
  // document.body.appendChild(viewScript);
};

const router = async () => {
  
  var auth = await checkAuth();
  if (auth.hasOwnProperty("token")) auth = await checkAuth();
  console.log(auth);
  if(auth.state) {

  }
  // console.log("=====> ",auth)
  
  // if (isFirstTime){
  //   alert("okey ")
  //   isFirstTime = false;

  // }
  // console.log(auth);
  // if (!auth.state && location.pathname != "/signing") {
  //   document.getElementById("goToSign").click();
  //   return;
  // }else
    if (auth.state)
      document.getElementById("goToSign").href = "/profile";

  const routes = [
    {
      path: "/",
      view: Home,
    },
    {
      path: "/profile",
      view: Profile,
    },
    {
      path: "/play",
      view: Play,
    },
    {
      path: "/tournament",
      view: Tournament,
    },
    {
      path: "/practice",
      view: Practice,
    },
    {
      path: "/signing",
      view: Sign,
    },
    {
      path: "/chat",
      view: Chat,
    },
    {
      path: "/user",
      view: User,
    },
    {
      path: "/resetPassword",
      view: PasswordReset,
    },
    {
      path: "/callback",
      view: CallBackView,
    },
    {
      path: "/gameModes",
      view: GameModes,
    },
	{
		path: "/gayming",
		view: Game,
	},
	{
		path: "/TournamentHub",
		view: TournamentViewPage,
	},
	{
		path: "/OfflineGame",
		view: OfflineGame,
	},
	{
		path: "/Statistics",
		view: Statistics,
	},
  ];
  console.log(location.pathname.split("/")[1]);
  var match = routes.findIndex((ele) => ele.path === location.pathname);
  if (match != -1) {
    if (!auth.state && match != 8 && match != 9)
      match = 5
    // else if (match === 5 && auth.state) {
    //   match = 1;
    //   navigateTo("/profile");
    //   document.getElementById("goToSign").href = "/profile";
    // }
    const view = new routes[match].view();
    const styles = document.querySelectorAll(`[styleData]`);
    document.getElementById("app").innerHTML = await view.getHtml();
    selectJsFile(match);
  } else {
    console.log("404");
    // alert("Shite")
  }
};

const handleLogOut = ()=>{
  const logOutBtn = document.getElementById("logOutBtn");
  logOutBtn.addEventListener("click", () => {
    socket.close();
    fetch(`https://${window.location.host}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    }).then((res) => {
      console.log(res);
      res.json().then((res) => {

        console.log(res);
        socket.send(
          JSON.stringify({
            type: "logout",
          })
        )
        localStorage.removeItem("Authorization");
        if (res.hasOwnProperty("success"))
          document.getElementById("goToSign").click();
      });
    });
  });
}




const fuck = ()=>{
  const srcs = document.querySelectorAll("*");
  
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("Dome loaded");
  
  initNotificationHandler();

  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]") || e.currentTarget.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    } else {
      // console.log("Is not a link");
    }
  });
  handleLogOut();
  router();
});

window.addEventListener("popstate", router);

export {router}
