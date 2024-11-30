const getUserInfo = async () => {
	return new Promise((resolve, reject) => {
		fetch(`https://${window.location.host}/api/self`, {
			method: 'GET',
			credentials: "include",
			headers: {
				"Authorization": localStorage.getItem("Authorization")
			}
		}).then(res => {
			if (res.status === 200) {
				res.json().then(resolve);
			} else {
				resolve(res);
			}
		});
	});
}

const getUserMatches = async (UserID) => {
	return new Promise((resolve, reject)=>{
        fetch(`https://${window.location.host}/api/match_history?id=${UserID}`, {method:'GET', credentials:"include", headers:{
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

const getGlobalLeaderboard = async () => {
	return new Promise((resolve, reject)=>{
        fetch(`https://${window.location.host}/api/leaderboard`, {method:'GET', credentials:"include", headers:{
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

const getFriendsLeaderboard = async () => {
	return new Promise((resolve, reject)=>{
        fetch(`https://${window.location.host}/api/fleaderboard`, {method:'GET', credentials:"include", headers:{
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

let NumOfPlayedMatches = 0;
let NumOfWins = 0;
let NumOfLoses = 0;
let GamesLostx = 0;
let GPos = 1;
let FPos = 1;

const fillMatchesStats = (Matches, Username) => {
	console.log(Matches);
	for (let match of Matches) {
		console.log(match);
		if (match.game.status === 'done') {
			NumOfPlayedMatches += 1;
			if ((Username === match.user_a.username && match.user_a.status === "Winner") || 
			(Username === match.user_b.username && match.user_b.status === "Winner")) {
				NumOfWins += 1;
			}
			else {
				NumOfLoses += 1;
			}
		}
	}
}

const getUserGlobalPosition = (GlobalLeaderboard, Username) => {
	for(let user in GlobalLeaderboard) {
		if (user.username === Username) {
			break;
		}
		GPos += 1;
	}
}

const getUserFriendsPosition = (FriendsLeaerboard, Username) => {
	for(let user in FriendsLeaerboard) {
		if (user.username === Username) {
			break;
		}
		GPos += 1;
	}
}

const displayWinLossRatio = () => {
	let xValues = ["wins", "Losses"];
	let yValues = [NumOfWins, NumOfLoses];
	let barColors = [
	"#008000",
	"#FF0000"
	];

	new Chart("WinLossRatio", {
	type: "pie",
	data: {
		labels: xValues,
		datasets: [{
		backgroundColor: barColors,
		data: yValues
		}]
	},
	options: {
		title: {
		display: true,
		text: "Your Win/loss ratio"
		}
	}
	});
}


const initStatistics = async () => {
	const GamesPlayed = document.getElementById('GamesPlayed');
	const GamesLost = document.getElementById('GamesLost');
	const GamesWon = document.getElementById('GamesWon');
	const GlobalPosition = document.getElementById('GlobalPosition');
	const FriendsPosition = document.getElementById('FriendsPosition');
	const UserInfo = await getUserInfo();
	const UserMatches = await getUserMatches(UserInfo.id);
	const GlobalLeaderboard = await getGlobalLeaderboard();
	const FriendsLeaerboard = await getFriendsLeaderboard();

	fillMatchesStats(UserMatches, UserInfo.username);
	getUserGlobalPosition(GlobalLeaderboard, UserInfo.username);
	getUserFriendsPosition(FriendsLeaerboard, UserInfo.username);

	GamesLost.textContent = `${NumOfLoses}`
	GamesWon.textContent = `${NumOfWins}`
	GamesPlayed.textContent = `${NumOfPlayedMatches}`;
	GlobalPosition.textContent = `${GPos}`;
	FriendsPosition.textContent = `${FPos}`;

	displayWinLossRatio();
}

export default initStatistics
