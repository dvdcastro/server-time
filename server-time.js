// Thanks http://stackoverflow.com/questions/1638337/the-best-way-to-synchronize-client-side-javascript-clock-with-server-date

var serverTimeOffset = false;
var srvRefreshRate = 1000, cliRefreshRate = 500;


function getServerTime(callback) {
    if (serverTimeOffset === false) {
        var scripts = document.getElementsByTagName('script'),
            URL = scripts[scripts.length - 1].src;

        var clientTimestamp = Date.parse(new Date().toUTCString());
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', URL + '?noCache=' + Date.now(), true);
        xhr.send();

        xhr.onload = function() {
          var serverDateStr = xhr.getResponseHeader('Date');
          var serverTimestamp = Date.parse(new Date(Date.parse(serverDateStr)).toUTCString());

          var serverClientRequestDiffTime = serverTimestamp - clientTimestamp;
          var nowTimeStamp  = Date.parse(new Date().toUTCString());

          var serverClientResponseDiffTime = nowTimeStamp - serverTimestamp;
          var responseTime = (serverClientRequestDiffTime - nowTimeStamp + clientTimestamp - serverClientResponseDiffTime )/2;

          serverTimeOffset = (serverClientResponseDiffTime - responseTime);

          var date = new Date();

          date.setTime(date.getTime() + serverTimeOffset);

          callback(date);

          serverTimeOffset = false;
        };
    }
}

function startTimeUpdater(nodeId){
  updateTime(nodeId);
  setInterval(function(){
    updateTime(nodeId);
  },srvRefreshRate);
}

function updateTime(nodeId) {
  var timeShow = document.getElementById(nodeId);
  getServerTime(function(theTime){
    formatTimer(theTime.getTime()/1000, function(res){
      timeShow.innerHTML = res;
    })
  });
}

//- START timer management functions

//- START Timer vars
var timeTxt = '00:00:00';
var end_date = new Date();
var rem_time_secs_secs = 0;
var fastClockNodeId = '';
var diffNodeId = '';
var showSecs = false;
//- END Timer vars

var startTimerTick = function(nodeId) {
  fastClockNodeId = nodeId;
  tickInterval = setInterval(execTimerTick, 50);
};

var formatTimer = function(duration, done) {
  var seconds = parseInt(duration%60),
    minutes = parseInt((duration/60)%60),
    hours = parseInt((duration/(60*60))%24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  done(hours + ':' + minutes + (showSecs ? ':' + seconds : ''));
};

var execTimerTick = function(){


  var now = new Date();

  formatTimer(now.getTime()/1000, function(timeTxt) {
    document.getElementById(fastClockNodeId).innerHTML = timeTxt;
  });
};
