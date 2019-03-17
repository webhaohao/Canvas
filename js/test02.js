// function createFunction(){
//     var result=new Array();
//     for(var i=0;i<10;i++){
//         result[i]=function(num){
//                 return num
//         }(i);
//     }
//     return result;
// }
// console.log(createFunction());
var person={name:'chen',age:18,man:{hight:188}}
var son={sex:'男'}
function clone(p,s){
    var s=s||{};
    for(var prop in p){
        if(typeof p[prop]=='object'){
            s[prop]=(p[prop].constructor===Array)?[]:{};
            clone(p[prop],s[prop]);
        }
        else{
            s[prop] =p[prop];
        }
       
    }
    return s;
}
clone(person,son);
console.log(son);
son.name='ze'
console.log(son);
console.log(person);
son.man.hight=19999;
console.log(son);
console.log(person);