(function(){
	getFontSize();
})();
function getFontSize() {
    //通过计算屏幕宽高比定页面基础字体大小
    var desW = 750,
        winW = document.documentElement.clientWidth,
        oMain = document.querySelector(".container");
    if (winW > 750) {
        oMain.style.width = 750 + "px";
        document.documentElement.style.fontSize = "200px";
        return;
    }
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}