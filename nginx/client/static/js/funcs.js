const colorFeedback = (type, toEnable) =>{
    const nodes = document.body.getElementsByTagName("div");
    const blur = document.getElementsByClassName("ball");
    if(nodes.length === 0)
      return;
    if (blur.length === 0)
      return;
    blur[0].style.backgroundImage =
    `url( ${type === "f" ? `https://${window.location.host}/images/pongerr.svg` :  `https://${window.location.host}/images/pongsucc.svg`} )`;
  const x = nodes.length;
  for (var i = 0; i < x; i++) {
    // console.log(
    //   nodes[i].tagName === "BUTTON" && nodes[i].id === "signInIntra"
    //     ? getComputedStyle(nodes[i]).backgroundColor + " | " + nodes[i].id
    //     : "nop"
    // );
    // console.log(getComputedStyle(nodes[i]).background);
    if (
      getComputedStyle(nodes[i]).backgroundColor ==
      "rgba(32, 152, 238, 0.19)"
    ) {
      // alert("Shite");
      nodes[i].style.backgroundColor = type === "f" ? "rgba(238, 32, 32, 0.19)" : "rgba(92, 238, 32 , 19%)";
      nodes[i].style.borderColor = type === 'f' ? "rgba(238, 32, 32, 0.61)" : "rgba(32, 238, 66, 61%)";
    }
  }
  setTimeout(() => {
    const nodesx = document.body.getElementsByTagName("div");
    const blurx = document.getElementsByClassName("ball");
    if(nodesx.length === 0)
      return;
    if (blurx.length === 0)
      return;
    blurx[0].style.backgroundImage =
      `url(https://${window.location.host}/images/hoy.svg )`;
    for (var i = 0; i < x; i++) {
      // console.log(getComputedStyle(nodesx[i]).backgroundColor, nodesx[i].id);
      if (
        nodesx[i] && getComputedStyle(nodesx[i]).backgroundColor ==
        "rgba(238, 32, 32, 0.19)" || nodesx[i] && getComputedStyle(nodesx[i]).backgroundColor == "rgba(92, 238, 32, 0.19)"
      ) {
        
        nodesx[i].style.backgroundColor = "rgba(32, 152, 238, 0.19)";
        nodesx[i].style.borderColor = "rgba(32, 152, 238, 0.61)";
        // console.log("Ok");
      }
    }
    // console.log(toEnable)
    toEnable.forEach(ele=>{
        ele.disabled = false;
    })
    // btn.disabled = false;
  }, 2000);
}


export {colorFeedback}
