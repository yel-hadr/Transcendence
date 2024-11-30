import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Signing");
	this.setDescription("Sign in and start playing pong!")
  }
  async getHtml() {
	// this.checkAuth();
    return `
     <div id="signingContainer">
		<div id="signingHolder">
			<form id="signInForm" class="signForm">
				<div class="signFormHeader">
					<span class="signTitle">Welcome back</span>
					<span class="signTxt">Sign-in to your account below</span>
				</div>
				<div class="signInOptionsContainer">
					<button class="signInbtn" id="signInIntra" type="button">
					 	<span id="intraTxtImgSpan">
						 <span>Sign-in with intra</span><img src="https://${window.location.host}/images/llogo.svg" alt="" draggable="false">
						</span>
						<div id="signInLoadingCircle"></div>
					 </button>
				</div>
				<div class="inputHolder">
					<label for="signInFirstInput">user name or email <span id="signInUserNameErr">Necessary</span> </label>
					<input value="sbahdi" id="signInFirstInput" type="text" placeholder="user name or email" autocomplete="off" >
					<div class="signInLoading"></div>
				</div>
				<div class="inputHolder">
					<label for="">Password <span id="signInPasswordErr">Necessary</span></label>
					<input value="47zuXbdOKYheX8p" id="signInPasswordInput" type="password" placeholder="Password" min="5" max="25">
					<button type="button" id="showPasswordBtn"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="white" d="m10.12 10.827l4.026 4.027a.5.5 0 0 0 .708-.708l-13-13a.5.5 0 1 0-.708.708l3.23 3.23A6 6 0 0 0 3.2 6.182a6.7 6.7 0 0 0-1.117 1.982c-.021.061-.047.145-.047.145l-.018.062s-.076.497.355.611a.5.5 0 0 0 .611-.355l.001-.003l.008-.025l.035-.109a5.7 5.7 0 0 1 .945-1.674a5 5 0 0 1 1.124-1.014L6.675 7.38a2.5 2.5 0 1 0 3.446 3.446m-3.8-6.628l.854.854Q7.564 5 8 5c2.044 0 3.286.912 4.028 1.817a5.7 5.7 0 0 1 .945 1.674q.025.073.035.109l.008.025v.003l.001.001a.5.5 0 0 0 .966-.257v-.003l-.001-.004l-.004-.013a2 2 0 0 0-.06-.187a6.7 6.7 0 0 0-1.117-1.982C11.905 5.089 10.396 4 8.002 4c-.618 0-1.177.072-1.681.199"/></svg></button>
					<div class="signInLoading"></div>
				</div>
				
				<!-- <span class="signTitle">Sign-in</span> -->
				<div class="signInActionsContainer">
					<button id="showSignUpBtn" type="button" class="signCofirmBtn">Sign-up</button>
					
					<button id="signInSubmit" type="submit" class="signCofirmBtn"> <span> Sign-in </span></button>
				</div>
				<div id="linkWrapper">
					<a href="/resetPassword" class="forgotPassLink" data-link></a>
					<span>Forgot password?</span>
				</div>
			</form>
			<form id="signUpForm" class="signForm">
				<div class="signFormHeader">
					<span class="signTitle" id="signUpTitle">Sign-up</span>
					<span class="signTxt" id="signUpTxt">Sign-up and start playing</span>
				</div>
				<div class="inputHolder">
					<label for="">First name <span class="signUpErr">Necessary</span></label>
					<input value="salah" class="signUpInput" name="fname" id="signUpFirstInput" type="text" placeholder="First name" min="5" autocomplete="off">
					<div class="signUpLoading"></div>
				</div>
				<div class="inputHolder">
					<label for="">Last name <span class="signUpErr">Necessary</span></label>
					<input value="eddine" class="signUpInput" name="lname" type="text" placeholder="Last name" min="5" autocomplete="off" >
					<div class="signUpLoading"></div>
				</div>
				<div class="inputHolder">
					<label for="">User name <span class="signUpErr">Necessary</span></label>
					<input value="sbahdi" class="signUpInput" name="username" type="text" placeholder="User name" min="5" autocomplete="off">
					<div class="signUpLoading"></div>
				</div>
				<div class="inputHolder">
					<label for="">Email <span class="signUpErr">Necessary</span></label>
					<input value="aitsalaheddine2009@lmongol.lol" class="signUpInput" name="email" type="email" placeholder="example@email.com" min="5" autocomplete="off">
					<div class="signUpLoading"></div>
				</div>
				<div class="inputHolder">
					<label for="">Password <span class="signUpErr">Necessary</span></label>
					<input value="47zuXbdOKYheX8p" class="signUpInput" name="password" type="password" placeholder="Password" min="5" >
					<div class="signUpLoading"></div>
				</div>
				
				<div class="signInActionsContainer" id="signUpActionsContainer">
					<button id="showSignInBtn" type="button" class="signCofirmBtn">Sign-in</button>
					<button id="signUpConfirmBtn" type="submit" class="signCofirmBtn">Sign-up</button>
					<button id="showVerifyBox" class="signCofirmBtn">Submit code</button>
				</div>
			</form>
			<form id="otpVerificationForm" class="signForm" >
				<div class="signFormHeader">
					<span class="signTitle" id="signUpTitle">OTP Verifcation</span>
					<span class="signTxt" id="signUpTxt">Your account has been created successfully!</span>
					<span class="signTxt" id="signUpTxt">You need to verify your email address</span>
				</div>
				<div class="inputHolder">
					<label for="">OTP code<span class="signUpErr">Necessary</span></label>
					<input class="opInput" name="OTP" type="number" placeholder="XXXX" min="5" >
					<div class="signUpLoading"></div>
				</div>
				<div id="otpSubmitBtnContainer">
					<button type="submit" id="submitOtpBtn">Submit</button>
				</div>
			</form>
			
		</div>
	</div>`;
  }
}
