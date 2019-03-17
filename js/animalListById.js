$(function(){
    var Id=GetQueryString("animalId");
    getAnimalById(Id);
})
function getAnimalById(id){
    $.ajax({
        url:"/Zoo/getProductByAnimalID",
        data:{
            animalID:id
        },
        success:function(data){
            console.log(data);
            $.each(data,function(i,item){
                var html=`
                  <li>
                        <div class="right_hot_product_small">
                        <div class="right_hot_product_img">
                            <img src="${item.path}" alt="" />
                        </div>
                        <div class="right_hot_product_msg">
                            <div class="product_small_tit">
                                <h5 class="ellipsis-1">${item.name}</h5>
                            </div>
                            <div class="product_info">
                                <div class="price">
                                <b>${item.price}</b>
                                </div>
                                <div class="product_btn">
                                    <a href="${item.productid}" class="go_shopping"></a>
                                </div>
                            </div>
                        </div>
                        </div>
                </li>
                ` 
              $(".product_list ul").append(html)      
            })
        }
    })
}