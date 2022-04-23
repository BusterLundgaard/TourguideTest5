//ATTACHING THINGS FROM TOP TO BOTTOM CRASHES THE GAME RIGHT NOW!

class Point {
  public Point(int X, int Y) {x=X;y=Y;}
  int x; int y;
}

class Plate {
  
  public Plate(int X, int Y, int W, int H) {
    x=X;y=Y;w=W;h=H;
    wPs.append(W); hPs.append(H);
  }
  public Plate(int X, int Y, IntList WParts, IntList HParts) {
    x=X;y=Y; w=0;h=0;
    for(int i = 0; i < WParts.size(); i++) {w += WParts.get(i); wPs.append(WParts.get(i));}
    for(int i = 0; i < HParts.size(); i++) {h += HParts.get(i); hPs.append(HParts.get(i));}
  }
  
  int x;
  int y;
  int w;
  int h;
  color col = #FAF2D7;
  
  IntList wPs = new IntList();
  IntList hPs = new IntList();
  
}

ArrayList<Plate> plates = new ArrayList<Plate>();
Plate belowPlate = null;

int MAXPLATES = 7;

boolean pMoved = false;
int moveXOffset = 0;
int moveYOffset = 0;

String expressionString = "";

color HCutColor;
color VCutColor;

void setup() {
  size(500,500);
  
  plates.add(new Plate(110,150,100,200));;
  plates.add(new Plate(300,300,100,100));
  
  updateExpressionString();
}

void draw() {
  background(255);

  strokeWeight(0);
  fill(#E6FFFD);
  rect(0,0,500,100);

  strokeWeight(4);
  fill(0); textSize(14);
  text(expressionString,25,42);
  text("Antal plader = " + str(plates.size()) + ", Max = " + str(MAXPLATES),25,70);
  
  if(!pMoved) {belowPlate = null;};
  for(int i = 0; i < plates.size(); i++) {
    
    Plate cp = plates.get(i);

    fill(cp.col);
    strokeWeight(4); stroke(0);
    rect(cp.x,cp.y,cp.w,cp.h);

    strokeWeight(1); stroke(150); 
    for(int j = 1; j < cp.w/25; j++) {line(cp.x + 25*j,cp.y + cp.h, cp.x + 25*j, cp.y);}
    for(int j = 1; j < cp.h/25; j++) {line(cp.x,cp.y + 25*j, cp.x + cp.w, cp.y + 25*j);}   
  
    textSize(14);strokeWeight(4);fill(0);
    text(cp.w/25,cp.x+0.5*cp.w - 5,cp.y-5); text(cp.h/25,cp.x-15,cp.y+0.5*cp.h);
    
    strokeWeight(3);
    int tmpW = 0; int tmpH = 0;
    for(int j = 0; j < cp.wPs.size() - 1; j++) {
      tmpW += cp.wPs.get(j);
      line(cp.x + tmpW,cp.y,cp.x + tmpW,cp.y + cp.h);
    }
    for(int j = 0; j < cp.hPs.size() - 1; j++) {
      tmpH += cp.hPs.get(j);
      line(cp.x,cp.y + tmpH,cp.x+cp.w,cp.y + tmpH);
    }
    
    if(mouseX > cp.x && mouseX < cp.x + cp.w && mouseY > cp.y && mouseY < cp.y + cp.h) {
      if(!pMoved) {belowPlate = cp;}
    }
  }
  
  
  if(belowPlate != null) {
   
    int HOrVCut = 0;
    HCutColor = color(#B7E8D4);
    VCutColor = color(#B7E8D4);
    
    int HQout = (mouseX - belowPlate.x) / 25;
    int WQout = (mouseY - belowPlate.y) / 25;
    
    if     (modDif(mouseX - belowPlate.x,25) < 5 && HQout > 0 && HQout < belowPlate.w/25) {HOrVCut = 1; HCutColor = color(#2EF211);}
    else if(modDif(mouseY - belowPlate.y,25) < 5 && WQout > 0 && WQout < belowPlate.h/25) {HOrVCut = 2; VCutColor = color(#2EF211);}                     
    
    strokeWeight((HOrVCut==1) ? 2 : 1);
    stroke(HCutColor); for(int i = 1; i < belowPlate.w/25; i++) {line(belowPlate.x + 25*i,belowPlate.y + belowPlate.h, belowPlate.x + 25*i, belowPlate.y);}
    strokeWeight((HOrVCut==2) ? 2 : 1);
    stroke(VCutColor); for(int i = 1; i < belowPlate.h/25; i++) {line(belowPlate.x,belowPlate.y + 25*i, belowPlate.x + belowPlate.w, belowPlate.y + 25*i);}   
    stroke(0); 
    
    if(clickedMouse) {
      if(plates.size() != MAXPLATES) {
        if(HOrVCut==1) {
          int newWidth = ((mouseX - belowPlate.x) / 25)*25;
          plates.add(new Plate(belowPlate.x,belowPlate.y,newWidth,belowPlate.h));
          plates.add(new Plate(belowPlate.x+newWidth,belowPlate.y,belowPlate.w - newWidth, belowPlate.h));
          plates.remove(belowPlate);
          updateExpressionString();
        }
        else if(HOrVCut==2) {
          int newHeight = ((mouseY - belowPlate.y) / 25)*25;
          plates.add(new Plate(belowPlate.x,belowPlate.y,belowPlate.w,newHeight));
          plates.add(new Plate(belowPlate.x,belowPlate.y+newHeight,belowPlate.w,belowPlate.h-newHeight));
          plates.remove(belowPlate);
          updateExpressionString();
        }
      }
    }
    
    else if(releasedMouse && pMoved) {
      pMoved = false;
      Point offset;
      
      do {
 
        offset = null;
        int i = 0; int chosenPlate = 0;
        while (i < plates.size()) {
          if (plates.get(i) != belowPlate) {
            offset = getCloseVertexOffset(belowPlate,plates.get(i));
            if(offset != null) {chosenPlate = i; i = plates.size();}
          }
          i++;
        }
        
        if(offset != null) {
          
          belowPlate.x -= offset.x; belowPlate.y -= offset.y;
          IntList wParts = new IntList();
          IntList hParts = new IntList();
          
          if(belowPlate.w == plates.get(chosenPlate).w) {
            
            if(isClose(belowPlate.x,belowPlate.y + belowPlate.h,plates.get(chosenPlate).x,plates.get(chosenPlate).y)) {
              wParts.append(belowPlate.w);
              hParts.append(belowPlate.h); hParts.append(plates.get(chosenPlate).h);
              combinePlates(wParts,hParts,chosenPlate);
            }
            else if (isClose(belowPlate.x,belowPlate.y,plates.get(chosenPlate).x,plates.get(chosenPlate).y + plates.get(chosenPlate).h)) {
              wParts.append(belowPlate.w);
              hParts.append(plates.get(chosenPlate).h); hParts.append(belowPlate.h); 
              combinePlates(wParts,hParts,chosenPlate);
            }
            
          } 
          if (wParts.size() == 0 && belowPlate.h == plates.get(chosenPlate).h) {
          
            if(wParts.size() == 0) {
              if(isClose(belowPlate.x + belowPlate.w, belowPlate.y,plates.get(chosenPlate).x, plates.get(chosenPlate).y)) {       
                wParts.append(plates.get(chosenPlate).w); wParts.append(belowPlate.w); 
                hParts.append(belowPlate.h); 
                combinePlates(wParts,hParts,chosenPlate);
              }
              else if (isClose(belowPlate.x, belowPlate.y,plates.get(chosenPlate).x + plates.get(chosenPlate).w, plates.get(chosenPlate).y)) {
                wParts.append(belowPlate.w); wParts.append(plates.get(chosenPlate).w);
                hParts.append(belowPlate.h); 
                combinePlates(wParts,hParts,chosenPlate);
              }
            }

          }     
          
          if(wParts.size() == 0) {offset=null;}
      
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
  
  
  for(int i = 0; i < plates.size(); i++) {
    
    Plate cp = plates.get(i);
    
    strokeWeight(1);
    int tmpW = 0; int tmpH = 0;
    for(int j = 0; j < cp.wPs.size() - 1; j++) {
      tmpW += cp.wPs.get(j);
      line(cp.x + tmpW,cp.y,cp.x + tmpW,cp.y + cp.h);
    }
    for(int j = 0; j < cp.hPs.size() - 1; j++) {
      tmpH += cp.hPs.get(j);
      line(cp.x,cp.y + tmpH,cp.x+cp.w,cp.y + tmpH);
    }
    
  }
  
  
  InputUpdate();
  
}

void combinePlates(IntList wPs, IntList hPs, int chosenPlate) {
   Plate newPlate = new Plate(Min(belowPlate.x,plates.get(chosenPlate).x),
                              Min(belowPlate.y,plates.get(chosenPlate).y),
                              wPs,
                              hPs);
   plates.add(newPlate);
   plates.remove(chosenPlate); plates.remove(belowPlate);
   belowPlate = newPlate;
   updateExpressionString();  
}

void updateExpressionString() {
  expressionString = "";
  
  for(int i = 0; i < plates.size(); i++) {
    
    Plate cp = plates.get(i);
    
    String wStr = ""; //Handle width number
    for(int j = 0; j < cp.wPs.size(); j++) {
      wStr += str(cp.wPs.get(j)/25); 
      if(j != cp.wPs.size() - 1) {wStr += " + ";}
    }
    if(cp.wPs.size()!=1) {expressionString += "(" + wStr + ") * ";}
    else {expressionString += wStr + " * ";}
    
    String hStr = ""; //Handle height number
    for(int j = 0; j < cp.hPs.size(); j++) {
      hStr += str(cp.hPs.get(j)/25); 
      if(j != cp.hPs.size() - 1) {hStr += " + ";}
    }
    if(cp.hPs.size()!=1) {expressionString += "(" + hStr + ")";}
    else {expressionString += hStr;}
    
    if(i != plates.size() - 1) {expressionString += " + ";}
  }
  
}

Point getCloseVertexOffset(Plate plate1, Plate plate2) {

  int distx1 = plate1.x - plate2.x; 
  int distx2 = plate1.x - plate2.x - plate2.w;
  int distx3 = plate1.x + plate1.w - plate2.x; 
  int distx4 = plate1.x + plate1.w - plate2.x - plate2.w; 
  
  int disty1 = plate1.y - plate2.y; 
  int disty2 = plate1.y - plate2.y - plate2.h;
  int disty3 = plate1.y + plate1.h - plate2.y; 
  int disty4 = plate1.y + plate1.h - plate2.y - plate2.h; 
  
  if(abs(distx1) + abs(disty1) < 20) {return new Point(distx1,disty1);}
  if(abs(distx2) + abs(disty1) < 20) {return new Point(distx2,disty1);}
  if(abs(distx3) + abs(disty1) < 20) {return new Point(distx3,disty1);}
  if(abs(distx4) + abs(disty1) < 20) {return new Point(distx4,disty1);}
  
  if(abs(distx1) + abs(disty2) < 20) {return new Point(distx1,disty2);}
  if(abs(distx2) + abs(disty2) < 20) {return new Point(distx2,disty2);}
  if(abs(distx3) + abs(disty2) < 20) {return new Point(distx3,disty2);}
  if(abs(distx4) + abs(disty2) < 20) {return new Point(distx4,disty2);}
  
  if(abs(distx1) + abs(disty3) < 20) {return new Point(distx1,disty3);}
  if(abs(distx2) + abs(disty3) < 20) {return new Point(distx2,disty3);}
  if(abs(distx3) + abs(disty3) < 20) {return new Point(distx3,disty3);}
  if(abs(distx4) + abs(disty3) < 20) {return new Point(distx4,disty3);}
  
  if(abs(distx1) + abs(disty4) < 20) {return new Point(distx1,disty4);}
  if(abs(distx2) + abs(disty4) < 20) {return new Point(distx2,disty4);}
  if(abs(distx3) + abs(disty4) < 20) {return new Point(distx3,disty4);}
  if(abs(distx4) + abs(disty4) < 20) {return new Point(distx4,disty4);}
  
  return null;
  
}

boolean isClose(int p1x, int p1y, int p2x, int p2y) {
  return abs(p2x-p1x) + abs(p2y-p1y) < 20;
}
