/**
 * Created by tz on 2016/12/5.
 */
function initRadar(id,characterContent,characterStar) {
  //console.log(id);
 // var myChart = echarts.init(document.getElementById("radar_chart"));
 var myChart=echarts.init(id);
 console.log(myChart);
  var char = [];
  for (var i in characterContent) {
    char.push({ text: characterContent[i], max: 100 });
  }
  console.log(JSON.stringify(char));
  console.log(JSON.stringify(characterStar));
  var option = {
    tooltip: {
      trigger: "axis"
    },
    radar: [
      {
        indicator: char,
        splitNumber: 5, //分割段数
        name: {
          textStyle: {
            //文字颜色
            color: "#000000",
            fontSize: 10,
            fontWeight: "500",
            fontFamily: "WAWA"
          }
        },
        splitArea: {
          areaStyle: {
            //20至40的覆盖区域
            color: [
              "rgba(255, 255, 255, 0)",
              "rgba(255, 255, 255, 0)",
              "rgba(255, 255, 255, 0)",
              "rgba(255, 255, 255, 0)"
            ],
            shadowColor: "rgba(0, 0, 0, 0.3)",
            shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
            //性格之间的线
            color: "rgba(149, 66, 50, 1)",
            width: 1.6
          }
        },
        splitLine: {
          //40与60之间的线
          lineStyle: {
            color: "rgba(149, 66, 50, 1)",
            width: 1.6
          }
        }
      }
    ],
    series: [
      {
        name: "动物性格数据",
        type: "radar",
        itemStyle: {
          normal: {
            lineStyle: {
              width: 0
            },
            areaStyle: {
              //数据覆盖区域样式
              color: "rgba(221,104,73,0.9)",
              type: "default"
            },
            label: {
              //数据值显示
              show:false,
              position: "right",
              textStyle: {
                color: "#339d9e",
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "WAWA"
              }
            }
          }
        },
        data: [
          {
            value: characterStar,
            name: "熊"
          }
        ]
      }
    ]
  };
  // 为echarts对象加载数据
  myChart.setOption(option);
}
