$(function(){
    userCartInfo();
    isAllCheck();
    //用户加减操作
    $(".cart_con .container ul").on('click','.user_handle button',function(e){
            e.preventDefault();
           var productId=$(this).parent().data('productid');
           var proCartText=$(this).siblings('span').html();
           var proCartNum=proCartText.substring(1);
            if(e.target.className=='plus'){
                 updateNum("add",productId).then((data)=>{
                    console.log(this); 
                    if(data='success'){
                        proCartNum++;  
                        $(this).siblings('span').html('x'+proCartNum);
                        allPrice()
                    }
                 })
            }
            else{
                if(proCartNum<1){
                    return;
                }
                updateNum("minus",productId).then((data)=>{
                    console.log(this); 
                    if(data='success'){
                        proCartNum>1?proCartNum--:proCartNum; 
                        $(this).siblings('span').html('x'+proCartNum);
                        allPrice()
                    }
                });  
            }
           
    })
    //点击购物车每个商品前的按钮
    $(".cart_con .container ul").on('click','.check_box>.box',function(){
            console.log($(this));
            var checkbox=$(this).find('input');
            if(checkbox.prop('checked')){
                $(this).css('border','none');
            }
            else{
                $(this).css('border','0.02rem solid #8c8c8c');  
            }
            isAllCheck();
            allPrice();
    })
    //点击全选
    $("#allCheck").click(function(){
        var inputCheckbox=$('.cart_con ul>li').find('input[type=checkbox]');
        if($(this).find('input').prop('checked')){
           //var  len=$('.cart_con ul>li').length;
           $(this).css('border','none');
           inputCheckbox.prop('checked',true);
           inputCheckbox.parent().css('border','none');
        }
        else{
            $(this).css('border','0.02rem solid #8c8c8c');  
            inputCheckbox.prop('checked',false);
            inputCheckbox.parent().css('border','0.02rem solid #8c8c8c'); 
        }
        allPrice();
    })
    //点击删除某件商品
    $(".cart_con .container ul").on("click",".del_product",function(e){
            e.preventDefault();
            var productId=$(this).attr('href');
            updateNum("del",productId).then((data)=>{
                   console.log(this); 
                   $(this).parents('li').remove();
            });  
    })
    //点击购物车结算
    $(".bottom_menu .right_menu").click(function(){
        console.log("开始结算");
        var cartData=allPrice();
        // var productIdList=cartData.CartId.join(",");
        // var wxUserInfo = window.sessionStorage.getItem("wxUserInfo");
        var info={
            'price':cartData.Total,
            'data':cartData.productArr
        }
        setOrder(JSON.stringify(info),cartData.Total);
        //settleAccounts(total);
    })
})
//判断购物车的内容是否需要全部选中
function isAllCheck(){
      var str="";
      var  len=$('.cart_con ul>li').length;
      for(var i=0;i<len;i++){
        str+=$('.cart_con ul>li').eq(i).find('input[type=checkbox]').prop('checked');
      }
      if(str){
        if(str.indexOf('false')==-1){
            $("#allCheck").find('input[type=checkbox]').prop('checked',true);
            $("#allCheck").css('border','none'); 
        }
        else{
            $("#allCheck").find('input[type=checkbox]').prop('checked',false); 
            $("#allCheck").css('border','0.02rem solid #8c8c8c'); 
        }
     }
     return;
}
//计算总价格
function allPrice(){
    var  len=$('.cart_con ul>li').length;
    var total=0;
    var cartData={
        productArr:null,
        Total:null
    };
    var productArr=[];
    for(var i=0;i<len;i++){
      if($('.cart_con ul>li').eq(i).find('input[type=checkbox]').prop('checked')){
        var num=parseInt($.trim($('.cart_con ul>li').eq(i).find('.user_handle>span').html()).substring(1));
        console.log(num);
        var proPrice=parseFloat($.trim($('.cart_con ul>li').eq(i).find('.price').html()).substring(1));
        var productId=$('.cart_con ul>li').eq(i).find(".del_product").attr('href');
        productArr.push({
            "productID":productId,
            "count":num
        });
        //console.log(proPrice);
        total+=parseFloat(num*proPrice);
      }
    }
    cartData.productArr= productArr;
    cartData.Total=total;
    $(".total_price>p>span").html('￥'+total.toFixed(2));
    return cartData;
}
//用户购物车内容
function userCartInfo(){
    $.ajax({
        url:'/Zoo/getCart',
        success:function(data){
            //console.log(data);
            var userCartList=data;
            console.log(userCartList);
            if($.isArray(userCartList)){
                var html="";
                $.each(userCartList,function(i,item){
                    html=`
                        <li>
                            <div class="check_box">
                                <div class="box">
                                    <input type="checkbox"/><span></span>
                                </div>
                            </div>
                            <div class="prodct_s_img">
                               <a href="./product_detail.html?productId=${item.productid}">
                                	<img src="${item.path}" alt=""/>
                               </a>
                            </div>
                            <div class="shopping_cart_info">
                                <div class="slider_slide">
                                    <h5>${item.name}</h5>
                                    <a href="${item.productid}" class="del_product" data-productid="${item.productid}">
                                    </a>
                                </div>
                                <div class="slider_slide">
                                    <span class="price">    
                                        ¥${item.price}
                                    </span>
                                    <div class="user_handle" data-productid="${item.productid}">
                                        <button class="plus"></button><span>x${item.count}</span><button class="miinus"></button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `  
                    $(".cart_con>.container>ul").append(html);   
                })
         } 
        },
        error:function(){

        }
    })
}
//修改用户购物车
function updateNum(flag,productId){
    return  new Promise(function(resolve,reject){
            $.ajax({
                url:"/Zoo/updateCart",
                type:"POST",
                data:{
                    type:flag,
                    productID:productId
                },
                success:function(data){
                    resolve(data.status);
                    //allPrice();	
                },
                error:function(){

                }
            })
    })
}
//删除商品
// function delProduct(flag){
//     $.ajax({
//         url: "/Zoo/updateCart",
//         data:{
//             type:flag
//         },
//         success:function(data){
//             var  data=JSON.parse(data);
//             if(data.status=="success"){
//                 $(obj).parent().parent().parent().remove();
//                 console.log("删除成功!");
//                 allPrice();	
//             }
//         }
//     })
// }
//购物车结算
