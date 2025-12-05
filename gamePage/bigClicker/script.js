var BigInt;
var game = {
  maxInput: 1000000,
  
  cash: 0n,
  dec: 0n,
  moneyPerSecond: 0n,
  moneyPerSecondMulti: 1n,
  clickMulti: 1n,
  clickMultiMulti: 1n,
  
  totalClicks: 0,
  buttonSliderWidth: 500,
  numberAsOut: false,
  purchaseInterval: 1n,
  
  shopUpgrades: {
    recursive: [
      {name: "Selling Practice (Automatic)", price: 10n, initialPrice: 10n, priceScale: 6n, scaleT: 1, num: 0n, effects: {moneyPerSec: 1n}, avail: true},
      {name: "Selling Practice (Manual)", price: 10n, initialPrice: 10n, priceScale: 6n, scaleT: 1, num: 0n, effects: {clickMulti: 1n}, avail: true},
      {name: "Hiring A Handler", price: 10000n, initialPrice: 10000n, priceScale: 20000n, scaleT: 1, num: 0n, effects: {moneyPerSecondMulti: 1n}, avail: true},
    ],
    oneTime: [
      {name: "Selling Practice (Extra)", price: 100n, initialPrice: 100n, priceScale: 40n, scaleT: 1, num: 0n, max: 4n, effects: {clickMulti: 4n}, avail: true},
      {name: "Selling Practice (Extra Extra)", price: 18000n, initialPrice: 18000n, priceScale: 300n, scaleT: 0, num: 0n, max: 20n, effects: {moneyPerSec: 50n}, avail: true},
    ],
  },
  
  cashDisplay: document.getElementById("cash"),
  totClickDisplay: document.getElementById("totClicks"),
  monPerSecDisplay: document.getElementById("monPerSec"),
  monPerClickDisplay: document.getElementById("monPerClick"),
  
  shopNonRecList: document.getElementById("nonRecursiveUpgrades"),
  shopRecList: document.getElementById("recursiveUpgrades"),
  
  int1Butt: document.getElementById("1xIntButt"),
  int10Butt: document.getElementById("10xIntButt"),
  int100Butt: document.getElementById("100xIntButt"),
  clickButton: document.getElementById("clickyButton"),
  
  purchaseIntervalInput: document.getElementById("purchaseInterval"),
  
  simplifyNum: document.getElementById("niwfon"),
  
  saveGame: function() {
    var saveAbleData = {
      cash: game.cash,
      time: game.currTime,
      recursive: [],
      oneTime: [],
    }
    /*var b = structuredClone(game.shopUpgrades.recursive);
    for(var i=0;i<b.length;i++) {
      saveAbleData.recursive.push({name: b[i].name, num: b[i].num});
    }*/
    var c = structuredClone(game.shopUpgrades);
    c.recursive.forEach((item) => {
      item.price = 0n;
    });
    c.oneTime.forEach((item) => {
      item.price = 0n;
    });
    var saveGame = JSON.stringify(c, (_, v) => typeof v === 'bigint' ? v.toString() : v);
    localStorage.setItem("save1", game.cash.toString()+"|"+game.currTime);
    localStorage.setItem("save2", saveGame);
  },
  loadGame: function() {
    if(localStorage.getItem("save2") || localStorage.getItem("save1")) {
      var a = JSON.parse(localStorage.getItem("save2"));
      a = convertNumericStringsToBigInt(a);
      game.shopUpgrades = a;
      
      var b = localStorage.getItem("save1").split("|");
      game.cash = BigInt(b[0]);
      game.reloadEffects();
      
      var c = new Date().getTime();
      
      var d = c-b[1];
      
      d = BigInt(d)*game.moneyPerSecond*game.moneyPerSecondMulti;
      
      game.cash += (d/1000n);
      
      game.loadShop();
      
    }
  },
  
  reloadEffects: function() {
    
    game.moneyPerSecond = 0n;
    game.clickMulti = 1n;
    game.clickMultiMulti = 1n;
    game.moneyPerSecondMulti = 1n;
    var b = game.shopUpgrades.recursive;
    for(var i=0;i<b.length;i++) {
      if(b[i].effects.hasOwnProperty("moneyPerSec")) {
      game.moneyPerSecond += b[i].effects.moneyPerSec*b[i].num;
      }
      if(b[i].effects.hasOwnProperty("clickMulti")) {
        game.clickMulti += b[i].effects.clickMulti*b[i].num;
      }
      if(b[i].effects.hasOwnProperty("moneyPerSecondMulti")) {
        game.moneyPerSecondMulti += b[i].effects.moneyPerSecondMulti*b[i].num;
      }
    }
    var b = game.shopUpgrades.oneTime;
    for(var i=0;i<b.length;i++) {
      if(b[i].effects.hasOwnProperty("moneyPerSec")) {
      game.moneyPerSecond += b[i].effects.moneyPerSec*b[i].num;
      }
      if(b[i].effects.hasOwnProperty("clickMulti")) {
        game.clickMulti += b[i].effects.clickMulti*b[i].num;
      }
      if(b[i].effects.hasOwnProperty("moneyPerSecondMulti")) {
        game.moneyPerSecondMulti += b[i].effects.moneyPerSecondMulti*b[i].num;
      }
    }
  },

  // Compute total cost to buy `qty` units of an upgrade from its current `num`.
  // Handles linear scaling (scaleT == 0) and exponential scaling (scaleT == 1).
  computeTotalCost: function(upgrade, qty) {
    qty = BigInt(qty);
    const cur = upgrade.num;
    const initial = upgrade.initialPrice;
    const scale = upgrade.priceScale;
    // Linear scaling: price for unit k is initial + scale*(cur + k)
    if(upgrade.scaleT == 0) {
      // sum_{k=0..qty-1} (initial + scale*(cur + k))
      // = qty*initial + scale*(qty*cur + qty*(qty-1)/2)
      const qtyCur = qty * cur;
      const qtyPair = (qty * (qty - 1n)) / 2n;
      return qty * initial + scale * (qtyCur + qtyPair);
    }
    // Exponential scaling: price for unit k is initial + scale ** (cur + k)
    if(upgrade.scaleT == 1) {
      let total = 0n;
      for(let k = 0n; k < qty; k++) {
        total += initial + (scale ** (cur + k));
      }
      return total;
    }
    // Fallback: treat as single price
    return upgrade.price || 0n;
  },

  // Return a human-friendly description of an upgrade's effects for `qty` units.
  formatEffect: function(upgrade, qty) {
    qty = BigInt(qty);
    const eff = upgrade.effects || {};
    const parts = [];
    if(eff.hasOwnProperty("moneyPerSec")) {
      const per = eff.moneyPerSec;
      const total = per * qty;
      if(qty > 1n) {
        parts.push("+"+game.dispNum(per)+"/s each ("+"+"+game.dispNum(total)+" total)");
      } else {
        parts.push("+"+game.dispNum(per)+"/s each");
      }
    }
    if(eff.hasOwnProperty("clickMulti")) {
      const per = eff.clickMulti;
      const total = per * qty;
      if(qty > 1n) {
        parts.push("+"+game.dispNum(per)+"/click each ("+"+"+game.dispNum(total)+" total)");
      } else {
        parts.push("+"+game.dispNum(per)+"/click each");
      }
    }
    if(eff.hasOwnProperty("moneyPerSecondMulti")) {
      const per = eff.moneyPerSecondMulti;
      const total = per * qty;
      if(qty > 1n) {
        parts.push("+"+game.dispNum(per)+" MPS-exp each ("+"+"+game.dispNum(total)+" exp total)");
      } else {
        parts.push("+"+game.dispNum(per)+" MPS-exp each");
      }
    }
    if(parts.length === 0) return "(no direct effect)";
    return parts.join("; ");
  },
  
  loadShop: function() {
    game.shopRecList.innerHTML = "";
    var b = game.shopUpgrades.recursive;
    for(var i=0;i<b.length;i++) {
      var a = document.createElement("li");
      if(b[i].avail) {
        a.className = "available";
      } else {
        a.className = "";
      };
        // compute total price for the selected purchase interval
        b[i].price = game.computeTotalCost(b[i], game.purchaseInterval);
        var effectHint = game.formatEffect(b[i], game.purchaseInterval);
        a.innerHTML = b[i].name + " | Price: $"+game.dispNum(b[i].price)+" For "+game.dispNum(game.purchaseInterval)+" Unit | Have: "+game.dispNum(b[i].num)+" | Effect: "+effectHint;
      a.idNUM = i;
      a.onclick = function() {
        purchaseUpgrade(true, this, false);
      };
      game.shopRecList.appendChild(a);
    }
    game.shopNonRecList.innerHTML = "";
    var b = game.shopUpgrades.oneTime;
    for(var i=0;i<b.length;i++) {
      if(b[i].num < b[i].max) {
        var a = document.createElement("li");
        if(b[i].avail) {
          a.className = "available";
        } else {
          a.className = "";
        }; 
        // one-time purchases always show cost for a single unit
        b[i].price = game.computeTotalCost(b[i], 1n);
        var effectHint = game.formatEffect(b[i], 1n);
        a.innerHTML = b[i].name + " | Price: $"+game.dispNum(b[i].price)+" | Have: "+game.dispNum(b[i].num) + " | Max: "+game.dispNum(b[i].max)+" | Effect: "+effectHint;
        a.idNUM = i;
        a.onclick = function() {
          purchaseUpgrade(false, this, true);
        };
        game.shopNonRecList.appendChild(a);
      };
    }
  },
  
  mpsCalcOldDate: new Date().getTime(),
  currTime: 0,
  
  mpsCalc: function() {
    let currTime = new Date().getTime();
    game.currTime = currTime;
    let difference = currTime - game.mpsCalcOldDate;
    difference = BigInt(difference);
    let addAmt = difference*game.moneyPerSecond**game.moneyPerSecondMulti;
    if(addAmt % 1000n != 0n && addAmt <= 1000) {
      game.dec += addAmt % 1000n;
      addAmt -= addAmt % 1000n;
    } else {
      addAmt = addAmt/1000n;
    };
    if(game.dec >= 1000n) {
      let amt = game.dec / 1000n;
      game.dec -= amt*1000n;
      addAmt += amt;
    };
    game.mpsCalcOldDate = currTime;
    game.cash += addAmt;
    game.cashDisplay.innerHTML = "$"+game.dispNum(game.cash);
    game.totClickDisplay.innerHTML = ""+game.dispNum(game.totalClicks);
    game.monPerSecDisplay.innerHTML = "$"+game.dispNum(game.moneyPerSecond**game.moneyPerSecondMulti);
    game.monPerClickDisplay.innerHTML = "$"+game.dispNum(game.clickMulti);
    game.saveGame();
    requestAnimationFrame(game.mpsCalc);
  },
  dispNum: function(nnum, kk) {
    var num = nnum;
    if(!game.numberAsOut) {
      if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Tre-Trigintillion");
      } else if(num >= 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Googol");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Duo-Trigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Un-Trigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Trigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Novem-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Octo-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Septem-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Ses-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Quin-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Quattuor-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Tres-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Duo-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Un-Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Vigintillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Noven-Decillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Octo-Decillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Septen-Decillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Sex-Decillion");
      } else if(num >= 1000000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Quin-Decillion");
      } else if(num >= 1000000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Quattuor-Decillion");
      } else if(num >= 1000000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Tre-Decillion");
      } else if(num >= 1000000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Duo-Decillion");
      } else if(num >= 1000000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Un-Decillion");
      } else if(num >= 1000000000000000000000000000000000n) {
        num = num/1000000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Decillion");
      } else if(num >= 1000000000000000000000000000000n) {
        num = num/1000000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Nonillion");
      } else if(num >= 1000000000000000000000000000n) {
        num = num/1000000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Octillion");
      } else if(num >= 1000000000000000000000000n) {
        num = num/1000000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Septillion");
      } else if(num >= 1000000000000000000000n) {
        num = num/1000000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Sextillion");
      } else if(num >= 1000000000000000000n) {
        num = num/1000000000000000n
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Quintillion");
      } else if(num >= 1000000000000000n) {
        num = num/1000000000000n;
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Quadrillion");
      } else if(num >= 1000000000000n) {
        num = num/1000000000n;
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Trillion");
      } else if(num >= 1000000000n) {
        num = num/1000000n;
        num = Number(num)/1000;
        return ((num).toFixed(3)+" Billion");
      } else {
        return num.toLocaleString().replaceAll(",", ", ");
      }
    } else {
      return num.toLocaleString().replaceAll(",", ", ");
    };
  },
};


document.getElementById("loadGame").onclick = function() {
  if(localStorage.getItem("save1")) {
    this.parentElement.remove();
    game.loadGame();
    requestAnimationFrame(game.mpsCalc);
    game.clickButton.onclick = function() {
      game.totalClicks++;
      game.cash += game.clickMulti;
      //this.style.left = Math.random()*(game.buttonSliderWidth - document.getElementById("clickyButton").offsetWidth) + "px";
    }
    window.onkeydown = function(e) {
      if(e.keyCode == 32) {
        game.totalClicks++;
        game.cash += game.clickMulti;
      };
    }

    game.loadShop();
  } else {
    alert("No Save Game To Load...");
  };
};

document.getElementById("newGame").onclick = function() {
  if(confirm("Are you sure you wish to begin a new game? (Will Delete Old Save)")) {
    this.parentElement.remove();
    requestAnimationFrame(game.mpsCalc);
    game.clickButton.onclick = function() {
      game.totalClicks++;
      game.cash += game.clickMulti*game.clickMultiMulti;
      //this.style.left = Math.random()*(game.buttonSliderWidth - document.getElementById("clickyButton").offsetWidth) + "px";
    }
    window.onkeydown = function(e) {
      if(e.keyCode == 32) {
        game.totalClicks++;
        game.cash += game.clickMulti*game.clickMultiMulti;
      };
    }

    game.loadShop();
  };
}

function convertNumericStringsToBigInt(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && /^\d+$/.test(obj[key])) {
      obj[key] = BigInt(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertNumericStringsToBigInt(obj[key]); // Recursive call for nested objects
    }
  }
  return obj;
}

function purchaseUpgrade(rec, self, oneTime) {
  if(rec) {
  var io = game.shopUpgrades.recursive[self.idNUM];
    const cost = game.computeTotalCost(io, game.purchaseInterval);
    if(game.cash >= cost) {
      game.cash -= cost;
      io.num += game.purchaseInterval;
      if(io.effects.hasOwnProperty("moneyPerSec")) {
        game.moneyPerSecond += io.effects.moneyPerSec*game.purchaseInterval;
      }
      if(io.effects.hasOwnProperty("clickMulti")) {
        game.clickMulti += io.effects.clickMulti*game.purchaseInterval;
      }
      if(io.effects.hasOwnProperty("moneyPerSecondMulti")) {
        game.moneyPerSecondMulti += io.effects.moneyPerSecondMulti*game.purchaseInterval;
      }
      game.loadShop();
    /*if(io.scaleT == 0) {
          io.price = (io.initialPrice+((io.priceScale*(io.num+game.purchaseInterval))));
      } else if(io.scaleT == 1) {
          io.price = io.initialPrice+((io.priceScale)**(io.num+game.purchaseInterval+1n));
      }*/
   } 
  } else {
  var io = game.shopUpgrades.oneTime[self.idNUM];
    const cost = game.computeTotalCost(io, 1n);
    if(game.cash >= cost) {
      game.cash -= cost;
      io.num += 1n;
      if(io.effects.hasOwnProperty("moneyPerSec")) {
        game.moneyPerSecond += io.effects.moneyPerSec;
      }
      if(io.effects.hasOwnProperty("clickMulti")) {
        game.clickMulti += io.effects.clickMulti;
      }
      if(io.effects.hasOwnProperty("moneyPerSecondMulti")) {
        game.moneyPerSecondMulti += io.effects.moneyPerSecondMulti;
      }
      game.loadShop();
      if(oneTime && io.num >= io.max) {
        self.remove();
      };
    };
  } 
 };

game.simplifyNum.onchange = function() {
  if(this.checked) {
    game.numberAsOut = false;
    game.cashDisplay.style.wordSpacing = "0px";
    game.monPerSecDisplay.style.wordSpacing = "2px";
  } else {
    game.numberAsOut = true;
    game.cashDisplay.style.wordSpacing = "-8px";
    game.monPerSecDisplay.style.wordSpacing = "-5px";
  };
};



game.int1Butt.onclick = function() {
  game.purchaseIntervalInput.value = 1;
  game.purchaseInterval = 1n;
  game.loadShop();
}
game.int10Butt.onclick = function() {
  game.purchaseIntervalInput.value = 10;
  game.purchaseInterval = 10n;
  game.loadShop();
}
game.int100Butt.onclick = function() {
  game.purchaseIntervalInput.value = 100;
  game.purchaseInterval = 100n;
  game.loadShop();
}
game.purchaseIntervalInput.onchange = function() {
  if(this.value > game.maxInput) {
    this.value = 1000000;
  }
  game.purchaseInterval = BigInt(this.value);
  console.log("wasd");
  game.loadShop();
}