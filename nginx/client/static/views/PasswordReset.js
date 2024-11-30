import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(){
        super();
        this.setTitle("Reset password");
        this.setDescription("Restore your account")
    }
    async getHtml() {
        return `
            <div id="passwordRestorContainer">
                <div id="passwordRestorHolder">
                    <div id="headingContainer">
                        <div id="headingWrapper">
                            <h2>Account restoration</h2>
                            <h2>New password</h2>
                        </div>
                    </div>
                    <div id="restoreDescAndInputContainer">
                        <div id="restorDescHolder">
                            <div id="restorDescWrapper">
                                <label id="emailHeading">Proivde your email address</label>
                                <label id="otpHeading">Type your new password</label>
                            </div>
                        </div>
                        <div id="restorInputcHolder">
                            <div id="restorInputsWrapper">
                                <form id="emailForm">
                                    <input id="emailInput" name="email" type="email" placeholder="exmaple@gmail.com" autofocus />
                                </form>
                                <form id="otpForm">
                                    <input id="optInput" type="password" placeholder="New password"/>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div id="restorSubmitContainer">
                        <div id="restorBtnWrapper">
                            <button type="button" id="submitEmailBtn"> <span class="submitSpan">Submit</span> <div class="restorPassLoadingCircle"></div> </button>
                            <button type="button" id="submitOtpBtn"><span class="submitSpan">Submit password</span> <div class="restorPassLoadingCircle"></div> </button>
                        </div>
                    </div>
                </form>
            </div>
        `
    }
}

