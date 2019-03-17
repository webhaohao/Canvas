var startAngle=0;
var endAngle=0;
var i=0;
var r1=this.ImgCircular.radius;
for(var i=0;i<this.imgPanel.length;i++){
    startAngle=60*i;
    endAngle=startAngle+60; 
    //绘制扇形 
    this.ctx.beginPath();
    this.ctx.arc(0,0,470/2,this.rads(startAngle),this.rads(endAngle),false);
    this.ctx.lineTo(0,0);
    this.ctx.strokeStyle="#87b345";
    this.ctx.lineWidth=10;
    this.ctx.fillStyle="#e6ba4c";
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    //绘制转盘上的小图标 
    this.ctx.save();
    var  newEndAngle=60/2+startAngle;
    var  imgWidth=this.imgPanel[i].width;
    var  imgHeight=this.imgPanel[i].height;
    var  RotateAngle=120+startAngle;
    this.ctx.translate(r1*Math.cos(this.rads(newEndAngle)),r1*Math.sin(this.rads(newEndAngle)));
    this.ctx.rotate(this.rads(RotateAngle));
    this.ctx.drawImage(this.imgPanel[i],-imgWidth/2,-imgHeight/2,imgWidth,imgHeight);
    this.ctx.restore();
    //绘制转盘上文字
    this.ctx.fillStyle = '#f2e299';
    this.ctx.font = '24px 微软雅黑';
    this.ctx.textAlign ="center";
    this.ctx.textBaseline = 'middle';
    var string =this.Text[i].name;
    var radius =this.smccircle.radius,index = 0,character;
    var angle1=Number(this.Text[i].angel1);
    var angle2 =Number(this.Text[i].angel2);
    var angleDecrement=Number(((angle1- angle2)/(string.length-1)).toFixed(2));
    //console.log(angleDecrement);
    this.ctx.save();
    while (index < string.length) {
        character = string.charAt(index);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.smccircle.x + Math.cos(angle1) * radius,this.smccircle.y + Math.sin(angle1) * radius);
        this.ctx.rotate(3.14/2 + angle1);
        this.ctx.fillText(character, 0, 0);
        angle1=Number((angle1-angleDecrement).toFixed(2));
        index++;
        this.ctx.restore();
    }
    this.ctx.restore();
}

/************************ */



/*** 一些公共的方法和变量
 */
var commonMethod = (function () {
    var $body = $("body"),
            pageUrl = location.href;
    /**
 * 消息提示公共方法
 * @param {string} title 提示的内容
 * @param {number} time  提示框消失时间，缺省则为默认3000ms
 */
    var MsgTimeAuto,
            DomMessage = $body.find(".message");
    var setMessage = function (title, time, highly) {
            var outTime = time
                    ? time
                    : 3000;
            clearTimeout(MsgTimeAuto);
            MsgTimeAuto = null;
            DomMessage.text(title);
            $body.addClass("show-message");
            highly && $body.addClass("highly");
            MsgTimeAuto = setTimeout(function () {
                    $body.removeClass("show-message highly");
            }, outTime);
    };

    //滚动条调用公共方法
    function scroll(elmentId, customArg) {
            var defaultArg = {
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: "scale",
                    click: true,
                    tap: true,
                    fadeScrollbars: true,
                    listenX: false
            };
            customArg && (defaultArg = $.extend(defaultArg, customArg));
            return new IScroll(elmentId, defaultArg);
    }

    /**
 * 获取cookie值
 * @param  {string} c_name cookie名称
 * @return {string}        存在返回cookies值，否则返回空。
 */
    function getCookie(c_name) {
            if (localStorage) {
                    //如果支持localstorage,则使用localstorage获取数据
                    if (!localStorage[c_name]) {
                            return "";
                    } else {
                            var c_name = JSON.parse(localStorage[c_name]);
                            if (new Date(c_name.date) > new Date()) {
                                    return c_name.val;
                            } else {
                                    return "";
                            }
                    }
            } else {
                    //否则使用cookies获取数据
                    if (document.cookie.length > 0) {
                            c_start = document
                                    .cookie
                                    .indexOf(c_name + "=");
                            if (c_start != -1) {
                                    c_start = c_start + c_name.length + 1;
                                    c_end = document
                                            .cookie
                                            .indexOf(";", c_start);
                                    if (c_end == -1) 
                                            c_end = document.cookie.length;
                                    return unescape(document.cookie.substring(c_start, c_end));
                            }
                    }
                    return "";
            }
    }

    /**
 * 保存cookies
 * @param {string} c_name       cookie的名称
 * @param {string} value        cookie值
 * @param {numbers} expiredays  cookie有效时间
 */
    function setCookie(c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + (expiredays
                    ? expiredays
                    : 100000));
            if (localStorage) {
                    //如果支持localstorage,则使用localstorage保存数据
                    localStorage[c_name] = JSON.stringify({val: value, date: exdate});
            } else {
                    //否则使用cookies保存数据
                    document.cookie = c_name + "=" + escape(value) + (expiredays == null
                            ? ""
                            : ";expires=" + exdate.toGMTString());
            }
    }

    /**
 * 对ajax的简单封装，统一错误提示
 */
    function ajax(arg) {
            var defaultArg = {
                    type: "GET",
                    dataType: "json",
                    error: function (data) {
                            alert("发生错误，请稍后重试");
                            console.log(data);
                    }
            };
            $.extend(defaultArg, arg);
            $.ajax(defaultArg);
    }

    //显示弹窗
    function showModal($this) {
            $body.addClass("show-modal");
            $this
                    .addClass("show")
                    .removeClass("hide");
    }

    //隐藏弹窗
    function hideModal(This, onlyHideModal) {
            var $modal = $(This.target)
                    .parents(".modal")
                    .eq(0);
            $modal.hasClass("only-hide-modal") || onlyHideModal || $body.removeClass("show-modal");
            //$body.removeClass("show-modal");
            $modal
                    .removeClass("show")
                    .addClass("hide");
            if (!($modal.hasClass("only-hide-modal") || onlyHideModal)) {
                    $modal
                            .siblings(".show")
                            .removeClass("show")
                            .addClass("hide");
            }
            if ($modal.hasClass("marker-group")) {
                    $("#sceniclist li.liSelect").removeClass("liSelect");
            }
    }

    //添加属性
    function active($, className) {
            var className = className || "active";
            $
                    .siblings("." + className)
                    .removeClass(className);
            $.addClass(className);
    }

    //跳转高德去这儿
    function goToHere(toLon, toLat, viweName) {
            //返回一个函数，在获取到当前位置后调用
            return function (currentLon, currentLat) {
                    var url = "http://uri.amap.com/navigation?from=" + currentLon + "," + currentLat + ",当前位置&to=" + toLon + "," + toLat + "," + viweName + "+&mode=walk&policy=0&src=" + encodeURIComponent(location.href) + "&coordinate=gaode&callnative=1";
                    if (confirm("路线已规划完成，是否跳转到高德地图导航?")) {
                            window.location.href = url;
                    }
            };
    }

    //返回音频链接
    function getAudioUrl(audioUrlObj) {

            if (audioUrlObj["audioId" + this.audioType]) {
                    //存在当前选中的类型音频直接返回
                    return audioUrlObj["audioId" + this.audioType];
            }

            if (audioUrlObj["audioId" + this.audioDefaultType]) {
                    //存在默认类型音频则返回默认类型
                    this.message("当前景点没有您选中的语音类型,已切换为默认类型语音！");
                    return audioUrlObj["audioId" + this.audioDefaultType];
            }

            for (var audioId in audioUrlObj) {
                    //返回第一个
                    this.message("当前景点没有您选中的语音类型,已切换为其它类型语音！");
                    return audioUrlObj[audioId];
            }
    }

    var audio = new Audio(),
            $audio = $(audio);

    //L.DomEvent.on(audio,"play", audioPlay);//播放时间变化时更改播放按钮显示状态
    $audio.bind("timeupdate", audioPlaying); //播放时间变化时更改播放按钮显示状态
    $audio.bind("waiting", audioPlayWaiting); //监控缓冲时更改播放按钮显示状态
    $audio.bind("pause", audioPlayPause); //音频结束时更改播放按钮显示状态
    $audio.bind("ended", audioPlayEnd); //音频结束时更改播放按钮显示状态
    $audio.bind("error", audioPlayError); //音频结束时更改播放按钮显示状态

    function getStatusClass() {
            status = "";
            if (commonMethod.$controlBtn.hasClass("control-play")) 
                    return (status += " control-play");
            if (commonMethod.$controlBtn.hasClass("images")) 
                    return (status += " images");
            if (commonMethod.$controlBtn.hasClass("progress-bar")) 
                    return (status += " progress-bar");
            }
    
    function getLiMarkerId(marker) {
            if (marker && marker.parentMarkerId) {
                    if ($("#sceniclist>li #marker" + marker.data.viweID).is(":visible")) {
                            return "#sceniclist>li #marker" + marker.data.viweID;
                    } else {
                            return "#marker" + marker.parentMarkerId;
                    }
            } else if (marker) {
                    return "#marker" + marker.data.viweID;
            } else {
                    return "";
            }
    }

    //音频播放中
    function audioPlaying() {
            commonMethod.$controlBtn && !commonMethod
                    .$controlBtn
                    .hasClass("playing") && commonMethod
                    .$controlBtn
                    .attr("class", "playing " + getStatusClass());
            if ($audio.data("status") != "playing") {
                    $audio.data("status", "playing");
                    audio.src && $audio.data("guidePlaying") != "true" && commonMethod.currentPlaying && $(commonMethod.currentPlaying._icon).addClass("playing");
                    if (commonMethod.currentPlaying && commonMethod.currentPlaying.parentMarker) {
                            $(commonMethod.currentPlaying.parentMarker._icon).addClass("playing");
                    }
            }
            if (currentChildGroupScenic && currentChildGroupScenic.playState == "playing") {
                    if (currentChildGroupScenic.childGroupId) {
                            var $marker = $(".child-grounp.marker" + currentChildGroupScenic.childGroupId)
                    } else {
                            var $marker = $(".child-grounp.marker" + currentChildGroupScenic.id)
                    }

                    if ($marker && !$marker.hasClass("playing")) {
                            $marker.addClass("playing")
                    }
            }
            process = audio.currentTime / audio.duration * 360;
            if (process && commonMethod.$controlBtn && commonMethod.$controlBtn.hasClass("progress-bar")) {
                    parseInt(process) >= 180 && commonMethod
                            .$controlBtn
                            .find(".slice")
                            .addClass("half");
                    if (parseInt(process + 1) >= 360) {
                            process = 0.001
                            commonMethod
                                    .$controlBtn
                                    .find(".slice")
                                    .removeClass("half");
                    }
                    commonMethod
                            .$controlBtn
                            .find(".slice>.than-half")
                            .css("transform", "rotate(" + process + "deg)");
            }

            commonMethod.currentPlaying && $(getLiMarkerId(commonMethod.currentPlaying)).addClass("playing");
    }

    //音频加载中
    function audioPlayWaiting() {
            commonMethod.$controlBtn && !commonMethod
                    .$controlBtn
                    .hasClass("Loading") && commonMethod
                    .$controlBtn
                    .attr("class", "Loading" + getStatusClass());
            if ($audio.data("status") != "waiting") {
                    $audio.data("status", "waiting");

                    if (!$(".leaflet-marker-icon.playing").hasClass("child-grounp")) {
                            $(".leaflet-marker-icon.playing").removeClass("playing");
                    }

                    commonMethod.currentPlaying && $(getLiMarkerId(commonMethod.currentPlaying)).removeClass("playing");
                    if (commonMethod.currentPlaying && commonMethod.currentPlaying.parentMarker) {
                            $(commonMethod.currentPlaying.parentMarker._icon).removeClass("playing");
                    }
                    audio.src && $audio.data("guidePlaying") != "true";
            }
    }

    //音频播放暂停
    function audioPlayPause() {
            commonMethod.$controlBtn && !commonMethod
                    .$controlBtn
                    .hasClass("playPause") && commonMethod
                    .$controlBtn
                    .attr("class", "playPause" + getStatusClass());
            if ($audio.data("status") != "paused") {
                    $audio.data("status", "paused");
                    $(".leaflet-marker-icon.playing").removeClass("playing");

                    commonMethod.currentPlaying && $(getLiMarkerId(commonMethod.currentPlaying)).removeClass("playing");
                    if (commonMethod.currentPlaying && commonMethod.currentPlaying.parentMarker) {
                            $(commonMethod.currentPlaying.parentMarker._icon).removeClass("playing");
                    }
            }
            commonMethod.changeCurrentPlaying(null);
    }

    //音频播放结束
    function audioPlayEnd() {
            commonMethod.$controlBtn && commonMethod
                    .$controlBtn
                    .attr("class", getStatusClass());
            if ($audio.data("status") != "playend") {
                    $audio.data("status", "playend");
                    $audio.data("guidePlaying") == "true" && $audio.data({guidePlaying: "false", guidePlayed: "true"});
                    $(".leaflet-marker-icon.playing").removeClass("playing");
                    commonMethod.currentPlaying && $(getLiMarkerId(commonMethod.currentPlaying)).removeClass("playing");
                    if (commonMethod.currentPlaying && commonMethod.currentPlaying.parentMarker) {
                            $(commonMethod.currentPlaying.parentMarker._icon).removeClass("playing");
                    }
            }
            process && (process = 0);
            commonMethod.currentPlaying && commonMethod
                    .currentPlaying
                    .closePopup();
            commonMethod.changeCurrentPlaying(null);
    }

    //音频播放出错
    function audioPlayError() {
            commonMethod.$controlBtn && !commonMethod
                    .$controlBtn
                    .hasClass("playError") && commonMethod
                    .$controlBtn
                    .attr("class", getStatusClass() + " playError");
            $audio.data("status") != "error" && $audio.data("status", "error");
            if (commonMethod.currentPlaying && commonMethod.currentPlaying.parentMarker) {
                    $(commonMethod.currentPlaying.parentMarker._icon).removeClass("playing");
            }
            commonMethod.changeCurrentPlaying(null);
    }

    //改变当前播放值音频
    function changeCurrentPlaying(marker, groupLayer) {
            var c = commonMethod;

            this.currentPlaying && this.currentPlaying.off && this
                    .currentPlaying
                    .off("add"); //取消之前marker的事件绑定
            if (marker) {
                    //开始播放
                    this.currentPlaying = marker;
                    $(".my-div-icon.playing").removeClass("playing");
                    $(marker._icon).addClass("playing");
                    $("#marker" + marker.data.viweID).addClass("playing");
                    marker._icon && groupLayer && $(groupLayer.getVisibleParent(c.currentPlaying)._icon)
                            .children(".my-div-icon")
                            .addClass("playing");
                    marker._icon && marker.on("add", function () {
                            //添加add事件，当marker重新加载到地图上时继续闪烁动画
                            $(this._icon).addClass("playing");
                    });
            } else {
                    //暂停、结束、出错

                    $(".my-div-icon.playing").removeClass("playing");
                    $(".scenic-list>dd.playing").removeClass("playing");
                    this.currentPlaying && this.currentPlaying.off && this
                            .currentPlaying
                            .off("add");
                    this.currentPlaying = null;
            }
    }

    //创建Popup
    function createPopup(marker) {
            if (!!marker.data.isContainChildScenic) {
                    return false;
            }
            var popup = L.popup({
                    keepInView: false,
                    maxWidth: "auto",
                    className: (marker.data.viweType === "near"
                            ? "near-popup"
                            : "") + (marker.data.indoor
                            ? "indoor-popup"
                            : "")
            }).setContent(getPopupDom(marker.data));
            marker.bindPopup(popup);
    }

    //组装popup内容框
    function getPopupDom(markerData) {
            var btns = "";
            if (markerData.audioUrl) {
                    btns += markerData.indoor
                            ? '<div class="show-indoor"><span></span></div><div class="show-details"></div>'
                            : '<div class="control-play"><span></span></div><div class="show-details"></div>';
            } else {
                    btns += '<div class="show-details"></div>';
            }
            var html = '<div><h3 class="view-name">' + markerData.viweName + '</h3><img class="viwe-photo" src="' + (markerData.viweImgUrl
                    ? markerData.viweImgUrl
                    : "images/viwephoto_null.jpg") + '" ><p class="introduction">' + markerData.introduction + "</p>" + btns + "</div>";

            if (markerData.viweType === "near") {
                    html = '<div><h3 class="view-name">' + markerData.viweName + '</h3><img class="viwe-photo" src="' + (markerData.viweImgUrl
                            ? markerData.viweImgUrl
                            : "images/viwephoto_null.jpg") + '" >' + (markerData.distance && commonMethod.inScenic
                            ? '<p class="distance">距离：' + getDistance(markerData.distance) + "</p>"
                            : '<p class="distance"></p>') + "</div>";
            }

            return html;
    }

    //打开popup
    function openPopup(marker) {
            if (marker && marker.__parent) {
                    //如果在一个聚会组中，先放大将marker显示出来现打开popup
                    marker
                            .__parent
                            ._group
                            .zoomToShowLayer(marker, function () {
                                    marker
                                            ._map
                                            .panTo(marker._latlng);
                                    doOpenPopup(marker);
                            });
            } else {
                    //否则直接打开popup
                    marker
                            ._map
                            .panTo(marker._latlng);
                    doOpenPopup(marker);
            }
    }

    //做打开的操作
    function doOpenPopup(marker) {
            if (!marker.getPopup()) {
                    //如果marker未创建绑定popup,先创建绑定
                    createPopup(marker);
                    marker.openPopup();
            } else {
                    //已创建直接打开
                    marker.openPopup();
            }
    }

    //判断是否自动播放
    function whetherAutoPlay(marker) {
            if (!this.manualPlay && !(this.$audio.data("guidePlaying") == "true") && this.$audio.data("markerId") != marker._leaflet_id) {
                    //当前不是手动播放状态且开启了自动播放
                    if (!(this.currentPlaying === marker)) {
                            //如果是进入一个新的自动播放区域,直接开始自动播放
                            this.audio.src = this.getAudioUrl(marker.data.audioUrl);
                            this.changeCurrentPlaying((this.auotPlayMarker = marker));
                            this
                                    .audio
                                    .play();
                            this
                                    .$audio
                                    .data("markerId", marker._leaflet_id);
                            openPopup(marker);
                    } else {
                            //否则进一步判断
                            if (this.$audio.data("status") != "playing" && this.$audio.data("status") != "playend") {
                                    this
                                            .audio
                                            .play();
                                    this.changeCurrentPlaying(this.auotPlayMarker);
                                    openPopup(this.currentPlaying);
                                    this
                                            .$audio
                                            .data("markerId", marker._leaflet_id);
                            }
                    }
                    this.$controlBtn = $(".control-play");
            }
    }

    function isPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                            flag = false;
                            break;
                    }
            }
            if (window.screen.width >= 768) {
                    flag = true;
            }
            return flag;
    }

    //将Url的参数转换为一个对象
    function getUrlParam() {
            var argObj = {},
                    argArr,
                    arg,
                    argStr = pageUrl.match(/\?/)
                            ? decodeURI(pageUrl.slice(pageUrl.match(/\?/).index + 1))
                            : null;
            if (!argStr) 
                    return undefined;
            argArr = argStr.split("&");
            for (var i = 0, len = argArr.length; i < len; i++) {
                    arg = argArr[i].match(/\=/);
                    if (arg) {
                            argObj[argArr[i].slice(0, arg.index)] = argArr[i].slice(arg.index + 1);
                    } else {
                            argArr[i] && (argObj[argArr[i]] = null);
                    }
            }
            return argObj;
    }

    /***********************************获得地图导航方向 开始*******************************************/
    function orientationHandler(event) {
            //陀螺仪 console.log(event)
            $(commonMethod.locationMark._icon)
                    .find("#orientation")
                    .css("transform", "rotateZ(" + commonMethod.orientation + "deg)");
            commonMethod.orientation = -Math.ceil(event.alpha * 100) / 100 - 45;
    }

    function getOrientation() {
            if (window.DeviceOrientationEvent) {
                    //陀螺仪
                    window.addEventListener("deviceorientation", orientationHandler, false);
            } else {
                    console.log("此手机不支持陀螺仪");
                    this.orientation = false;
            }
    }

    /***********************************获得地图导航方向 结束*******************************************/
    //浏览器是否已经自动校正地理位置 浏览器是否已经自动校正地理位置
    var isUC = !!navigator
                    .userAgent
                    .match(/ucbrowser/i),
            isHuawei = !!navigator
                    .userAgent
                    .match(/huawei/i),
            isOppo = !!navigator
                    .userAgent
                    .match(/oppo/i),
            isQuark = !!navigator
                    .userAgent
                    .match(/quark/i),
            isiOS = !!navigator
                    .userAgent
                    .match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            isWeixin = navigator
                    .userAgent
                    .indexOf("micromessenger") != -1,
            isQQ = !!navigator
                    .userAgent
                    .match(/qqbrowser/i);

    function isAutoRectify() {
            return isQuark || (isUC && !isiOS);
    }

    function getDistance(distance) {
            if (!distance) 
                    return distance;
            if (distance && distance < 10) 
                    return "<10m";
            if (distance && distance < 1000) 
                    return distance.toFixed(2) + "m";
            if (distance && distance < 1000000) 
                    return (distance / 1000).toFixed(2) + "km";
            if (distance && distance > 1000000) 
                    return ">1000km";
            }
    
    //组装景点列表
    function assembleScenicList(marker) {
            var html = "",
                    distance,
                    c = commonMethod,
                    className = "",
                    playing = "",
                    notScenic = "",
                    isGroup = "";
            marker.audioUrl && (className += "hasVoice ");
            distance = marker.distance === 0
                    ? "<10m"
                    : getDistance(marker.distance || "");

            if (c.currentPlaying && c.currentPlaying.data.viweID === marker.viweID) 
                    className += '"playing ';
            
            if (c.currentPlaying && c.currentPlaying.parentMarkerId && c.currentPlaying.parentMarkerId === marker.viweID) 
                    className += "playing ";
            if (marker.viweType == "group") {
                    className += "group ";
                    isGroup = "<span class='group-fold-icon'></span>";
            }
            if (!!marker.isContainChildScenic) {
                    className += 'child-group ';
                    // isGroup="<span class='group-fold-icon'></span>";
            }
            if (marker.viweType != "group" && marker.viweType != "scenic") {
                    notScenic = '<span class="list-icon" style="background-image:url(\'' + marker.serviceTypPicName + "')\"></span>";
            }

            html = '<li id="marker' + marker.viweID + '" class="' + className + '" >' + notScenic + '<span class="sTxt">' + marker.viweName + isGroup + '<span class="select-icon"></span></span><span class="distance">' + (c.inScenic
                    ? distance
                    : "") + "</span>";

            if (!isGroup) {
                    html + "</li>";
            } else {
                    html += "<ul>";
                    for (var i = 0; marker.markers && i < marker.markers.length; i++) {
                            html += assembleScenicList(marker.markers[i]);
                    }
                    html += "<ul></li>";
            }

            return html;
    }

    //排序景点并插入DOM
    function markerListSort(markerList, listNav) {
            var markerList = markerList || this.currentMarkerList.markerList,
                    listNav = listNav || this.currentMarkerList.listNav;
            This = this;
            for (var i = 0, len = markerList.length; i < len; i++) {
                    markerList[i].data.distance = this.currentLatlng
                            ? markerList[i]
                                    ._latlng
                                    .distanceTo(this.currentLatlng)
                            : "";
            }
            this.inScenic && markerList.sort(function (a, b) {
                    return a.data.distance - b.data.distance;
            });
            listNav
                    .find("li")
                    .remove();
            markerList.forEach(function (marker, index) {
                    listNav.append($(This.assembleScenicList(marker.data)).data("marker", marker));
            });
    }

    //返回新对象保存状态
    return {
            scroll: scroll,
            message: setMessage,
            getCookie: getCookie,
            setCookie: setCookie,
            ajax: ajax,
            showModal: showModal,
            hideModal: hideModal,
            active: active,
            goToHere: goToHere,
            whetherAutoPlay: whetherAutoPlay,
            getAudioUrl: getAudioUrl,
            changeCurrentPlaying: changeCurrentPlaying,
            createPopup: createPopup,
            openPopup: openPopup,
            getOrientation: getOrientation,
            getLiMarkerId: getLiMarkerId,
            assembleScenicList: assembleScenicList,
            getDistance: getDistance,
            markerListSort: markerListSort,

            token: getCookie("token"),
            userId: getCookie("userId"),
            userName: getCookie("nickname"),
            orientation: 0,
            locationMark: "",
            pageUrl: pageUrl,
            urlArg: getUrlParam(),
            audio: audio,
            $audio: $audio,
            isPC: isPC(),
            isUC: isUC,
            isHuawei: isHuawei,
            isOppo: isOppo,
            isWeixin: isWeixin,
            isQQ: isQQ,
            clickEvent: isPC()
                    ? "click"
                    : "tap",
            guideAuido: "images/test/autoguide.mp3",
            fontsize: parseInt($("html").css("font-size")),
            fontsizePer: parseInt($("html").css("font-size")) / 100,
            bodyWidth: $body.width(),

            isiOS: isiOS,
            isAutoRectify: isAutoRectify(),
            isAndroid: navigator
                    .userAgent
                    .indexOf("Android") > -1 || navigator
                    .userAgent
                    .indexOf("Adr") > -1, //android终端
            activated: false, //保存当前是否激活
            needVerify: true,
            isAuthUrl: "",
            scenicId: 1,
            goToHereFun: null,
            autoPlay: false, //保存是否打开自动播放功能
            manualPlay: true //保存是否为手动播放，手动优先
    };
})();

//地图相关的公用方法
var mapCommonMethod = (function () {
    //定位相关参数
    var locateArg = {
                    showPopup: false,
                    drawCircle: false,
                    drawMarker: false,
                    setView: false,
                    onLocationError: function () {
                            console.log("error");
                    },
                    onLocationOutsideMapBounds: function () {
                            console.log("OutsideMapBounds");
                    },
                    locateOptions: {
                            watch: true,
                            setView: false,
                            enableHighAccuracy: true,
                            maximumAge: 5000,
                            timeout: 3 * 1000
                    }
            },
            c = commonMethod;

    //路线线条相关参数
    var polylineStyele = {
            // color: '#ff664f',
            color: "grey",
            weight: 10,
            opacity: 1
    };

    /**
 * //gps转换相关的方法。。。
 * @type {Object}
 */
    var PointTransformation = {
            PI: 3.14159265358979324,
            x_pi: 3.14159265358979324 * 3000.0 / 180.0,
            delta: function (lat, lon) {
                    var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
                    var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
                    var dLat = this.transformLat(lon - 105.0, lat - 35.0);
                    var dLon = this.transformLon(lon - 105.0, lat - 35.0);
                    var radLat = lat / 180.0 * this.PI;
                    var magic = Math.sin(radLat),
                            magic = 1 - ee * magic * magic;
                    var sqrtMagic = Math.sqrt(magic),
                            dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * this.PI),
                            dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * this.PI);
                    var pt = {
                            lat: dLat,
                            lon: dLon
                    };
                    return pt;
            },

            //WGS-84 to GCJ-02
            gcj_encrypt: function (wgsLat, wgsLon) {
                    if (this.outOfChina(wgsLat, wgsLon)) 
                            return {lat: wgsLat, lng: wgsLon};
                    
                    var d = this.delta(wgsLat, wgsLon);
                    var pt = {
                            lat: wgsLat + d.lat,
                            lng: wgsLon + d.lon
                    };
                    return pt;
            },
            outOfChina: function (lat, lon) {
                    if (lon < 72.004 || lon > 137.8347) 
                            return true;
                    if (lat < 0.8293 || lat > 55.8271) 
                            return true;
                    return false;
            },
            transformLat: function (x, y) {
                    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                    ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
                    ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
                    return ret;
            },
            transformLon: function (x, y) {
                    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                    ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
                    ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
                    return ret;
            }
    };

    // 判断某个点是否在polygon里面 piont=[latitude,longitude];
    // APoints=[piont,piont,piont,piont.....]
    function IsPtInPoly(point, APoints) {
            var iSum = 0,
                    iCount,
                    ALat = point[0],
                    ALon = point[1];

            var dLon1,
                    dLon2,
                    dLat1,
                    dLat2,
                    dLon;
            if (APoints.length < 3) 
                    return false;
            iCount = APoints.length;
            for (var i = 0; i < iCount; i++) {
                    if (i == iCount - 1) {
                            dLon1 = APoints[i][1];
                            dLat1 = APoints[i][0];
                            dLon2 = APoints[0][1];
                            dLat2 = APoints[0][0];
                    } else {
                            dLon1 = APoints[i][1];
                            dLat1 = APoints[i][0];
                            dLon2 = APoints[i + 1][1];
                            dLat2 = APoints[i + 1][0];
                    }
                    //以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
                    if ((ALat >= dLat1 && ALat < dLat2) || (ALat >= dLat2 && ALat < dLat1)) {
                            if (Math.abs(dLat1 - dLat2) > 0) {
                                    //得到 A点向左射线与边的交点的x坐标：
                                    dLon = dLon1 - (dLon1 - dLon2) * (dLat1 - ALat) / (dLat1 - dLat2);
                                    if (dLon < ALon) 
                                            iSum++;
                                    }
                            }
            }
            if (iSum % 2 != 0) 
                    return true;
            return false;
    }

    //公用创建marker的方法
    function createLineMarker(data) {
            return L.marker(data.lnglats, {
                    icon: L.divIcon({
                            className: "",
                            html: '<span  class="icon-track" >' + data.index + "</span>",
                            iconAnchor: [12, 0]
                    })
            });
    }

    //公用创建icon的方法
    function newIcon(data) {
            var iconUrl = data.nonAudio
                            ? " nonAudio "
                            : "",
                    isIndoor = data.indoor
                            ? " is-indoor "
                            : "";
            var html = data.html
                    ? data.html
                    : "<p><span>" + data.viweName + '</span></p><div class="marker">' + (data.hasSubMarker
                            ? "<span>" + data.hasSubMarker + "</span>"
                            : "") + "</div>";
            data.nearService && (html = "<p><span>" + data.viweName + '</span></p><div class="marker nearService" style="background-image:url(' + data.nearService + ');" ></div>');
            return L.divIcon({
                    className: "my-div-icon " + iconUrl + (data.className || "") + isIndoor,
                    html: html,
                    iconSize: [
                            62 * c.fontsizePer,
                            62 * c.fontsizePer
                    ],
                    iconAnchor: [
                            30 * c.fontsizePer,
                            48 * c.fontsizePer
                    ],
                    popupAnchor: [
                            -8 * c.fontsizePer,
                            -60 * c.fontsizePer
                    ]
            });
    }

    //返回一个新对象
    return {
            locateArg: locateArg,
            PointTransformation: PointTransformation,
            IsPtInPoly: IsPtInPoly,
            polylineStyele: polylineStyele,
            createLineMarker: createLineMarker,
            newIcon: newIcon
    };
})();

/**
*
* 地图封装,返回一个map对象
*/
function LaeflatMapModule(arg) {
    if (!(this instanceof LaeflatMapModule)) {
            return new LaeflatMapModule(arg);
    }

    var c = commonMethod,
            mc = mapCommonMethod,
            mapData = c.mapData,
            mThis = this;

    this.subImgLayer = []; //保存子图层数据
    this.markerList = []; //保存marker对象
    this.serviceMarkerList = []; //保存服务marker对象
    this.markerGroup = ""; //将marker数据创建一个LayerGroup对象保存
    this.serviceMarkerGroup = ""; //将serviceMarkerGroup数据创建一个LayerGroup对象保存
    this.lineLayerGroup = []; //将路线数据创建一个LayerGroup对象保存
    this.arrowInlineLayerGroup = []; //将路线数据创建一个LayerGroup对象保存

    /**
 * 初始化地图
 * @param {object} MapArguments 初始化地图参数
 * @return {object} 高德地图对象
 */
    this.initialize = function (mapArg) {
            this.map = L.map(mapArg.container, mapArg);
            this.map.maxBounds = L.latLngBounds(mapArg.maxBounds);
            return this;
    };

    /**
 * 添加自定义图层
 * @param {object} LayerArguments 图层参数
 * @param {object} mapObj         高德地图对象
 */
    this.addImageLayer = function (LayerArguments, isSubScenic) {
            !isSubScenic && (this.mapImgLayer = L.imageOverlay(LayerArguments.imageUrl, LayerArguments.imageBounds, {
                    zIndex: 0,
                    className: " base-map"
            }).addTo(this.map));
            if (isSubScenic) {
                    //如果是下线景区图层，特殊处理
                    var subImageOverlay = L.imageOverlay(LayerArguments.imageUrl, LayerArguments.imageBounds, {zIndex: 0});
                    subImageOverlay.data = LayerArguments;
                    this
                            .subImgLayer
                            .push(subImageOverlay);
                    subImageOverlay.addTo(this.map);
            }
            return this;
    };

    arg && this.initialize(arg);

    //添加Markers点
    this.addMarkers = function (markers, options) {
            var marker,
                    backMarkerList = [],
                    options = options || {};
            if (!markers.length) 
                    return backMarkerList;
            markers
                    .forEach(function (markerData) {
                            if (markerData.position) {
                                    marker = L.marker(markerData.position, {
                                            icon: mc.newIcon({
                                                    nonAudio: markerData.audioUrl
                                                            ? false
                                                            : true,
                                                    viweName: markerData.viweName,
                                                    className: (options.className
                                                            ? options.className
                                                            : "") + " marker" + markerData.viweID + " my-div-icon " + (markerData.service
                                                            ? markerData.service
                                                            : ""),
                                                    coustomIcon: markerData.icon,
                                                    hasSubMarker: markerData.markers
                                                            ? markerData.markers.length
                                                            : null,
                                                    nearService: markerData.viweType == "near"
                                                            ? markerData.icon
                                                            : "",
                                                    indoor: markerData.indoor, //室内景点
                                                    isContainChildScenic: markerData.isContainChildScenic //子景区组
                                            })
                                    });
                                    marker.data = markerData;
                                    backMarkerList.push(marker);
                                    // markerData.area&&mThis.map.addLayer(L.polygon(markerData.area));//添加polygon,用
                                    // 来 测试判断是否进入自动播放范围
                            }
                    });

            return backMarkerList;
    };
    var markerNames = ["阿尔山国家森林公园", "天池服务区", "龟背岩"];

    function getMarkerName(_markers) {
            var b = -1;
            for (var i = 0; i < _markers.length; i++) {
                    if (markerNames.indexOf(_markers[i].data.viweName) != -1) {
                            b = markerNames.indexOf(_markers[i].data.viweName);
                            break;
                    }
            }
            return b >= 0
                    ? markerNames[b]
                    : _markers[0].data.viweName;
    }

    this.addMarkerCluster = function (markerList, options) {
            var options = options || {};
            var markerCluster = L.markerClusterGroup({
                    showCoverageOnHover: false, zoomToBoundsOnClick: false, spiderfyOnMaxZoom: false,
                    /*			spiderfyOnMaxZoom:true,
        spiderfyDistanceMultiplier:5,*/

                    iconCreateFunction: function (cluster) {
                            var html = "",
                                    markerName = "",
                                    _markers = cluster.getAllChildMarkers();
                            var markerName = _markers[0].data.viweName + "...等";
                            if (c.scenicId === "2374") {
                                    //针对阿尔山景区。聚合点名称特殊处理
                                    var markerName = getMarkerName(_markers);
                            }
                            //console.log(_markers);
                            html = '<div class="leaflet-marker-icon my-div-icon cluster-marker ' + (options.className
                                    ? options.className
                                    : "") + '" ><p><span>' + markerName + '</span></p><div class="marker"><span>' + cluster.getChildCount() + "</span></div></div>";
                            if (cluster.getChildCount() == mThis.markerList.length) {
                                    for (var i = 0, clen = mThis.markerList.length; i < clen; i++) {
                                            if (mThis.map.hasLayer(mThis.markerList[i])) {
                                                    return mc.newIcon({className: "cluster-marker-icon bug", html: "<span></span>"});
                                            }
                                    }
                            }
                            return mc.newIcon({className: "cluster-marker", html: html});
                    }
            });
            markerCluster.on("clusterclick", function (a) {
                    //单击聚合点,就放大一层级别 a.layer.zoomToBounds();

                    mThis
                            .map
                            .setView(a.layer.getBounds().getCenter(), mThis.map.getZoom() + 1);
            });

            options.scenic && markerCluster.on("animationend", function () {
                    //聚合点散开或聚合，修改当前要闪烁的icon
                    var This = this;
                    if (c.currentPlaying) {
                            if (this.getVisibleParent(c.currentPlaying)) {
                                    if (!this.getVisibleParent(c.currentPlaying).hasEventListeners("add")) {
                                            c.animateMarkerParent && c
                                                    .animateMarkerParent
                                                    .off("add");
                                            this
                                                    .getVisibleParent(c.currentPlaying)
                                                    .on("add", function () {
                                                            if (This.getVisibleParent(c.currentPlaying) == this) {
                                                                    $(this._icon).addClass("playing");
                                                            }
                                                    });
                                            c.animateMarkerParent = this.getVisibleParent(c.currentPlaying);
                                    }
                                    $(this.getVisibleParent(c.currentPlaying)._icon)
                                            .children(".my-div-icon")
                                            .addClass("playing");
                            } else {
                                    $(c.currentPlaying._icon).addClass("playing");
                            }
                    }
            });
            return markerCluster.addLayer(L.layerGroup(markerList));
    };
    /******************************************************GPS定位设置开始**********************************************/
    this.inAutoPlayArea = function (lat, lon) {
            var marker;
            for (var i = 0, len = this.markerList.length; i < len; i++) {
                    marker = this.markerList[i].data;

                    if (marker.audioUrl && marker.area) {
                            if (mc.IsPtInPoly([
                                    lat, lon
                            ], marker.area)) 
                                    return this.markerList[i];
                            }
                    }

            return false;
    };

    this.startLocate = function () {
            if (!this.locateObj) {
                    this.locateObj = L
                            .control
                            .locate(mc.locateArg)
                            .addTo(this.map);
                    //注册定位成功方法

                    this
                            .map
                            .on("locationfound", onLocationFound);
                    //注册定位失败方法 locateOptions
                    this
                            .map
                            .on("locationerror", onLocationError);
            }
            this
                    .locateObj
                    .stop();
            this
                    .locateObj
                    .start();
            return this;
    };
    this.stopLocate = function () {
            this.locateObj && this
                    .locateObj
                    .stop() && this
                    .map
                    .stopLocate();
    };

    //自动设置地址最小缩放等级，实现最小缩放等级时必须铺满显示区域大小
    this.autoZoomRange = function () {
            var z = Math.ceil(this.map.getBoundsZoom(this.map.options.maxBounds, true));

            this.map.options.minZoom < z && (this.map.options.minZoom = z);
            this.map.options.maxZoom < z && (this.map.options.maxZoom = z);
            this
                    .map
                    .setZoom(z);
    };

    //定位失败处理方法

    function onLocationError(e) {
            var errorType = ["您的设置不支持定位", "您拒绝了位置请求服务", "无法获取你的位置，请打开GPS及Wifi后前往开阔场地尝试。", "无法获取你的位置，请打开GPS及wifi后前往开阔场地尝试"];
            //触发定位失败事件
            if (e.code == 1) {
                    if (!$(".advertisement-wrap").hasClass("show")) {
                            if ($(".modal.show").length >= 1) {
                                    $(".reject-local-box.modal").addClass("only-hide-modal");
                            } else {
                                    $(".reject-local-box.modal").removeClass("only-hide-modal");
                            }
                            c.showModal($(".reject-local-box.modal"));
                    }
                    c.rejectLocate = true;
            } else {
                    !c.currentLatlng && c.message(errorType[e.code], 5000);
            }
            setTimeout(function () {
                    mThis.locateBtn && mThis
                            .locateBtn
                            .removeClass("panto");
            }, 300);
    }

    //定位成功处理函数
    function onLocationFound(e) {
            var radius = e.accuracy / 2,
                    point = mc
                            .PointTransformation
                            .gcj_encrypt(e.latlng.lat, e.latlng.lng);
            // c.isAndroid&&(c.isWeixin||c.isQQ)&&(point.lat-=0.000095,point.lng-=0.0002100)
            // ; $(".scenic-name").html(e.latlng.lat+","+e.latlng.lng);
            var latlng = c.isAutoRectify
                            ? L.latLng(e.latlng.lat, e.latlng.lng)
                            : L.latLng(point.lat, point.lng),
                    goToHereFun,
                    inArea;
            //$(".scenic-name").html(latlng.lat+","+latlng.lng);
            radius = radius > 300
                    ? 50
                    : radius;

            c.currentLatlng = latlng;

            if (mThis.map.maxBounds.contains(latlng)) {
                    //在地图内

                    !c.nonfirstInScenic && (c.showAd(), (c.nonfirstInScenic = true));
                    c.inScenic = true;
                    if (mThis.locateMarker) {
                            //未添加定位按钮就添加，否则只需移动
                            mThis
                                    .locateMarker
                                    .mark
                                    .setLatLng(latlng);
                            mThis.locateMarker.circle && mThis
                                    .locateMarker
                                    .circle
                                    .setLatLng(latlng);
                            mThis.locateMarker.circle && mThis
                                    .locateMarker
                                    .circle
                                    .setRadius(radius);
                    } else {
                            mThis.locateMarker = mThis.addLocationMarker(latlng, radius);
                    }

                    if (mThis.locateBtn && mThis.locateBtn.hasClass("panto")) {
                            //移动到当前位置
                            mThis
                                    .map
                                    .panTo(latlng);
                    }
                    if ((inArea = mThis.inAutoPlayArea(latlng["lat"], latlng["lng"])) && !c.showLine) 
                            //已打开自动播放同时进入某个自动讲解区域并且没有显示路线，开始判断是否自动播放
                            c.whetherAutoPlay(inArea);
                    c.currentMarkerList && c
                            .currentMarkerList
                            .listNav
                            .parents(".modal.show")
                            .length > 0 && c.markerListSort();
            } else {
                    if (mThis.locateMarker) {
                            mThis
                                    .locateMarker
                                    .mark
                                    .setLatLng(latlng);
                            mThis.locateMarker.circle && mThis
                                    .locateMarker
                                    .circle
                                    .setLatLng(latlng);
                            mThis.locateMarker.circle && mThis
                                    .locateMarker
                                    .circle
                                    .setRadius(radius);
                    }
                    (!c.outViweHint || (mThis.locateBtn && mThis.locateBtn.hasClass("panto"))) && (c.message("您不在当前景区范围內！"), (c.outViweHint = true));
            }

            setTimeout(function () {
                    mThis
                            .locateBtn
                            .removeClass("panto");
            }, 300);
            goToHereFun = c.goToHereFun;
            c.goToHereFun && ((c.goToHereFun = null), goToHereFun(point["lon"], point["lat"])); //如果c.goToHereFun不为空，则表示处于去这儿路线规划中，开始跳转高德
    }

    /******************************************************GPS定位设置结束**********************************************/

    //添加一下显示当前位置的marker
    this.addLocationMarker = function (latlng, radius) {
            var icon = "",
                    locationCircle = null;

            if (c.orientation !== false) {
                    icon = L.divIcon({className: "locate-marker-icon orientation", html: '<span  class="icon-local" ></span><span id="orientation" ></span>'});
            } else {
                    icon = L.divIcon({className: "locate-marker-icon", html: '<span  class="icon-local" ></span>'});
            }

            locationCircle = L.circle(latlng, radius, {
                    weight: "2",
                    color: "#1f6cf4",
                    fillColor: "#1f6cf4"
            });

            locationMark = L.marker(latlng, {icon: icon});

            locationCircle && locationCircle.addTo(this.map);
            locationMark.addTo(this.map);
            c.locationMark = locationMark;
            return {mark: locationMark, circle: locationCircle};
    };

    //显示路线
    this.showLine = function (name) {
            if (this.currentShowline) {
                    this
                            .map
                            .removeLayer(this.currentShowline);
            }
            if (!this.lineLayerGroup[name]) {
                    this.lineLayerGroup[name] = this.cratePolyline(this.lineData[name], name);
                    // this.arrowInlineLayerGroup[name]=this.crateArrowInline(this.lineData[name],na
                    // m e);
            }
            this.currentShowline = this.lineLayerGroup[name];
            this
                    .lineLayerGroup[name]
                    .addTo(this.map);
            //this.arrowInlineLayerGroup[name].addTo(this.map);

            c.showLine = true;

            return this;
    };

    //添加路线   todo by zl
    this.cratePolyline = function (lineData, name) {
            var layerGroup = L.layerGroup(),
                    points = [],
                    position,
                    latLng,
                    marker,
                    markerIndex = 1,
                    polyline;
            for (var i = 0, len = lineData.length; i < len; i++) {
                    position = lineData[i]
                            .position
                            .split(",");
                    latLng = L.latLng(position[1], position[0]);
                    points.push(latLng);
                    if (lineData[i].mark === "1") {
                            marker = mc.createLineMarker({
                                    lnglats: latLng,
                                    index: markerIndex++
                            });
                            layerGroup.addLayer(marker);
                    }
            }
            polyline = L.polyline(points, {
                    color: "#dd3622",
                    weight: 8 * 2,
                    opacity: 1
            });
            layerGroup.addLayer(polyline);
            polyline = L.polyline(points, {
                    color: "#ff5440",
                    weight: 6 * 2,
                    opacity: 1
            });
            layerGroup.addLayer(polyline);

            var arrowLine = L.polylineDecorator(points, {
                    patterns: [
                            {
                                    offset: "1%",
                                    repeat: "5%",
                                    symbol: L
                                            .Symbol
                                            .marker({
                                                    rotate: true,
                                                    markerOptions: {
                                                            icon: L.icon({
                                                                    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAAH6Nf8rAAAAAXNSR0IArs" +
                                                                            "4c6QAAAJ5JREFUGBldkMsRwkAMQ5dWAhWQFoAiAlWEcpMCwpXccsA8Od7PRDOelWSt95NS4GRmP/grQd" +
                                                                            "67CeuomVpyLiloRRWCeVcHbG7u3FYJeC/dpsciIrHFjps3EEsYOl/oNEfoY8cqIfPZzkLrIRUYg8yooX" +
                                                                            "aC0dD1fBxriy/i6jHI1HQ+8At1psQzpnxJPedxPApPv+RPVTA++hirmsz4Bxc+2JxEAhdiAAAAAElFTk" +
                                                                            "SuQmCC",
                                                                    iconSize: [
                                                                            6 * 2,
                                                                            6 * 2
                                                                    ],
                                                                    iconAnchor: [6, 0]
                                                            })
                                                    }
                                            })
                            }
                    ]
            });
            // layerGroup.addLayer(arrowLine);

            return layerGroup;
    };

    //隐藏路线
    this.hideLine = function (name) {
            if (this.currentShowline) {
                    var _layers = this.currentShowline._layers,
                            marker,
                            markerGroup = this.markerGroupC || this.markerGroup;
                    this.currentShowline && this
                            .map
                            .removeLayer(this.currentShowline);
            }

            c.showLine = false;
    };
}

/**
* DOM相关操作
*/
var domOperate = function () {
    var $body = $("body"),
            c = commonMethod,
            clickEvent = c.clickEvent,
            scenicName = c.scenicName,
            $autoPlay = $("#autoPlay"),
            $xieChengLink = $(".xiecheng-wrapper");

    function xieChengHandler() {
            if ((c.distributorId == 11 || c.distributorId == 233) && (c.scenicId == 5661 || c.scenicId == 5506)) {
                    var obj = {
                            dk: c.distributorId
                    }
                    if (c.scenicId == 5661) {
                            obj.sk = 5506
                    } else if (c.scenicId == 5506) {
                            obj.sk = 5661
                    }
                    window
                            .sessionStorage
                            .setItem("xiecheng", JSON.stringify(obj))
            }
    }

    //携程4+1项目特殊处理
    $xieChengLink
            .on(clickEvent, function (e) {
                    var xieChengScenicId = $(this).data("id")
                    if (!authorization()) { 		return false; }
                    if (xieChengScenicId == 5661) {
                            window.location.href = "index?t=e&sk=FdzfOkZ9eOU%3D&dk="+c.urlArg.dk
                    } else if (xieChengScenicId == 5506) {
                            window.location.href = "index?t=e&sk=tH%2BX3JKBR%2Fk%3D&dk="+c.urlArg.dk
                    }

            })

    //关闭模态框
    var closeModal = $(".modal .close-icon");
    closeModal.off(clickEvent);
    closeModal.bind(clickEvent, c.hideModal);

    $("div.modals").bind(clickEvent, function (e) {
            if (e.target === e.currentTarget) {
                    if ($(this).children(".show.marker-group").length > 0) {
                            $("#sceniclist li.liSelect").removeClass("liSelect");
                    }
                    if ($(this).children(".show.close-by-self").length == 0) {
                            $body.removeClass("show-modal");
                            $(this)
                                    .children(".show")
                                    .removeClass("show")
                                    .addClass("hide");
                    }
                    /*			if(!c.rejectLocate){
            c.map&&c.map.startLocate();
            c.subMap&&c.subMap.stopLocate();
        }*/
            }

            return false;
    });

    //模态框下子元素阻止冒泡
    $("div.modals").on(clickEvent, "div.modals>div", function (e) {
            e.stopPropagation();
    });
    //关闭模态框结束

    $body.bind(clickEvent, function (e) {
            if ($(e.target).parents(".menu-wrapper").length <= 0 && $(".menu-wrapper.show").length > 0) {
                    $(".menu-wrapper.show").removeClass("show");
            }
    });
    //禁用下拉刷新
    $body[0].addEventListener("touchmove", function (e) {
            if (!($(e.target).hasClass("enable-touchmove") || $(e.target).parents(".enable-touchmove").length)) 
                    e.preventDefault();
            }
    , false);

    $("textarea,input").bind("blur", function () {
            $body.scrollTop(0);
            setTimeout(function () {
                    $body.scrollTop(0);
            }, 100);
    });

    /****************************************广告弹窗和激活弹框相关操作************************************************************************/
    //广告弹窗相关操作
    var $advertisement = $(".advertisement-wrap"),
            $looklook = $advertisement.find("div.looklook"),
            $confirmYes = $advertisement.children("#confirmYes"),
            $verifyWrap = $(".verify-wrap.modal"),
            $vTextarea = $verifyWrap.find(".dd-input>textarea"),
            $tipText = $verifyWrap.find(".dd-txt>.ptxt1"),
            $aActivate = $verifyWrap.find("a.a-activate"),
            urlCode = c.urlArg && c.urlArg.c;

    //关闭广告弹窗
    $looklook.bind(clickEvent, function (e) {
            !c.activated && c.hideModal(e);
            return false;
    });

    //开户自动导游功能或弹出激活激活弹窗
    $confirmYes.bind(clickEvent, function (e) {
            $autoPlay.trigger(c.clickEvent);
            if (!c.rejectLocate && ($advertisement.hasClass("active") || $advertisement.hasClass("free"))) {
                    $advertisement.removeClass("only-hide-modal");
            } else {
                    $advertisement.addClass("only-hide-modal");
            }

            c.hideModal(e);

            return false;
    });

    //验证是否激活
    function authorization() {
            if (c.activated || c.needVerify === false) {
                    !c.activated && (c.activated = true);
                    return true;
            } else {
                    $verifyWrap
                            .find("p.ptxt1")
                            .show()
                            .siblings(":visible")
                            .hide();
                    c.showModal($verifyWrap);
                    urlCode && ($vTextarea.val(urlCode), $tipText.html("已自动识别您所购买的授权码，点击“验证授权”，即可获取授权！"), $vTextarea.trigger("focus"));
                    return false;
            }
    }

    //获得焦点时取消背景
    $vTextarea
            .bind("focus", function () {
                    !$vTextarea
                            .parent()
                            .hasClass("active") && $vTextarea
                            .parent()
                            .addClass("active");
            });
    //失去焦后且没有输入时恢复背景
    $vTextarea.bind("blur", function () {
            if (!$vTextarea.val()) {
                    $vTextarea
                            .parent()
                            .removeClass("active");
            }
    });
    //给激活按钮添加事件

    $aActivate.bind(clickEvent, function () {
            var inputCode = $vTextarea
                            .val()
                            .trim(),
                    includeText = false,
                    $ddTxt = $verifyWrap.find(".dd-txt>p"),
                    $inputNull = $verifyWrap.find(".input-null"),
                    $inputError = $verifyWrap.find(".input-error"),
                    reqUrl = "",
                    urlObj = c.urlArg.urlObj;

            try {
                    urlObj = eval("(" + c.urlArg.urlObj + ")");
            } catch (e) {
                    urlObj = "";
                    console.log(e);
            }

            if (inputCode == "") {
                    $ddTxt.hide();
                    $inputNull.show();
                    return false;
            }
            inputCode.search(/[^0-9]/) != -1 && (includeText = true);

            if (inputCode.search(/取票凭证码|授权码|【电子票|预订成功/) > -1) {
                    //通过正则自动匹配短信中的激活码

                    if (inputCode.match(/(取票凭证码|授权码|【电子票|预订成功).*?([0-9]{6,15})/)) {
                            inputCode = inputCode.match(/(取票凭证码|授权码|【电子票|预订成功).*?([0-9]{6,15})/)[2];
                    } else {
                            $ddTxt.hide();
                            $inputError.show();
                            return false;
                    }
            } else {
                    if (inputCode.match(/[0-9]{6,15}/)) {
                            inputCode = inputCode.match(/[0-9]{6,15}/)[0];
                    } else {
                            $ddTxt.hide();
                            $inputError.show();
                            return false;
                    }
            }

            c.urlArg.weChat == "true" && (reqUrl = c.isAuthUrl + inputCode + "&scenicId=" + c.scenicId + "&userId=" + c.userId + "&token=" + c.token + "&distributorId=" + c.distributorId);
            c.urlArg.weChat != "true" && (reqUrl = c.isAuthUrl + inputCode + "&scenicId=" + c.scenicId + "&distributorId=" + c.distributorId);
            urlObj && urlObj.scenicGroupId && (reqUrl = reqUrl + "&groupId=" + urlObj.scenicGroupId);
            c.ajax({
                    url: reqUrl,
                    async: false,
                    success: function (data) {
                            if (data.isForeverAuth) {
                                    authSuccess(true, data);
                                    return false;
                            }
                            endDate = data.endDate;

                            if (data.errorMessage == undefined && data.beginUseDate != "") {
                                    //验证通过

                                    authSuccess(false, data);
                            } else if (data.errorMessage == "1" || data.errorMessage == "2") {
                                    //验证码错误

                                    $ddTxt.hide();

                                    if (includeText) {
                                            $verifyWrap
                                                    .find(".ptxt2-1")
                                                    .show();
                                    } else {
                                            $verifyWrap
                                                    .find(".ptxt2")
                                                    .show();
                                    }
                            } else if (data.errorMessage == "4") {
                                    //验证码过期

                                    $ddTxt.hide();
                                    if (data.beginUseDate) {
                                            $verifyWrap
                                                    .find(".ptxt3 .expire-tip")
                                                    .html("有效时间：" + data.beginUseDate.replace(/-/g, "") + "-" + data.useEndDate.replace(/-/g, ""));
                                    } else {
                                            $verifyWrap
                                                    .find(".ptxt3 .expire-tip")
                                                    .html("您未在" + data.endDate.replace(/-/g, "") + "前激活");
                                    }

                                    $verifyWrap
                                            .find(".ptxt3")
                                            .show();
                            } else if (data.errorMessage == "token_error") {
                                    alert("登录出错，请重新登录.");
                                    location.href = "login.html";
                            }
                    }
            });

            function authSuccess(isForeverAuth, data) {
                    //激活成功相关操作
                    c.setCookie("validCode", inputCode, 365);
                    c.activated = true;
                    //针对携程4+1项目做特殊处理
                    xieChengHandler()
                    $verifyWrap.addClass("success");
                    !isForeverAuth && $verifyWrap
                            .find(".success-tip>span")
                            .html(data.useEndDate);

                    $verifyWrap
                            .find(".understand")
                            .bind(clickEvent, function (e) {
                                    if (c.activated) {
                                            $autoPlay.trigger(clickEvent);
                                    }
                                    if (c.rejectLocate) {
                                            $verifyWrap
                                                    .removeClass("show")
                                                    .addClass("hide");
                                    } else {
                                            c.hideModal(e);
                                    }
                            });
            }

            return false;
    });

    /****************************************广告弹窗和激活弹框相关操作结束************************************************************************/
    /****************************************授权码验证***********************************************************************************************/
    var urlObj;
    try {
            urlObj = eval("(" + c.urlArg.urlObj + ")");
    } catch (e) {
            console.log(e);
    }

    function verifyCookie() {
            if (!c.needVerify) {
                    c.activated = true;
                    return true;
            }
            var flag = false;
            var validCode = c.getCookie("validCode");
            var groupValidCode = c.getCookie("groupValidCode");
            var urlCode = c.urlArg && (c.urlArg.d || c.urlArg.c);
            var userInfo = "";
            if (c.urlArg.weChat == "true") {
                    userInfo = "&userId=" + c.userId + "&token=" + c.token;
            }
            urlCode && (validCode = urlCode);
            if (groupValidCode != null && groupValidCode != "" && c.urlArg.nonShowConfirm) {
                    $.ajax({
                            url: c.isAuthUrl + groupValidCode + "&groupId=" + urlObj.scenicGroupId + "&distributorId=" + c.distributorId + userInfo,
                            type: "GET",
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                    debugger
                                    if (data.errorMessage == undefined) {
                                            c.message("恭喜您已激活该景区！");
                                            c.activated = true;
                                            flag = true;
                                            c.setCookie('groupValidCode', groupValidCodee); //  这是覆盖保存
                                            xieChengHandler();
                                    } else if (data.errorMessage == "token_error" && c.urlArg.weChat == "true") {
                                            alert("登录出错，请重新登录.");
                                            location.href = "login.html";
                                    }
                            }
                    });
            }
            if (validCode != null && validCode != "" && !flag) {
                    //如果存在则不显示弹窗

                    $.ajax({
                            url: c.isAuthUrl + validCode + "&scenicId=" + c.scenicId + "&distributorId=" + c.distributorId + userInfo,
                            type: "GET",
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                    if (data.errorMessage == undefined) {
                                            c.message("恭喜您已激活该景区！");
                                            c.activated = true;
                                            flag = true;
                                            c.setCookie("validCode", validCode, 365);
                                            xieChengHandler();
                                    } else if (data.errorMessage == "token_error" && c.urlArg.weChat == "true") {
                                            alert("登录出错，请重新登录.");
                                            location.href = "login.html";
                                    }
                            }
                    });
            }

            if (!flag && c.userId && c.token && userInfo) {
                    $.ajax({
                            url: c.isAuthUrl + "&userId=" + c.userId + "&token=" + c.token + "&distributorId=" + c.distributorId + (c.scenicId
                                    ? "&scenicId=" + c.scenicId
                                    : "&groupId=" + urlObj.scenicGroupId),
                            type: "GET",
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                    if (data.errorMessage == undefined) {
                                            c.message("恭喜您已激活该景区！");
                                            c.activated = true;
                                            flag = true;
                                    } else if (data.errorMessage == "token_error" && c.urlArg.weChat == "true") {
                                            alert("登录出错，请重新登录.");
                                            location.href = "login.html";
                                    }
                            }
                    });
            }
            if (window.sessionStorage && window.sessionStorage.getItem("xiecheng") && window.sessionStorage.getItem("xiecheng") != "") {
                    var xieChengObj = JSON.parse(window.sessionStorage.getItem("xiecheng"))
                    if (xieChengObj.sk == c.scenicId && xieChengObj.dk == c.distributorId) {
                            flag = true;
                    }
            }

            c.activated = flag;
            return flag;
    }

    /****************************************授权码验证结束***********************************************************************************************/
    //关闭广告条
    $("#closePopularize")
            .bind(clickEvent, function () {
                    $body.addClass("hide-popularize");
                    setTimeout(function () {
                            c
                                    .map
                                    .map
                                    .invalidateSize(true);
                    }, 250);
            });

    /*************************************************底部菜单相关DOM操作结束*************************************************************/
    var $roadsListNav = $(".roads-list-wrapper"),
            $roadsList = $("#recommendRoad"),
            roadsListScroll = c.scroll("#roadsListScroll"),
            $audioListNav = $(".audio-list-wrapper"),
            $audioList = $("#audioList"),
            audioListScroll = c.scroll("#audioListScroll"),
            $scenicListNav = $(".scenicList-nav"),
            sceniclistScroll = c.scroll("#sceniclistWrap"),
            $sceniclist = $("#sceniclist"),
            $spotsSearch = $("#spotsSearch");

    $(".other-btns .audio-list-icon").bind(clickEvent, function (e) {
            //显示语音类型菜单
            if ($audioListNav.hasClass("show")) {
                    $audioListNav
                            .find(".close-icon")
                            .trigger(clickEvent);
            } else {
                    c.showModal($audioListNav);
                    $audioListNav
                            .siblings(".modal.show")
                            .removeClass("show")
                            .addClass("hide");
                    audioListScroll.refresh();
            }
            return false;
    });

    //切换音频类型开始
    $audioList
            .children("li:not('.tips')")
            .bind(clickEvent, function (e, trigger) {
                    switchAudioType($(this));
                    !trigger && c.hideModal(e);
                    return false;
            });

    function switchAudioType($this) {
            if ($this.hasClass("liSelect")) {
                    return false;
            }
            $this
                    .siblings(".liSelect")
                    .length > 0 && c.message("当前语音类型已切换为：" + $this.find(".sTxt").text());
            c.active($this, "liSelect");
            c.audioType = $this.attr("audioid");
            if (c.$audio.data("guidePlaying") != "true" && c.currentPlaying) {
                    if (c.currentPlaying.data.audioUrl["audioId" + c.audioType]) {
                            c.audio.src = c.currentPlaying.data.audioUrl["audioId" + c.audioType];
                            c
                                    .audio
                                    .play();
                    } else {
                            c.message("当前讲解的景点没有该类型的语音....");
                    }
            }
    }

    $audioList
            .children("li:not('.tips')")
            .eq(0)
            .trigger(clickEvent, true);
    //切换音频类型结束

    /*************************************************底部菜单相关DOM操作结束*************************************************************/

    //显示帮助弹窗
    var $userHelp = $(".viweDetails.help"),
            userHelpScroll = c.scroll("#userHelpContant"),
            $userHelpContant = $("#userHelpContant"),
            $helpIcon = $(".other-btns>.help-icon-con>.help-icon");
    $helpIcon.bind(clickEvent, function () {
            if (!$userHelpContant.hasClass("loaded")) {
                    $.ajax({
                            url: c.needVerify
                                    ? "help.html"
                                    : "helpForFree.html",
                            success: function (data) {
                                    $userHelpContant
                                            .children("div")
                                            .eq(0)
                                            .html(data);
                                    $userHelpContant
                                            .removeClass("loading")
                                            .addClass("loaded");
                                    $userHelpContant
                                            .find("img")
                                            .bind("load", function () {
                                                    userHelpScroll.refresh();
                                            });
                                    userHelpScroll.refresh();
                            },
                            error: function (error) {
                                    c.message("帮助文档载入出错，请尝试刷新重试。。");
                            }
                    });
            }

            c.showModal($userHelp);
            userHelpScroll.refresh();
            return false;
    });
    //显示帮助弹窗操作结束

    /*****************************************投诉相关DOM操作开始*********************************************************************/

    var $feedbackModal = $("#feedBackDom"),
            $backBtn = $feedbackModal.find("div.back"),
            $feedbackSbt = $feedbackModal.find("div.submit"),
            $feedbackTitle = $feedbackModal.find(".header .title"),
            $feedTip = $feedbackModal.find(".error-tip"),
            $feedTelInput = $feedbackModal.find("input#telNumber"),
            $feedBackSbt = $("#feedBackDom div.submit"),
            $feedTelTextarea = $feedbackModal.find("textarea.textarea");

    //显示问题反馈弹窗
    $(".error-correction").bind(clickEvent, function () {
            $feedTelInput.val("");
            $feedTelTextarea.val("");
            $feedTip.removeClass("show-error");
            $backBtn.trigger(clickEvent);
            c.showModal($feedbackModal);
            return false;
    });

    //显示问题反馈表单
    $feedbackModal.on(clickEvent, ".feed-choose>dl>dt", function () {
            var $this = $(this);

            $feedbackTitle.text($this.attr("error-text"));
            $this
                    .siblings()
                    .removeClass("selected");
            $this.addClass("selected");
            $feedbackModal.addClass("show-menu");
            return false;
    });
    //返回主页
    $backBtn.bind(clickEvent, function () {
            $feedbackModal.removeClass("show-menu");
            $feedbackTitle.text("建议与反馈");
    });

    //提交按钮状态检测
    $feedTelInput.bind("input", function () {
            feedValidateIntime();
    });
    $feedTelTextarea.bind("input", function () {
            feedValidateIntime();
    });

    //已验证失败时，实时验证输入是否合法 未验证失败，检测提交按钮是否可用
    function feedValidateIntime() {
            if ($feedTip.hasClass("show-error")) {
                    feedValidate();
            } else {
                    if ($feedTelInput.val().trim() && $feedTelTextarea.val().trim()) {
                            $feedBackSbt.removeClass("disable");
                    }
            }
    }

    //输入数据验证
    function feedValidate() {
            var mobile = $feedTelInput
                            .val()
                            .trim(),
                    text = $feedTelTextarea
                            .val()
                            .trim();

            if (!/^(17[0-9]|13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(mobile)) {
                    //手机号码验证
                    $feedTip
                            .addClass("show-error")
                            .text("请填写正确的手机号码");
                    return false;
            }
            if (text.length < 10) {
                    $feedTip
                            .addClass("show-error")
                            .text("至少输入10个字符");
                    return false;
            }
            $feedTip.removeClass("show-error");
            return true;
    }

    //提交表单
    $feedBackSbt
            .bind(clickEvent, function () {
                    if (feedValidate()) {
                            var sendStr = "adviceScenicids=" + $feedbackModal
                                    .find("dl>dt.selected")
                                    .attr("error-text") + "," + $feedTelTextarea
                                    .val()
                                    .trim() + "," + $feedTelInput
                                    .val()
                                    .trim() + "," + scenicName;

                            $feedbackModal
                                    .parent()
                                    .trigger(clickEvent);
                            $.ajax({
                                    type: "POST",
                                    url: "/web/adviceRecord",
                                    data: sendStr,
                                    success: function (data) {
                                            c.message("信息提交成功，我们会尽快处理！感谢您的反馈。", 3000, "true");
                                    },
                                    error: function (jqXHR) {
                                            c.message("发生错误：" + jqXHR.status + "！请尝试重新提交，或拨打我们的投诉热线！", 3000, "highly");
                                    }
                            });
                    }
            });

    /*************************************************投诉相关DOM操作结束*************************************************************/

    //自动播放按钮绑定事件
    $autoPlay.bind(clickEvent, function () {
            if (!authorization()) {
                    return false;
            }
            var $this = $(this),
                    audioData = c
                            .$audio
                            .data();
            if ($this.hasClass("on")) {
                    //关闭自动播放
                    $this.removeClass("on");
                    c.message("自动播放已关闭！");
                    if (!c.manualPlay || audioData.guidePlaying == "true") {
                            //如果是手动点击播放按钮并且音频未播放结束，关闭自动播放后不暂停当前播放音频
                            c
                                    .audio
                                    .pause();
                            c
                                    .$audio
                                    .data("status", "playend");
                            c.$controlBtn && c
                                    .$controlBtn
                                    .removeClass("playing");
                            if (audioData.guidePlaying == "true") {
                                    c
                                            .$audio
                                            .data("guidePlaying", "false");
                                    c
                                            .$audio
                                            .data("guidePlayed", "true");
                            }
                    }
                    c.autoPlay = false;
            } else {
                    //打开自动播放
                    if (c.rejectLocate) {
                            $advertisement.hasClass("show") && $advertisement.removeClass("show");
                            c.showModal($(".reject-local-box.modal"));
                            return false;
                    }
                    c.message(c.inScenic
                            ? "定位到您在景区内，很高兴为您导游！"
                            : "当您到达景区后，自动播放自动开始");

                    c.audio.src = "first";
                    c
                            .audio
                            .play();
                    if ((c.scenicId === "2374" || c.scenicId === "2149") && audioData.status != "playing" && c.inScenic && audioData.guidePlayed != "true") {
                            c.audio.src = c.guideAuido;
                            c
                                    .$audio
                                    .data("guidePlaying", "true");
                            c
                                    .audio
                                    .play();
                    }
                    c.autoPlay = true;
                    c.manualPlay = false;

                    $(this).addClass("on");
            }
    });

    //针对ios的一些特殊处理

    if (c.isiOS) {
            $(".doubletap-disable")
                    .doubletap(function (event) {
                            event.preventDefault();
                            return false;
                    }, function (event) {}, 400);
    }

    /*************************************************与地图相关的DOM操作事件绑定*************************************************************/
    var $viweDetails = $(".viweDetails.scenic"),
            viweDetailsScroll = c.scroll("#scenicContant"),
            $viweDetailsContant = $("#scenicContant");

    var domOperateForMap = function (mapModule, subScenic) {
            var m = mapModule,
                    map = m.map,
                    markers = m.markerList,
                    c = commonMethod,
                    $mapLocateBtn = $("#mapLocateBtn");

            function getDetalis(markerData) {
                    var dataType = "html";
                    if (!($viweDetailsContant.data("loaded") === markerData.detailsURL)) {
                            $viweDetailsContant.addClass("loading");
                            markerData.viweType == "groupScenic" && (dataType = "json");
                            $viweDetails
                                    .find(".header>h3")
                                    .html(markerData.viweName);
                            $viweDetails.data({viweName: markerData.viweName, lat: markerData.position[0], lon: markerData.position[1]});
                            c.ajax({
                                    url: markerData.detailsURL,
                                    dataType: dataType,
                                    success: function (data) {
                                            var content = data;
                                            markerData.viweType == "groupScenic" && (content = data.marker.detail);
                                            var $html = $("<div>" + content.replace(/src\=\"http:\/\//g, 'src="https://') + "</div>"),
                                                    $images = $html.find("img");
                                            $viweDetailsContant.data("loaded", markerData.detailsURL);
                                            viweDetailsScroll.scrollTo(0, 0);
                                            $images.bind("load error", function () {
                                                    viweDetailsScroll.refresh();
                                            });
                                            $viweDetailsContant
                                                    .children(".content")
                                                    .html($html.html());
                                            setTimeout(function () {
                                                    viweDetailsScroll.refresh();
                                            }, 1000);
                                            $viweDetailsContant.removeClass("loading");
                                    }
                            });
                    }
                    c.showModal($viweDetails);
            }

            /****************************************景点列表相关操作开始************************************************************************/

            var menuTabs = [
                    {
                            listNav: $sceniclist,
                            scrollBar: sceniclistScroll,
                            markerList: c.map.markerList,
                            mapLayers: [c.map.allMarkersLyer]
                    }, {
                            listNav: $roadsList,
                            scrollBar: roadsListScroll
                    }
            ];
            var mapHasLayers = [c.map.allMarkersLyer];
            var $menuWrapper = $(".menu-wrapper"),
                    $foldBtn = $menuWrapper.find(".fold-btn"),
                    $menuList = $menuWrapper.find(".menu-list-nav"),
                    $menuContent = $menuWrapper.find(".menu-content"),
                    menuListScroll = c.scroll("#menuListScroll", {
                            scrollbars: false,
                            scrollY: false,
                            scrollX: true
                    });

            $foldBtn.bind(clickEvent, function () {
                    var tab = $menuWrapper
                                    .find("ul>li.active")
                                    .data("tab"),
                            index = $menuWrapper
                                    .find("ul>li.active")
                                    .index();

                    if (!$menuWrapper.hasClass("show")) {
                            $spotsSearch.val("");
                            $spotsSearch.trigger("input");
                            $spotsSearch.blur();
                            $menuWrapper.addClass("show");
                    } else {
                            $spotsSearch.blur();
                            $menuWrapper.removeClass("show");
                    }
                    if (menuTabs[index] && menuTabs[index].markerList) {
                            c.currentMarkerList = menuTabs[index];
                            (c.inScenic || menuTabs[index].listNav.children("li").length <= 0) && c.markerListSort();
                            menuTabs[index].scrollBar && menuTabs[index]
                                    .scrollBar
                                    .refresh();
                    }
                    if (index === 0) {
                            menuTabs[index]
                                    .listNav
                                    .find("li.playing")
                                    .removeClass("playing");
                    }

                    //$menuWrapper.find("ul>li.active").data("active",false).trigger(clickEvent);
            });
            var tabs,
                    listDiv,
                    $listDiv,
                    listObj;
            for (var i = 0, len = c.mapData.nearServices.length; i < len; i++) {
                    tabs = '<li ><div><img class="img-active" src="' + c.mapData.nearServices[i].serviceTypShowPicName + '" ><img class="img-un-active" src="' + c.mapData.nearServices[i].serviceTypDefaultPicName + '" ></div>' + c.mapData.nearServices[i].serviceTypeName + "</li>";
                    listDiv = '<div  class="scenicList-nav list-item-div tool-nav modal ">  	<div id="listItemS' +
                                    "croll" + i + '" class="scroll enable-touchmove ">      	<ul id="listItem' + i + '">      	</ul>	</div></div>';
                    $listDiv = $(listDiv);
                    $menuList
                            .find("ul")
                            .append($(tabs));

                    $menuContent.append($listDiv);
                    listObj = {
                            listNav: $listDiv.find("#listItem" + i),
                            scrollBar: c.scroll("#listItemScroll" + i),
                            markerList: c
                                    .map
                                    .addMarkers(c.mapData.nearServices[i].markers),
                            mapLayers: []
                    };
                    listObj
                            .mapLayers
                            .push(L.layerGroup(listObj.markerList));
                    menuTabs.push(listObj);
            }
            $menuList
                    .find("ul")
                    .width(menuTabs.length * $menuList.find("ul>li:eq(0)").width());
            menuListScroll.refresh();
            $menuList.off(clickEvent);
            $menuList.on(clickEvent, "ul>li", function () {
                    var $this = $(this),
                            tab = $this.data("tab"),
                            index = $this.index(),
                            oldIndex = $this
                                    .siblings(".active")
                                    .index(),
                            scrollDistains = -(c.fontsize * 1.4 / 2 + $this.position().left - c.bodyWidth / 2);

                    if (!$this.data("active") || tab === "road") {
                            $this.data("active", true);
                            $this
                                    .siblings(".active")
                                    .data("active", false);
                            $this
                                    .addClass("active")
                                    .siblings()
                                    .removeClass("active");
                            $menuContent
                                    .children("div")
                                    .eq(index)
                                    .addClass("active")
                                    .siblings()
                                    .removeClass("active");

                            if (tab === "road") {
                                    !$menuWrapper.hasClass("show") && menuTabs[index]
                                            .listNav
                                            .children("li")
                                            .eq("0")
                                            .trigger(clickEvent);
                            } else {
                                    if (mapHasLayers.length > 0) {
                                            mapHasLayers
                                                    .forEach(function (layer) {
                                                            map.hasLayer(layer) && layer.remove();
                                                    });
                                            mapHasLayers = [];
                                    }
                                    c.showLine && (m.hideLine(), $roadsList.find("li.liSelect").removeClass("liSelect"));
                                    if (menuTabs[index].mapLayers) {
                                            menuTabs[index]
                                                    .mapLayers
                                                    .forEach(function (layer) {
                                                            map.addLayer(layer);
                                                            mapHasLayers.push(layer);
                                                    });
                                    }

                                    c.currentMarkerList = menuTabs[index];
                                    (c.inScenic || menuTabs[index].listNav.children("li").length <= 0) && c.markerListSort();
                            }
                            if (menuTabs[index]) {
                                    menuTabs[index].scrollBar && menuTabs[index]
                                            .scrollBar
                                            .refresh();
                            }
                    }
                    menuListScroll.scrollBy(scrollDistains, 300);
                    menuListScroll.refresh();
                    return false;
            });
            $sceniclist.html("");
            for (var i = 0, len = markers.length; i < len; i++) {
                    $li = $(c.assembleScenicList(markers[i].data));
                    $li.data("marker", markers[i]);
                    $sceniclist.append($li);
            }

            sceniclistScroll.refresh();

            $sceniclist.off(clickEvent);
            $sceniclist.on(clickEvent, "li", listClick);
            $(".list-item-div").on(clickEvent, "li", listClick);
            var sortSubMarkers = [];

            function listClick(e) {
                    var $this = $(this),
                            marker = $this.data("marker");

                    $spotsSearch.trigger("blur");
                    !$this.hasClass("group") && $menuWrapper.removeClass("show");
                    if ($this.hasClass("child-group")) {
                            $(".child-grounp." + $this.get(0).id).find(".marker") && $(".child-grounp." + $this.get(0).id)
                                    .find(".marker")
                                    .trigger(clickEvent);
                            return true
                    }
                    if (!$this.hasClass("group") && $this.parents("li.group").length == 0) {
                            if ($this.hasClass("liSelect")) {
                                    marker.closePopup();
                                    $this.removeClass("liSelect");
                            } else {
                                    $this
                                            .siblings(".liSelect")
                                            .removeClass("liSelect");
                                    $this.addClass("liSelect");
                                    map.setMaxBounds();
                                    c.openPopup(marker);
                            }
                    } else {
                            if ($this.hasClass("group")) {
                                    if ($this.hasClass("result")) 
                                            $this.toggleClass("search-folded");
                                    else 
                                            $this.toggleClass("folded");
                                    $this.hasClass("folded") && $this.removeClass("playing");
                                    if (c.currentLatlng && c.inScenic) {
                                            sortSubMarkers = [];
                                            for (var i = 0, len = marker.data.markers.length; i < len; i++) {
                                                    sortSubMarkers[i] = {
                                                            data: marker.data.markers[i]
                                                    };
                                                    sortSubMarkers[i]._latlng = L.latLng(marker.data.markers[i].position);
                                                    sortSubMarkers[i].data.distance = marker.data.markers[i].position
                                                            ? sortSubMarkers[i]
                                                                    ._latlng
                                                                    .distanceTo(c.currentLatlng)
                                                            : "";
                                            }
                                            c.markerListSort(sortSubMarkers, $this.children("ul"));
                                    }

                                    $this
                                            .children("ul")
                                            .slideToggle("fast", function () {
                                                    sceniclistScroll.refresh();
                                            });
                            }

                            if ($this.parents("li.group").length > 0) {
                                    $this
                                            .siblings(".liSelect")
                                            .removeClass("liSelect");
                                    $this.addClass("liSelect");
                                    $this
                                            .parents("li.group")
                                            .eq(0)
                                            .data("marker")
                                            .fire("click");
                                    return false;
                            }
                    }

            }

            var $groupNav = $(".marker-group"),
                    $groupList = $groupNav.find(".group-list>dl"),
                    groupListScroll = c.scroll("#group-list-scroll"),
                    $progressBar = $groupNav.find(".progress-bar"),
                    $subMarker;

            function showGroupList(marker) {
                    var markerData = marker.data;

                    $groupNav
                            .find(".group-intr>.title")
                            .html(markerData.viweName);
                    $groupNav
                            .find(".group-intr>.content")
                            .html(markerData.viweIntr);
                    $groupNav
                            .children(".group-intr")
                            .data("marker", marker);
                    $progressBar.prependTo($groupNav.find(".group-intr"));
                    if (!markerData.audioUrl) 
                            $progressBar.parent().addClass("no-audio");
                    else 
                            $progressBar
                                    .parent()
                                    .removeClass("no-audio");
                    $progressBar.css("background-image", "url('" + markerData.viweImgUrl + "')");
                    $groupNav
                            .find(".images.playing")
                            .removeClass("playing");
                    if (c.currentPlaying === marker) {
                            c.$controlBtn = $progressBar;
                    } else {
                            c.currentPopup = marker;
                            c.$controlBtn = null;
                            $progressBar.attr("class", "progress-bar");
                            $progressBar
                                    .find(".slice")
                                    .removeClass("half");
                            $progressBar
                                    .find(".slice>.than-half")
                                    .css("transform", "rotate(0deg)");
                    }
                    if ($groupNav.data("id") != markerData.viweID) {
                            $groupNav.data("id", markerData.viweID);
                            $groupList.html("");
                            markerData
                                    .markers
                                    .forEach(function (subMarker) {
                                            $subMarker = $(assembleGroupList(subMarker));
                                            $groupList.append($subMarker.data("marker", {
                                                    data: subMarker,
                                                    parentMarker: marker,
                                                    parentMarkerId: markerData.viweID,
                                                    groupListId: subMarker.viweID,
                                                    _leaflet_id: marker._leaflet_id
                                            }));
                                    });
                    }
                    if (c.$audio.data("status") == "playing" && c.currentPlaying && c.currentPlaying.groupListId) {
                            $groupList
                                    .children("dt")
                                    .each(function (index, item) {
                                            if (c.currentPlaying.groupListId == $(item).data("marker").groupListId) {
                                                    c.$controlBtn = $(item).children(".images");
                                                    return false;
                                            }
                                    });
                    }

                    groupListScroll.refresh();
                    c.showModal($groupNav);
            }

            $groupNav
                    .on(clickEvent, ".show-more", function () {
                            var markerData = $(event.target)
                                            .parent()
                                            .data("marker")
                                            .data,
                                    $html,
                                    $images;
                            $viweDetails.addClass("only-hide-modal");
                            if (markerData.viweType == "group") {
                                    $viweDetails.addClass("loading");
                                    $viweDetails
                                            .find(".header>h3")
                                            .html(markerData.viweName);
                                    $viweDetails.data({viweName: markerData.viweName, lat: markerData.position[0], lon: markerData.position[1]});
                                    $html = $("<div>" + markerData.detail.replace(/src\=\"http:\/\//g, 'src="https://') + "</div>");
                                    $images = $html.find("img");
                                    $viweDetailsContant.data("loaded", markerData.detailsURL);
                                    viweDetailsScroll.scrollTo(0, 0);
                                    $images.bind("load error", function () {
                                            viweDetailsScroll.refresh();
                                    });
                                    $viweDetailsContant
                                            .children(".content")
                                            .html($html.html());
                                    setTimeout(function () {
                                            viweDetailsScroll.refresh();
                                    }, 1000);
                                    $viweDetailsContant.removeClass("loading");
                                    c.showModal($viweDetails);
                            } else {
                                    markerData && getDetalis(markerData);
                            }
                    });

            $groupNav
                    .children(".footer")
                    .bind(clickEvent, c.hideModal);

            $groupNav.on(clickEvent, "dt>.images", _manualPlay);

            $progressBar.bind(clickEvent, _manualPlay);

            function _manualPlay() {
                    //zl 修改后端聚合景点 验证

                    if (!authorization()) {
                            $(".marker-group")
                                    .removeClass("show")
                                    .addClass("hide");
                            $("body").addClass("show-modal") && $(".verify-wrap")
                                    .removeClass("hide")
                                    .addClass("show");
                            return false;
                    }
                    var $this = $(this),
                            $dt = $this.parent();
                    if ($dt.hasClass("no-audio")) {
                            return false;
                    }
                    c.manualPlay = true; //操作播放按钮，则为手动优先
                    c.$controlBtn && c
                            .$controlBtn
                            .hasClass("images") && !$this.hasClass("playing") && c
                            .$controlBtn
                            .removeClass("playing");

                    c.$controlBtn = $this;
                    c.currentPopup = $dt.data("marker");
                    if (c.$controlBtn.hasClass("playPause")) {
                            c.changeCurrentPlaying(c.currentPopup, m.groupLayer);
                            c
                                    .audio
                                    .play();
                            c
                                    .$audio
                                    .data("markerId", c.currentPopup._leaflet_id);
                            return false;
                    }
                    if (c.$controlBtn.hasClass("playing") || c.$controlBtn.hasClass("loading")) {
                            //c.$controlBtn=$controlBtn;
                            c
                                    .audio
                                    .pause();
                            return false;
                    }

                    c
                            .audio
                            .pause();
                    c.audio.src = c.currentPopup.data.audioUrl && c.getAudioUrl(c.currentPopup.data.audioUrl);
                    c.changeCurrentPlaying(c.currentPopup, m.groupLayer);
                    c
                            .audio
                            .play();
                    c
                            .$audio
                            .data("markerId", c.currentPopup._leaflet_id);
                    c
                            .$audio
                            .data("guidePlaying") == "true" && (c.$audio.data("guidePlaying", "false"), c.$audio.data("guidePlayed", "true"));
                    if (c.$controlBtn && c.$controlBtn.hasClass("progress-bar")) {
                            c
                                    .$controlBtn
                                    .attr("class", "progress-bar");
                            c
                                    .$controlBtn
                                    .find(".slice")
                                    .removeClass("half");
                            c
                                    .$controlBtn
                                    .find(".slice>.than-half")
                                    .css("transform", "rotate(0deg)");
                    }
                    if (c.$controlBtn.hasClass("images")) {
                            $progressBar.attr("class", "progress-bar");
                            $progressBar
                                    .find(".slice")
                                    .removeClass("half");
                            $progressBar
                                    .find(".slice>.than-half")
                                    .css("transform", "rotate(0deg)");
                    }
            }

            //景区简介相关操作
            var $scenicIntr = $(".modal.scenic-intr"),
                    $interIcon = $(".other-btns>.help-icon-con>.intr-icon"),
                    intrMarker;
            $interIcon.bind(clickEvent, function () {
                    if (!$scenicIntr.hasClass("loaded")) {
                            $.ajax({
                                    url: "indexshowScenicAbout?sk=" + commonMethod.urlArg.sk,
                                    async: false,
                                    success: function (data) {
                                            $scenicIntr
                                                    .find("li.adress>span")
                                                    .html(data.jsonData.addressDesc);
                                            $scenicIntr
                                                    .find("li.open-time>span")
                                                    .html(data.jsonData.openTimeDesc);

                                            if (!data.jsonData.openTimeDesc.trim()) {
                                                    $scenicIntr
                                                            .find("li.open-time")
                                                            .hide();
                                            }
                                            if (!data.jsonData.addressDesc.trim()) {
                                                    $scenicIntr
                                                            .find("li.adress")
                                                            .hide();
                                            }
                                            intrMarker = {
                                                    scenicInter: true,
                                                    viweName: data.jsonData.name,
                                                    audioUrl: {}
                                            };
                                            // $scenicIntr.find(".progress-bar").css("background-image","url('"+c.audioPath+
                                            // d ata.jsonData.picName+"')");

                                            for (var i = 0, len = data.jsonData.voices.length; i < len; i++) {
                                                    if (data.jsonData.voices[i].voiceName) {
                                                            intrMarker.audioUrl["audioId" + data.jsonData.voices[i].lanId + "-" + data.jsonData.voices[i].styleId] = c.audioPath + data.jsonData.voices[i].voiceName;
                                                    }
                                            }
                                            intrMarker.viweImgUrl = c.filePath + data.jsonData.picName;
                                            $scenicIntr.data("marker", {data: intrMarker});
                                    },
                                    error: function (error) {
                                            c.message("帮助文档载入出错，请尝试刷新重试。。");
                                    }
                            });
                    }
                    $progressBar.appendTo($scenicIntr);

                    c.currentPopup = $scenicIntr.data("marker");
                    if (c.currentPlaying && c.currentPlaying.data.scenicInter && c.currentPlaying.data.viweName === c.currentPopup.data.viweName) {
                            c.$controlBtn = $progressBar;
                    } else {
                            c.$controlBtn = null;
                            $progressBar.attr("class", "progress-bar");
                            $progressBar
                                    .find(".slice")
                                    .removeClass("half");
                            $progressBar
                                    .find(".slice>.than-half")
                                    .css("transform", "rotate(0deg)");
                    }
                    map.closePopup();
                    $progressBar.css("background-image", "url('" + $scenicIntr.data("marker").data.viweImgUrl + "')");
                    $body.addClass("no-bg");
                    c.showModal($scenicIntr);
                    return false;
            });

            //显示相关操作操作结束
            function assembleGroupList(marker) {
                    var html = "";
                    html += '<dt>	<span class="images" style="background:url(\'' + marker.viweImgUrl + '\') center/cover"></span>		 				<p class="scenic-name">' + marker.viweName + '</p>	<p class="scenic-inter">' + marker.introduction + '</p>	<span class="show-more"></span></dt>';
                    return html;
            }

            //开始本地景点搜索操作
            $spotsSearch.unbind("input");
            $spotsSearch.bind("input", function () {
                    spotsSearch($(this).val(), $sceniclist);
                    sceniclistScroll.refresh();
            });

            //获得焦点提高景点列表菜单高度
            $spotsSearch.unbind("focus");
            $spotsSearch.bind("focus", function () {
                    sceniclistScroll.refresh();
            });
            //失去焦点降低景点列表菜单高度
            $spotsSearch.unbind("blur");
            $spotsSearch.bind("blur", function () {
                    sceniclistScroll.refresh();
                    $body.scrollTop(0);
                    setTimeout(function () {
                            $body.scrollTop(0);
                    }, 100);
            });

            /**
     * 本地景点搜索，通过jquery contains()选择器来实现
     * @param  {string} key [搜索关键字]
     * @param  {jquery dom} ul [要搜索的景点列表]
     */
            function spotsSearch(key, ul) {
                    var result = ul
                            .find("li:contains('" + key + "')")
                            .not(".nullResult");

                    if (key == "") {
                            $(".group.search-folded").removeClass("search-folded");
                            ul.removeClass("hasResult resultNull");
                            result
                                    .addClass("result")
                                    .removeClass("result");
                            return false;
                    }
                    if (key != "" && result.length > 0) {
                            ul
                                    .removeClass("resultNull")
                                    .addClass("hasResult");
                            ul
                                    .find("li")
                                    .removeClass("result");
                            result.addClass("result");
                    } else {
                            ul
                                    .children("li.result")
                                    .removeClass("result");
                            ul
                                    .addClass("resultNull")
                                    .removeClass("hasResult");
                            if (ul.children(".nullResult").length <= 0) {
                                    $("<li class='nullResult'>未找到含“" + key + "”的景点或目的地</li>").appendTo(ul);
                            } else {
                                    ul
                                            .children(".nullResult")
                                            .text("未找到含“" + key + "”的景点或目的地");
                            }
                    }
            }

            /****************************************景点列表相关操作结束************************************************************************/

            //给每个marker绑定popup,并监听popup状态

            menuTabs
                    .forEach(function (list) {
                            if (list.markerList) 
                                    markers = markers.concat(list.markerList);
                            }
                    );
            markers.forEach(function (marker, index) {
                    if (marker.data.viweType === "group") {
                            L
                                    .DomEvent
                                    .on(marker, "click", function (This) {
                                            map.closePopup();
                                            showGroupList(marker);
                                    });
                            return;
                    }
                    L
                            .DomEvent
                            .on(marker, "click", function () {
                                    if (!marker.getPopup()) {
                                            c.openPopup(marker);
                                    }
                            });
                    marker.on("popupclose", function () {
                            //监听popup关闭
                            $menuContent
                                    .find("#marker" + marker.data.viweID)
                                    .removeClass("liSelect");
                            c.currentPopup = "";
                            if (c.autoPlay && c.manualPlay && c.audio.paused) {
                                    //如果已经打开自动播放同时手动播放为true并且音频处于暂停状态，则取消手动优先
                                    c.manualPlay = false;
                            }
                            map.setMaxBounds(map.maxBounds);
                    });

                    marker.on("popupopen", function () {
                            //todo 监听popup打开
                            c.currentPopup = marker;
                            map.setMaxBounds();
                            //todo
                            if (currentChildGroupScenic && currentChildGroupScenic.playState != "") {
                                    //todo by zl
                                    $(".control-play").attr("class", "control-play");
                                    return;
                            }
                            if (c.$audio.data("markerId") == marker._leaflet_id && !c.currentPlaying.data.scenicInter) {
                                    c.$controlBtn = $(".control-play");
                                    if (c.$audio.data("status") == "playing") {
                                            c
                                                    .$controlBtn
                                                    .attr("class", "control-play playing");
                                    }
                                    if (c.$audio.data("status") == "paused") {
                                            c
                                                    .$controlBtn
                                                    .attr("class", "control-play playPause");
                                    }
                                    if (c.audio.readyState == 2) {
                                            c
                                                    .$controlBtn
                                                    .attr("class", "control-play Loading");
                                    }
                            } else {
                                    $(".control-play").attr("class", "control-play");
                            }
                            if (marker.data.viweType == "near") {
                                    marker.data.distance = c.currentLatlng
                                            ? marker
                                                    ._latlng
                                                    .distanceTo(c.currentLatlng)
                                            : "";
                                    c.inScenic && c.getDistance(marker.data.distance) && $(".leaflet-popup-content .distance").html("距离：" + c.getDistance(marker.data.distance));
                            }

                            $menuContent
                                    .find("ul>#marker" + marker.data.viweID)
                                    .addClass("liSelect");
                    });
            });
            //marker绑定popup结束

            /****************************************popupsh 相关操作************************************************************************/
            $("#" + map.options.container + ">.leaflet-map-pane>.leaflet-popup-pane").off("click");
            $("#" + map.options.container + ">.leaflet-map-pane>.leaflet-popup-pane").on("click", ".leaflet-popup", function (e) {
                    var $target = $(e.target),
                            markerData = c.currentPopup.data;

                    if ($target.hasClass("show-indoor") && authorization()) {
                            //跳转到室内景点

                            location.href = markerData.indoor;
                    }
                    if ($target.hasClass("show-details")) {
                            //显示详情

                            if (subScenic) {
                                    $viweDetails.addClass("only-hide-modal");
                            } else {
                                    $viweDetails.removeClass("only-hide-modal");
                            }
                            getDetalis(markerData);
                    }

                    if ($target.hasClass("control-play") || $target.parents(".control-play").length > 0) {
                            //播放音频

                            if (!authorization()) {
                                    return false;
                            }
                            var $controlBtn = $target.hasClass("control-play")
                                            ? $target
                                            : $target
                                                    .parents(".control-play")
                                                    .eq(0),
                                    audioType = null;
                            //todo control

                            currentChildGroupScenic && (currentChildGroupScenic.playState = "");

                            c.manualPlay = true; //操作播放按钮，则为手动优先
                            if ($controlBtn.hasClass("playPause")) {
                                    c.$controlBtn = $controlBtn;
                                    c.changeCurrentPlaying(c.currentPopup);
                                    c
                                            .audio
                                            .play();
                                    c
                                            .$audio
                                            .data("markerId", c.currentPopup._leaflet_id);
                                    return false;
                            }
                            if ($controlBtn.hasClass("playing") || $controlBtn.hasClass("loading")) {
                                    c.$controlBtn = $controlBtn;
                                    c
                                            .audio
                                            .pause();
                                    return false;
                            }

                            c.$controlBtn = $controlBtn;
                            c
                                    .audio
                                    .pause();
                            c.audio.src = c.getAudioUrl(markerData.audioUrl);
                            c.changeCurrentPlaying(c.currentPopup);
                            c
                                    .audio
                                    .play();
                            c
                                    .$audio
                                    .data("markerId", c.currentPopup._leaflet_id);
                            c
                                    .$audio
                                    .data("guidePlaying") == "true" && (c.$audio.data("guidePlaying", "false"), c.$audio.data("guidePlayed", "true"));
                    }
            });

            /***************************************子景点组 开始*******************************************/

            var $childGroupMarkersModal = $(".child-group-markers"),
                    $childGroupContainer = $(".child-group-container"),
                    childGrounpMarkerSourceData = c.map.childGrounpMarker,
                    scenicGrounpMarker = null,
                    tempHtml = null,
                    childGroupMarkersDataArr = {};
            currentChildGroupScenic = null

            $("#" + map.options.container + " .leaflet-pane.leaflet-map-pane ").on(clickEvent, ".leaflet-marker-icon.child-grounp", function (e) {
                    if ($(e.currentTarget).has("child-grounp")) {
                            $("body")
                                    .addClass("show-modal")
                                    .removeClass("no-bg");

                            $childGroupMarkersModal
                                    .removeClass("hide")
                                    .addClass("show");
                            $(".scenic-group li.scenic-item span.images").removeClass("playing playPause loading");

                            childGrounpMarkerSourceData.forEach(function (ele, index) {
                                    if (ele._icon._leaflet_id == e.currentTarget._leaflet_id) {
                                            scenicGrounpMarker = ele.data;
                                            scenicGrounpMarker._leaflet_id = e.currentTarget._leaflet_id;
                                            childGroupMarkersDataArr[scenicGrounpMarker.viweID] = scenicGrounpMarker;

                                            function renderChildModalList(data) {
                                                    tempHtml = template("child_group_marker", data);
                                                    $childGroupContainer.html(tempHtml);
                                            }
                                            $.ajax({
                                                    url: "/web/subScenic_loadChildScenicGroup?subScenicId=" + scenicGrounpMarker.viweID,
                                                    type: "get",
                                                    dataType: "json",
                                                    async: false,
                                                    success: function (data) {
                                                            if (data.resultCode == 1) {
                                                                    data.content && data.content.length > 0 && data
                                                                            .content
                                                                            .forEach(function (ele, index) {
                                                                                    if (ele.childScenics && ele.childScenics.length > 0) {
                                                                                            ele
                                                                                                    .childScenics
                                                                                                    .forEach(function (marker, j) {
                                                                                                            marker.childGroupId = scenicGrounpMarker.viweID;
                                                                                                            childGroupMarkersDataArr[marker.id] = marker;
                                                                                                    });
                                                                                    }
                                                                            });
                                                                    childGroupMarkersDataArr[scenicGrounpMarker.viweID].loaded = true;

                                                                    data.markerData = scenicGrounpMarker;

                                                                    renderChildModalList(data);
                                                                    var scenicGroupListScroll = c.scroll("#scenic-group-list-scroll")
                                                                    setInterval(function () {
                                                                            scenicGroupListScroll.refresh()
                                                                    }, 200)
                                                            } else {
                                                                    alert("请求错误!");
                                                            }
                                                    },
                                                    error: function (err) {
                                                            console.log(err, "err------err");
                                                    }
                                            });
                                    }
                            });

                            if (currentChildGroupScenic) {

                                    var scenicIntrPlayer;
                                    if (c.$audio.data("status") == "playend" || c.$audio.data("status") == "error") {
                                            $("#scenic-group-list-scroll .group-item .scenic-item>span.images")
                                                    .each(function (index, ele) {
                                                            if (currentChildGroupScenic.id == $(ele).data("scenicid")) {
                                                                    currentChildGroupScenic && $(ele).removeClass("playing playPause Loading");
                                                            }
                                                    });

                                            $(".child-group-container .group-intr .progress-bar").each(function (index, ele) {
                                                    if (currentChildGroupScenic.id == $(ele).data("scenicid")) {
                                                            currentChildGroupScenic && $(ele).removeClass("playing playPause Loading");
                                                            $(ele)
                                                                    .find(".than-half")
                                                                    .css({
                                                                            transform: "rotate(" + 0 + "deg)"
                                                                    });
                                                    }
                                            });

                                    } else {
                                            $("#scenic-group-list-scroll .group-item .scenic-item>span.images")
                                                    .each(function (index, ele) {
                                                            if (currentChildGroupScenic.id == $(ele).data("scenicid")) {
                                                                    currentChildGroupScenic && $(ele)
                                                                            .removeClass("playing playPause Loading")
                                                                            .addClass(currentChildGroupScenic.playState);
                                                            }
                                                            scenicIntrPlayer = $(".modal.scenic-intr").find(".progress-bar")
                                                            if (scenicIntrPlayer.hasClass("playing") || scenicIntrPlayer.hasClass("Loading") || scenicIntrPlayer.hasClass("playPause")) {
                                                                    $(ele).removeClass("Loading playing playPause")
                                                            }
                                                    });

                                            $(".child-group-container .group-intr .progress-bar").each(function (index, ele) {

                                                    if (!c.$controlBtn.hasClass("control-play") && currentChildGroupScenic.id == $(ele).data("scenicid")) {
                                                            c.$controlBtn = $(ele)

                                                            $(ele)
                                                                    .removeClass("playing playPause Loading")
                                                                    .addClass(currentChildGroupScenic.playState);
                                                            $(ele)
                                                                    .find(".than-half")
                                                                    .css({
                                                                            transform: "rotate(" + process + "deg)"
                                                                    });

                                                    }

                                                    scenicIntrPlayer = $(".modal.scenic-intr").find(".progress-bar")
                                                    if (scenicIntrPlayer.hasClass("playing") || scenicIntrPlayer.hasClass("Loading") || scenicIntrPlayer.hasClass("playPause")) {
                                                            $(ele).removeClass("Loading playing playPause")
                                                            $(ele)
                                                                    .find(".than-half")
                                                                    .css({
                                                                            transform: "rotate(" + 0 + "deg)"
                                                                    });
                                                    }
                                                    if (c.$controlBtn.hasClass("control-play")) {
                                                            $(ele).removeClass("Loading playing playPause")
                                                            $(ele)
                                                                    .find(".than-half")
                                                                    .css({
                                                                            transform: "rotate(" + 0 + "deg)"
                                                                    });
                                                    }
                                            });
                                    }
                            }

                            var $viweDetailsModal = $(".viweDetails.scenic"),
                                    $title = $viweDetailsModal.find(".header>h3"),
                                    $goToHere = $viweDetailsModal.find(".header>.go-to-here"),
                                    $scenicContant = $("#scenicContant"),
                                    $content = $("#scenicContant>.content");
                            //重新绑定模态框的打开事件
                            $("#scenic-group-list-scroll .show-more").on(clickEvent, function (e) {
                                    $scenicContant.removeClass("loading");
                                    $title.text($(this).attr("data-title"));
                                    $goToHere
                                            .attr("data-lat", $(this).attr("data-lat"))
                                            .attr("data-lon", $(this).attr("data-lon"))
                                            .attr("data-title", $(this).attr("data-title"));
                                    $content.html($(this).attr("data-desc"));
                                    viweDetailsScroll.scrollTo(0, 0);
                                    setTimeout(function () {
                                            viweDetailsScroll.refresh();
                                    }, 1000);
                                    $viweDetailsModal
                                            .addClass("show")
                                            .removeClass("hide");
                                    $("body")
                                            .addClass("show-modal")
                                            .removeClass("no-bg");
                            });
                            //重新绑定模态框的关闭事件
                            $(".viweDetails.scenic .close-btn").off(clickEvent);
                            $(".viweDetails.scenic .close-btn").on(clickEvent, function (params) {
                                    $viweDetailsModal
                                            .addClass("hide")
                                            .removeClass("show");
                                    if (!$childGroupMarkersModal.hasClass("show")) {
                                            $("body").removeClass("show-modal");
                                    }
                            });
                            //重新绑定高德导航
                            $viweDetailsModal.off(clickEvent, ".bindgo-to-here");
                            $viweDetailsModal.on(clickEvent, ".bindgo-to-here", function () {
                                    //详情页面去这儿功能绑定事件
                                    if (c.currentLatlng) {
                                            //当前已经获取到位置，直接调用去这儿方法
                                            c.goToHere($(this).attr("data-lon"), $(this).attr("data-lat"), $(this).attr("data-title"))(c.currentLatlng.lng, c.currentLatlng.lat);
                                    } else {
                                            //否则
                                            c.message("路线规划中，请稍等..。"); //提示规划中
                                            c
                                                    .map
                                                    .startLocate(); //开始定位
                                            c.goToHereFun = c.goToHere($(this).attr("data-lon"), $(this).attr("data-lat"), $(this).attr("data-title")); //将去这儿方法保存起来，定位成功后执行
                                    }
                            });
                            //综述详情点击事件
                            $(".child-group-container .group-intr>.show-more").on(clickEvent, function () {

                                    getDetalis(scenicGrounpMarker);
                            });
                            $(".child-group-container .group-intr>.progress-bar").on(clickEvent, function () {
                                    //todo

                                    if (!authorization()) {
                                            $(".child-group-markers")
                                                    .removeClass("show")
                                                    .addClass("hide");
                                            $("body").addClass("show-modal") && $(".verify-wrap")
                                                    .removeClass("hide")
                                                    .addClass("show");
                                            return false;
                                    }
                                    commonMethod.changeCurrentPlaying(null);
                                    c.manualPlay = true; //操作播放按钮，则为手动优先
                                    // console.log( 	childGrounpMarkerSourceData, 	"childGrounpMarkerSourceData" );

                                    currentChildGroupScenic = childGroupMarkersDataArr[$(this).attr("data-scenicId")];
                                    currentChildGroupScenic.id = childGroupMarkersDataArr[$(this).attr("data-scenicId")].viweID;
                                    // console.log(currentChildGroupScenic, "currentChildGroupScenic");
                                    var classOfthis = $(this).attr("class");
                                    $(".playing").removeClass("playing");
                                    $(".playPause").removeClass("playPause");
                                    $(".Loading").removeClass("Loading");
                                    $(this).attr("class", classOfthis);
                                    c.$controlBtn = $(this);
                                    $currentPlayingChildGroupDom = $(".leaflet-marker-icon.my-div-icon.marker" + $(this).attr("data-scenicId"));

                                    if ($(this).hasClass("playing") || $(this).hasClass("Loading")) {
                                            $(this).removeClass("playing playPause Loading ");
                                            currentChildGroupScenic.playState = "playPause";
                                            $currentPlayingChildGroupDom.addClass("playPause");
                                            c
                                                    .audio
                                                    .pause();
                                    } else if ($(this).hasClass("playPause")) {
                                            $(this).removeClass("playing playPause Loading ");
                                            currentChildGroupScenic.playState = "playing";
                                            c
                                                    .audio
                                                    .play();
                                            $currentPlayingChildGroupDom.addClass("playing");
                                    } else {
                                            c
                                                    .audio
                                                    .pause();
                                            currentChildGroupScenic.playState = "playing";
                                            c.audio.src = c.getAudioUrl(currentChildGroupScenic.audioUrl);
                                            c
                                                    .audio
                                                    .play();
                                            $currentPlayingChildGroupDom.addClass("playing");
                                    }

                            });

                            //底部收缩
                            $(".child-group-container .footer-container").on(clickEvent, function () {
                                    $childGroupMarkersModal
                                            .removeClass("show")
                                            .addClass("hide");
                                    $("body").removeClass("show-modal");
                            });

                            //子景点组列表 播放事件
                            $(".scenic-group .scenic-item .images").on(clickEvent, function () {
                                    //todo
                                    if (!authorization()) {
                                            $(".child-group-markers")
                                                    .removeClass("show")
                                                    .addClass("hide");
                                            $("body").addClass("show-modal") && $(".verify-wrap")
                                                    .removeClass("hide")
                                                    .addClass("show");
                                            return false;
                                    }
                                    commonMethod.changeCurrentPlaying(null);
                                    c.manualPlay = true; //操作播放按钮，则为手动优先
                                    c.$controlBtn = $(this);
                                    currentChildGroupScenic = childGroupMarkersDataArr[$(this).attr("data-scenicId")];
                                    var classOfthis = $(this).attr("class");
                                    $(".playing").removeClass("playing");
                                    $(".playPause").removeClass("playPause");
                                    $(this).attr("class", classOfthis);
                                    $currentPlayingChildGroupDom = $(".leaflet-marker-icon.my-div-icon.marker" + currentChildGroupScenic["childGroupId"]);
                                    $(".than-half").css({transform: "rotate(0deg)"});

                                    if ($(this).hasClass("playing") || $(this).hasClass("Loading")) {
                                            currentChildGroupScenic.playState = "playPause";
                                            $currentPlayingChildGroupDom.addClass("playPause");
                                            c
                                                    .audio
                                                    .pause();
                                    } else if ($(this).hasClass("playPause")) {
                                            currentChildGroupScenic.playState = "playing";
                                            c
                                                    .audio
                                                    .play();
                                            $currentPlayingChildGroupDom.addClass("playing");
                                    } else {
                                            c
                                                    .audio
                                                    .pause();
                                            c.changeCurrentPlaying($currentPlayingChildGroupDom);

                                            $(".scenic-group li.scenic-item span.images").removeClass("playing playPause Loading");
                                            currentChildGroupScenic.playState = "playing";
                                            currentChildGroupScenic.audioUrl = {};
                                            currentChildGroupScenic
                                                    .voices
                                                    .forEach(function (ele, index) {
                                                            currentChildGroupScenic.audioUrl["audioId" + ele.lanId + "-" + ele.styleId] = ele.voiceName;
                                                    });

                                            c.audio.src = c.audioPath + c.getAudioUrl(currentChildGroupScenic.audioUrl);
                                            c
                                                    .audio
                                                    .play();
                                            $currentPlayingChildGroupDom.addClass("playing");
                                    }

                                    // _manualPlay();
                            });
                    }
            });

            /***************************************子景点组 结束*******************************************/

            $viweDetails.off(clickEvent, ".bindgo-to-here");
            $viweDetails.on(clickEvent, ".bindgo-to-here", function () {
                    //详情页面去这儿功能绑定事件
                    var data = $viweDetails.data();
                    if (c.currentLatlng) {
                            //当前已经获取到位置，直接调用去这儿方法

                            c.goToHere(data.lon, data.lat, data.viweName)(c.currentLatlng.lng, c.currentLatlng.lat);
                    } else {
                            //否则
                            c.message("路线规划中，请稍等..。"); //提示规划中
                            c
                                    .map
                                    .startLocate(); //开始定位
                            c.goToHereFun = c.goToHere(data.lon, data.lat, data.viweName); //将去这儿方法保存起来，定位成功后执行
                    }
            });
            /****************************************popup 相关操作结束************************************************************************/

            /****************************************景点路线相关操作开始************************************************************************/
            $roadsList
                    .find("li")
                    .remove();
            $roadsList.off(clickEvent);
            $roadsList.on(clickEvent, "li", function (e) {
                    if (!authorization()) {
                            c.hideModal(e, true);
                            return false;
                    }
                    var $this = $(this);
                    if ($this.hasClass("liSelect")) {
                            c.showLine && m.hideLine();
                            $this.removeClass("liSelect");
                    } else {
                            m.showLine($(this).data("name"));
                            $this
                                    .siblings(".liSelect")
                                    .removeClass("liSelect");
                            $this.addClass("liSelect");
                    }
            });
            var roadIndex = 1;
            for (var lineName in m.lineData) {
                    $li = $("<li>" + lineName + "</li>").data("name", lineName);
                    $roadsList.append($li);
            }

            /****************************************景点路线相关操作结束************************************************************************/

            //定位按钮绑定事件
            m.locateBtn = $mapLocateBtn;
            $mapLocateBtn.unbind(clickEvent); //先解绑，下线景区定位按钮存在复用

            var isFirstLocat = true; //保存是否是第一次定位

            $mapLocateBtn.bind(clickEvent, function () {
                    if (!$mapLocateBtn.hasClass("panto")) {
                            //当前不处于定位中，则开始定位
                            $mapLocateBtn.addClass("panto");
                            m.startLocate();
                            isFirstLocat && c.inScenic && c.message("定位受环境及设备因素影响，仅供参考"); //如果是第一次定位到在景区则出现此toast
                    }
                    isFirstLocat = false; //定位后则不是第一次定位

                    return false;
            });

            if (c.isPC) {
                    $(".zoom-control")
                            .on("click", ".add", function () {
                                    m
                                            .map
                                            .zoomIn();
                            });
                    $(".zoom-control").on("click", ".minu", function () {
                            m
                                    .map
                                    .zoomOut();
                    });
            }
    };
    /*************************************************与地图相关的DOM操作事件绑定结束*************************************************************/
    //返回一些数据，包含常用DOM元素、DOM操作
    return {
            showAd: function () {
                    c.activated && $advertisement.addClass("active");
                    !c.needVerify && $advertisement.addClass("active free");
                    c.showModal($advertisement);
            },
            verify: verifyCookie,
            domOperateForMap: domOperateForMap
    };
};

//设置下载条的URL
function setDownloadUrl() {
    //设置广告条下载链接
    var c = commonMethod,
            appPopularize = $("div.app-popularize"),
            link = appPopularize.children("a"),
            img = link.children("img"),
            scenicName = link.children("p.scenic-name"),
            urlObj;

    if (c.isiOS && c.singleIosAppLink) {
            //是ios设备，且有配置ios单机版的下载链接
            link.attr("href", c.singleIosAppLink);
            img.attr("src", c.singleLogo);
    }
    if (c.isAndroid && c.singleAndroidAppLink) {
            //是Android设备，且有配置Android单机版的下载链接
            link.attr("href", c.singleAndroidAppLink);
            img.attr("src", c.singleLogo);
    }

    if (c.urlArg && c.urlArg.urlObj) {
            //从景区组进入景区
            try {
                    urlObj = eval("(" + c.urlArg.urlObj + ")");
            } catch (e) {
                    console.log(e);
            }
            if (urlObj) {
                    //通过url传入参数且参数合法
                    if (c.isiOS && urlObj.singleIosAppLink) {
                            //是ios设备，且有配置ios分组包的下载链接
                            link.attr("href", urlObj.singleIosAppLink);
                            img.attr("src", c.path + "/cm/fileOpviewFile?fileName=" + urlObj.imgUrl);
                            scenicName.html(urlObj.scenicGroupName);
                    }
                    if (c.isAndroid && urlObj.singleAndroidAppLink) {
                            //是isAndroid设备，且有配置isAndroid分组包的下载链接
                            link.attr("href", urlObj.singleAndroidAppLink);
                            img.attr("src", c.path + "/cm/fileOpviewFile?fileName=" + urlObj.imgUrl);
                            scenicName.html(urlObj.scenicGroupName);
                    }
            }
    }
    img.removeClass("hide-ele");
    scenicName.removeClass("hide-ele");
    //设置广告条下载链接结束
}