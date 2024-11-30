import { router } from "./index.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

// var hasEnded = false;

// const getTournamentInfos = ()=>{
//   return new Promise((resolve, reject)=>{
//     const url = new URLSearchParams(window.location.search);
//     const code = url.get("TournamentID");
//     fetch(`https://${window.location.host}/api/tournament_infos?code=${code}`, {method:"GET",credentials:"include", headers:{
//       "Authorization": localStorage.getItem("Authorization")
//     }}).then(res=>{
//       if (res.status === 200){
//         res.json().then(res=>{
//           // console.log(res);
//           return resolve(res);
//         })
//       }
//       else
//         resolve(false);
//     })
//   })
// }

// const getMyInfos = ()=>{
//   return new Promise((resolve, reject)=>{
//     fetch(`https://${window.location.host}/api/self`, {method:"GET", credentials:"include", headers:{
//       "Authorization": localStorage.getItem("Authorization")
//     }}).then(res=>{
//       if (res.status === 200)
//       {
//         res.json().then(res=>{
//           return resolve(res);
//         })
//       }else
//         return resolve(false);
//     })
//   })
// }

// const startTournament = ()=>{
  
//   fetch(`https://${window.location.host}/api/start_tournament`, {method:"POST", credentials:"include", headers:{
//     "Authorization": localStorage.getItem("Authorization")
//   }}).then(res=>{
//     if (res.status === 200){
//       console.log(res);
//       res.json().then(res=>{
//         console.log(res)
//         if (res.hasOwnProperty("error")){
//           alert("Something went wrong")
//         }else if (res.hasOwnProperty("success")){
//           // document.getElementById("relaodBtn").disabled = true;
//           document.getElementById("notfiyMsg").textContent = "Tournament started successfully. reload to start playing"
//           document.getElementById("notfiyMsg").style.color = "green";
//           document.getElementById("notfiyMsg").style.display = "block"; 
//             // navigateTo(`/${window.location.href}`)
//         }
//       })
//     } else {
//       alert("Server error");
//     }
//   })
  
// }

// const tournamentEnded = ()=>{
//   document.getElementById("relaodBtn").style.display = 'none';
// }

// const goNextRound = ()=>{
//   const url = new URLSearchParams(window.location.search);
//   const code = url.get("TournamentID");
//   const formData = new FormData();
//   formData.append("tournament_code", code);
//   fetch(`https://${window.location.host}/api/next_round`, {method:"POST", credentials:"include", body: formData, headers:{
//     "Authorization": localStorage.getItem("Authorization")
//   }}).then(res=>{
//     console.log(res);
//     if (res.status === 200){
//       res.json().then(res=>{
//         if (res.hasOwnProperty("error") && res.error === 'tournament has ended') {
//           tournamentEnded();
//         }   
//         console.log(res)
//       })
//     }
//   });
// }


// const iamAdmin = (tournamentInfos, myInfos)=>{
//   console.log(tournamentInfos.status);
//   console.log(tournamentInfos.players.length)
//   const notfiyMsg = document.getElementById("notfiyMsg");
//   if (tournamentInfos.status === 'waiting' && tournamentInfos.players.length === 4){
//     if (tournamentInfos.admin === myInfos.username) {
//       notfiyMsg.textContent = "Tournament gonna start in 1s";
//       notfiyMsg.style.color = 'green';
//       notfiyMsg.style.display = 'block';
//       setTimeout(()=>{
//         startTournament();
//       },1000)
//     }
//     // startTournament();
//   } else if (tournamentInfos.status === 'ongoing'){
//     console.log(tournamentInfos)
//     // if (tournamentInfos.rounds.length > 1) {
//       goNextRound()
//     // }
//   } else if (tournamentInfos.players.length < 4) {
//     notfiyMsg.textContent = "There is no enought players! " + tournamentInfos.players.length + " / 4";
//     notfiyMsg.style.display = 'block';
//   }
// }

// const imPlayer = (myInfos, tournamentInfos)=>{
//   const notfiyMsg = document.getElementById("notfiyMsg");
//   if (tournamentInfos.status === 'waiting' && tournamentInfos.players.length === 4){
//       notfiyMsg.textContent = "Waiting for the admin to start";
//       notfiyMsg.style.color = 'yellow';
//       notfiyMsg.style.display = 'block';
//   }
//   else if (tournamentInfos.status === 'ongoing'){
//     // const myMatch = tournamentInfos.rounds[0].round[0].find(ele => ele.splayer == myInfos.id || ele.fplayer == myInfos.id)

//     // for (var i = 0; i < tournamentInfos.rounds.length; i++) {
//     //   // if (tournamentInfos.rounds[i].round[])
//     //   console.log(tournamentInfos.rounds[i].round)
//     //   if (tournamentInfos.rounds[i].round)
//     // }
//     const myMatch = tournamentInfos.rounds.at(-1).round.find(ele => ele.fplayer == myInfos.id || ele.splayer == myInfos.id);
//     // console.log(myMatch)

    
//     if (!myMatch)
//     {
      
//       document.getElementById("notfiyMsg").textContent = "You have failed";
//       document.getElementById("notfiyMsg").style.color = "red";
//       document.getElementById("notfiyMsg").style.display = "block";
//     }
//     else if (myMatch.status === 'waiting') {
      
//       const myMatch = tournamentInfos.rounds.at(-1).round.find(ele => ele.fplayer == myInfos.id || ele.splayer == myInfos.id);
//       console.log(myMatch)
//       if (!myMatch) {
        
//         document.getElementById("notfiyMsg").textContent = "You have failed";
//         document.getElementById("notfiyMsg").style.color = "red";
//         document.getElementById("notfiyMsg").style.display = "block";
//       } else {
//         const enimeId = myMatch.fplayer === myInfos.id ? myMatch.splayer : myMatch.splayer;
//         const enimeInfos = tournamentInfos.players.find(ele=> ele.id === enimeId);
//         console.log(enimeInfos);
//         document.getElementById("myEnimeImage").src = `https://${window.location.host}/uploads/${enimeInfos.img}`;
//         document.getElementById("myEnimeUsername").textContent = enimeInfos.username;
//         document.getElementById("notfiyMsg").textContent = "Your match ganna start in 1s";
//         document.getElementById("notfiyMsg").style.color = "green";
//         document.getElementById("notfiyMsg").style.display = "block";
//         setTimeout(()=>{
//           navigateTo(`/gayming?gameID=${myMatch.token}&tournament=true`);
//         }, 1000)

//       }
//     } 
//     else if(myMatch.status === 'done') {
//       //final
//       if (myMatch.fplayer === myInfos.id ) {
//         if ( myMatch.fplayer_score > myMatch.splayer_score) {
//           document.getElementById("notfiyMsg").textContent = "You have won";
//           document.getElementById("notfiyMsg").style.color = "green";
//           document.getElementById("notfiyMsg").style.display = "block";
//         }
//         else {
//           document.getElementById("notfiyMsg").textContent = "You have failed";
//           document.getElementById("notfiyMsg").style.color = "red";
//           document.getElementById("notfiyMsg").style.display = "block";
//           alert("Fialed")
          
//         }
//       }else {
//         if ( myMatch.fplayer_score < myMatch.splayer_score){
//           document.getElementById("notfiyMsg").textContent = "You have won";
//           document.getElementById("notfiyMsg").style.color = "green";
//           document.getElementById("notfiyMsg").style.display = "block";
//         }
//         else {
//           document.getElementById("notfiyMsg").textContent = "You have failed";
//           document.getElementById("notfiyMsg").style.color = "red";
//           document.getElementById("notfiyMsg").style.display = "block";
//           alert("Fialed")
//         }
//       }
//     }
//   }
//   else if (tournamentInfos.players.length < 4) {
//     notfiyMsg.textContent = "There is no enought players! " + tournamentInfos.players.length + " / 4";
//     notfiyMsg.style.display = 'block';
 
//   }

// }

const handleWebSocketMessage = () => {

}

const handleWebSocketClose = () => {

}

const getMathInfo = (gid)=>{
  return new Promise((resolve, reject) =>{
    fetch(`https://${window.location.host}/api/game_infos?gid=${gid}`, {method:"GET", credentials:'include', headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      console.log(res);
      if (res.status === 200) {
        res.json().then(res=>{
          // console.log(res)
          resolve(res)
        }).catch(err=>{
          resolve(false);
        })
      }else {
        resolve(false);
      }
    })

  })
}

const getUserInfosFromId = (userId)=>{
  return new Promise((resolve, reject)=>{
    fetch(`https://${window.location.host}/api/id/${userId}`, {method:"GET", credentials:'include', headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      if (res.status === 200) {
        
        res.json().then(res=>{
          resolve(res);
        })
      }else{
        resolve(false);
      }
    })
  })
}

const getTournamentInfos = ()=>{
  return new Promise((resolve, reject)=>{
    const url = new URLSearchParams(window.location.search);
    const tournamentId = url.get("TournamentID");
    console.log(tournamentId);
    fetch(`https://${window.location.host}/api/user_tournament_infos?code=${tournamentId}`, {method:"GET", credentials:"include", headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      console.log(res);
      if (res.status === 200) {
        res.json().then(res=>{
           resolve(res);
        })
      } else 
        resolve(false);
    }).catch(err=>{
      resolve(false);
    })
  })
}

const getMyInfos = ()=>{
  return new Promise((resolve, reject)=>{
    fetch(`https://${window.location.host}/api/self`, {method:"GET", credentials:"include", headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      if (res.status === 200)
      {
        res.json().then(res=>{
          return resolve(res);
        })
      }else
        return resolve(false);
    })
  })
}



const requestStartingTournament = ()=>{
  fetch(`https://${window.location.host}/api/start_tournament`, {method:"POST", credentials:"include", headers:{
    "Authorization": localStorage.getItem("Authorization")
  }}).then(res=>{
    if (res.status === 200){
      console.log(res);
      res.json().then(res=>{
        console.log(res)
        if (res.hasOwnProperty("error")){
          alert(res.error)
        }else if (res.hasOwnProperty("success")){
        }
      })
    } else {
      alert("Server error");
    }
  })

}


const adminStartTheGame = ()=>{

  document.getElementById("adminOptions").style.display = "block";
  document.getElementById("adminOptions").addEventListener("click", ()=>{
    requestStartingTournament();
  })

}

const requestNextRound = ()=>{
  
    const formData = new FormData();
    const url = new URLSearchParams(window.location.search);
    const code = url.get("TournamentID");
    formData.append("tournament_code", code);
    fetch(`https://${window.location.host}/api/next_round`, {method:"POST", credentials:"include", body:formData, headers:{
      "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
      console.log(res);
      if (res.status === 200){
          res.json().then(res=>{
            if (res.hasOwnProperty("error") && res.error == "tournament has ended") {
              document.getElementById("notfiyMsg").textContent = "Tournament has ended. redirect to your home page in 1s";
              document.getElementById("notfiyMsg").style.color = "green";
              document.getElementById("notfiyMsg").style.display = "block";
              setTimeout(()=>{
                 navigateTo(`https://${window.location.host}/profile`)
              }, 1000)
            } else {
              console.log(res);
              alert("Next round requested")

            }
          })
      }else{
        
      }
    })

  
}

const waitingForAdminToStartGame = ()=>{
  // console.log("Wating for a game i'm not admin")
  alert("Waiting for the admin to start tournament")
}

const qualified = async (myInfos, tournament)=>{
  if(tournament.reason === "game didn't start yet" && myInfos.username == tournament.admin) {
    adminStartTheGame();
  } else if (tournament.reason === "game didn't start yet" && myInfos.username != tournament.admin) {
    waitingForAdminToStartGame();
  } else if (tournament.reason === "player is waiting for a game") {
    // alert("Here")
   
    const myMatchInfos = await getMathInfo(tournament.token);
    console.log(myMatchInfos)
    console.log(tournament)
    const myEnime = await getUserInfosFromId(myMatchInfos.splayer === myInfos.id ? myMatchInfos.fplayer : myMatchInfos.splayer);
    document.getElementById("myEnimeImage").src = `https://${window.location.host}/uploads/${myEnime.img}`
    document.getElementById("myEnimeUsername").textContent = myEnime.username
    document.getElementById("notfiyMsg").textContent = "Game gonna start in 1s";
    document.getElementById("notfiyMsg").style.color = "green";
    document.getElementById("notfiyMsg").style.display = "block";
    setTimeout(()=>{
       navigateTo(`https://${window.location.host}/gayming?gameID=${tournament.token}`)
    }, 1000)
    // redirect the user for another game
  } else if (tournament.reason === "player is in the middle of a game") {
    // do nothing
  } else if (tournament.reason === "player won the last match" && myInfos.username == tournament.admin){
    // admin go next procceed to the next round
    // document.getElementById("adminStartTournament").style.display = 'none';
    // document.getElementById("goNextRoundRequestBtn").style.display = 'block';
    document.getElementById("goNextRoundRequestBtn").addEventListener("click", requestNextRound);
  } else if (tournament.reason === "player won the last match" && myInfos.username != tournament.admin){
    // not ask the admin to go to the next round
  }else if (tournament.reason === "player won the tournament") {
    document.getElementById("notfiyMsg").textContent = "You won the tournament. redirect to your home page in 1s";
    document.getElementById("notfiyMsg").style.color = "green";
    document.getElementById("notfiyMsg").style.display = "block";
    setTimeout(()=>{
       navigateTo(`https://${window.location.host}/profile`)
    }, 1000)
  }

}

const disqualified = (myInfos, tournament)=>{
  // alert the user that the game is done and he lost

  if(myInfos.username != tournament.admin) {
    // document.getElementById("adminOptions").style.display = 'none'
    document.getElementById("notfiyMsg").textContent = "You have lost. redirecting to profile page in 1s";
    document.getElementById("notfiyMsg").style.color = "red";
    document.getElementById("notfiyMsg").style.display = "block";
    
    setTimeout(()=>{
      navigateTo(`https://${window.location.host}/profile`);
      
    }, 1000);
    
  }else {
    // document.getElementById("adminStartTournament").style.display = 'none';
    // document.getElementById("goNextRoundRequestBtn").style.display = 'block';
    
    document.getElementById("goNextRoundRequestBtn").addEventListener("click", requestNextRound);


  }

}

const theNone = (myInfos, tournament)=>{
  // tournament is done
}

const init = async ()=>{
  const infos = await getTournamentInfos().catch(err => err);
  const myInfos = await getMyInfos().catch(err => err)

  document.getElementById("myTournamentImg").src = `https://${window.location.host}/uploads/${myInfos.img}`;
  document.getElementById("myTournamentUserName").textContent = myInfos.username;

  console.log(infos);

  if (infos.admin == myInfos.username) {
    document.getElementById("adminOptions").style.display = 'block';
  }


  if (infos.status === "qualified") {
    qualified(myInfos, infos);
  } else if (infos.status === "disqualified") {
    disqualified(myInfos, infos);
  } else if (infos.status === "None") {
    theNone(myInfos, infos);
  }
  

  
  // const myTournamentImg = document.getElementById("myTournamentImg")
  // const myTournamentUserName = document.getElementById("myTournamentUserName")
  // const adminStartTournament = document.getElementById("adminStartTournament")

  // const tournamentInfos = await getTournamentInfos();
  // const myInfos = await getMyInfos();
  // const socket = new WebSocket(`wss://${window.location.host}/webs/tournament/${tournamentInfos.Tournament_token}/${myInfos.username}/${myInfos.id}/`);

  // socket.onopen = () => {}// console.log('WebSocket is connected.');
  // socket.onmessage = (event) => handleWebSocketMessage(event);
  // socket.onclose = (event) => handleWebSocketClose(event);

  // console.log(tournamentInfos)
  // console.log(myInfos)
  // if (tournamentInfos.admin === myInfos.username) {
  //   iamAdmin(tournamentInfos, myInfos);
  //   document.getElementById("imAdmin").style.display = 'block';
  // }
  // imPlayer(myInfos, tournamentInfos);

  //   // document.getElementById("adminOptions").style.display = "flex";
  // myTournamentImg.src = `https://${window.location.host}/uploads/${myInfos.img}`;
  // myTournamentUserName.textContent = myInfos.username.length > 8 ? myInfos.username.substr(0, 5) + "..." :  myInfos.username;
  // if (tournamentInfos.rounds.length > 0){
  //   // const myMatch = tournamentInfos.rounds.at(-1).round.find(ele => ele.fplayer == myInfos.id || ele.splayer == myInfos.id);
  //   // if (myMatch) {
  //   //   alert("I have a match")
  //   // }
  // }
  // adminStartTournament.addEventListener('click', startTournament);
}

const tournamentHub = async () => {
  init();
  document.getElementById("relaodBtn").addEventListener("click", ()=>{
    init();
  });

};

export default tournamentHub;