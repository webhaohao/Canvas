$(function(){
    var productId=GetQueryString("productId");
    //console.log(productId);
    getProDetail(productId);
    $(".product_detail_con .sub_tit").click(function(){
        location.href="./go_here.html";
    })
    $(".bottom_nav .join_cart>a").click(function(e){
    	e.preventDefault();
    	addCart(productId);
    })
    $(".Do_shopping>a").click(function(e){
    	e.preventDefault();
    	// alert("调起微信支付");
        //var wxUserInfo = window.sessionStorage.getItem("wxUserInfo");
        // alert(wxUserInfo);
        var proPrice=parseFloat($.trim($('.price>b').html()).substring(1));
        // alert(proPrice);
        var arr=[];
        arr.push({
            'productID':productId,
            'count':1    
        })
        var obj={
            'price':proPrice,
            'data':arr
        }
        setOrder(JSON.stringify(obj),proPrice);
    	//pay(proPrice);
    })
}) 
function getProDetail(productId){
    $.ajax({
        url:'/Zoo/getProductByID',
        data:{
           productID:productId
        },
        success:function(data){
          //console.log(typeof(data));
          var proInfo=data;
          console.log(proInfo);
          getProBanner(proInfo.img);
          $(".product_detail_con .hot_product_tit>h5").html(`${proInfo.name}`);
          $(".product_msg .price>b").html(`￥${proInfo.price}`);
          $(".product_msg .product_btn .go_shopping").attr('href',proInfo.productId);
        },
        error:function(){

        }
    })
}
function getProBanner(str){
    var html="";
    if(typeof(str)=="string"){
        console.log("string")
        html=`
          <div class="swiper-slide"><img src="${str}" alt="" /></div>
        `; 
        $(".pro_banner .swiper-container .swiper-wrapper").append(html);
    } 
    else if(typeof(str)=="object"){
        console.log("object")
        for(i=0;i<str.length;i++){
            html=`
                <div class="swiper-slide"><img src="${str[i]}" alt="" /></div>
            `;
            $(".pro_banner .swiper-container .swiper-wrapper").append(html); 
        }
    }
    else{
        return false;
    } 
    console.log(html);
    var mySwiper = new Swiper ('.pro_banner .swiper-container', {
        loop: true,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        paginationType : 'custom',
        paginationCustomRender: function (swiper, current, total) {
            return   '<div class="pagewrapper"><span class="current">'+current +'</span>'+'/'+total+'</div>';
        },
        onInit: function(swiper){
        }
    })
}
   