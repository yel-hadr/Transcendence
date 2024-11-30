export default class {
  constructor() {}
  setTitle(title) {
    document.title = title;
  }

  setDescription(description) {
    document.querySelector("meta[name=description]").content = description
  }

  async getHtml() {
    return "";
  }
  

  getSearchBar() {
    return `<div id="searchInputContainer">
              <form id="searchFormHolder">
                <input id="searchForFriendInput" type="search" placeholder="Search" autocomplete="off" />
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21l-4.3-4.3" />
                    </g>
                  </svg>
                </button>
              </form>
              <div id="searchInputResult" >
                <div id="searchInputLoadingContainer">
                  <div id="searchInputLoading"></div>
                  </div>
                 
               
             
              </div>
            </div>`;
  }
}
