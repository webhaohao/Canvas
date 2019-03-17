$(function(){
    GetQueryString('zooId')==4||GetQueryString('zooId')==8||GetQueryString('zooId')==3?$(".btns #seal-btn").css('display','none'):'';
    $(".btns #seal-btn").on('tap',function(){
        $(this).hasClass('seal_map_btn')?$(this).addClass('seal_list_btn').removeClass('seal_map_btn'):$(this).addClass('seal_map_btn').removeClass('seal_list_btn');
        $(this).hasClass('seal_map_btn')?$(".seal-list").fadeIn().siblings().fadeOut():$(".seal_map_wrapper").fadeIn().siblings().fadeOut();
    })
    //点击分享按钮
    $("#share").on('tap',function(){
    	$(".share_modal").fadeIn('fast');
    })
    $(".share_modal").on('tap',function(){
    	 $(this).fadeOut('fast');
    })
    var userID=GetQueryString('userId');
    $("#loading").fadeIn();
	$.ajax({
        type: "GET",
        url: "/Zoo/getUserSeal",
        data: {
            userid: userID,
            zooid: GetQueryString('zooId')
        },
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            $("#loading").fadeOut();
        	var srcData=[];
            // alert(JSON.stringify(msg));
            if(msg.status === "fail"){
                alert("Get seal fail");
            }
            else 
            {
	        	var seal_html = "";
	            for(var i in msg){
                    seal_html+=`   
                        <li>
                            <img src="${msg[i].path}"/>
                            <span>${msg[i].count}</span>
                            <div><i>${msg[i].name}</i></div> 
                        </li>`;
	                srcData.push({x:msg[i].x,y:msg[i].y,count:msg[i].count});        
            }
            console.log(srcData);
               $(".seal-list ul").html(seal_html);
                // alert($("#seal").css("display"));
//                      var srcData = [{
//                          x:200,
//                          y:400,
//                          num:21
//                      },{
//                          x:150,
//                          y:300,
//                          num:2
//                      },{
//                          x:300,
//                          y:250,
//                          num:5
//                      }];
                var svg_html = "";
                var SVG_NS = "http://www.w3.org/2000/svg";
                for(var i in srcData){
                    var ele = document.createElementNS(SVG_NS,"image");
                    ele.setAttribute("width","23px");
                    ele.setAttribute("height","25px");
                    ele.setAttribute("x",srcData[i].x);
                    ele.setAttribute("y",srcData[i].y);
                    ele.setAttribute("data-type","pin");
                    ele.setAttribute("data-url",msg[i].path);
                    ele.setAttribute("data-num",srcData[i].count);
//                          ele.setAttribute("href","image/pin_red.png");
                    ele.href.baseVal="image/pin_red.png";
                    map_father.appendChild(ele);
                }
                map_father.setAttribute("transform","translate(-100,-100)");

                var sealAnimal = document.createElementNS(SVG_NS,"image");
                sealAnimal.setAttribute("width","60px");
                sealAnimal.setAttribute("height","60px");
                sealAnimal.setAttribute("x","-9999");
                sealAnimal.setAttribute("y","-9999");

                var sealCircle = document.createElementNS(SVG_NS,"circle");
                sealCircle.setAttribute("cx","-9999");
                sealCircle.setAttribute("cy","-9999");
                sealCircle.setAttribute("fill","#dd5738");
                sealCircle.setAttribute("r","10");

                var sealText = document.createElementNS(SVG_NS,"text");
                sealText.setAttribute("x","-9999");
                sealText.setAttribute("y","-9999");
                sealText.setAttribute("style","fill:#FFF;font-size:12px");
                sealText.setAttribute("width","200");

                map_father.appendChild(sealAnimal);
                map_father.appendChild(sealCircle);
                map_father.appendChild(sealText);

                $("svg image[data-type=pin]").bind("touchstart",function(){
                    sealAnimal.setAttribute("x",parseInt($(this).attr("x"))-20);
                    sealAnimal.setAttribute("y",parseInt($(this).attr("y"))-70);
                    //sealAnimal.setAttribute("href",$(this).attr("data-url"));
                    sealAnimal.href.baseVal=$(this).attr("data-url");
                    sealCircle.setAttribute("cx",parseInt($(this).attr("x"))+30);
                    sealCircle.setAttribute("cy",parseInt($(this).attr("y"))-20);
                    sealText.setAttribute("y",parseInt($(this).attr("y"))-16);

                    sealText.textContent=$(this).attr("data-num");
                    if(parseInt($(this).attr("data-num"))>=10){
                        sealText.setAttribute("x",parseInt($(this).attr("x"))+24);
                    }else {
                        sealText.setAttribute("x",parseInt($(this).attr("x"))+27);
                        }
                    })

                }
            }
       });
         var svg_sign = 0;
        $(".seal-list ul").on('touchstart','li',function(e){
            console.log($(e.target));
            e.stopPropagation();
            $(this).find('div').addClass('active');
            $(this).siblings().find('div').removeClass('active');
        })
        $('body').on('touchstart',function(e){
                if($(e.target)[0]!=='div'||$(e.target)[0]!=='li'){
                    $(".seal-list ul li div").removeClass('active');
                }
        }) 
	    $("#seal_map").bind("touchstart", function(e) {
	        var self = $(this);
	        var startX,startY;
	
	        if(svg_sign===0){
	            document.addEventListener("touchstart", function(e) {
	                startX = e.touches[0].pageX;
	                startY = e.touches[0].pageY;
	            }, false);
	            //手指离开屏幕
	            document.addEventListener("touchmove", function(e) {
	                var endX, endY;
	                endX = e.changedTouches[0].pageX;
	                endY = e.changedTouches[0].pageY;
	                var attr = map_father.getAttribute("transform").split(",");
	                var attrX = attr[0].substring(10);
	                var attrY = attr[1].substring(0,attr[1].length-1);
	                var X = parseInt(attrX)+ (endX - startX)*0.07;
	                var Y = parseInt(attrY)+ (endY - startY)*0.045;
	                // alert(endX - startX);
                    X = X > 0 ? 0 : X;
                    console.log(X);
	                X = X < (parseInt(self.width())-980) ? parseInt(self.width())-980 : X;
	                Y = Y > 0 ? 0 : Y;
	                Y = Y < (parseInt(self.height())-678) ? parseInt(self.height())-678 : Y;
	                map_father.setAttribute("transform","translate("+X+","+Y+")");
	                // e.preventDefault();
	            },false);
	            svg_sign++;
	        }
	        // document.addEventListener("touchend",function () {  //取消不了？？？
	        //     document.removeEventListener("touchstart");
	        //     document.removeEventListener("touchmove");
	        // },false);
	        e.preventDefault();
        });
})