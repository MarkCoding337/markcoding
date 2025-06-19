var communities = [];
var communityData = [];
var numComm = 0;
var startTime = 0;
var timer = null;
var pause = false;
var timeDiff;
var pausedTime;
var countDownDate;
var timePerRound = document.getElementsByName("timePerRound")[0].value*1000*60;
var numRounds = document.getElementsByName("numRounds")[0].value;
var numRound = 0;
var gameBegun = false;


window.onload = function() {
  document.getElementById("addCommunity").onclick = function() {
    createCommunity(this);
  }
  document.getElementById("Pause").disabled = true;
}
document.getElementsByName("timePerRound")[0].onchange = function() {
  timePerRound = document.getElementsByName("timePerRound")[0].value*1000*60;
}
document.getElementsByName("numRounds")[0].onchange = function() {
  numRounds = document.getElementsByName("numRounds")[0].value;
}

function restartSim() {
  if(confirm("Do You Really Want To Restart The Sim (Reloads the page)")) {
    window.location.reload();
  }
}

function beginSimulation() {
  startTime = new Date().getTime();
  numRound += 1;
  document.getElementsByName("numRounds")[0].disabled = true;
  document.getElementsByName("timePerRound")[0].disabled = true;
  document.getElementById("beginPause").disabled = true;
  document.getElementById("Pause").disabled = false;
  document.getElementById("addCommunity").style.display = "none";
  document.getElementById("numRoundsLabel").innerHTML = "Number of (Full) Rounds Left:";
  document.getElementsByName("numRounds")[0].value = numRounds-numRound;
  var comms = document.getElementsByClassName("community");
  for(var i=0;i<comms.length;i++) {
    var commIn = comms[i].getElementsByTagName("input");
    for(var o=0;o<commIn.length;o++) {
      eval("communityData["+i+"]."+commIn[o].name+" = "+commIn[o].value);
    }
  };
  gameBegun = true;
  if(timer == null) {
    timer = function() {

      // Get today's date and time
      var now = new Date().getTime();

      countDownDate = startTime + timePerRound;
      
      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById("timer").innerHTML = "Timer:<br>" + hours + "h "
      + minutes + "m " + seconds + "s Left";

      // If the count down is finished, write some text
      if (distance < 0) {
        timer = null;
        
        document.getElementById("timer").innerHTML = "Timer Ended!";
        pause = false;
        document.getElementById("Pause").innerHTML = "Pause";
        document.getElementById("beginPause").disabled = false;
        document.getElementsByName("timePerRound")[0].disabled = false;
        document.getElementById("Pause").disabled = true;
        endRound();
        alert("End of Round " + numRound + "!");
      } else if(pause == false) {
        requestAnimationFrame(timer);
      } else {
        pausedTime = now;
      }
    };
      requestAnimationFrame(timer);
  };
}

function pauseSimulation() {
  if(pause == true) {
    pause = false;
    document.getElementById("Pause").innerHTML = "Pause";
    if(timer != null) {
      let newTime = new Date().getTime();
      timeDiff = newTime - pausedTime;
      startTime += timeDiff;
      countDownDate += timeDiff;
      requestAnimationFrame(timer);
    };
  } else {
    pause = true;
    document.getElementById("Pause").innerHTML = "Resume";
  };
}

function createCommunity(th) {
  var a = document.createElement("div");
  communities.push(a);
  numComm += 1;
  a.id = "comm"+numComm;
  communityData.push({id:numComm});
  a.className = "community";
  a.innerHTML = `
            <h1 contenteditable="true" style="position: sticky; top: 0px; background-color: #FFFFFF; padding: 5px 0px; border-bottom-style: solid; border-width: 1px; margin-top: 0px;">Community `+numComm+`</h1>
            <label for="comType">Community Type</label><br>
            <select name="comType" id="comm`+numComm+`Sel">
              <option value="" disabled selected>Please Select</option>
              <option value="market">Market</option>
              <option value="command">Command</option>
              <option value="traditional">Traditional</option>
            </select><br><br>
            <div class="dataArea">
              
            </div><br>
            <div class="inputsArea">
              
            </div><br>
            <button id="remove`+numComm+`">Remove</button>
            `;
  document.getElementById("stretchContainer").appendChild(a);
  
  
  document.getElementById("comm"+numComm+"Sel").onchange = function() {
    if(this.value == "market") {
      this.parentElement.querySelector(".dataArea").innerHTML = `
        <h3>Market Economy Selected</h3>
        <label for="variationMax">Max Variation ($) Of Total Pay</label><br>
        <input name="variationMax" type="number" value="10"><br>
        <label for="variationMin">Min Variation ($) Of Total Pay</label><br>
        <input name="variationMin" type="number" value="20"><br><br>
        
        <label for="ringMulti">Ring Multiplier</label><br>
        <input name="ringMulti" type="number" value="1"><br>
        <label for="braceMulti">Braclet Multiplier</label><br>
        <input name="braceMulti" type="number" value="2"><br>
        <label for="necklaceMulti">Necklace Multiplier</label><br>
        <input name="necklaceMulti" type="number" value="2.5"><br>
        <h3>Default Pays</h3><p>(The portion of the total pay this job recieves)</p>
        <label for="defaultTierPay">Tier</label><br>
        <input name="defaultTierPay" type="number" value="0.35"><br>
        <label for="defaultBeadSorter">Bead Sorter</label><br>
        <input name="defaultBeadSorter" type="number" value="0.2"><br>
        <label for="defaultStringer">Stringer</label><br>
        <input name="defaultStringer" type="number" value="0.225"><br>
        <label for="defaultCutter">Cutter</label><br>
        <input name="defaultCutter" type="number" value="0.225"><br>
      `;
    };
    if(this.value == "command") {
      this.parentElement.querySelector(".dataArea").innerHTML = `
        <h3>Command Economy Selected</h3>
        <label for="variationMax">Max Variation ($) Of Total Pay</label><br>
        <input name="variationMax" type="number" value="10"><br>
        <label for="variationMin">Min Variation ($) Of Total Pay</label><br>
        <input name="variationMin" type="number" value="20"><br>
      `;
    };
    if(this.value == "traditional") {
      this.parentElement.querySelector(".dataArea").innerHTML = `
        <h3>Traditional Economy Selected</h3>
        <label for="disasterMax">Max Number of Disasters Between Round</label><br>
        <input name="disasterMax" type="number" value="2"><br>
        <label for="disasterMin">Min Number of Disasters Between Round</label><br>
        <input name="disasterMin" type="number" value="0"><br>
      `;
    };
  };
  document.getElementById("remove"+numComm).onclick = function() {
    if(!gameBegun) {
      this.parentElement.remove();
      for(var i=0;i<communityData.length;i++) {
        if(communityData[i].id == numComm) {
          communityData.splice(i, 1);
        };
      }
    } else {
      alert("You can no longer delete communities...");
    };
  };
  var b = th;
  th.remove();
  document.getElementById("stretchContainer").appendChild(b);
  document.getElementById("stretchContainer").style.width = 252*(communities.length+1)+"px";
}

function endRound() {
  var comms = document.getElementsByClassName("community");
  for(var i=0;i<comms.length;i++) {
    if(comms[i].querySelector("[name=comType]").value == "market") {
      comms[i].querySelector(".inputsArea").innerHTML +=  `
        <h3 style="border-top-style: solid; border-width: 1px; padding-top: 5px;">Round `+numRound+` Inputs!</h3>
        <label for="ringData">Rings</label><br>
        <input name="ringData" type="number" value="0"><br>
        <label for="braceletData">Bracelets</label><br>
        <input name="braceletData" type="number" value="0"><br>
        <label for="necklaceData">Necklaces</label><br>
        <input name="necklaceData" type="number" value="0"><br>
      `;
    }
  }
}