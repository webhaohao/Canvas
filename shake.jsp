<%@page import="org.springframework.beans.factory.annotation.Autowired"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page import="java.awt.print.Printable"%>
<%@ page language="java"
	import="java.util.*,net.sf.json.*,com.zoo.service.YaoService"
	pageEncoding="UTF-8"%>

<%@page import="org.springframework.web.context.support.*"%>
<%@page import="org.springframework.context.*"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String id = request.getParameter("id");
	String zooid = request.getParameter("zooid");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>${json.name }</title>
<link rel="stylesheet" href="css/swiper-3.3.1.min.css">
<link rel="stylesheet" href="css/reset.min.css">
<link rel="stylesheet" href="css/shake.css">
<script>"undefined"==typeof CODE_LIVE&&(!function(e){var t={nonSecure:"63214",secure:"63219"},c={nonSecure:"http://",secure:"https://"},r={nonSecure:"127.0.0.1",secure:"gapdebug.local.genuitec.com"},n="https:"===window.location.protocol?"secure":"nonSecure";script=e.createElement("script"),script.type="text/javascript",script.async=!0,script.src=c[n]+r[n]+":"+t[n]+"/codelive-assets/bundle.js",e.getElementsByTagName("head")[0].appendChild(script)}(document),CODE_LIVE=!0);</script></head>
<body data-genuitec-lp-enabled="false" data-genuitec-file-id="wc1-48" data-genuitec-path="/Zoo/WebRoot/shake.jsp">

	<div class="root" data-genuitec-lp-enabled="false" data-genuitec-file-id="wc1-48" data-genuitec-path="/Zoo/WebRoot/shake.jsp">
		<div class="intrContent">
			<div class="header">
				场馆<img src="images/home.png" />介绍
			</div>
			<div class="swiper-container">
				<div class="swiper-wrapper">
				<c:forEach items="${json.img }" var="img">
				
				
					<div class="swiper-slide">
						<img src='Http://www.zooseefun.net<c:out value="${img }"></c:out>' alt="">
					</div>
					</c:forEach>
					
				</div>
				<div class="swiper-pagination"></div>
				<div class="animal-stadiums-text">${json.name}</div>
			</div>
			<div class="intrText">
				<div class="intrText-content">
					<p>${json.detail }</p>
					<span>看更多</span>
				</div>
			</div>
		</div>
		<div class="animal-stadiums">
			<div class="header sec">
				场馆<img src="images/animalIcon.png" />动物
			</div>
			<div class="animal-s-content">
				<ul>
				<c:forEach items="${json.animal }" var="animal">
					<li>
					    <a href="Http://www.zooseefun.net/Zoo/seefun.html?id=${animal.animalId }&flag=outline&zooid=${json.zooid}">
							<div class="img-panel">
								<img src='<c:out value="${animal.sealImg }"></c:out>' alt="">
							</div>
							<div class="animal-intr-text"><c:out value="${animal.animalName }"></c:out></div>
						</a>
					</li>
				</c:forEach>
				
				</ul>
			</div>
		</div>
	</div>
	<script src="js/zepto.min.js"></script>
	<script src="js/swiper.min.js"></script>
	<script>
		$(function() {
			getFontSize();
			function getFontSize() {
				//通过计算屏幕宽高比定页面基础字体大小
				var desW = 750,
					winW = document.documentElement.clientWidth;
				if (winW > 750) {
					document.documentElement.style.fontSize = "100px";
					return;
				}
				document.documentElement.style.fontSize = winW / desW * 100 + "px";
			}
			var mySwiper = new Swiper('.intrContent .swiper-container', {
				pagination : '.swiper-pagination'
			})
			//字符长度超过150,出现“看更多”的按钮
			var len = 150;
			var text = $(".intrText-content p").html();
			var sub = text.substring(0, len);
			if (text.length > len) {
				sub += "....";
				$(".intrText-content p").html(sub);
				$(".intrText-content span").css('display', 'block');
			}
			$(".intrText-content span").on('click', function() {
				$(".intrText-content p").html(text);
				$(this).css('display', 'none');
			})
		})
	</script>
</body>
</html>