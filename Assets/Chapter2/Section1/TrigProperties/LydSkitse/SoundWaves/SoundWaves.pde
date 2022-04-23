//PUBLIC variables regarding position and logic:
int m = 60; int n = 4; //amount of columns and layers respectively

float startX = 190; float startY = 100;

float averageXChange = 20; //Was previously 20, and Am was 50
float averageYChange = 30;
float averagePhaseChange = 0.2;

float Sp = 0.048;  //Speed. Was 0.035 before
float Am = 50; //Amplitude

float startJitter = 5; // specifies the maximum range of random offset to the start positions
float dynamicJitter = 1; // specifies the maximum range of random offset to the dynamic positions on update. 

//PUBLIC variables regarding visuals:
float particleSize = 10;

float startHue = 0;
float averageHueChange = 0.3;
float startValue = 100;
float startSaturation = 100; 

float speakerBaseWidth = 20;
float speakerPistonWidth=10;
float smallestPistonLength = 10;
float speakerPusherWidth=7;

//PRIVATE variables:
float[][] sPos = new float[n][]; //this list is *not* changed in update. 
float[][] Phases = new float[n][]; //this list is changed in update. 
float[][] Hues = new float[n][]; //this list is *not* changed in update. 

float speakerPhase = 0.19;

PImage EarImage;
PImage GraphImage;

void setup() {
  
  //Techinical details
  scale(1.2);
  size(1920,1080);  
  colorMode(HSB,6.2831, 100, 100);
  
  //Load images into variables:
  EarImage = loadImage("EarDrawing.png");
  GraphImage = loadImage("Graph.png");
  
  //Set text style:
  textSize(22);
  
  //Fill in start-values to lists:
  for (int i = 0; i < n; i++) {
    
    sPos[i] = new float[m];
    Phases[i] = new float[m];
    Hues[i] = new float[m]; 
    
    for(int j = 0; j < m; j++) {
       
      //Start positions:
      sPos[i][j] = startX + j*averageXChange + random(-startJitter,startJitter);
      
      //Phases:
      Phases[i][j] = -j*averagePhaseChange;
      
      //Colours:
      Hues[i][j] = (startHue + j*averageHueChange) % 6.2831;
      
    }
  }
  
}

//

float speedTester1 = startX+10;
float speedTester2 = startX+610;

void draw() {
  
  scale(1.25);
  background(3.055, 9.42, 100);
  
  //Wavelength visualizer:
  speedTester1 += 4.615;
  speedTester2 += 4.615;
  
  if(speedTester1 > 1400) {
     speedTester1 = startX + 10; 
  }
  if(speedTester2 > 1400) {
     speedTester2 = startX + 10; 
  }
  
  stroke(0);
  strokeWeight(3);
  line(speedTester1, 250, speedTester2, 250);
  
  stroke(0,0,0,50);  
  strokeWeight(1.5);
  line(speedTester1, 250, speedTester1, 100);
  line(speedTester2, 250, speedTester2, 100);
  
  noStroke();
 
  fill(0,0,0);
  text("Bølgelængde", 0.5*(speedTester1+speedTester2)-70, 280);
  
  //Draw ear:
  float sI = 3*0.5*(1+sin(speakerPhase)); //shakeIntensity
  image(EarImage, startX + averageXChange*m + Am - 90 + random(-sI,sI), startY - 55 + random(-sI,sI));
  
  //Draw text:
  fill(0,0,0);
  text("Lydkilde", startX-135, startY + 135);
  text("(Energikilde)", startX-155, startY + 165);
  text("Øre", startX + averageXChange*m + Am - 49, startY + 192);
  
  //Draw graph:
  image(GraphImage, startX + averageXChange*m + Am + 80, startY - 65);
  fill(2.19, 86, 76);
  circle(startX + averageXChange*m + Am + 109, startY + 79 - 110*sin(speakerPhase), 15);
  
  int tempX = 0;
  stroke(2.19, 86, 85);
  
  for(int i = 0; i < 284; i++) {
    tempX = (int)(startX + averageXChange*m + Am + 109 + i);
    line(tempX, startY + 79 - 110*sin(-speakerPhase + i*Sp + 3.1),
         tempX+1, startY + 79 - 110*sin(-speakerPhase + (i+1)*Sp + 3.1));
  }
  noStroke();
  
  //Draw speaker:
  speakerPhase = (speakerPhase + Sp)%6.2831;

     //Pusher:
  fill(0,0,0);
  rect(startX + sin(speakerPhase)*Am - speakerPusherWidth - 10, 
       startY-10, 
       speakerPusherWidth, 
       n*averageYChange-10);
  
     //Arm:
  fill(0,0,35);
  rect(startX - Am - speakerPusherWidth - 10 - smallestPistonLength, 
       startY-15 + 0.5*n*averageYChange - speakerPistonWidth,  
       smallestPistonLength+Am*(1+sin(speakerPhase)),
       speakerPistonWidth);
       
    //Base:
  fill(0,0,0);
  rect(startX - Am - speakerPusherWidth - 10 - smallestPistonLength - speakerBaseWidth, 
       startY - 15, 
       speakerBaseWidth,
       n*averageYChange);
     


  //Draw particles:
  for (int i = 0; i < n; i++) {
    
    for(int j = 0; j < m; j++) {
         
      //Update the phase
      Phases[i][j] = (Phases[i][j] + Sp)%6.2831; 
      
      //Calculate the position
      float xPos = sPos[i][j] + Am*sin(Phases[i][j]) + random(-dynamicJitter, dynamicJitter);
      float yPos = startY + averageYChange*i;
      
      //Draw the particle:
      fill(Hues[i][j], startSaturation, startValue);
      circle(xPos, yPos, particleSize);
    }
    
  }
  
}
