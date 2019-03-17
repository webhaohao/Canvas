 $("input[type='file']").on('change', function () {
        var self = this;
        var ele = $(this);
        var file = self.files[0];
        if(!/image\/\w+/.test(file.type)){
            alert("请选择图片文件！");
            return false;
        }
        var fileName = $(this).attr("name");
        var reader = new FileReader();//图片读取
        reader.readAsDataURL(file);
        reader.onload = function(e){
            var result = this.result;
            ele.parent().fadeOut("slow");
            $(".scan_img").fadeIn("slow");
            $("#seefun").fadeIn("slow");
            var img = new Image();
            img.src = result;

            var basestr = result;
            if (result.length>150000){
            	basestr = compress(img);
            }
            $("body").css("background","url("+basestr+") 0 0/100% 100%");
            
            $.ajax({
                type: "POST",
                url: $("#fileForm").attr("action"),
                data:{
                	file:basestr
                },
                // dataType: "JSON",
                success: function(msg){
                	$(".scan_img").css("display","none");
                	alert(msg);
                	window.location.href="/Zooplus";
                   
                }
            });
            /*
        	$.ajax({
        		url:$("#fileForm").attr("action"),
        		data:$("#fileForm").serialize(),
        		type:"post",
        		dataType:"json",
        		success:function(data){
        			$(".scan_img").css("display","none");
        			alert(data.responseText);
        		},
        		error:function(data){
        			$(".scan_img").css("display","none");
        			console.log("error"+data.responseText);
        		}
        	})
        	*/
            //$('form').submit();
        }
    });
 
 function compress(img) {
	//  用于压缩图片的canvas
		  var canvas = document.createElement("canvas");
		  var ctx = canvas.getContext('2d');
		  //    瓦片canvas
		  var tCanvas = document.createElement("canvas");
		  var tctx = tCanvas.getContext("2d");
	    var initSize = img.src.length;
	    var width = img.width;
	    var height = img.height;

	    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
	    var ratio;
	    if ((ratio = width * height / 4000000)>1) {
	        ratio = Math.sqrt(ratio);
	        width /= ratio;
	        height /= ratio;
	    }else {
	        ratio = 1;
	    }

	    canvas.width = width;
	    canvas.height = height;
	    //    铺底色
	    ctx.fillStyle = "#fff";
	    ctx.fillRect(0, 0, canvas.width, canvas.height);

	    //如果图片像素大于100万则使用瓦片绘制
	    var count;
	    if ((count = width * height / 1000000) > 1) {
	        count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片
	        //计算每块瓦片的宽和高
	        var nw = ~~(width / count);
	        var nh = ~~(height / count);
	        tCanvas.width = nw;
	        tCanvas.height = nh;
	        for (var i = 0; i < count; i++) {
	            for (var j = 0; j < count; j++) {
	                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

	                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
	            }
	        }
	    } else {
	        ctx.drawImage(img, 0, 0, width, height);
	    }

	    //进行最小压缩
	    var ndata = canvas.toDataURL("image/jpeg", 0.1);
	    console.log("压缩前：" + initSize);
	    console.log("压缩后：" + ndata.length);
	    console.log("压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%");
	    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
	    return ndata;
	}
