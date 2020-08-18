
let durations = {
  55: 8,
  21: 5,
  13: 3,
  8: 2,
  5: 1,
  3: 0.5

}

let onBreak = false;
let breakDuration = 0;
let isPastBreak = false;

document.getElementById("timer").innerHTML = "Select a Duration"

//a hack to wake up the sound audio on the browser 
var silence = new Audio("silence"); 
silence.play();


var timeleft = 60 * 10000;

function timer() {
var downloadTimer = setInterval(function(){

  if(timeleft < 0 && timeleft > -2000){
    clearInterval(downloadTimer);

    if(onBreak){
      isPastBreak = true;
      var bark = new Audio("dog_bark.wav"); 
      bark.play();

      document.getElementById("timer").innerHTML = "Select a Duration";
     


    }else{
      var bling = new Audio("endbell.mp3"); 
      bling.play();
      timeleft = breakDuration
      onBreak = true;
      timer()
    }

   

  } else {

    if(timeleft > 60 * 100){
      document.getElementById("timer").innerHTML = "Select a Duration";
    } else if(isPastBreak){
      document.getElementById("timer").innerHTML = "Finished";
     
    }else{
      let periodIndicator = onBreak ? "On Break: " : "Remaining: "
      document.getElementById("timer").innerHTML = periodIndicator + fancyTimeFormat(timeleft);
    }
    

  }
  timeleft -= 1;
}, 1000);

}

timer()


function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


$(".container").on('click', '.item', function(elem) {

  var gong = new Audio("opening_gong.wav"); 
  gong.play();

  let timeSelected = parseInt($(this).text())
  onBreak = false;
  isPastBreak = false;

  breakDuration = durations[timeSelected] * 60;

 

  if(timeleft > 0){
    timeleft = timeSelected * 60;
  }else{
    timeleft = timeSelected * 60;
    timer()
  }
 
  
});



$("#def").hide();

$('.break').on("mouseenter", function () {
        $("#def").show();            
    })
    .on("mouseleave", function () {
        $("#def").hide();
    });

   $("#def2").hide();

$('.break2').on("mouseenter", function () {
        $("#def2").show();            
    })
    .on("mouseleave", function () {
        $("#def2").hide();
    });

    $('#def2').on("mouseenter", function () {
      $("#def2").show();            
  })
  .on("mouseleave", function () {
      $("#def2").hide();
  });

