import { router } from "./index.js";
import tournamentHub from "./tournamentHub.js";
import { colorFeedback } from "./funcs.js";

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

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

const CreateTournament = () => {
	return new Promise(async (resolve, reject)=>{
		const userInfo = await getUserInfo();
		const formData = new FormData();
		formData.append("admin_alias", userInfo.username);
		fetch(`https://${window.location.host}/api/create_tournament`, {method:'POST', body:formData, credentials:"include", headers:{
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

const JoinTournament = (TournamentID) => {
	return new Promise((resolve, reject)=>{
        fetch(`https://${window.location.host}/api/register_to_tournament?code=${TournamentID}`, {method:'GET', credentials:"include", headers:{
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

/*
	mlalama TODO:
		Tournament info he should check if the tournament hasnt started yet
		add abort tournament
*/


const abortTournament = (e)=>{
	// alert("Shite")
	
	const createTournamentTxt = document.getElementById('createTournamentTxt');
	const goToMyHostedTournament = document.getElementById('goToMyHostedTournament');
	const abortMyHostedTournament = document.getElementById('abortMyHostedTournament');
	const CreateTournamentButton = document.getElementById('CreateTournamentButton');
	const tournamentTxtHelper = document.getElementsByClassName('tournamentTxtHelper');
	abortMyHostedTournament.disabled = true;
	
	
	const formData = new FormData();
	formData.append("tournament_code", goToMyHostedTournament.className)
	fetch(`https://${window.location.host}/api/abort_tournament`, {method:"POST", credentials:"include", body:formData,  headers:{
		"Authorization": localStorage.getItem("Authorization")
	}}).then(res=>{
		if (res.status === 200) {

			res.json().then(res=>{
				console.log(res)
				if (res.hasOwnProperty("success")) {
					colorFeedback("s", [abortMyHostedTournament])
					createTournamentTxt.innerHTML = "Create a tounament and send the tounament link to your friends </br>You can send them the code from chat";
					createTournamentTxt.style.color = "white";
					tournamentTxtHelper[0].style.display = "none";
					
					abortMyHostedTournament.style.display = 'none';
					goToMyHostedTournament.style.display = 'none';
					CreateTournamentButton.style.display = 'block';
					goToMyHostedTournament.className = '';
				}
				// console.log(res);
			})
		}
	})
}

const goToMyTournament = (e)=>{
	const tournamentId = e.currentTarget.classList;
	console.log(tournamentId)
	if (tournamentId.length != 1)
		return;
	// navigateTo(tournamentId[0])
	navigateTo(`/TournamentHub?TournamentID=${tournamentId[0]}`)
	// alert("Let's go")
}

const initTournament = () => {
	const CreateTournamentButton = document.getElementById('CreateTournamentButton');
	const JoinTournamentButton = document.getElementById('JoinTournamentButton');
	const tournamentOptionsLoading = document.getElementsByClassName('tournamentOptionsLoading');
	const tournamentTxtHelper = document.getElementsByClassName('tournamentTxtHelper');
	const createTournamentTxt = document.getElementById('createTournamentTxt');
	const goToMyHostedTournament = document.getElementById('goToMyHostedTournament');
	const abortMyHostedTournament = document.getElementById('abortMyHostedTournament');
	const tournamentDiscriptionContainer = document.getElementsByClassName('tournamentDiscriptionContainer');
	const tournamentBtnsSpan = document.getElementsByClassName('tournamentBtnsSpan');
	var aTagHelp = document.createElement('a');
	
	CreateTournamentButton.addEventListener('click', async (e) => {
		tournamentBtnsSpan[2].style.display = 'none';
		tournamentOptionsLoading[2].style.display = 'block';
		CreateTournamentButton.disabled = true;
		const tournamentId = await CreateTournament();
		
		console.log(tournamentId)
		if (tournamentId.hasOwnProperty("error") &&
			tournamentId.error === "the user is already hosting a tournament"){
			createTournamentTxt.textContent = "You already hosting a tournament. You can't host multiple tournament at the same time";
			createTournamentTxt.style.color = "red";
			tournamentOptionsLoading[2].style.display = 'none';
			tournamentBtnsSpan[2].style.display = 'block';
			// tournamentTxtHelper[0].textContent = "You can access to your current tournament using the following link"
			// tournamentTxtHelper[0].style.display = 'block';
			colorFeedback('f', [CreateTournamentButton]);
			CreateTournamentButton.style.display = 'none';
			goToMyHostedTournament.style.display = 'block';
			abortMyHostedTournament.style.display = 'block';
			goToMyHostedTournament.classList.add(tournamentId.tournamentId)

		}else if (tournamentId.hasOwnProperty("success")) {
			colorFeedback("s", [CreateTournamentButton]);
			createTournamentTxt.textContent = "Your tournament has been created successfully";
			createTournamentTxt.style.color = "green";
			tournamentOptionsLoading[2].style.display = 'none';
			tournamentBtnsSpan[2].style.display = 'block';
			CreateTournamentButton.style.display = 'none';
			goToMyHostedTournament.style.display = 'block';
			goToMyHostedTournament.classList.add(tournamentId.success)
			// goToMyHostedTournament.classList.add(tournamentId.tournamentId)
		}
		// console.log(TournamentID);
		// if (TournamentID.success) {
		// 	// navigateTo(`/TournamentHub?TournamentID=${TournamentID.success}`);
		// } else {
		// 	console.log(TournamentID);
		// }
	})

	JoinTournamentButton.addEventListener('click', async () => {
		const inputValue = document.getElementById('JoinTournamentInput').value;
		if (inputValue.length) {
			const returnVal = await JoinTournament(inputValue);
			if (returnVal.success) {
				navigateTo(`/TournamentHub?TournamentID=${inputValue}`);
			}
			else {
				console.log(returnVal.error);
			}
		}
	})

	abortMyHostedTournament.addEventListener("click", abortTournament)
	goToMyHostedTournament.addEventListener("click", goToMyTournament)
}

export default initTournament