var BandwidthTest = function () {

};
BandwidthTest.prototype = {
  imgUrl: "" // Where the image is located at
    ,
  size: 0 // bytes
    ,
  run: function (options) {

      if (options && options.onStart)
        options.onStart();

      var imgUrl = this.imgUrl + "?r=" + (new Date()).getTime();
      this.startTime = (new Date()).getTime();

      var testImage = new Image();
      var me = this;
      testImage.onload = function () {
        me.endTime = (new Date()).getTime();
        me.runTime = me.endTime - me.startTime;

        if (options && options.onEnd)
          options.onEnd(me.getResults());
      };
      testImage.src = imgUrl;
    }

    ,
  getResults: function () {
    if (!this.runTime)
      return null;

    return {
      runTime: this.runTime,
      Mbps: (((this.size * 8 / 1024) / 1024) / (this.runTime / 1000)),
      MBps: (((this.size / 1024) / 1024) / (this.runTime / 1000))
    };
  }
}

function getBW() {
  var bt = new BandwidthTest();
  bt.imgUrl = 'bw-test.jpg';
  bt.size = 1563160;
  bt.run({
    onStart: function () {

    },
    onEnd: function (speed) {
      if (speed.Mbps < 10) {
        document.getElementById('bitrate').value = 128;
      } else if (speed.Mbps > 10 && speed.Mbps < 30) {
        document.getElementById('bitrate').value = 256;

      } else {
        document.getElementById('bitrate').value = 512;
      }
    }
  });
}