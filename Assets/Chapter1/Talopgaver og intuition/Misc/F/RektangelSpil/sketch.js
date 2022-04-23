function EdgePos(X,Y) {
  this.x = X; this.y=Y;
}

function plate(X,Y,W,H) {
  this.x=X;this.y=Y;
  this.wPs=[]; this.hPs=[];
  
  if(typeof W === "number") {
    this.w=W;this.h=H;
    this.wPs.push(W); this.hPs.push(H);
  }
  else {
    this.w=0;this.h=0;
    for(let i = 0; i < W.length; i++) {this.w += W[i]; this.wPs.push(W[i]);}
    for(let i = 0; i < H.length; i++) {this.h += H[i]; this.hPs.push(H[i]);}
  }
}

var plates = [];
var belowPlate = null;

var MAXPLATES = 7;

var pMoved = false;
var moveXOffset = 0;
var moveYOffset = 0;

var expressionString = "";

var HCutColor;
var VCutColor;


function setup() {
  createCanvas(500,500);

  plates.push(new plate(110,150,100,200));
  plates.push(new plate(300,300,100,100));

  updateExpressionString();
}

function draw() {
  
  background(255);

  strokeWeight(0);
  fill(230, 255, 253);
  rect(0,0,500,100);

  strokeWeight(0);
  fill(0); textSize(14);
  text(expressionString,25,42);
  text("Antal plader = " + plates.length.toString() + ", Max = " + MAXPLATES.toString(),25,70);
  
  if(!pMoved) {belowPlate = null;};
  for(let i = 0; i < plates.length; i++) {
    
    var cp = plates[i];

    fill(250, 242, 215);
    strokeWeight(4); stroke(0);
    rect(cp.x,cp.y,cp.w,cp.h);

    strokeWeight(1); stroke(150); 
    for(let j = 1; j < cp.w/25; j++) {line(cp.x + 25*j,cp.y + cp.h, cp.x + 25*j, cp.y);}
    for(let j = 1; j < cp.h/25; j++) {line(cp.x,cp.y + 25*j, cp.x + cp.w, cp.y + 25*j);}   
  
    textSize(14);strokeWeight(0);fill(0);
    text(cp.w/25,cp.x+0.5*cp.w - 5,cp.y-5); text(cp.h/25,cp.x-15,cp.y+0.5*cp.h);
    
    strokeWeight(3);
    var tmpW = 0; var tmpH = 0;
    for(let j = 0; j < cp.wPs.length - 1; j++) {
      tmpW += cp.wPs[j];
      line(cp.x + tmpW,cp.y,cp.x + tmpW,cp.y + cp.h);
    }
    for(let j = 0; j < cp.hPs.length - 1; j++) {
      tmpH += cp.hPs[j];
      line(cp.x,cp.y + tmpH,cp.x+cp.w,cp.y + tmpH);
    }
    
    if(mouseX > cp.x && mouseX < cp.x + cp.w && mouseY > cp.y && mouseY < cp.y + cp.h) {
      if(!pMoved) {belowPlate = cp;}
    }
  }


  
  
  if(belowPlate != null) {
   
    var HOrVCut = 0;
    HCutColor = color(183, 232, 212);
    VCutColor = color(183, 232, 212);
    
    var HQout = (mouseX - belowPlate.x) / 25;
    var WQout = (mouseY - belowPlate.y) / 25;
    
    if     (modDif(mouseX - belowPlate.x,25) < 5 && HQout > 0 && HQout < belowPlate.w/25) {HOrVCut = 1; HCutColor = color(46, 242, 17);}
    else if(modDif(mouseY - belowPlate.y,25) < 5 && WQout > 0 && WQout < belowPlate.h/25) {HOrVCut = 2; VCutColor = color(46, 242, 17);}                     
    
    strokeWeight((HOrVCut==1) ? 2 : 1);
    stroke(HCutColor); for(let i = 1; i < belowPlate.w/25; i++) {line(belowPlate.x + 25*i,belowPlate.y + belowPlate.h, belowPlate.x + 25*i, belowPlate.y);}
    strokeWeight((HOrVCut==2) ? 2 : 1);
    stroke(VCutColor); for(let i = 1; i < belowPlate.h/25; i++) {line(belowPlate.x,belowPlate.y + 25*i, belowPlate.x + belowPlate.w, belowPlate.y + 25*i);}   
    stroke(0); 
    
    if(clickedMouse) {
      if(plates.length != MAXPLATES) {
        if(HOrVCut==1) {
          var newWidth = Math.round((mouseX - belowPlate.x) / 25)*25;
          plates.push(new plate(belowPlate.x,belowPlate.y,newWidth,belowPlate.h));
          plates.push(new plate(belowPlate.x+newWidth,belowPlate.y,belowPlate.w - newWidth, belowPlate.h));
          removeItemByValue(belowPlate,plates);
          updateExpressionString();
        }
        else if(HOrVCut==2) {
          var newHeight = Math.round((mouseY - belowPlate.y) / 25)*25;
          plates.push(new plate(belowPlate.x,belowPlate.y,belowPlate.w,newHeight));
          plates.push(new plate(belowPlate.x,belowPlate.y+newHeight,belowPlate.w,belowPlate.h-newHeight));
          removeItemByValue(belowPlate,plates);
          updateExpressionString();
        }
      }
    }
    
    else if(releasedMouse && pMoved) {
      pMoved = false;
      var offset;
      
      do {
 
        offset = null;
        var i = 0; var chosenPlate = 0;
        while (i < plates.length) {
          if (plates[i] != belowPlate) {
            offset = getCloseVertexOffset(belowPlate,plates[i]);
            if(offset != null) {chosenPlate = i; i = plates.length;}
          }
          i++;
        }
        
        if(offset != null) {
          
          belowPlate.x -= offset.x; belowPlate.y -= offset.y;
          var wParts = [];
          var hParts = [];
          
          if(belowPlate.w == plates[chosenPlate].w) {
            
            if(isClose(belowPlate.x,belowPlate.y + belowPlate.h,plates[chosenPlate].x,plates[chosenPlate].y)) {
              wParts.push(belowPlate.w);
              hParts.push(belowPlate.h); hParts.push(plates[chosenPlate].h);
              combinePlates(wParts,hParts,chosenPlate);
            }
            else if (isClose(belowPlate.x,belowPlate.y,plates[chosenPlate].x,plates[chosenPlate].y + plates[chosenPlate].h)) {
              wParts.push(belowPlate.w);
              hParts.push(plates[chosenPlate].h); hParts.push(belowPlate.h); 
              combinePlates(wParts,hParts,chosenPlate);
            }
            
          } 
          if (wParts.length == 0 && belowPlate.h == plates[chosenPlate].h) {
          
            if(wParts.length == 0) {
              if(isClose(belowPlate.x + belowPlate.w, belowPlate.y,plates[chosenPlate].x, plates[chosenPlate].y)) {       
                wParts.push(plates[chosenPlate].w); wParts.push(belowPlate.w); 
                hParts.push(belowPlate.h); 
                combinePlates(wParts,hParts,chosenPlate);
              }
              else if (isClose(belowPlate.x, belowPlate.y,plates[chosenPlate].x + plates[chosenPlate].w, plates[chosenPlate].y)) {
                wParts.push(belowPlate.w); wParts.push(plates[chosenPlate].w);
                hParts.push(belowPlate.h); 
                combinePlates(wParts,hParts,chosenPlate);
              }
            }

          }     
          
          if(wParts.length == 0) {offset=null;}
      
        }
         
      } while (offset != null);

    }
    
    if(pressedMouse) {moveXOffset = belowPlate.x - mouseX; moveYOffset = belowPlate.y - mouseY;}
    if(holdMouse) {
      belowPlate.x = mouseX + moveXOffset; belowPlate.y = mouseY + moveYOffset;
      if(belowPlate.y < 100) {belowPlate.y = 100;}
    }
    if(holdMouseLong) {
      pMoved = true;
      belowPlate.x = mouseX + moveXOffset; belowPlate.y = mouseY + moveYOffset;
      if(belowPlate.y < 100) {belowPlate.y = 100;}
    }
    
  }
  
  
  for(let i = 0; i < plates.length; i++) {
    
    var cp = plates[i];
    
    strokeWeight(1);
    var tmpW = 0; var tmpH = 0;
    for(let j = 0; j < cp.wPs.length - 1; j++) {
      tmpW += cp.wPs[j];
      line(cp.x + tmpW,cp.y,cp.x + tmpW,cp.y + cp.h);
    }
    for(let j = 0; j < cp.hPs.length - 1; j++) {
      tmpH += cp.hPs[j];
      line(cp.x,cp.y + tmpH,cp.x+cp.w,cp.y + tmpH);
    }
    
  }
  
  
  InputUpdate();

}



var combinePlates = function(wPs,hPs,chosenPlate) {
    
    var currentChosenPlate = plates[chosenPlate];
    var currentBelowPlate = belowPlate;
    plates.splice(chosenPlate,1); removeItemByValue(belowPlate,plates);
  
    var newPlate = new plate(Math.min(currentBelowPlate.x,currentChosenPlate.x),
                             Math.min(currentBelowPlate.y,currentChosenPlate.y),
                             wPs,
                             hPs);
    plates.push(newPlate);
    
    belowPlate = newPlate;
    updateExpressionString();  
}

var removeItemByValue = function(valToRemove,arrayToRemoveFrom) {
  for(let i = 0; i < arrayToRemoveFrom.length; i++) {
    if(arrayToRemoveFrom[i]==valToRemove) {arrayToRemoveFrom.splice(i,1); return null;}
  }
}


var updateExpressionString = function() {
  expressionString = "";
 
  for(let i = 0; i < plates.length; i++) {
    
    var cp = plates[i];
    
    var wStr = ""; //Handle width number
    for(let j = 0; j < cp.wPs.length; j++) {
      wStr += Math.round(cp.wPs[j]/25).toString(); 
      if(j < cp.wPs.length - 1) {wStr += " + ";}
    }
    if(cp.wPs.length!=1) {expressionString += "(" + wStr + ") * ";}
    else {expressionString += wStr + " * ";}
    
    var hStr = ""; //Handle height number
    for(let j = 0; j < cp.hPs.length; j++) {
      hStr += Math.round(cp.hPs[j]/25).toString(); 
      if(j < cp.hPs.length - 1) {hStr += " + ";}
    }
    if(cp.hPs.length!=1) {expressionString += "(" + hStr + ")";}
    else {expressionString += hStr;}
    
    if(i < plates.length - 1) {expressionString += " + ";}
  }
 
}

var getCloseVertexOffset = function(plate1,plate2) {

  var distx1 = plate1.x - plate2.x; 
  var distx2 = plate1.x - plate2.x - plate2.w;
  var distx3 = plate1.x + plate1.w - plate2.x; 
  var distx4 = plate1.x + plate1.w - plate2.x - plate2.w; 
  
  var disty1 = plate1.y - plate2.y; 
  var disty2 = plate1.y - plate2.y - plate2.h;
  var disty3 = plate1.y + plate1.h - plate2.y; 
  var disty4 = plate1.y + plate1.h - plate2.y - plate2.h; 
  
  if(Math.abs(distx1) + Math.abs(disty1) < 20) {
    return new EdgePos(distx1,disty1);
    //return new point(0,0);
  }
  if(Math.abs(distx2) + Math.abs(disty1) < 20) {
    return new EdgePos(distx2,disty1);
    //return new point(0,0);
  }
  if(Math.abs(distx3) + Math.abs(disty1) < 20) {
    return new EdgePos(distx3,disty1);
    //return new point(0,0);
  }
  if(Math.abs(distx4) + Math.abs(disty1) < 20) {
    return new EdgePos(distx4,disty1);
    //return new point(0,0);
  }
  
  if(Math.abs(distx1) + Math.abs(disty2) < 20) {
    return new EdgePos(distx1,disty2);
    //return new point(0,0);
  }
  if(Math.abs(distx2) + Math.abs(disty2) < 20) {
    return new EdgePos(distx2,disty2);
    //return new point(0,0);
  }
  if(Math.abs(distx3) + Math.abs(disty2) < 20) {
    return new EdgePos(distx3,disty2);
    //return new point(0,0);
  }
  if(Math.abs(distx4) + Math.abs(disty2) < 20) {
    return new EdgePos(distx4,disty2);
    //return new point(0,0);
  }
  
  if(Math.abs(distx1) + Math.abs(disty3) < 20) {
    return new EdgePos(distx1,disty3);
    //return new point(0,0);
  }
  if(Math.abs(distx2) + Math.abs(disty3) < 20) {
    return new EdgePos(distx2,disty3);
    //return new point(0,0);
  }
  if(Math.abs(distx3) + Math.abs(disty3) < 20) {
    return new EdgePos(distx3,disty3);
    //return new point(0,0);
  }
  if(Math.abs(distx4) + Math.abs(disty3) < 20) {
    return new EdgePos(distx4,disty3);
    //return new point(0,0);
  }
  
  if(Math.abs(distx1) + Math.abs(disty4) < 20) {
    return new EdgePos(distx1,disty4);
    //return new point(0,0);
  }
  if(Math.abs(distx2) + Math.abs(disty4) < 20) {
    return new EdgePos(distx2,disty4);
    //return new point(0,0);
  }
  if(Math.abs(distx3) + Math.abs(disty4) < 20) {
    return new EdgePos(distx3,disty4);
    //return new point(0,0);
  }
  if(Math.abs(distx4) + Math.abs(disty4) < 20) {
    return new EdgePos(distx4,disty4);
    //return new point(0,0);
  }
  
  return null;
 
}

var isClose = function(p1x,p1y,p2x,p2y) {
  return Math.abs(p2x-p1x) + Math.abs(p2y-p1y) < 20;
}






//Keyboard:
//==========================================
var InputUpdate = function() {

  //For making release in mouse input false again
  if(pressedMouse){pressedMouse=false; holdMouse=true;}
  if(holdMouse){amountOfHeldDownFrames++;} 
  if(holdMouseLong){holdMouseLong = false;}
  if(amountOfHeldDownFrames == 19) {holdMouseLong = true;}
  if(releasedMouse){releasedMouse=false;}
  if(doubleClickedMouse) {doubleClickedMouse=false;}
  
  if(clickedMouse){
    clickedMouse=false;
    
    if (amountOfFramesSinceLastClick > 0 && amountOfFramesSinceLastClick < 16) {doubleClickedMouse = true;}
    amountOfFramesSinceLastClick = 1;
  }
  
  if(amountOfFramesSinceLastClick > 0 && amountOfFramesSinceLastClick < 16) {
    amountOfFramesSinceLastClick++;
    if (amountOfFramesSinceLastClick == 16) {amountOfFramesSinceLastClick = 0;}
  } 
   
}
//==========================================


//MOUSE 
//=======================================
var pressedMouse = false;
var holdMouse = false;
var holdMouseLong = false;
var releasedMouse = false;
var clickedMouse = false; //reffering to fast click
var doubleClickedMouse = false;

var amountOfHeldDownFrames = 0;
var amountOfFramesSinceLastClick = 0;

window.onmousedown = function() {
  amountOfHeldDownFrames=0;
  pressedMouse = true; 
}

window.onmouseup = function() {
  holdMouse = false; holdMouseLong = false;
  releasedMouse = true;
  if (amountOfHeldDownFrames < 20) {
    clickedMouse=true;
  }
}
//==========================

var modDif = function(x,y) {
  var mod=x%y;
  var mid = floor(y/2);
  return (mod < mid) ? mod : 2*mid - mod;
}
