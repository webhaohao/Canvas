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

$(function(){
    var c = commonMethod;
    var menuListScroll = c.scroll("#menuListScroll", {
        scrollbars: false,
        scrollY: false,
        scrollX: true
    });
    var $menuList=$(".menu-list-nav");
    $menuList
    .find("ul")
    .width(3 * $menuList.find("ul>li:eq(0)").width());

    c.mapData={
        rightTop:[39.9461355534,116.3433300411],
        leftBottom:[39.9380432729,116.3267646006],
        zoom:7,
        zoomRange:[17.5,19.0],
        hideTitZoom:6,
        groupMarkers:[],
        markers:[],
        serviceMarkers:[],
        imageLayer:[],
        tileSrc:[],
        childGrounpMarker:[],
        nearServices:[]

        }
        //Marker
        var temporaryMarkerObj,nearSubMarker;
        
            temporaryMarkerObj={
            serviceTypDefaultPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574934396-x7onbuyf.png',
            serviceTypShowPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574934372-x22e1u4m.png',
            serviceTypeName:'厕所',

            };
            temporaryMarkerObj.markers=[];
            
                nearSubMarker={
                viweID: '35314',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965181-eg5cq4sr.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.943639,116.3295];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35315',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.945451,116.335127];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35316',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965788-ksd5evmz.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.94377,116.342302];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35317',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.94123,116.342223];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35318',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.943314,116.33474];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35319',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716966152-zcxadm52.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.939632,116.337942];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35320',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716966549-4ttrdv3r.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.944522,116.331882];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35321',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967395-142kzy9s.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.938111,116.330181];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35322',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.945908,116.331286];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35323',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967931-r101vguv.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.944621,116.337649];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35324',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716968313-1rkymuss.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.942418,116.338996];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35325',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.939023,116.330039];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35327',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.941345,116.332009];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35328',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.93924,116.341174];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35329',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.940722,116.335584];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35330',
                viweName: '公共厕所',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.9402,116.33381];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35326',
                viweName: '五塔寺楼厕',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716968762-khtrh3wf.jpg'||'mimi-001_1515574934351-gxyo8wsy.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574934323-yx2iudw6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574934299-awas4ekx.png'
                }
                
                    nearSubMarker.position = [39.944603,116.33188];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
            c.mapData.nearServices.push(temporaryMarkerObj);
        
            temporaryMarkerObj={
            serviceTypDefaultPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574894512-61qhh86p.png',
            serviceTypShowPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574894485-n4hqjpk0.png',
            serviceTypeName:'出入口',

            };
            temporaryMarkerObj.markers=[];
            
                nearSubMarker={
                viweID: '437',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498789340073-mmmdlkhh.jpg'||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.939172,116.339191];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35277',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.939009,116.330863];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35278',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965809-b25gtdux.jpg'||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938146,116.328613];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35279',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716966140-qiuwempl.jpg'||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.939526,116.339989];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35280',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938662,116.338673];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35281',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.943515,116.330274];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35283',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938588,116.33401];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35284',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.941085,116.328229];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35285',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967080-0ft2v6ty.jpg'||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.943335,116.3297];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35286',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.93869,116.330441];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35287',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967819-nsma7iyu.jpg'||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938595,116.338898];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35288',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938772,116.328993];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35289',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938876,116.342691];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35290',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.939526,116.339989];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35291',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.942734,116.327741];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35293',
                viweName: '出口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716968411-t135kj6d.jpg'||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.939844,116.33025];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35282',
                viweName: '进出口集团有限公司',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.939364,116.329717];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35274',
                viweName: '西直门外大街西向',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938542,116.330521];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35275',
                viweName: '西直门外大街东向',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965341-pf5ybjzs.jpg'||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938149,116.332437];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35276',
                viweName: '西直门外大街东向',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.938049,116.336907];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35292',
                viweName: '西向',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574894447-jcptm9r5.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574894411-mlchw8hx.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574894388-pchsjcny.png'
                }
                
                    nearSubMarker.position = [39.93827,116.335404];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
            c.mapData.nearServices.push(temporaryMarkerObj);
        
            temporaryMarkerObj={
            serviceTypDefaultPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574875577-04907elq.png',
            serviceTypShowPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574875555-fllipr6h.png',
            serviceTypeName:'公交站',

            };
            temporaryMarkerObj.markers=[];
            
                nearSubMarker={
                viweID: '35166',
                viweName: '公交站',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574875532-55dhasvh.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574875509-uts8joht.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574875483-rxgre4c1.png'
                }
                
                    nearSubMarker.position = [39.938641,116.329941];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
            c.mapData.nearServices.push(temporaryMarkerObj);
        
            temporaryMarkerObj={
            serviceTypDefaultPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574839858-xjfv0ug6.png',
            serviceTypShowPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574839838-fgrpvqgh.png',
            serviceTypeName:'住宿',

            };
            temporaryMarkerObj.markers=[];
            
                nearSubMarker={
                viweID: '35188',
                viweName: '首体宾馆',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965244-qrbcpvbh.jpg'||'mimi-001_1515574839815-sx93fx95.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574839794-zsr0ozg2.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574839765-hszw4ctn.png'
                }
                
                    nearSubMarker.position = [39.941211,116.32794];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35189',
                viweName: '永裕智辰商务酒店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965462-l3zm02sm.jpg'||'mimi-001_1515574839815-sx93fx95.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574839794-zsr0ozg2.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574839765-hszw4ctn.png'
                }
                
                    nearSubMarker.position = [39.941149,116.327729];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
            c.mapData.nearServices.push(temporaryMarkerObj);
        
            temporaryMarkerObj={
            serviceTypDefaultPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515569529365-cdz4hiny.png',
            serviceTypShowPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515569529344-vt6r1tcs.png',
            serviceTypeName:'停车场',

            };
            temporaryMarkerObj.markers=[];
            
                nearSubMarker={
                viweID: '35366',
                viweName: '北京动物园停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938828,116.330559];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35356',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.939009,116.330863];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35357',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.943515,116.330274];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35370',
                viweName: '出入口',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938588,116.33401];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35359',
                viweName: '方圆大厦停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938904,116.32975];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35364',
                viweName: '方圆大厦停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716969012-o38qogun.jpg'||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.939459,116.329649];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35369',
                viweName: '方圆大厦北',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.939842,116.330027];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35352',
                viweName: '金地华著南',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.945356,116.333417];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35361',
                viweName: '凯旋大厦停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716968078-2xmxfomk.jpg'||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.939527,116.333199];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35362',
                viweName: '凯旋大厦停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716968472-gsed0pft.jpg'||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938861,116.33415];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35363',
                viweName: '凯旋大厦停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938667,116.333412];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35367',
                viweName: '首体宾馆停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.941142,116.327913];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35351',
                viweName: '天勤商务楼南',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965275-vcpfdmu7.jpg'||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.944186,116.327743];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35360',
                viweName: '腾达大厦停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938105,116.327183];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35365',
                viweName: '停车场',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.943456,116.329675];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35353',
                viweName: '五塔寺路',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.943895,116.331365];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35354',
                viweName: '五塔寺路',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.942883,116.327434];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35355',
                viweName: '西直门外大街辅路',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.939339,116.33094];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35358',
                viweName: '西直门外大街辅路',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967529-tn11cqqf.jpg'||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938196,116.329015];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35368',
                viweName: '西直门外大街辅路',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716969683-anp5nl3o.jpg'||'mimi-001_1515569529321-jgg96zsl.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515569529289-ytiuuba6.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515569529271-77z75fww.png'
                }
                
                    nearSubMarker.position = [39.938179,116.327955];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
            c.mapData.nearServices.push(temporaryMarkerObj);
        
            temporaryMarkerObj={
            serviceTypDefaultPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574816129-mm7ew4gr.png',
            serviceTypShowPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574816104-lntzsp6o.png',
            serviceTypeName:'游客中心',

            };
            temporaryMarkerObj.markers=[];
            
                nearSubMarker={
                viweID: '35187',
                viweName: '西直门外大街辅路西',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965249-ighoaugh.jpg'||'mimi-001_1515574816080-p7r2xnii.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574816052-3l4xl7m4.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574816019-rzhqt0n9.png'
                }
                
                    nearSubMarker.position = [39.938675,116.339188];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
            c.mapData.nearServices.push(temporaryMarkerObj);
        
            temporaryMarkerObj={
            serviceTypDefaultPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574796217-b1yrtagd.png',
            serviceTypShowPicName: '/cm/fileOpviewFile?fileName=mimi-001_1515574796191-rals1mup.png',
            serviceTypeName:'美食',

            };
            temporaryMarkerObj.markers=[];
            
                nearSubMarker={
                viweID: '35371',
                viweName: '白石桥店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965348-pefuixtr.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.939045,116.330231];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35372',
                viweName: '白石桥店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716965803-glsywk0j.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938667,116.331407];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35375',
                viweName: '白石桥店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716966777-qjjulv1f.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.939106,116.329615];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35381',
                viweName: '北京黎晖餐饮管理有限公司',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.939523,116.329466];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35382',
                viweName: '北京抚河水乡餐饮管理有限公司',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938686,116.331567];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35388',
                viweName: '白石桥店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716970312-kr6ufzoc.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938677,116.331297];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35374',
                viweName: '东方宫京城第一羯',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716966549-cefifykk.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.93878,116.334299];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35379',
                viweName: '动物园店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716968372-jugjsx4s.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938471,116.334427];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35380',
                viweName: '动物园店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716968702-5asgued0.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938606,116.334272];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35385',
                viweName: '动物园店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716969305-a2qr5iqk.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.939099,116.334276];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35387',
                viweName: '动物园店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716970044-wkjkj8ra.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938661,116.331575];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35390',
                viweName: '动物园直营店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716970613-k1sias17.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938628,116.334278];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35378',
                viweName: '京粹轩',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967983-gvbbslmi.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938965,116.33426];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35384',
                viweName: '京城第一蝎',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716969157-ggedzdz3.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938548,116.334548];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35376',
                viweName: '老韩家郑州羊肉烩面',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967119-exh7gr8h.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.93874,116.331643];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35377',
                viweName: '腾达大厦店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716967498-nov5xfss.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938159,116.326917];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35373',
                viweName: '西直门外大街店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716966105-s8lnx2tu.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938788,116.341715];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35386',
                viweName: '西直门外大街店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716969905-qmab0m74.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938663,116.331466];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35389',
                viweName: '营养酸菜餐厅',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+(''||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938741,116.331644];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
                nearSubMarker={
                viweID: '35383',
                viweName: '中关村南大街店',
                viweType:'near',
                viweImgUrl: '/cm/fileOpviewFile?fileName='+('mimi-001_1498716969022-rwtyab3d.jpg'||'mimi-001_1515574796170-i5zmsyhq.png'),
                serviceTypPicName:'/cm/fileOpviewFile?fileName=mimi-001_1515574796143-9akaw99h.png',
                icon:'/cm/fileOpviewFile?fileName=mimi-001_1515574795764-vr7i4i05.png'
                }
                
                    nearSubMarker.position = [39.938668,116.331397];
                    temporaryMarkerObj.markers.push(nearSubMarker);
                
            
            c.mapData.nearServices.push(temporaryMarkerObj);
        

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5022',
                viweName: '澳洲动物展区',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435180899-z86haso1.jpg',
                introduction: '亲爱的，澳洲动物区位于豳风堂以北，长河南岸，展示的是大洋洲的动物。......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5022'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528436347-j13j1beu';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.942619,116.337193],
                    [39.942611,116.337697],
                    [39.942331,116.337697],
                    [39.942307,116.337193]
                    ];
                
                
                    temporaryMarkerObj.position = [39.94243,116.337461];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5029',
                viweName: '北京海洋馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435181907-algxwamd.jpg',
                introduction: '亲爱的，北京海洋馆位于北京动物园内长河北岸，占地12万平方米，建筑......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5029'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528153444-nsp3olxj';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.944585,116.33994],
                    [39.944577,116.341217],
                    [39.943804,116.341217],
                    [39.943804,116.339973]
                    ];
                
                
                    temporaryMarkerObj.position = [39.944199,116.340584];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5027',
                viweName: '大门',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435181629-u0gbt2p0.jpg',
                introduction: '亲爱的，我们就要进入动物园了哦，是不是想想都觉得很兴奋呢？北京动物......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5027'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1459547279838-jqggunrw';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.939041,116.339393],
                    [39.939058,116.339758],
                    [39.938827,116.339747],
                    [39.938844,116.339393]
                    ];
                
                
                    temporaryMarkerObj.position = [39.938909,116.339597];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5025',
                viweName: '大熊猫馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435181312-z478vjo8.jpg',
                introduction: '亲爱的，现在，我们来到的是北京动物园熊猫馆，没错，是可爱的熊猫哟！......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5025'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528311747-4viiv809';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.94016,116.339178],
                    [39.94016,116.3398],
                    [39.9396,116.3398],
                    [39.939633,116.339189]
                    ];
                
                
                    temporaryMarkerObj.position = [39.939888,116.339457];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5030',
                viweName: '儿童动物园',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435182123-ypfvnwrh.png',
                introduction: '亲爱的宝贝，接下来咱们要去的这个儿童动物园可是深受小朋友们欢迎的哦......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5030'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528131996-yjlthlnx';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.93951,116.332386],
                    [39.93951,116.333647],
                    [39.938856,116.333631],
                    [39.938852,116.332376]
                    ];
                
                
                    temporaryMarkerObj.position = [39.939123,116.332987];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5014',
                viweName: '非洲动物区',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435179452-t3ta8406.jpg',
                introduction: '亲爱的，非洲动物区位于科普馆北，原址为绿化树林。于2000年代开放......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5014'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528717265-om99415w';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.943113,116.334791],
                    [39.943113,116.335617],
                    [39.942619,116.335617],
                    [39.942628,116.334769]
                    ];
                
                
                    temporaryMarkerObj.position = [39.942825,116.33523];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5028',
                viweName: '猴山',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435181756-3uiiw3se.jpg',
                introduction: '亲爱的宝贝，说到猴山，可谓是无人不知无人不晓。作为北京动物园的地标......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5028'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528238765-uq5jo4vk';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.93951,116.341292],
                    [39.939502,116.341668],
                    [39.939206,116.341657],
                    [39.939214,116.341303]
                    ];
                
                
                    temporaryMarkerObj.position = [39.939354,116.341475];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5021',
                viweName: '荟芳轩',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435180734-23htxqah.jpg',
                introduction: '嘿，亲爱的，现在咱们来到了荟芳轩，她始建于1908年，是一座中式的......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5021'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528457426-nyif9esb';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.940793,116.338519],
                    [39.940797,116.339066],
                    [39.940493,116.339066],
                    [39.940493,116.338519]
                    ];
                
                
                    temporaryMarkerObj.position = [39.940637,116.338819];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5020',
                viweName: '火烈鸟馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435180590-hty89gw4.jpg',
                introduction: '亲爱的，现在我们来到了鸟苑的南边，展现我们面前的就是火烈鸟馆了！火......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5020'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528526941-a0vigqfu';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.940749,116.335599],
                    [39.940733,116.336114],
                    [39.94042,116.336104],
                    [39.940404,116.33561]
                    ];
                
                
                    temporaryMarkerObj.position = [39.94056,116.335889];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5016',
                viweName: '科普馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435179809-s7lihv3m.jpg',
                introduction: '亲爱的，接下来咱们一起去科普馆看看吧，这里是一个很有教育意义的地方......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5016'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528657120-cidhifm5';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.942582,116.334876],
                    [39.942582,116.336073],
                    [39.942023,116.336073],
                    [39.942023,116.334876]
                    ];
                
                
                    temporaryMarkerObj.position = [39.942294,116.33552];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5011',
                viweName: '两栖爬行动物馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435178968-dq3po51n.jpg',
                introduction: '亲爱的，现在我们来到了动物园西南部，看到紧邻鬯（chàng）春堂的......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5011'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528789369-ahkerqa2';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.940226,116.333089],
                    [39.940209,116.333808],
                    [39.939855,116.333798],
                    [39.939847,116.333089]
                    ];
                
                
                    temporaryMarkerObj.position = [39.940012,116.333454];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5018',
                viweName: '貘馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435180277-5u39nh65.png',
                introduction: '亲爱的，现在我们在水禽湖的北方，展示在我们面前的就是貘馆了，貘在动......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5018'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528608039-qn71co0d';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.941657,116.336483],
                    [39.941653,116.33695],
                    [39.941291,116.336944],
                    [39.941283,116.336494]
                    ];
                
                
                    temporaryMarkerObj.position = [39.941451,116.336724];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5017',
                viweName: '鸟苑',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435180063-o008cc7j.png',
                introduction: '亲爱的，鸟苑建筑风格非常特别，就像一只展翅飞翔的大鸟。在鸟苑生态馆......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5017'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528629074-hwdswevk';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.941501,116.335434],
                    [39.941501,116.33581],
                    [39.941114,116.335799],
                    [39.941114,116.335413]
                    ];
                
                
                    temporaryMarkerObj.position = [39.941311,116.335563];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5010',
                viweName: '企鹅馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435178826-15wmiqz6.jpg',
                introduction: '亲爱的，现在我们处在动物园的西南端，可以看到企鹅馆哦！不过在这里还......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5010'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528829220-r0v7ekvj';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.940759,116.331663],
                    [39.940738,116.332237],
                    [39.940294,116.332232],
                    [39.94029,116.331663]
                    ];
                
                
                    temporaryMarkerObj.position = [39.940537,116.331942];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '6351',
                viweName: '热带小型猴馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435330613-dbi7g2ol.jpg',
                introduction: '宝贝，现在我们来到的是热带小型猴馆，它的总建筑面积是344平方米，......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=6351'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1422697873328-1zapa658';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.941324,116.333144],
                    [39.941332,116.333723],
                    [39.941061,116.333691],
                    [39.941061,116.333144]
                    ];
                
                
                    temporaryMarkerObj.position = [39.941176,116.333423];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5023',
                viweName: '狮虎山',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435181022-pqacjj93.jpg',
                introduction: '亲爱的，狮虎山建于1956年，处在公园的东部，建筑最高点有14.2......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5023'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528391179-rufd8ym4';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.942192,116.33979],
                    [39.9422,116.340316],
                    [39.941657,116.340337],
                    [39.941657,116.339812]
                    ];
                
                
                    temporaryMarkerObj.position = [39.941871,116.34008];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5019',
                viweName: '水禽湖',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435180476-q6ifjyjj.jpg',
                introduction: '亲爱的宝贝，在您面前的这片辽阔水域就是北京城里少有的，而且是非常适......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5019'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528561458-8di9rwbl';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.940324,116.337054],
                    [39.940316,116.337999],
                    [39.939806,116.337999],
                    [39.939798,116.337108]
                    ];
                
                
                    temporaryMarkerObj.position = [39.940078,116.337484];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5024',
                viweName: '象馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435181186-z8mjtmtw.jpg',
                introduction: '亲爱的，现在我们来到的可是北京动物园大象馆哦！一提到大象我们马上就......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5024'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528360140-802d5l38';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.943944,116.338481],
                    [39.943935,116.339265],
                    [39.943491,116.339243],
                    [39.943491,116.338513]
                    ];
                
                
                    temporaryMarkerObj.position = [39.943689,116.33891];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5015',
                viweName: '犀牛河马馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435179627-jddbmdzm.jpg',
                introduction: '亲爱的，北京动物园犀牛馆、河马馆都是五十年代的建筑，馆舍小，封闭较......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5015'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528682378-q66vzbnp';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.944421,116.336529],
                    [39.944421,116.337709],
                    [39.943796,116.33773],
                    [39.943787,116.336518]
                    ];
                
                
                    temporaryMarkerObj.position = [39.944084,116.337162];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5012',
                viweName: '猩猩馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435179095-hnjn9dew.jpg',
                introduction: '亲爱的，不知道你有没有看过电影《金刚》呢，里面的猩猩金刚可真是聪明......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5012'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528755281-xcmsl42a';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.942019,116.332752],
                    [39.942002,116.333374],
                    [39.941599,116.333364],
                    [39.941599,116.332752]
                    ];
                
                
                    temporaryMarkerObj.position = [39.94178,116.333063];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5026',
                viweName: '雉鸡苑',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435181444-gqjwzl74.jpg',
                introduction: '亲爱的，我们来到展出大鸨、白鹇、白冠长尾雉、红腹锦鸡、白腹锦鸡等的......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5026'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528283309-hpnry5iy';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.939958,116.340777],
                    [39.939942,116.341233],
                    [39.939617,116.341244],
                    [39.939617,116.340761]
                    ];
                
                
                    temporaryMarkerObj.position = [39.939765,116.341035];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            


            

        

            
                // 一般景点marker
                temporaryMarkerObj={
                viweID: '5013',
                viweName: '长颈鹿馆',
                viweType:'scenic',
                viweImgUrl: '/cm/fileOpviewFile?fileName=mimi-001_1459435179245-o73bm7qi.jpg',
                introduction: '亲爱的，我们现在处在科普馆的西边，这里是长颈鹿馆，可以看到高高的长......',
                detailsURL: '/web/subScenicshowSubScenicDetail?id=5013'
                };
                
                    
                        // !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={});
                       !temporaryMarkerObj.audioUrl&&(temporaryMarkerObj.audioUrl={})
                        temporaryMarkerObj.audioUrl['audioId1-2']=
                        c.audioPath+'mimi-001_1420528737479-ccz30pvc';
                    
                

                

                
                    temporaryMarkerObj.area=[
                    [39.9428,116.333589],
                    [39.942792,116.334415],
                    [39.94243,116.334426],
                    [39.942405,116.333589]
                    ];
                
                
                    temporaryMarkerObj.position = [39.942611,116.333954];
                    c.mapData.markers.push(temporaryMarkerObj);
                
            
                    var subMarker;
                    
            
            
                    var lineTrack = {};
            
                    
                        lineTrack['全景游']=[];
            
                        
                            lineTrack['全景游'].push({'position': '116.33956,39.938805', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33996,39.93928', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.34002,39.939644', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.339874,39.939846', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33961,39.940315', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.34034,39.940216', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.34088,39.940334', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.34113,39.940662', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.34159,39.94081', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.341934,39.941418', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.34198,39.94196', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.34138,39.94196', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.34074,39.94215', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.34037,39.9423', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.3401,39.942455', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33965,39.942184', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33956,39.941658', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33933,39.941383', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33911,39.942234', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.339745,39.94257', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33966,39.94313', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.339,39.943153', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.338066,39.94298', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33685,39.94321', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33628,39.943287', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33628,39.94274', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33624,39.942513', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33561,39.942562', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33508,39.94257', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33448,39.94262', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33405,39.94262', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33345,39.942783', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.33268,39.94313', 'mark': '1'});
                        
                            lineTrack['全景游'].push({'position': '116.332344,39.943336', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33199,39.943253', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33166,39.94309', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.3314,39.942905', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.33129,39.94271', 'mark': '2'});
                        
                            lineTrack['全景游'].push({'position': '116.331314,39.94248', 'mark': '2'});
            



        c.mapData.bounds= L.bounds([c.mapData.rightTop,c.mapData.leftBottom]);
        c.mapData.center=[c.mapData.bounds.getCenter().x,c.mapData.bounds.getCenter().y];
        // c.mapData.imageLayer.push({'imageUrl':'images/zooMap.jpg','imageBounds':[
        //     [39.9380432729,116.3267646006],
        //     [39.9461355534,116.3433300411]
        // ]
        // });
        c.mapData.imageLayer.push({'imageUrl':'https://map.365daoyou.cn/cm/fileOpviewFile?fileName=mimi-001_1498790260055-h4pnzjof.jpg','imageBounds':[
            [39.9380432729,116.3267646006],
            [39.9461355534,116.3433300411]
            ]
        });
    function intiMap(){ //
        
                c.map=new LaeflatMapModule({ //新建一个地图对象
                container:"map",
                scenicName:c.scenicName,
                center:c.mapData.center,
                zoom:c.mapData.zoom,
                zoomControl:false,
                minZoom:c.mapData.zoomRange[0]||7,
        
                maxZoom:c.mapData.zoomRange[1]||19,
                zoomAnimationThreshold:1,
                maxBounds:[c.mapData.rightTop,c.mapData.leftBottom]
                });
        
                // function addImageLayers(){}
        
                
                    
                    
                function addImageLayers(){
                        for(var i=0,len=c.mapData.imageLayer.length;i<len;i++){ //添加图层


                        c.map.addImageLayer(c.mapData.imageLayer[i],c.mapData.imageLayer[i].subMap);


                        }
                }
                    
                
        
        
                c.map.autoZoomRange();//自动设置地图大小
        
        
                
                c.map.markerList=c.map.addMarkers(c.mapData.markers); //添加marker点
                c.map.groupLayer=c.map.addMarkerCluster(c.map.markerList,{"scenic":true});
                c.map.groupMarkerList=c.map.addMarkers(c.mapData.groupMarkers,{className:'group'});
                c.map.childGrounpMarker=c.map.addMarkers(c.mapData.childGrounpMarker,{className:' child-grounp'});
                c.map.allMarkersLyer=L.layerGroup().addLayer(c.map.groupLayer);
        
              
        
                if(c.map.groupMarkerList){
                    c.map.allMarkersLyer.addLayer(L.layerGroup(c.map.groupMarkerList));
                    c.map.markerList= c.map.markerList.concat(c.map.groupMarkerList);
                } 
               if(c.map.childGrounpMarker.length>0){
                    c.map.allMarkersLyer.addLayer(L.layerGroup(c.map.childGrounpMarker)) 
                    c.map.markerList= c.map.markerList.concat(c.map.childGrounpMarker);
                    
                }
        
                // c.map.childGrounpMarker.addTo(c.map.map);
                c.map.allMarkersLyer.addTo(c.map.map);
        
        
                c.currentMarkerList={
                markerList:c.map.markerList,
                listNav:$("#sceniclist")
                }
                c.map.lineData=lineTrack;//绑定路线数据
                c.getOrientation();
                c.orientation=false;
                c.map.startLocate(); //开始定位
                // domOperateBack.domOperateForMap(c.map);//给map元素绑定事件
        
                //取消自动讲解语音提醒
                //c.$audio.data("guidePlaying","false");
                //c.$audio.data("guidePlayed","true");
        
                return {
                addImageLayers:addImageLayers
                }
               }
                var intiMap=intiMap();
                intiMap.addImageLayers();
        
})
