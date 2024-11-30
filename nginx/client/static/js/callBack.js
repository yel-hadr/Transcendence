const initCallBack = ()=>{
    const formData = new FormData();
    const url = new URLSearchParams(window.location.search)
    console.log(url.get("code"))
    if (url.get("code") == null) {
        alert('no code')
        return
    }
    fetch(`https://${window.location.host}/api/callback?code=${url.get("code")}`, {method:"GET"}).then(res=>{
        console.log(res);
        res.json().then(res=>{
            console.log(res)
            localStorage.setItem("Authorization", "Bearer " + res.token)
            window.location.href = "/profile"
        })
    })
    
}

export default initCallBack
