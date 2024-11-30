import AbstractView from "./AbstractView.js";


export default class CallBackView extends AbstractView {
    constructor(){
        super();
        this.setTitle("42 callback")
        this.setDescription("42 callback page")
    }

    async getHtml(){
        return `
        <style>
            @keyframes loading {
                100% {rotate: 360deg;}
            }
        </style>
        <div style="width: 100%; height:100svh; display:flex; align-items:center; justify-content:center;">
            <div style="border: 4px solid white; width:50px; height:50px; border-radius: 50%; border-top-color: transparent; animation: loading 700ms infinite linear"></div>
        </div>`
    }
}