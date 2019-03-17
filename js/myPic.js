$(function(){
    //获取动物园id
    var id = GetQueryString("id"); 
    getUserImage(id);
    function getUserImage(id){
        $.ajax({
            url:'/Zoo/getUserImage',
            data:{
                zooid:id
            },
            success:function(data){
                console.log(data);
                $.each(data,function(i,item){
                    var html=`
                        <div class="item">
                           <a href="myPic_detail.html?id=${item.animalid}">
                                <div class="img-panel">
                                    <img src="${'http://www.zooseefun.net/data/'+item.path}" alt="">
                                </div>
                                <div class="animalName">
                                    ${item.name}
                                </div>
                            </a>
                        </div>
                    `;
                    $(".myPic").append(html);
                })
                
            }
        })
    }
  
})