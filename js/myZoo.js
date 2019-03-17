$(function(){
	var map=new BMap.Map('container');
	getFootPrint().then(function(data){
			console.log(data);
			$.each(data,function(i,item){
				var Arr=item.date.location.split(',');
				var lng=Arr[0];
				var lat=Arr[1];
				var point=new BMap.Point(lng,lat);
				// var point=new BMap.Point(item.location);
				map.centerAndZoom(point,5);
				var myIcon = new BMap.Icon("http://www.zooseefun.net/Zoo/images/footicon.png", new BMap.Size(42,50));
				var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
				map.addOverlay(marker);              // 将标注添加到地图中	
				marker.addEventListener("click",function(){
					$("#busUnclickedoverLay" + item.date.zooid).fadeIn();
				});

				// $("#busUnclickedoverLay" + item.date.zooid).on('click',function(e){
				// 	e.stopPropagation();
				// 	$(this).fadeOut();
				// })
				InfoWindow(item,marker)
			})
	})
	function  InfoWindow(_info,marker){
		var sContent = `
					<div style="background-color:#eb6161;height:.54rem;line-height:.54rem;padding-left:.2rem;color:#fff;">${_info.date.name}</div>
					<div style="margin-top:.1rem">
						<img src="${'http://www.zooseefun.net/data'+_info.path}" style="max-width:100%;" id="img${_info.date.zooid}"/>
		 			</div>
		 			<div style="overflow:hidden;margin-top:.1rem">
		 				<a href="./myPic.html?id=${_info.date.zooid}" style="width:48%;height:.56rem;background-color:#a1b220;display:block;float:left;text-align:center;line-height:.56rem;color:#fff;">图集</a>
		 				<a href="./zooDetail.html?id=${_info.date.zooid}" style="width:48%;height:.56rem;background-color:#449cb7;display:block;float:right;text-align:center;line-height:.56rem;color:#fff;">详情</a>
		 			</div>
			 `;
		var infoWindow=new BMap.InfoWindow(sContent);	
		infoWindow.addEventListener('open',function(type, target, point){ //窗口打开是，隐藏自带的关闭按钮
			$('.BMap_pop>img').hide();
   		})
		//标注增加点击事件
	    marker.onclick=function(){
	        //var p = e.target;
			console.log(this);	        
			this.openInfoWindow(infoWindow);
			document.getElementById('img'+_info.date.zooid).onload = function (){
				console.log("1111");
				infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
			}
		}	     
	}
	//----------------复杂的自定义覆盖物-----------------------------------------------
	//还未点击的覆盖物
	//初始化，提供一下主要改变的参数
	// function BusUnclickedOverlay(point,info,id) {
	// 	console.log(info);
	// 	this._point = point;
	// 	this._info=info;
	// 	this._id = id;
	// }
	// BusUnclickedOverlay.prototype = new BMap.Overlay(); //继承百度地图提供的覆盖物的类
	// BusUnclickedOverlay.prototype.initialize = function(map) {
	// 	this._map = map;
	// 	console.log(this._point.lat)
	// 	var div = this._div = document.createElement("div");
	// 	div.setAttribute("id", "busUnclickedoverLay" + this._id);
	// 	div.style.position = "absolute";
	// 	div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat); 
	// 	//div.style.height = "3.2rem";
	// 	div.style.display="none";
	// 	div.style.width = "4.70rem";
	// 	//div.style.lineHeight = "70px";
	// 	//div.style.textAlign = "center";
	// 	div.style.background = "#eadbbc";
	// 	div.style.color = "#ffffff";
	// 	div.style.padding=".1rem";
	// 	//钱pay
	// 	div.style.fontSize = ".25rem";
	// 	div.innerHTML = `
	// 			<div style="background-color:#eb6161;height:.54rem;line-height:.54rem;padding-left:.2rem">${this._info.date.name}</div>
	// 			<div style="margin-top:.1rem">
	// 				<img src="${'http://www.zooseefun.net/data'+this._info.path}" style="max-width:100%;"/>
	// 			</div>
	// 			<div style="overflow:hidden;margin-top:.1rem">
	// 				<a href="" style="width:48%;height:.56rem;background-color:#a1b220;display:block;float:left;text-align:center;line-height:.56rem;color:#fff;">图集</a>
	// 				<a href="./zooDetail.html" style="width:48%;height:.56rem;background-color:#449cb7;display:block;float:right;text-align:center;line-height:.56rem;color:#fff;">详情</a>
	// 			</div>
	// 	`;
	// 	div.onclick= function(){
	// 		alert("1111");
	// 	}
	
	// 	map.getPanes().labelPane.appendChild(div); //将自定义窗口插入到地图样式内部，宠儿达到覆盖默认样式的效果
	// 	return div;
	
	// }
	
	// BusUnclickedOverlay.prototype.draw = function() {
	// 	var map = this._map;
	// 	var pixel = map.pointToOverlayPixel(this._point);
	// 	//this._div.style.left = pixel.x - 35 + "px"; //控制这个信息窗口针对标注物原点的偏移量，这也是前面div要设置样式position:absolute;
	// 	//this._div.style.top = pixel.y - 70 + "px";
	// 	this._div.style.left = pixel.x-130+"px";
	// 	this._div.style.top = pixel.y-205+"px";
	// }
})
function getFootPrint(){
	return new Promise(function(resolve,reject){
		$.ajax({
			url:'/Zoo/getFootPrint',
			success:function(data){
				// console.log(data);
				resolve(data);
			}
		})
	})
	
}