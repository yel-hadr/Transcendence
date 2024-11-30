import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Profile");
  }

  async getHtml() {
    return `
    <div class="profilepageContainer">
      ${this.getprofilecart()}
      <div class="profilepageDivs">
        ${this.getDetails()}
        ${this.getsettings()}
      </div>
    </div>
    `
  }

  getprofilecart() {
    return `
    <div class="cart profileCartContainer">
      <div class="content">
        <div class="block profileContainer">
          <div class="coverImg"></div>
          <div class="userAvatarContainer">
            <div class="userAvatar"></div>
          </div>
          <div class="profileHeader">
            <div class="profileName" style="margin-bottom: 30px">
              <span id="profileFullName">kk</span>
            </div>
          </div>
          <div class="buttonContainer">
            <div class="animated-buttonContainer">
              <button class="animated-button">
                <i class="fa-solid fa-angles-right arr-1"></i>
                <span class="text">Details</span>
                <span class="circle"></span>
                <i class="fa-solid fa-angles-right arr-2"></i>
              </button>
            </div>
            <div class="animated-buttonContainer">
              <button class="animated-button">
                <i class="fa-solid fa-angles-right arr-1"></i>
                <span class="text">Details</span>
                <span class="circle"></span>
                <i class="fa-solid fa-angles-right arr-2"></i>
              </button>
            </div>
            <div class="animated-buttonContainer">
              <button class="animated-button">
                <i class="fa-solid fa-angles-right arr-1"></i>
                <span class="text">Details</span>
                <span class="circle"></span>
                <i class="fa-solid fa-angles-right arr-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }

  getDetails() {
    return `
    <div class="cart detailsCartContainer">
      <div class="content detailsContent">
        <div class="block detailsblock">
        <div class="divHeader">
          <h4>Details</h4>
            <div class="editBtnContainer">
              <button class="editBtn">
                <svg height="1em" viewBox="0 0 512 512">
                  <path
                    d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                  ></path>
                </svg>
                <span class="editBtnText">Edit</span>

              </button>
            </div>
          </div>
          <div class="detailsList">
            <div class="detailsItems">
              <div class="detailsLabel">First Name :</div>
              <div class="detailsValue"> <span class="profileInfoHolder" id="fname"></span></div>
            </div>
            <div class="detailsItems">
              <div class="detailsLabel">Last Name :</div>
              <div class="detailsValue"><span class="profileInfoHolder" id="lname"></span></div>
            </div>
            <div class="detailsItems">
              <div class="detailsLabel">Username :</div>
              <div class="detailsValue"><span class="profileInfoHolder" id="username"></span></div>
            </div>
            <div class="detailsItems">
              <div class="detailsLabel">Email :</div>
              <div class="detailsValue"><span class="profileInfoHolder" id="email"></span></div>
            </div>
            <div class="detailsItems">
            <div class="detailsLabel">2FA status:</div>
              <button id="twoFaButton">Enabled</button>
            </div>

            <div class="detailsItems">
              <div class="detailsLabel">Bio :</div><br>
              <div class="detailsValue" name="bio"><span class="profileInfoHolder" id="bio"></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }




  getsettings() {
    return `
    <div class="cart settingsContainer">
      <div class="content settingsContent settingsForm">
        <form class="block settingsblock" id="editProfileInfosForm">
          <div class="divHeader">
            <h4>Edit</h4>
          </div>
          <div class="listItems">
            ${this.getInputField("text", "First Name", "fname", false)}
            ${this.getInputField("text", "Last Name", "lname", false)}
          </div>
          <div class="listItems">
            ${this.getInputField("text", "Username", "username", false)}
            ${this.getInputField("email", "Email", "email", false)}
          </div>
          <div class="listItems" id="thePasswordBlock">
            ${this.getInputField("password", "New password", "password", false)}
            ${this.getInputField("password", "Confirm Password", "old_passwd", false)}
          </div>
          <div class="listItems" id="thePasswordBlock">
            <input id="profileImageInput" type="file"/>
          </div>
          <div class="listItems" id="theBioBlock">
            ${this.getTexrArea("Bio")}
          </div>
    
          <button id="editProfileSubmitBtn" type="submit">Submit changes</button>
      </form>
    </div>
    `
  }
  getTexrArea(Label) {
    return `
    <div class="inputbox">
      <textarea type="text" ></textarea>
      <span>${Label}</span>
      <i></i>
    </div>
    `
  }
  getInputField(type, Label, name, required, id="",) {
    return `
    <div class="inputbox" id="${id}">
      <input class="profileInput" name="${name}" type="${type}" ${required ? "required" :""} >
      <span>${Label}</span>
      <i></i>
    </div>
    `
  }
  miniprofile() {
    return `
    <div class="miniProfileContainer" id="searchInputContainer">
      <span class=avatarContainer>
          <img src="https://${window.location.host}/imgs/dodo.png" alt="avatar" class="avatar">
      </span>
          
      <span class="miniProfileName">User Name</span>
    </div>
    `
  }
}
