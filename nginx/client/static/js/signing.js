import {colorFeedback} from './funcs.js'

const initSigning = () => {

  // const
  const sigInUpImageHolder = document.getElementById("sigInUpImageHolder");
  const showSignUpBtn = document.getElementById("showSignUpBtn");
  const showSignInBtn = document.getElementById("showSignInBtn");
  const signInFirstInput = document.getElementById("signInFirstInput");
  const signUpFirstInput = document.getElementById("signUpFirstInput");
  const signInSubmit = document.getElementById("signInSubmit");
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");
  const signInPasswordInput = document.getElementById("signInPasswordInput");
  const showPasswordBtn = document.getElementById("showPasswordBtn");
  const signInUserNameErr = document.getElementById("signInUserNameErr");
  const signInPasswordErr = document.getElementById("signInPasswordErr");
  const signingHolder = document.getElementById("signingHolder");
  const signLoadContainer =
    document.getElementsByClassName("signLoadContainer");
  const signUpInput = document.querySelectorAll(".signUpInput");
  const signUpErr = document.querySelectorAll(".signUpErr");
  const signUpConfirmBtn = document.getElementById("signUpConfirmBtn");
  const signInLoading = document.querySelectorAll(".signInLoading");
  const signUpLoading = document.querySelectorAll(".signUpLoading");


  const signUpTxt = document.getElementById("signUpTxt");
  const signCofirmBtn = document.querySelectorAll(".signCofirmBtn");
  const inputHolder = document.querySelectorAll(".inputHolder");
  const showVerifyBox = document.getElementById("showVerifyBox");
  const signUpActionsContainer = document.getElementById("signUpActionsContainer");
  const signUpTitle = document.getElementById("signUpTitle");
  const otpInputHolder = document.getElementsByClassName("otpInputHolder")[0];
  const otpVerificationForm = document.getElementById("otpVerificationForm");
  const opInput = document.getElementsByClassName("opInput")[0];
  const submitOtpBtn = document.getElementById("submitOtpBtn");
  const signInIntra = document.getElementById("signInIntra");
  const signInLoadingCircle = document.getElementById("signInLoadingCircle");
  const intraTxtImgSpan = document.getElementById("intraTxtImgSpan");
  var isLocked = false;

  const showSignUp = () => {
    signingHolder.style.transform = "rotateY(180deg)";
    signUpFirstInput.focus();
  };

  const showSignIn = () => {
    signingHolder.style.transform = "rotateY(0deg)";
    signInFirstInput.focus();
  };

  showPasswordBtn.addEventListener("click", () => {
    if (signInPasswordInput.type === "text")
      signInPasswordInput.type = "password";
    else signInPasswordInput.type = "text";
  });

  const handleSignInForm = (e) => {
    e.preventDefault();
    console.log(signInFirstInput.value, signInPasswordInput.value);
    signInUserNameErr.style.display =
      signInFirstInput.value.length === 0 ? "inline-block" : "none";
    signInPasswordErr.style.display =
      signInPasswordInput.value.length < 5 ? "inline-block" : "none";

    if (
      signInFirstInput.value.length === 0 ||
      signInPasswordInput.value.length === 0
    )
      return;

    signInFirstInput.disabled = true;
    signInPasswordInput.disabled = true;
    signInSubmit.disabled = true;

    signInLoading[0].style.display = "block";
    showPasswordBtn.style.display = "none";
    signInLoading[1].style.display = "block";

    const formData = new FormData();
    formData.append("username", signInFirstInput.value)
    formData.append("password", signInPasswordInput.value);
    fetch(`https://${window.location.host}/api/login`, {method:"POST", body:formData , credentials:"include"}).then(res=>{
      console.log(res);
      if (res.status === 200){
        res.json().then(res=>{
          console.log(res)
          if (res.hasOwnProperty("token")) {
            colorFeedback('s', [signInSubmit]);
            console.log(res.token)
            localStorage.setItem("Authorization", "Bearer " + res.token);
            if (res.locked) {
              isLocked = true;
              signUpForm.style.display = "none";
              otpVerificationForm.style.display = "flex";
              signingHolder.style.transform = "rotateY(180deg)";
            }
          }
          else
            colorFeedback('f', [signInSubmit]);
        })
      }else
        colorFeedback('f', [signInSubmit]);
    })

    setTimeout(() => {
      signInLoading[0].style.display = "none";
      showPasswordBtn.style.display = "block";
      signInLoading[1].style.display = "none";
      signInFirstInput.disabled = false;
      signInPasswordInput.disabled = false;
      signInSubmit.disabled = false;
      // colorFeedback (nodes, blur, 'f');
      
      
      // console.log(nodes.length);
    }, 1000);
    ``;
  };

  const handleSignUpForm = (e) => {
    e.preventDefault();
    var checker = true;
    signUpInput.forEach((ele, idx) => {
      if (ele.value.length === 0) {
        checker = false;
        signUpErr[idx].style.display = "inline-block";
      } else signUpErr[idx].style.display = "none";
    });

    if (!checker) return;
    signUpInput.forEach((ele, idx) => {
      ele.disabled = true;
      signUpLoading[idx].style.display = "block";
    });
    signUpConfirmBtn.disabled = true;

    const formData = new FormData();
    formData.append("fname", signUpInput[0].value);
    formData.append("lname", signUpInput[1].value);
    formData.append("username", signUpInput[2].value);
    formData.append("email", signUpInput[3].value);
    formData.append("password", signUpInput[4].value);

    fetch(`https://${window.location.host}/api/register`, {
      method: "POST",
      credentials:"include",
      body: formData,
    }).then((res) => {
      console.log(res.status)
    
      if (res.status === 200) {
        res.json().then(res=>{
          console.log(res)
          signUpInput.forEach((ele, idx) => {
            ele.disabled = false;
            signUpLoading[idx].style.display = "none";
          });
          if(res.hasOwnProperty("error")){
            colorFeedback ('f', [signUpConfirmBtn]);
            signUpTxt.textContent = res.error;
            signUpTxt.style.color = "red"
            return
          }
          signUpTxt.textContent = "Your account created successfully, Verify your account down below";
          signUpTxt.style.color = "green"
          colorFeedback ('s', [signUpConfirmBtn]);
          signUpForm.style.display = "none";
          otpVerificationForm.style.display = "flex";
          localStorage.setItem("Authorization", "Bearer " + res.token)
        })}
      }
    );
  
    
  };

  const handleOtp = (e)=>{
    e.preventDefault();
    submitOtpBtn.disabled = true;
    const formData = new FormData();
    formData.append("otp", opInput.value);
    fetch(`https://${window.location.host}/api/${isLocked ? "challenge2fa" : "verify_otp"}`, {method:"POST", headers: {
      "Authorization": localStorage.getItem("Authorization")
    }, body: formData}).then(res=>{
      console.log(res);
      res.json().then(res=>{
        console.log(res);
        if (res.hasOwnProperty("success")) {
          // alert("success")
          colorFeedback('s', [submitOtpBtn])
        }else {
          colorFeedback('f', [submitOtpBtn])
          // alert("Error couldn't")
        }
      })

      
    })
  }

  const showOpt = ()=>{
    console.log("Executed")
    signInForm.style.display = "none";
    signUpForm.style.display = "none";
    otpVerificationForm.style.display = "flex";
    otpVerificationForm.style.transform = 'rotateY(0deg)';
  }

  const handleIntraLogIn = ()=>{

  }
 
 

  showSignUpBtn.addEventListener("click", showSignUp);
  showSignInBtn.addEventListener("click", showSignIn);

  signInForm.addEventListener("submit", handleSignInForm);
  signUpForm.addEventListener("submit", handleSignUpForm);
  otpVerificationForm.addEventListener("submit", handleOtp);

  signInIntra.addEventListener("click", ()=>{
    fetch(`https://${window.location.host}/api/auth/42`).then(res=>{
      console.log(res);
      res.json().then(res=>{
        console.log(res.success)
        if (res.hasOwnProperty("success")){
          signInFirstInput.disabled = true;
          signInPasswordInput.disabled = true;
          signInSubmit.disabled = true;
          intraTxtImgSpan.style.display = "none"
          signInLoadingCircle.style.display = "block";
          window.location.href = res.success;
          
        }
        console.log(res)
      })
    })
  })

  const urlParams = new URLSearchParams(window.location.search);
  const show = urlParams.get("show");
  if (show == 'otp'){
    showOpt()
  }
  
};

export default initSigning;
