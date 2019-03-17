function StringToVoice(controller, string) {
  this.controller = controller;
  this.string = string;
  this.initElements();
  this.initEvents();
}

StringToVoice.prototype = {
  constructor: StringToVoice,

  initElements: function() {},
  initEvents: function() {
    var _self = this;
    this.controller.onclick = function() {
      var utterText = _self.string;
      //utterText = encodeURI(utterText);
      //alert(typeof utterText);
      var uri =
        "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=4&text=" +
        utterText;
      $("#audioReader")[0].innerHTML =
        '<audio id="audioPlayer" style="display:none;"><source src="' +
        uri +
        '" type="audio/mpeg"><embed height="0" width="0" src="' +
        uri +
        '"></audio>';
      document.getElementById("audioPlayer").play();
      $(".close").on("touchend", function() {
        $("#audioPlayer")[0].pause();
      });
    };
  }
};
