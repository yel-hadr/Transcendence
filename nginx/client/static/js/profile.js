const initProfilePage = (infos)=>{
    console.log('Reach heer')
    console.log(infos)

    
    const profileInfoHolder = document.querySelectorAll(".profileInfoHolder")
    console.log(profileInfoHolder.length)
    profileInfoHolder.forEach(ele=>{
        if (ele.type === "password")
            return
        ele.innerHTML = infos[ele.id]
    }) 
}

const getPersonalInfos = ()=>{
    return new Promise((resolve, reject)=>{
        fetch(`https://${window.location.host}/api/self`, {method:'GET', credentials:"include", headers:{
            "Authorization": localStorage.getItem("Authorization")
        }}).then(res=>{
            // console.log(res)
            if (res.status === 200){
                res.json().then(res=>{
                    return resolve(res);
                })
            }else
                return resolve(res)
        })
    })
}


const requestEditinInfos = (e)=>{
    e.preventDefault(); 
    const profileInput = document.querySelectorAll('.profileInput');
    const profileImageInput = document.getElementById('profileImageInput')
    console.log("Send")
    const formData = new FormData();
    profileInput.forEach(ele=>{
        if (ele.value.trim().length > 0)
            formData.append(ele.name, ele.value)
    })
    console.log(profileImageInput.files[0])
    formData.append("img", profileImageInput.files[0]);
    fetch(`https://${window.location.host}/api/update`, {method: "POST", credentials:"include",body: formData, headers:{
        "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
        console.log(res)
        if (res.status === 200){
            res.json().then(res=>{
                console.log(res)
            })
        }
    })
    
}

const enable2Fa = ()=>{
    fetch(`https://${window.location.host}/api/enable2fa`, {method:"POST", headers:{
        "Authorization": localStorage.getItem("Authorization")
    }}).then(res=>{
        console.log(res);
        res.json().then(res=>{
            console.log(res)
        })
    })
}

const initProfile = async () => {
    const editProfileInfosForm = document.getElementById("editProfileInfosForm");
    const userInfos = await getPersonalInfos();
    const profileFullName = document.getElementById("profileFullName");
    const userAvatar = document.getElementsByClassName("userAvatar")[0];
    const twoFaButton = document.getElementById("twoFaButton");
    console.log(userAvatar)
    console.log("Profile Page");
    initProfilePage(userInfos)
    profileFullName.textContent = userInfos.fname + " " + userInfos.lname
    userAvatar.style.backgroundImage = `url('https://${window.location.host}/uploads/${userInfos.img}')`
 
    editProfileInfosForm.addEventListener("submit", requestEditinInfos)
    twoFaButton.addEventListener("click", enable2Fa)

   

    
    // console.log(userInfos)
    // now i need to listen to the click event on the expandBtn



};

export default initProfile; 
