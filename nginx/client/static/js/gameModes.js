import { router } from "./index.js";

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const CreateGame = () => {
	return new Promise((resolve, reject)=>{
        fetch(`https://${window.location.host}/api/create_game`, {method:'POST', credentials:"include", headers:{
            "Authorization": localStorage.getItem("Authorization")
        }}).then(res=>{
			if (res.status === 200){
				res.json().then(res=>{
                    return resolve(res);
                })
            }else
                return resolve(res)
        })
    })
}

const JoinGame = (gameId) => {
	return new Promise((resolve, reject)=>{
        fetch(`https://${window.location.host}/api/register_togame?game_id=${gameId}`, {method:'GET', credentials:"include", headers:{
            "Authorization": localStorage.getItem("Authorization")
        }}).then(res=>{
			if (res.status === 200){
				res.json().then(res=>{
                    return resolve(res);
                })
            }else
                return resolve(res)
        })
    })
}

const initGameModes = () => {
	const joinGameButton = document.getElementById("joinGameButton");
	const CreateGameButton = document.getElementById("CreateGameButton");

	joinGameButton.addEventListener('click', async () => {
		const inputValue =  document.getElementById("joinGameInput").value;
		if (inputValue.length) {
			const returnVal = await JoinGame(inputValue);
			if (returnVal.success) {
				navigateTo(`/gayming?gameID=${inputValue}`);
			}
			else {
				console.log(returnVal.error);
			}
		}
	})

	CreateGameButton.addEventListener('click', async () => {
		const gameId = await CreateGame();
		if (gameId.success) {
			navigateTo(`/gayming?gameID=${gameId.success}`);
		}
		else {
			console.log(gameId.error);
		}
	})
}

export default initGameModes
