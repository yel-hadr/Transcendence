import { colorFeedback } from "./funcs.js";

const changeDisplay = ()=>{
    const headingWrapper = document.getElementById("headingWrapper");
    const restorInputsWrapper = document.getElementById("restorInputsWrapper");
    const restorDescWrapper = document.getElementById("restorDescWrapper");
    const restorBtnWrapper = document.getElementById("restorBtnWrapper");
    // setTimeout(()=>{
        headingWrapper.style.transform = `translateY(-50%)`;
        restorDescWrapper.style.transform = `translateY(-50%)`;
        restorInputsWrapper.style.transform = `translateY(calc(-50% - 4px))`;
        restorBtnWrapper.style.transform = `translateY(calc(-50% - 5px))`;
    // }, 1000)
}

const handleFormSubmit = (e)=>{
    e.preventDefault();
    const emailInput = document.getElementById("emailInput")
   
    const optInput = document.getElementById("optInput")
    if (optInput.value.trim().length > 0)
        alert("Handling otp")
    else 
        alert("Handling email")
    
}

const preventTab = (e)=>{
    if (e.keyCode === 9)
        e.preventDefault(); 
}

const handleEmailForm = (e)=>{
    e.preventDefault();
    const emailInput = document.getElementById("emailInput");
    const submitEmailBtn = document.getElementById("submitEmailBtn");
    const emailHeading = document.getElementById("emailHeading");
    const submitSpan = document.getElementsByClassName("submitSpan")[0];
    const restorPassLoadingCircle = document.getElementsByClassName("restorPassLoadingCircle")[0];
    submitEmailBtn.disabled = true;
    emailInput.disabled = true;
    if (emailInput.value.trim().length === 0 || !emailInput.value.trim().includes("@")){
        colorFeedback('f', [submitEmailBtn, emailInput])
        return
    }
    submitSpan.style.display = "none"
    restorPassLoadingCircle.style.display = "block"
    const formData = new FormData();
    formData.append("email", emailInput.value.trim());

    fetch(`https://${window.location.host}/api/forgot_password`, {method:"POST", body:formData}).then(res=>{
        console.log(res);
        restorPassLoadingCircle.style.display = "none"
        submitSpan.style.display = "block"
        res.json().then(res=>{
            console.log(res)
            if(res.hasOwnProperty("success")){
                colorFeedback('s', [submitEmailBtn, emailInput])
                emailHeading.textContent = "Check your email";
                emailHeading.style.color = "green";

            }
        })
    })
    // changeDisplay();
    // document.getElementById("restorInputsWrapper").addEventListener('transitionend', ()=>{
    //     document.getElementById("optInput").focus();
    // })


}

const handlePasswordForm = (e)=>{
    e.preventDefault();
    const optInput = document.getElementById("optInput");
    const otpHeading = document.getElementById("otpHeading");
    const submitSpan = document.getElementsByClassName("submitSpan")[1];
    const restorPassLoadingCircle = document.getElementsByClassName("restorPassLoadingCircle")[1];

    const url = new URLSearchParams(window.location.search);
    const token = url.get("token");
    submitSpan.style.display = "none"
    restorPassLoadingCircle.style.display = "block"
    const formData = new FormData();
    formData.append("token", token);
    formData.append("passwd", optInput.value);
    fetch(`https://${window.location.host}/api/restore_password`, {method:"POST", body:formData}).then(res=>{
        console.log(res);
        res.json().then(res=>{
            restorPassLoadingCircle.style.display = "none"
            submitSpan.style.display = "block"
            console.log(res)
            if (res.hasOwnProperty("error")) {
                otpHeading.textContent = res.error;
                colorFeedback('f', [])
            }else if (res.hasOwnProperty("success")){
                colorFeedback('s', [])
                otpHeading.textContent = res.success;
                setTimeout(()=>{
                    document.getElementById("goToSign").click();
                }, 1000)
            }
        })
    })
}


const checkType = ()=>{
    const url = new URLSearchParams(window.location.search);
    console.log(url.get("token"))
    if (url.get("token") != null)
        return true;
    return false
}

const initPasswordRestoration = ()=>{
    const emailForm = document.getElementById("emailForm");
    const otpForm = document.getElementById("otpForm");
    const submitEmailBtn = document.getElementById("submitEmailBtn");
    const submitOtpBtn = document.getElementById("submitOtpBtn");

    
    if (checkType()){
        changeDisplay();
    }
    // console.log(typeCheck);

    // changeDisplay();

    emailForm.addEventListener("submit", handleEmailForm)
    otpForm.addEventListener("submit", handlePasswordForm)
    emailForm.addEventListener("keydown", preventTab)
    
    submitEmailBtn.addEventListener("click", handleEmailForm);
    submitOtpBtn.addEventListener("click", handlePasswordForm)


    // alert("HI")
}

export default initPasswordRestoration
