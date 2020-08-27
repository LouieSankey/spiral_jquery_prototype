
let durations = {
  89: 21,
  55: 13,
  34: 8,
  21: 5,
  13: 3,
  8: 2,
  5: 1,
  3: 0.5,
  2: 0

}

var sessionUsage;

var usageFromStorage = localStorage.getItem('session');

if(!usageFromStorage){
  sessionUsage = [];
}else{
  sessionUsage = JSON.parse(usageFromStorage);
}

console.log(sessionUsage)


let onBreak = false;
let breakDuration = 0;
let isPastBreak = false;

document.getElementById("timer").innerHTML = "Select a Duration"

//a hack to wake up the sound audio on the browser 
// var silence = new Audio("silence.wav");
// silence.play();

var timeleft = 60 * 10000;

var downloadTimer = null;


function timer() {
//if(!pause){

downloadTimer = setInterval(function(){
  if(!pause){
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
      $('.toolbar').css('visibility','hidden');
      $('.stop').css('visibility','hidden');
      $('.skip_next').css('visibility','hidden');
     
    }else{
      let periodIndicator = onBreak ? "On Break: " : "Remaining: "
      $('.toolbar').css('visibility','visible');
      document.getElementById("timer").innerHTML = periodIndicator + fancyTimeFormat(timeleft);
    }
    

  }
  timeleft -= 1;
}
}, 1000);

}

//}

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


let pause = false;

let smallSet = [21,13,8,5,3,2]
let mediumSet = [34,21,13,8,5,3]
let mediumLargeSet = [55,34,21,13,8,5]
let largeSet = [89,55,34, 21,13,8]


let set = [mediumSet, smallSet,  largeSet, mediumLargeSet]
let setCount = 0;
//cycle through three different number sets
$(".cycle").on('click', function(){

  let i = 0;
  $('.container').children('div').each(function () {
    $(this).text(set[setCount][i])
    i++
});
if(setCount === 3){
  setCount = 0;
}else{
  setCount++
}


})

$(".toolbar").on('click', '.stop', function(elem){

stop()

})

function stop(){
  clearInterval(downloadTimer);
  $('.stop').css('visibility','hidden');
  $('.skip_next').css('visibility','hidden');

  $('.toolbar').css('visibility','hidden');
  $('.pause').text('pause_presentation')
document.getElementById("timer").innerHTML = "Select a Duration";
pause = false;
breakDuration = 0;
timeleft = 60 + 100000
timer()
}

$(".toolbar").on('click', '.skip_next', function(elem){
timeleft = 0
$('.pause').click()
})


$(".toolbar").on('click', '.pause', function(elem){
  if(pause){
    pause = false
    $('.pause').text('pause_presentation')
    $('.stop').css('visibility','hidden');
    $('.skip_next').css('visibility','hidden');
  }else{
    pause = true
    $('.pause').text('play_circle_outline')

    $('.stop').css('visibility','visible');
    $('.skip_next').css('visibility','visible');
  }
})

$(".container").on('click', '.item', function(elem) {
console.log(pause)
console.log(breakDuration)
console.log(timeleft)
console.log(onBreak)

stop()



  var gong = new Audio("opening_gong.wav"); 
  gong.play();

  let timeSelected = parseInt($(this).text())
  onBreak = false;
  isPastBreak = false;


  breakDuration = durations[timeSelected] * 60;

  let note = $('#fname').val().split(":");

  let task = note[1]
  let category = note[0]



  let date = new Date()

  var d = new Date(); 
  var _date = d.toLocaleDateString();
  var time = d.toLocaleTimeString();



  if(timeleft > 0){
    timeleft = timeSelected * 60;
  }else{
    timeleft = timeSelected * 60;
    timer()
  }

  let cycle = {
    "category": category,
    "task": task,
    "cycle": timeSelected + " min",
    "skipped": "n/a",
    "date": _date,
    "start time": time,
    "end time": "n/a"
    
   
   
  }

sessionUsage.push(cycle);
localStorage.setItem("session", JSON.stringify(sessionUsage));


//}

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



 
