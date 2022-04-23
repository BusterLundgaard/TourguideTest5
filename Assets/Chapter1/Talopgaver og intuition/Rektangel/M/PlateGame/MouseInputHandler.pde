//Keyboard:
//==========================================
void InputUpdate() {

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
boolean pressedMouse;
boolean holdMouse;
boolean holdMouseLong;
boolean releasedMouse;
boolean clickedMouse; //reffering to fast click
boolean doubleClickedMouse;

int amountOfHeldDownFrames = 0;
int amountOfFramesSinceLastClick=0;

void mousePressed() {//On first frame of clicking only
  amountOfHeldDownFrames=0;
  pressedMouse = true; 
}

void mouseReleased() { //On release only
  holdMouse = false; holdMouseLong = false;
  releasedMouse = true;
  if (amountOfHeldDownFrames < 20) {
    clickedMouse=true;
  }
}
//==========================


Boolean Contains(IntList SomeList, int theKey) {
  for (int i = 0; i < SomeList.size(); i++) {
    if (SomeList.get(i) == theKey) {
      return true;
    }
  }
  return false;
}

int modDif(int x, int y) {
  int mod=x%y;
  int mid = floor(y/2);
  return (mod < mid) ? mod : 2*mid - mod;
}

int Min(int a, int b) {return (a < b) ? a : b;}
