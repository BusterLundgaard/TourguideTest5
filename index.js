window.MathJax = {
    startup: {
        typeset: false
    },
    tex: {
        inlineMath: [
            ['_(', '_)'],
        ],
        displayMath: [
            ['_($', '_)']
        ],
        packages: {'[+]': ['ams']}
    }
};

let frameLength; let lastTime; 
let getFrameRate = (currentTime)=>{
    frameLength = 0;
    if(lastTime != null) {
        frameLength = (currentTime-lastTime)/1000;
    } 
    lastTime=currentTime;
    requestAnimationFrame(getFrameRate);
}
getFrameRate(0);

let slowInternet = null; 

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

let openBrowser = (chap, sec, page, sepTab)=>{
    if(sepTab == null){window.open("Browser11.html?" + chap + sec + page, "_self");}
    else{window.open("Browser11.html?" + chap + sec + page, "_blank");}
}

let startLogoScreen = async function(){

    await sleep(40);

    logoAnimation();
    gradAnim();
    showTaglineAnim();

    await sleep(40);

    document.getElementById("piLogo").style.animationName = "piAnim";
    document.getElementById("piLogoM").style.animationName = "piMAnim";
    document.getElementById("atematik").style.animationName = "atematikAnim";
    document.getElementById("underlineLogo").style.animationName = "underlineAnim";
    document.getElementById("TLogo").style.animationName = "TAnim";
    document.getElementById("globe").style.animationName = "globeAnim";
    document.getElementById("t0Logo").style.animationName = "t0Anim";
    document.getElementById("t1Logo").style.animationName = "t1Anim";
    document.getElementById("t2Logo").style.animationName = "t2Anim";
    document.getElementById("t3Logo").style.animationName = "t3Anim";
    document.getElementById("t4Logo").style.animationName = "t4Anim";
    document.getElementById("t5Logo").style.animationName = "t5Anim";
    document.getElementById("t6Logo").style.animationName = "t6Anim";
}

let logoAnimation = async function(){

    let globe = document.getElementById("globe");
    let globePics = [];
    for(let i=0; i < 13; i++) {
        globePics.push(document.createElement("img"));
        globePics[i].style.width="100%";
        globePics[i].style.position="absolute";
        globePics[i].style.bottom="100%";
        globePics[i].src="Assets/Forside/Logo/o" + i.toString() + ".svg"
    }

    await sleep(2980);

    let spinDir = 1;
    let spinSpeed = 5.25;
    let spinSpeedDecrease = 0.085;
    let spinEndSpeed = 1.1;
    let isSmoothingOut = false;
    let picNum = 0;
    while(true) {

        let prevPic = globe.firstChild;
        if(prevPic != null) {globe.removeChild(prevPic);}

        globe.appendChild(globePics[Math.floor(picNum)]);

        picNum+=spinSpeed*spinDir;

        if(picNum>=13){
            picNum=11-(picNum-13);
            spinDir = -1;
        }
        if(picNum<0){
            if(spinSpeed <= spinEndSpeed) {
                globe.appendChild(globePics[0]);
                break;
            }
            picNum = 1-picNum;
            spinDir = 1;
        }

        await sleep(32);
        if(isSmoothingOut) {
            spinSpeed-=0.1*(spinSpeed-1);
        }
        else if(spinSpeed <= spinEndSpeed) {
            spinSpeed==spinEndSpeed;
            isSmoothingOut=true;
        } 
        else{spinSpeed-=spinSpeedDecrease;}

    }


}

let gradAnimRunning = true;
let gradAnim = async function() {

    let grad = document.getElementById("grad");

    let changeColor = (col, toC, T) =>{
        let diffs = [toC[0]-col[0], toC[1]-col[1], toC[2]-col[2]];

        let inverseT = 1/T;
        let stepSize;
        let timer = 0;

        let step = ()=>{
            stepSize = frameLength*inverseT;
            timer += frameLength;

            col[0] += stepSize*diffs[0];
            col[1] += stepSize*diffs[1];
            col[2] += stepSize*diffs[2];

            if(timer < T){requestAnimationFrame(step);}
        }
        step();
    }
    let Cstr = (col)=>{
        return "hsl(" + col[0] + "," + col[1] + "%," + col[2] + "%)";
    }
    let setGrad = ()=>{
        grad.style.background = "linear-gradient(" + angle + "deg," + 
                    Cstr(edgeL) + "0%," +
                    Cstr(beamL) + LX.toString() + "%," +
                    Cstr(beam) + bX.toString() + "%," + 
                    Cstr(beamR) + RX.toString() + "%," +
                    Cstr(edgeR) + "100%)";
    }
    function easeInOutBack(x) {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }

    let beam = [229, 95, 97];
    let beamL = [231, 68, 11];
    let beamR = [231, 68, 11];
    let edgeL = [227, 89, 3];
    let edgeR = [227, 89, 3];
    let bX = 50; 
    let LX = 41.2; 
    let RX = 58.8; 
    let angle = 90;

    let T = 0;
    let changePositions = ()=>{

        T+=frameLength;
        let t1 = (T-1.1)/2;
        let t2 = (T-2.05)/2;

        if(T < 1.1){
            LX = 41.2 - 2.5*Math.sin(1.5*T+0.45);
            RX = 58.8 + 2.5*Math.sin(1.5*T+0.45);
            beamL[2] = 2+7*Math.sin(T+0.45);
            beamR[2] = 2+7*Math.sin(T+0.45);
            edgeL[2] = 0+3.5*Math.sin(T+0.45);
            edgeR[2] = 0+3.5*Math.sin(T+0.45);
        }
        else if(T < 2.05){
            bX = 50 - (t1 < 0.5 ? 4*t1*t1*t1 : 1 - Math.pow(-2*t1 + 2, 3) / 2)*38;

            LX = 39.02 - (t1 < 0.5 ? 4*t1*t1*t1 : 1 - Math.pow(-2*t1 + 2, 3) / 2)*40;
            RX = 58.8 + 2.5*Math.sin(1.5*T+0.45);
        }
        else if(T < 2.7) {
            bX = 50 - (t1 < 0.5 ? 4*t1*t1*t1 : 1 - Math.pow(-2*t1 + 2, 3) / 2)*38;

            LX = 23.27 - (1 - Math.pow(1 - t2, 3))*40;
            RX = 59.71 + (1 - Math.pow(1 - t2, 3))*55.29; 
        }
        else{
            bX = 12+20*Math.sin(T-2.7);
            angle -= 30*frameLength;
        }

        setGrad();
        if(gradAnimRunning){requestAnimationFrame(changePositions)};
    }

    changePositions();

    await sleep(1950);
    changeColor(edgeL, [192, 18, 100], 2.5);
    changeColor(edgeR, [199, 100, 72], 2.5);
    changeColor(beamL, [192, 18, 100], 0.5);
    changeColor(beam, [196, 29, 100], 0.5);
    changeColor(beamR, [199, 100, 72], 0.5);
}

let showTaglineAnim = async function() {

    let str = "En matematikbog til unge, fra unge.";

    let bar = document.createElement("div");
    bar.style.display="inline-block";

    bar.style.position="relative";
    bar.style.height="1em";
    bar.style.top="0.2em";

    bar.style.width="3px";
    bar.style.backgroundColor="black";

    let tagline = document.getElementById("tagline");

    await sleep(3850);

    tagline.appendChild(bar);

    //Flash bar a bit in the start
    for(let i = 0; i < 4; i++) { 
        await sleep(200);
        bar.style.opacity=0;
        await sleep(200);
        bar.style.opacity=1;
    }

    bar.style.marginLeft="2px";

    //Actually write it:
    let accumStr = "";
    for(let i =0; i < str.length; i++) {
        accumStr += str[i];
        tagline.innerHTML = accumStr;
        tagline.appendChild(bar);

        if(str[i]==","){await sleep(350);}
        else{await sleep(25+ 65*Math.random()); }

    }

    //Flash bar a bit 
    for(let i = 0; i < 4; i++) { 
        await sleep(200);
        bar.style.opacity=0;
        await sleep(200);
        bar.style.opacity=1;
    }

    //Go back and make parentheses:
    let afterBar = document.createElement("span");

    tagline.innerHTML="En matematikbog til unge, fra ung";
    tagline.appendChild(bar);
    tagline.appendChild(afterBar); afterBar.innerHTML="e";
    await sleep(10);

    //Flash bar a tiny bit 
    for(let i = 0; i < 2; i++) { 
        await sleep(200);
        bar.style.opacity=0;
        await sleep(200);
        bar.style.opacity=1;
    }

    tagline.innerHTML="En matematikbog til unge, fra ung(";
    tagline.appendChild(bar);
    tagline.appendChild(afterBar); afterBar.innerHTML="e";
    await sleep(150);

    tagline.innerHTML="En matematikbog til unge, fra ung(e";
    tagline.appendChild(bar);
    await sleep(90);

    tagline.innerHTML="En matematikbog til unge, fra ung(e)";
    tagline.appendChild(bar);
    await sleep(90);

    //Flash bar a bit more
    for(let i = 0; i < 4; i++) { 
        await sleep(200);
        bar.style.opacity=0;
        await sleep(200);
        bar.style.opacity=1;
    }

    await sleep(200);

    bar.style.opacity=0;

    await sleep(1000);

    if(atLogo){
        document.getElementById("trailerVid").style.display="block";

        tagline.style.opacity=0;

        setTimeout(() => {
            tagline.style.display="none";
            document.getElementById("trailerVid").style.opacity="1";    
        }, 500);
    }
    

}


//SCROLLING
$('document').ready(()=>{
    if(window.location.search == ""){
        setTimeout(() => {window.scrollTo(0,0);}, 300);
    }
    setTimeout(() => {
        document.getElementById("TocResumeCover").style.display="none";
    }, 500);
});

let isTouchDevise = false;
let presentationMode = true;

var chaptersPrepared = false;
var TocPrepared = false;

let pScroll=0;

let scrollCounter = 0;
let atLogo = true;
let scrollDest;

let scrollStep = 0;

let scrollBeforeSearch = 0;

//Quitting logo screen
//Shows the fancy animation for quitting the logo screen, then calls quitLogoDesktop();        
let quitLogoAnim = function(){
    
    atLogo=false;
    let conBack = document.getElementById("contentBackground");
    conBack.style.display = "block";
    document.body.style.overflowY = "hidden";

    document.getElementById("toolbar").style.display="block";

    document.getElementById("grad").style.webkitFilter="blur(2px)";
    document.getElementById("logo").style.opacity=0;
    document.getElementById("tagline").style.opacity=0;
    document.getElementById("trailerVid").style.opacity=0;
    document.getElementById("quitLogo").style.opacity=0;

    if(document.cookie != ""){document.getElementById("startOffImg").src = "Assets/Forside/SecThumbnails/Final/" + document.cookie.substring(9, 11) + ".png";
    } else {document.getElementById("startOff").style.display="none";}

    let t=0; 
    let blurLevel = 0;
    let blurLevelIncrease = true;
    conBack.style.webkitFilter = "blur(2px)";

    scrollDest = window.innerHeight+3;

    let step = function(){

        t+=0.020;

        if(t > 0.16 && blurLevelIncrease && blurLevel==0) {conBack.style.webkitFilter = "blur(3px)"; blurLevel++; }
        if(t > 0.32 && blurLevelIncrease && blurLevel==1) {conBack.style.webkitFilter = "blur(4px)"; blurLevel++; 
            let introH1 = document.getElementById("introH1");
            introH1.style.opacity=1;
            introH1.style.marginLeft="-230px";
        }
        if(t > 0.48 && blurLevelIncrease && blurLevel==2) {conBack.style.webkitFilter = "blur(3px)"; blurLevel++; blurLevelIncrease=false; }
        if(t > 0.64 && !blurLevelIncrease && blurLevel==3) {conBack.style.webkitFilter = "blur(2px)"; blurLevel--; }
        if(t > 0.80 && !blurLevelIncrease && blurLevel==2) {conBack.style.webkitFilter = "blur(1px)";}
        
        window.scrollTo(0, (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2)*scrollDest);
        if(t < 1) {window.requestAnimationFrame(step);}
        else{
            quitLogoDesktop();
        }
    }
    step();
        
}

    //These two do mostly the same, but theres a few small differences, and to prevent confusion, it's best to have them seperated. 
let quitLogoDesktop = function(){
    atLogo=false;

    document.getElementById("contentBackground").style.display = "block";
    document.getElementById("contentBackground").style.top="0px";
    document.getElementById("toolbar").style.display="block";
    document.getElementById("toolbar").style.top="0px";
    document.getElementById("toolbar").style.position="fixed";
    document.getElementById("grad").style.display="none";
    document.getElementById("logo").style.display="none";
    document.getElementById("tagline").style.display=   "none";
    document.getElementById("trailerVid").style.display="none";
    document.getElementById("trailerVidIFrame").src="";
    document.getElementById("quitLogo").style.display="none";
    
    if(document.cookie != ""){document.getElementById("startOffImg").src = "Assets/Forside/SecThumbnails/Final/" + document.cookie.substring(9, 11) + ".png";
    } else {document.getElementById("startOff").style.display="none";}

    loadImages();
    
    gradAnimRunning=false;
    if(!slowInternet){prepareChapters(); chaptersPrepared=true;}

    window.scrollTo(0,0);
    document.body.style.overflowY = "auto";
    document.getElementById("contentBackground").style.webkitFilter="blur(0px)";
    document.getElementById("grad").style.webkitFilter="blur(0px)";
    
    scrollStep++;
}
let quitLogoMobile = function(){
    atLogo=false;

    document.getElementById("contentBackground").style.display="block";
    document.getElementById("contentBackground").style.top="60px";
    document.getElementById("toolbar").style.display="block";
    document.getElementById("toolbar").style.top="0px";
    document.getElementById("toolbar").style.position="fixed";
    document.getElementById("grad").style.display="none";
    document.getElementById("logo").style.display="none";
    document.getElementById("tagline").style.display="none";
    document.getElementById("trailerVid").style.display="none";
    document.getElementById("trailerVidIFrame").src="";
    document.getElementById("quitLogo").style.display="none";

    if(document.cookie != ""){document.getElementById("startOffImg").src = "Assets/Forside/SecThumbnails/Final/" + document.cookie.substring(9, 11) + ".png";
    } else {document.getElementById("startOff").style.display="none";}

    document.body.style.zoom=0.45;

    loadImages();

    let introH1 = document.getElementById("introH1");
    introH1.style.opacity=1;
    introH1.style.marginLeft="-230px";

    gradAnimRunning=false;
    if(!slowInternet){prepareChapters(); chaptersPrepared=true;}        
    prepareToc(); TocPrepared=true; 
}

let loadImages = function(){

    document.getElementById("chapterBorders").style.display="block";
    document.getElementById("searchRemove").style.display="block";

    if(!slowInternet){
        document.getElementById("penPaper").src="Assets/Forside/PenAndPaper.jpg";
        document.getElementById("chromeLogo").src="Assets/Forside/chromeLogo.svg";
    } else{
        removeChapterSelectionWhenInternetBad();
    }

}

let removeChapterSelectionWhenInternetBad = function(){
    document.getElementById("chaptersH1").style.display="none";
    document.getElementById("chapterBorders").style.display="none";
    document.getElementById("chap1").style.display="none";
    document.getElementById("chap2").style.display="none";
    document.getElementById("chap25").style.display="none";
    document.getElementById("chap3").style.display="none";
    document.getElementById("chap4").style.display="none";
    document.getElementById("chap5").style.display="none";

    let introH1 = document.getElementById("introH1");
    introH1.style.opacity=1;
    introH1.style.marginLeft="-230px";

    let tocH1 = document.getElementById("tocH1");
    tocH1.style.marginLeft="-230px";
    tocH1.style.opacity=1;

    document.getElementById("spaceRight").style.display="none";
}

//User has returned from browser:
if(window.location.search == "?toToc" && slowInternet==false){
    setTimeout(() => { //We use a timeout here because it avoids a hosting problem (prepareChapters and prepareToc are lower down in the script), and because it just makes it less glitchy.
        
        if(!isTouchDevise){quitLogoDesktop();}
        else {quitLogoMobile();}
        
        presentationMode=false;
        let chaptersH1 = document.getElementById("chaptersH1");
        chaptersH1.style.marginLeft="365px";
        chaptersH1.style.opacity=1;
        let tocH1 = document.getElementById("tocH1");
        tocH1.style.marginLeft="-230px";
        tocH1.style.opacity=1;

        if(!chaptersPrepared){prepareChapters(); chaptersPrepared=true;}
        if(!TocPrepared){prepareToc(); TocPrepared=true;}
        
        setTimeout(() => {
            if(!isTouchDevise){window.scrollTo(0,6850);}
            else{
                document.body.style.zoom=0.45;
                window.scrollTo(0, 2776);
            }
        }, 500);

        scrollStep=4;
    }, 50);
}


//Scrolling events
if(('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
    isTouchDevise=true;

    //Swipe down from logo
    let touchstartY = 0
    let touchendY = 0

    async function handleGesture() {
        if (touchendY < touchstartY-50 && atLogo) {
            quitLogoMobile(); 
        }
    }      

    document.addEventListener('touchstart', e => {
    touchstartY = e.changedTouches[0].screenY
    })

    document.addEventListener('touchend', e => {
    touchendY = e.changedTouches[0].screenY
    handleGesture()
    })
}

let doSearch = function(inp) {

    let searchMatches = [];
    let searchIndex = [-1, -1, -1, -1, -1];

    let iWords; let iWordsL = [];

    let suffixes = ["e", "er", "et", "erne", "tion", "de", "ere", "st"];
    let algorithmA = function(cWords){

        let getCharDiffCount = function(a, b) {
            let bL = b.length;

            if(iWordL == bL) {
                let diffs = 0;
                for(let i=0; i < iWordL; i++) {
                    if(a[i].toLowerCase()!=b[i].toLowerCase()) {diffs++;}
                }
                let allowedDifferences = Math.min(bL, 3);
                if(bL <= 5) {allowedDifferences = 2;}

                let score = allowedDifferences-diffs;
                if(score <= 0) {return 0;}
                else {return score; }
            }
            else{
                let s; let sL;
                let l; let lL;
                if(bL > iWordL) {s=a, sL=iWordL; l=b; lL = bL;}
                else{s=b; sL=bL; l=a; lL = iWordL;}

                let baseIndex=0;
                let diffs;
                while(sL + baseIndex < lL + 1) {
                    diffs=0;
                    for(let i = 0; i < sL; i++) {
                        if(s[i].toLowerCase() != l[i+baseIndex].toLowerCase()) {diffs++;}
                    }
                    if(diffs < 3) {
                        diffs += baseIndex; //Add prefix as difference
                        if(!suffixes.includes(l.substring(sL + baseIndex))){diffs += lL - sL - baseIndex; } //Add suffix as difference *if* it isn't a common suffix

                        let allowedDifferences = Math.min(sL, 3);
                        if(sL <= 5) {allowedDifferences = 2;}

                        let score = allowedDifferences-diffs;
                        if(score <= 0) {return 0;}
                        else {return score; }
                    }
                    baseIndex++;
                }
                return 0;
            }
        }

        let totalScore = 0;
        let L = cWords.length;

        let iWordL;
        for(let i = 0; i<iWords.length; i++) {
            iWordL = iWordsL[i];
            for(let j = 0; j < L; j++) {
                totalScore += getCharDiffCount(iWords[i], cWords[j]);
            }
        } 
        return totalScore;
    }

    let findMatches = function(){
        let depth = 0;
        while(searchIndex[depth] != -1){depth++;}

        let listChildren = rD;
        for(let i = 0; i < depth; i++) {
            listChildren = listChildren[searchIndex[i]][0];
        }    

        let L = listChildren.length;
        for(let i=0; i < L; i++) {

            searchIndex[depth] = i;
            for(let j = depth+1; j < 5; j++) {searchIndex[j]=-1;}

            let listEl = listChildren[i];

            let searchScore = 0;

            searchScore += algorithmA(listEl[1].split(" "))*1.5;
            searchScore += algorithmA(listEl[2].split(" "));
            //searchScore += algorithmB(listEl[2]);
            
            if(listEl[3] != "") { searchScore += algorithmA(listEl[3].split(", ")); }
            if(listEl[5] != null && listEl[5] != "") { searchScore += algorithmA(listEl[5].split(", "))*2; }
            
            if(searchScore > 1) {
                let indexClone = []; for(let i = 0; i < 5; i++) {indexClone.push(searchIndex[i]);}
                searchMatches.push({searchI: indexClone, score: searchScore});
            }

            if(listEl[0].length != 0) {
                findMatches();
            }

        }
    }

    iWords = inp.split(" ");
    for(let i=0; i<iWords.length; i++) {iWordsL[i] = iWords[i].length; } //Calculate lengths only once for performance;

    findMatches();
    
    return searchMatches.sort((a,b)=>{return b.score - a.score});
}


//CHAPTERS
    //Chapter 1:
class header1{

    constructor(){

        this.canvas = new fabric.StaticCanvas('chap1Can');

        this.animating = false;

        //Images
        this.backgroundImg;
        this.cloud1;
        this.cloud2;
        this.sheep = [];
        this.bush;
        this.numOne;
        this.loadedImages = 0;

        //Logic
        this.inAir = [5];
        this.jumpT = [5];
        this.timeSinceJump = [0,0,0,0,0];
        this.timeTillJump = [5];
        this.jumpPos = [5];
        this.jumpVel = [5];

        this.speed = [5]; this.groundSpeed = 2.5; this.airSpeed = 3.5; this.speedVar = 0.8;
        this.flipPos = [5];
        this.dir = [5];

        this.cloud1T = 0;
        this.cloud2T = 0;

        //Setup:
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter1/background.svg', (oImg)=>{this.backgroundImg=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter1/cloud1.svg', (oImg)=>{this.cloud1=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter1/cloud2.svg', (oImg)=>{this.cloud2=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter1/bush.svg', (oImg)=>{this.bush=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter1/1.svg', (oImg)=>{this.numOne=oImg;setupScene();});

        for(let i = 0; i < 3; i++) {
            fabric.Image.fromURL('Assets/Forside/Chapters/Chapter1/sheep1.png', (oImg)=>{
                this.sheep.push(oImg);
                setupScene();
            });
        }
        for(let i = 0; i < 2; i++) {
            fabric.Image.fromURL('Assets/Forside/Chapters/Chapter1/sheep2.png', (oImg)=>{
                this.sheep.push(oImg);
                setupScene();
            });
        }

        let setupScene = ()=>{
            this.loadedImages++;
            if(this.loadedImages == 10){

                this.canvas.add(this.backgroundImg);
                this.backgroundImg.scale(0.9, 0.9);

                for(let i = 0; i<5; i++) {
                    this.canvas.add(this.sheep[i]);
                    
                    this.sheep[i].left = 20+Math.random()*860;
                    this.flipPos[i] = 20+Math.random()*860;

                    if(this.flipPos[i] > this.sheep[i].left) {this.dir[i]=1;}
                    else{this.dir[i]=-1; this.sheep[i].set("flipX",true);}

                    this.speed[i] = this.groundSpeed + (2*Math.random() - 1)*this.speedVar;

                    this.sheep[i].top = this.ground(this.sheep[i].left);
                    this.inAir[i] = false;
                    this.timeTillJump[i] = 1.5+Math.random()*2;

                    this.sheep[i].angle = -5 - Math.random()*10
                    
                }
                
                this.canvas.add(this.cloud1); this.canvas.add(this.cloud2);
                this.cloud1.left=30; this.cloud1.top=90; this.cloud1.angle = -10;
                this.cloud2.left=500; this.cloud2.top=10;

                this.canvas.add(this.bush);
                this.bush.scale(0.9,0.9);

                this.canvas.add(this.numOne);
                this.numOne.scale(0.9,0.9);
                this.numOne.left = 27; this.numOne.top=211.5;

                this.cloud1.left = 30 + Math.sin(this.cloud1T/2.5)*150;
                this.cloud1.top = 110 - Math.sin(this.cloud1T/2.5)*30;
                
                this.animate();
            }
        }

    }

    animate = ()=>{

        if(this.animating) {

            this.cloud1T += frameLength;
            this.cloud2T += frameLength;

            this.cloud1.left = 30 + Math.sin(this.cloud1T/2.5)*150;
            this.cloud1.top = 110 - Math.sin(this.cloud1T/2.5)*30;
            
            for(let i =0; i<5; i++) {
                
                if(this.inAir[i]) {
                    this.jumpT[i] += frameLength;
                    
                    this.sheep[i].top = this.jumpPos[i] - this.jumpVel[i]*this.jumpT[i] + 100*this.jumpT[i]*this.jumpT[i];
                    this.sheep[i].left += this.speed[i]*this.dir[i];
                    
                    if(this.dir[i]==1){this.sheep[i].angle += 0.2;}
                    else{this.sheep[i].angle -= 0.2;}

                    if(this.sheep[i].top > this.ground(this.sheep[i].left)) {
                        this.sheep[i].top = this.ground(this.sheep[i].left);
                        this.sheep[i].angle = -5 - Math.random()*10
                        this.speed[i] = this.groundSpeed + (2*Math.random() - 1)*this.speedVar;
                        
                        this.timeTillJump[i] = 1.5+Math.random()*2.5;
                        this.timeSinceJump[i] = 0;
                        this.inAir[i] = false;
                    }
                }
                else{
                    if(this.dir[i]==1 && this.sheep[i].left > this.flipPos[i]) {
                        this.flipPos[i] = 20+Math.random()*(880-this.sheep[i].left);
                        this.dir[i] = -1;
                        this.sheep[i].set("flipX",true);
                        this.speed[i] = this.groundSpeed + (2*Math.random() - 1)*this.speedVar;
                    }
                    else if(this.dir[i] == -1 && this.sheep[i].left < this.flipPos[i]){
                        this.flipPos[i] = this.sheep[i].left + Math.random()*(880-this.sheep[i].left);
                        this.dir[i] = 1;
                        this.sheep[i].set("flipX",false);
                        this.speed[i] = this.groundSpeed + (2*Math.random() - 1)*this.speedVar;
                    }

                    this.sheep[i].left += this.speed[i]*this.dir[i];
                    this.sheep[i].top = this.ground(this.sheep[i].left);

                    this.timeSinceJump[i] += frameLength;
                    if(this.timeSinceJump[i] >= this.timeTillJump[i] && Math.abs(this.sheep[i].left - this.flipPos[i]) > 100) {
                        this.jumpT[i]=0;
                        
                        if(this.dir[i]==1) {this.jumpVel[i] = 85 + Math.random()*85;}
                        else{this.jumpVel[i] = 40 + Math.random()*40;}
                        
                        this.jumpPos[i] = this.sheep[i].top;
                        this.speed[i] = this.airSpeed + (2*Math.random() - 1)*0.5;

                        if(this.dir[i]==1){this.sheep[i].angle = -30 + Math.random()*10;}
                        else{this.sheep[i].angle = 10 - Math.random()*10; }
                        

                        this.inAir[i]=true;
                    }
                }   

            }

            this.canvas.renderAll();
        }

        requestAnimationFrame(this.animate);
    }

    ground = (x)=>{
        return 248-(6.7 + 0.2646*x + 1.3*Math.sin(0.0303*x + 0.545) + 2.2*Math.cos(0.04*x - 0.6));
    }

}

    //Chapter 2:
class header2{

    constructor(){

        this.canvas = new fabric.StaticCanvas('chap2Can');
        this.animating = false;
        this.globalT = 0;

        this.background=null;

        this.sun=null; 
        this.sunGlow=null;
        this.waterBack=null; 
        this.waterMid=null; 
        this.waterFront=null;
        this.piR=null; 
        this.piL=null; 
        this.piTop=null;
        this.two=null;

        this.skyGradient = new fabric.Gradient({
            type: 'linear',
            gradientUnits: 'pixels', // or 'percentage'
            coords: { x1: 0, y1: 0, x2: 0, y2: 45 },
            colorStops:[
                { offset: 0, color: 'hsl(18, 100%, 63%)'},
                { offset: 1, color: 'hsl(320, 63%, 30%)'}
            ]
        })

        this.shapesLMed = 460;
        this.shapeLSpread = 86.3;
        this.shapeLAmp = 4500;

        this.activeShapes = [null, null, null, null, null, null, null, null];
        this.activeShapesPhase = [null, null, null, null, null, null, null, null];
        this.activeShapesTypes = [null, null, null, null, null, null, null, null];
        this.shapesTopoffset = [-15,0,-7,0,-23,-8,-8,-10];
        this.shapesWaveAmplitude = [20,35,13,20,10,20,10,20];
        this.shapesRotationAmplitude = [6,8,5,8,4,12,15,4];
        this.shapesIndex = 0;

        this.newShapeTime = 1;
        this.timeTillNewShape = 0;

        this.waterA = 3.5; //Amplitude
        this.waterF = 0.8; //Frequency

        this.rotSpeedMed = 0.5; 
        this.rotSpeedAmp = 2; 
        this.rotSpeedDivisions = 10;
        this.rotSpeed = this.rotSpeedMed;
        this.rotSpeedDirCounter = 0;
        this.rotT = 0.0;

        fabric.loadSVGFromURL("Assets/Forside/Chapters/Chapter2/background.svg", (objs) => {this.background=objs[0]; setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2/sun.svg', (oImg)=>{this.sun=oImg; setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2/sunGlow.svg', (oImg)=>{this.sunGlow=oImg; setupScene();});
        fabric.loadSVGFromURL('Assets/Forside/Chapters/Chapter2/water0.svg', (objs)=>{this.waterBack=objs[0]; setupScene();});
        fabric.loadSVGFromURL('Assets/Forside/Chapters/Chapter2/water1.svg', (objs)=>{this.waterMid=objs[0]; setupScene();});
        fabric.loadSVGFromURL('Assets/Forside/Chapters/Chapter2/water2.svg', (objs)=>{this.waterFront=objs[0]; setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2/piR.svg', (oImg)=>{this.piR=oImg; setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2/piL.svg', (oImg)=>{this.piL=oImg; setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2/piTop.svg', (oImg)=>{this.piTop=oImg; setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2/2.svg', (oImg)=>{this.two=oImg; setupScene();});

        let loadedImages = 0;
        let setupScene = ()=>{
            loadedImages++;
            if(loadedImages == 10) {
                
                this.canvas.add(this.background); this.background.scale(3.4);
                this.background.set("fill", this.skyGradient);
                
                this.canvas.add(this.sun); this.sun.scale(0.9); this.sun.left = 690; this.sun.top=55;
                this.canvas.add(this.sunGlow); this.sunGlow.scale(0.9); this.sunGlow.left = 655; this.sunGlow.top=25;
                
                this.canvas.add(this.waterBack); this.waterBack.scale(3.5); 

                this.canvas.add(this.piL);
                this.piL.left = 709.2; this.piL.top = 93.4; this.piL.scale(0.9); 
                this.canvas.add(this.piTop);
                this.piTop.left = 703.8; this.piTop.top = 79.2; this.piTop.scale(0.9); 

                this.canvas.add(this.two);
                this.two.left = 739.8; this.two.top=28.5; this.two.scale(0.9); 

                this.canvas.add(this.waterMid); this.waterMid.scale(3.5); 

                this.canvas.add(this.piR);
                this.piR.left = 756.9; this.piR.top = 92; this.piR.scale(0.9); 

                this.canvas.add(this.waterFront); this.waterFront.scale(3.5); 

                this.waterBack.top = 144 + this.waterA*Math.sin(this.globalT*this.waterF);    
                this.waterMid.top = 144 + 0.75*this.waterA*Math.sin(this.globalT*this.waterF);     
                this.waterFront.top = 144 + 0.5*this.waterA*Math.sin(this.globalT*this.waterF);   

                let newColor = "hsl(272, 100%," + (20+6*Math.sin((this.globalT+0.9)/4)).toString() + "%)";
                this.waterBack.set("fill", newColor);
                this.waterMid.set("fill", newColor);
                this.waterFront.set("fill", newColor);

                //Animate sun:
                this.sun.scale(0.9 + 0.05*Math.sin((this.globalT+0.9)/4));
                this.sunGlow.scale(0.9 + 0.5*Math.sin((this.globalT+0.9)/4));
                this.sun.left = 690 - 5*Math.sin((this.globalT+0.9)/4);
                this.sunGlow.left = 655 - 57*Math.sin((this.globalT+0.9)/4);
                this.sunGlow.top = 25 - 50*Math.sin((this.globalT+0.9)/4);

                this.skyGradient.colorStops[0].color="hsl(18, 100%, " + (48+15*Math.sin((this.globalT+0.9)/4)).toString() + "%)";
                this.skyGradient.colorStops[1].color="hsl(320, 63%, " + (30).toString() + "%)";
                this.background.set("fill", " ");
                this.background.set("fill", this.skyGradient);

                this.animate();

            }
        }

    }


    animate = ()=>{

        if(this.animating) {

            this.globalT += frameLength;

            //Animate water:
            this.waterBack.top = 144 + this.waterA*Math.sin(this.globalT*this.waterF);    
            this.waterMid.top = 144 + 0.75*this.waterA*Math.sin(this.globalT*this.waterF);     
            this.waterFront.top = 144 + 0.5*this.waterA*Math.sin(this.globalT*this.waterF);   

            let newColor = "hsl(272, 100%," + (20+6*Math.sin((this.globalT+0.9)/4)).toString() + "%)";
            this.waterBack.set("fill", newColor);
            this.waterMid.set("fill", newColor);
            this.waterFront.set("fill", newColor);


            //Animate this.sun:
            this.sun.scale(0.9 + 0.05*Math.sin((this.globalT+0.9)/4));
            this.sunGlow.scale(0.9 + 0.5*Math.sin((this.globalT+0.9)/4));
            this.sun.left = 690 - 5*Math.sin((this.globalT+0.9)/4);
            this.sunGlow.left = 655 - 57*Math.sin((this.globalT+0.9)/4);
            this.sunGlow.top = 25 - 50*Math.sin((this.globalT+0.9)/4);

            this.skyGradient.colorStops[0].color="hsl(18, 100%, " + (48+15*Math.sin((this.globalT+0.9)/4)).toString() + "%)";
            this.skyGradient.colorStops[1].color="hsl(320, 63%, " + (30).toString() + "%)";
            this.background.set("fill", " ");
            this.background.set("fill", this.skyGradient);


            //Animate pi and number:
            let rotChangeProb = 0.5 + 0.5*Math.pow((this.rotSpeed-this.rotSpeedMed)/this.rotSpeedAmp, 1);

            let ran = Math.random();
            
            let rotSpeedAntiDamp = 1.0; let halvePowers = 1;
            for(let i = 0; i < Math.abs(this.rotSpeedDirCounter); i++) {rotSpeedAntiDamp += halvePowers; halvePowers/=1.2; }
            
            if(this.rotSpeedDirCounter > 0) {
                rotChangeProb = rotChangeProb/rotSpeedAntiDamp; 
            }
            else if(this.rotSpeedDirCounter < 0){
                rotChangeProb = 1-(1-rotChangeProb)/rotSpeedAntiDamp; 
            }

            if(ran > rotChangeProb) {
                this.rotSpeed += this.rotSpeedAmp/this.rotSpeedDivisions;
                this.rotSpeedDirCounter++;
                if(this.rotSpeedDirCounter > 3){this.rotSpeedDirCounter=3;}

            } else{
                this.rotSpeed -= this.rotSpeedAmp/this.rotSpeedDivisions;
                this.rotSpeedDirCounter--;
                if(this.rotSpeedDirCounter < -3){this.rotSpeedDirCounter=-3;}

            }

            this.rotT += 1.5*frameLength*this.rotSpeed;

            this.piL.angle = 7*Math.sin(this.rotT);
            this.piR.angle = 5.8*Math.sin(this.rotT+1.1);
            this.piL.top = 93.4 - 0.5*this.piL.angle + 5*Math.sin((this.globalT-0.6)*this.waterF);
            this.piR.top = 92 - 0.2*this.piR.angle + 5*Math.sin((this.globalT-0.6)*this.waterF);
            this.piTop.angle = 0.2*Math.sin(-this.rotT + 0.4);
            this.piTop.top = 79.2 - 0.2*this.piTop.angle + 5*Math.sin((this.globalT-0.6)*this.waterF);
            this.two.top = 28.5 + 5*Math.sin((this.globalT-0.6)*this.waterF);

            this.piL.left = 709.2 + 0.2*Math.random();
            this.piR.left = 756.9 + 0.2*Math.random();


            //Animate shapes:
            this.timeTillNewShape += frameLength;
            if(this.timeTillNewShape > this.newShapeTime) {

                let prevShapeType;
                if(this.shapesIndex != 0) {prevShapeType = this.activeShapesTypes[this.shapesIndex-1];}
                else{prevShapeType = this.activeShapesTypes[7]; }

                var chosenShape = Math.floor(Math.random()*7);
                while(chosenShape == prevShapeType){
                    chosenShape = Math.floor(Math.random()*7);
                }

                fabric.loadSVGFromURL("Assets/Forside/Chapters/Chapter2/shape" + chosenShape.toString() + ".svg", (objs) => {
                    
                    //Store a list of what *kind* of shapes are added right now. Then we can do some dictionary shit to adjust various things for each shape to make it perfect
                    this.activeShapes[this.shapesIndex] = objs[0];
                    this.activeShapesPhase[this.shapesIndex] = 3.14*Math.random();
                    this.activeShapesTypes[this.shapesIndex] = chosenShape;

                    this.shapesIndex++;
                    if(this.shapesIndex==8) {this.shapesIndex=0;}

                    objs[0].left=900; 
                    objs[0].scale(3.8);
                    this.canvas.add(objs[0]);
                    this.canvas.sendBackwards(objs[0]); this.canvas.sendBackwards(objs[0]); this.canvas.sendBackwards(objs[0]); this.canvas.sendBackwards(objs[0]);

                });

                this.timeTillNewShape=0;
                this.newShapeTime = 5+Math.random()*5;
            }
            for(let i = 0; i < 8; i++) {
                if(this.activeShapes[i]!=null){

                    let sT = this.activeShapesTypes[i];
                    this.activeShapes[i].left -= (55 + 10*Math.sin(this.activeShapesPhase[i]) + 5*Math.sin((this.globalT-0.5)/0.5))*frameLength;
                    this.activeShapes[i].top = 130 + this.shapesTopoffset[sT] - this.shapesWaveAmplitude[sT]*Math.sin((this.globalT - this.activeShapesPhase[i])/0.5);
                    this.activeShapes[i].angle = this.shapesRotationAmplitude[sT]*(-0.5 + 2*Math.sin((this.globalT - this.activeShapesPhase[i]-0.2)/0.5));
                    
                    let sX = this.activeShapes[i].left;
                    if(sX < this.shapesLMed) {
                        sX = this.shapesLMed - 0.38*(this.shapesLMed - sX); //This is to skew the curve
                    }

                    let shapeLightness = 17 + 10*Math.sin((this.globalT+0.9)/4);
                    shapeLightness += -10 + this.shapeLAmp*(1/(this.shapeLSpread*2.506628))*Math.pow(2.7182818, -0.5*Math.pow((sX-this.shapesLMed)/this.shapeLSpread, 2));
                    this.activeShapes[i].set("fill", "hsl(57, 100%," + shapeLightness.toString() + "%)");
                    this.activeShapes[i].set("stroke", "hsl(57, 100%," + (shapeLightness-2).toString() + "%)");

                    if(this.activeShapes[i].left < -190) {
                        this.canvas.remove(this.activeShapes[i]);
                        this.activeShapes[i]=null;
                    }
                }
            }

            this.canvas.renderAll();
        }
        requestAnimationFrame(this.animate);
    }

}

    //Chapter 2.5:
class header25{

    constructor(){
        this.canvas = new fabric.StaticCanvas('chap25Can');
        this.animating = false;

        this.background;
        this.num25;
        this.loadedImages = 0;

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2 5/stripes.svg', (oImg)=>{this.background=oImg; setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter2 5/2half.svg', (oImg)=>{this.num25=oImg; setupScene();});

        this.lastTime;
        this.totalMovement = 0;

        let setupScene = ()=>{
            this.loadedImages++;
            if(this.loadedImages==2) {
                this.canvas.add(this.background);
                this.canvas.add(this.num25);

                this.num25.left = 10;
                this.num25.top = -55;

                this.background.left=-200;

                this.animate(0);
            }
        }

    }

    animate=(currentTime)=>{

        let frameLength = 0;
        if(this.lastTime != null) {
            frameLength = (currentTime-this.lastTime)/1000;
        } 
        this.lastTime=currentTime;

        if(this.animating){
            this.background.left += frameLength*50;
            this.totalMovement += frameLength*50;
            if(this.totalMovement >= 63.82) {
                this.background.left -= 63.82;
                this.totalMovement = 0;
            }
            
            this.canvas.renderAll();
        }

        requestAnimationFrame(this.animate);
    }

    }

    //Chapter 3:
class header3{
    constructor(){

        this.canvas = new fabric.StaticCanvas('chap3Can');
        this.animating = false;
        this.globalT = 0;

        this.background;
        this.spinner;
        this.pointer;
        this.roulette;
        this.rouletteTop;
        this.cardNum;
        this.loadedImages = 0;

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter3/background.svg', (oImg)=> {this.background=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter3/spinner.svg', (oImg)=> {this.spinner=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter3/pointer.svg', (oImg)=> {this.pointer=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter3/roulette.svg', (oImg)=> {this.roulette=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter3/rouletteTop.svg', (oImg)=> {this.rouletteTop=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter3/number.svg', (oImg)=> {this.cardNum=oImg;setupScene();});

        let setupScene = ()=>{
            this.loadedImages++;
            if(this.loadedImages==6){

                this.canvas.add(this.background);
                this.canvas.add(this.cardNum);

                this.canvas.add(this.spinner);
                this.canvas.add(this.pointer);
                this.canvas.add(this.roulette);
                this.canvas.add(this.rouletteTop);

                this.spinner.originX="center"; this.spinner.originY="center";
                this.rouletteTop.originX="center"; this.rouletteTop.originY="center";
                this.pointer.originX="center"; this.pointer.originY="bottom";

                this.roulette.left = 94; this.roulette.top=31;
                this.spinner.left=198; this.spinner.top=138; this.spinner.angle=11.5;

                this.rouletteTop.left=200;this.rouletteTop.top=130; 

                this.pointer.left=265; this.pointer.top=63; this.pointer.angle = 220;

                this.animate();
            }
        }

        this.spinnerSpeed = 160;
        this.T1 = (20.92/this.spinnerSpeed)*3.2;  
        this.T2 = (20.92/this.spinnerSpeed)*0.6;

    }

    getPointerAngle = ()=>{
        let t=this.globalT%(this.T1+this.T2);

        if(t <= this.T1) {
            return 1+Math.sin(t*3.14/this.T1 - 1.57);
        } else{
            return 2*Math.sin(t*1.57/this.T2 - (this.T1-this.T2)*1.57/this.T2);
        }
    }

    animate = ()=>{

        if(this.animating) {

            this.globalT += frameLength;

            //Spin
            this.spinner.angle += this.spinnerSpeed*frameLength; 
            if(this.spinner.angle > 360) {this.spinner.angle -= 360;}

            this.pointer.angle = 210+10*this.getPointerAngle();
            this.rouletteTop.angle = (200*this.globalT)%360;

            //Shake:
            let globalShakeX = Math.random()*0.5; 
            let globalShakeY = Math.random()*0.5;

            let spinnerShakeX = Math.random()*2; 
            let spinnerShakeY = Math.random()*2; 

            let topShakeX = Math.random()*0.5;
            let topShakeY = Math.random()*0.5;

            this.roulette.left = 94 + globalShakeX;
            this.roulette.top = 31 + globalShakeY;

            this.spinner.left = 198 + globalShakeX + spinnerShakeX;
            this.spinner.top = 138 + globalShakeY + spinnerShakeY;

            this.rouletteTop.left = 200+globalShakeX + topShakeX;
            this.rouletteTop.top = 130 + globalShakeY + topShakeY;

            this.pointer.left = 265+globalShakeX*2;
            this.pointer.top = 63 + globalShakeY*2;

            this.canvas.renderAll();

        }
        requestAnimationFrame(this.animate);
    }

}

    //Chapter 4:
class header4{

    constructor() {

        //Setup this.canvas and objects
        this.canvas = new fabric.StaticCanvas('chap4Can');
        this.animating=false;
        this.globalT = 0; 

        this.background;
        this.spring;
        this.chapNum;
        this.ball1; 
        this.ball2;
        this.wheelL; 
        this.wheelR;
        this.traceCover;

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter4/background.svg', (oImg)=> {this.background=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter4/spring.svg', (oImg)=> {this.spring=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter4/four.svg', (oImg)=> {this.chapNum=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter4/traceCover.svg', (oImg)=> {this.traceCover=oImg;setupScene();});
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter4/ball.svg', (oImg)=> {
            this.ball1=oImg;
            this.ball2=fabric.util.object.clone(oImg);
            setupScene();
        });
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter4/wheel.svg', (oImg)=> {
            this.wheelL=oImg;
            this.wheelR=fabric.util.object.clone(oImg);
            setupScene();
        });


        var loadedImages = 0;
        var setupScene = ()=>{
            loadedImages++;
            if(loadedImages == 6){
                this.canvas.add(this.background);
                this.canvas.add(this.chapNum);
                this.canvas.add(this.spring);
                this.canvas.add(this.wheelL); this.canvas.add(this.wheelR);

                this.canvas.add(this.lineA); this.canvas.add(this.lineB);
                this.canvas.add(this.ball1); this.canvas.add(this.ball2);

                this.canvas.add(this.traceCover);

                this.wheelL.originX="center"; this.wheelL.originY="center";
                this.wheelR.originX="center"; this.wheelR.originY="center";
                this.chapNum.originX="center"; this.chapNum.originY="bottom";
                this.ball1.originX="center"; this.ball1.originY="center";
                this.ball2.originX="center"; this.ball2.originY="center";

                this.ball1.scale(0.8); this.ball2.scale(0.8);

                this.wheelL.left = 122; this.wheelL.top = 159;
                this.wheelR.left = 207.5; this.wheelR.top = 159;

                this.spring.left = 800; this.spring.top = 125;
                this.chapNum.left = 835; this.chapNum.top = 140;

                //Render very first frame:
                this.ball1.left = 575 + this.La*Math.sin(this.a);
                this.ball2.left = 575 + this.La*Math.sin(this.a) + this.Lb*Math.sin(this.b);

                this.ball1.top=30+this.La*Math.cos(this.a);
                this.ball2.top=30+this.La*Math.cos(this.a) + this.Lb*Math.cos(this.b);

                this.lineA.set({x2: this.ball1.left, y2: this.ball1.top});
                this.lineB.set({x1: this.ball1.left, y1: this.ball1.top, x2: this.ball2.left, y2: this.ball2.top});

                this.animate();
                
            }
        }


        this.lineA = new fabric.Line([575, 30, 0, 0], {stroke: 'rgb(120,120,120)'});
        this.lineB = new fabric.Line([0, 0, 0, 0], {stroke: 'rgb(120,120,120)'});
        this.lineA.strokeWidth=3;
        this.lineB.strokeWidth=3;

        this.tracesA = [null, null, null, null, null, null, null, null, null, null];
        this.tracesB = [null, null, null, null, null, null, null, null, null, null];
        this.traceIndex = 0;
        this.traceBIndex = 0;
        this.traceTimer = 0;

        //Define logic variables
        this.a = 1.57; 
        this.Va = 0; 
        this.Aa = 0;
        
        this.b = 1.57; 
        this.Vb = 0; 
        this.Ab = 0;

        this.La = 55;
        this.Lb = 65;

        this.Wa = 15;
        this.Wb = 20;

    }

    //Animate
    animate = ()=>{

    if(this.animating){

        this.globalT += frameLength;

        //wheels:
        this.wheelL.angle += frameLength*35;
        this.wheelR.angle += frameLength*35;
        if(this.wheelL.angle > 360){this.wheelL.angle -= 360;}
        if(this.wheelR.angle > 360){this.wheelR.angle -= 360;}

        //Number and this.spring:
        this.spring.set("scaleY", 1+0.4*Math.sin(this.globalT/2));
        this.spring.top=127 - 15*Math.sin(this.globalT/2);

        this.chapNum.top=135+10*Math.sin(this.globalT/1.1);
        this.chapNum.angle = -7.5*Math.sin(this.globalT/2.5-1);

        //Double-pendulum:
        let frameLengthDiv = frameLength/16; //Subdivite frame into smaller units for better precision.
        for(let i=0; i < 16; i++) {

            //Get the accelerations:
            let g = 9.82;
            let denom = 2*this.Wa + this.Wb - this.Wb*Math.cos(2*this.a - 2*this.b);
            let aNumerator = -g*(2*this.Wa + this.Wb)*Math.sin(this.a) - this.Wb*g*Math.sin(this.a-2*this.b) - 2*Math.sin(this.a-this.b)*this.Wb*(this.Vb*this.Vb*this.Lb + this.Va*this.Va*this.La*Math.cos(this.a-this.b));
            let bNumerator = 2*Math.sin(this.a-this.b)*(this.Va*this.Va*this.La*(this.Wa+this.Wb) + g*(this.Wa+this.Wb)*Math.cos(this.a) + this.Vb*this.Vb*this.Lb*this.Wb*Math.cos(this.a-this.b));

            this.Aa = aNumerator/(this.La*denom);
            this.Ab = bNumerator/(this.Lb*denom);

            //Update the angles:
            this.a += frameLengthDiv*this.Va; this.b+=frameLengthDiv*this.Vb;
            this.Va += frameLengthDiv*this.Aa; this.Vb +=frameLengthDiv*this.Ab;
        }

        this.ball1.left = 575 + this.La*Math.sin(this.a);
        this.ball2.left = 575 + this.La*Math.sin(this.a) + this.Lb*Math.sin(this.b);

        this.ball1.top=30+this.La*Math.cos(this.a);
        this.ball2.top=30+this.La*Math.cos(this.a) + this.Lb*Math.cos(this.b);

        this.lineA.set({x2: this.ball1.left, y2: this.ball1.top});
        this.lineB.set({x1: this.ball1.left, y1: this.ball1.top, x2: this.ball2.left, y2: this.ball2.top});

        //whiteboard this.tracesA:
        this.traceTimer += frameLength; 

        if(this.traceTimer > 1) {
            this.traceTimer=0;

            this.tracesA[this.traceIndex] = new fabric.Circle({radius: 8, fill: 'transparent', stroke:'black', left: this.ball1.left, top: this.ball1.top}) 
            this.tracesB[this.traceIndex] = new fabric.Circle({radius: 6, fill: 'transparent', stroke:'black', left: this.ball2.left, top: this.ball2.top}) 
            this.canvas.add(this.tracesA[this.traceIndex]);
            this.canvas.add(this.tracesB[this.traceIndex]);

            this.canvas.sendBackwards(this.tracesA[this.traceIndex]);
            this.canvas.sendBackwards(this.tracesB[this.traceIndex]);

            this.traceIndex++;
            if(this.traceIndex==10){this.traceIndex=0;}
        }
        for(let i = 0; i < 10; i++){
            if(this.tracesA[i] != null) {

                this.tracesA[i].opacity-=0.1*frameLength;
                this.tracesB[i].opacity-=0.1*frameLength;

                if(this.tracesA[i].opacity<=0){
                    this.canvas.remove(this.tracesA[i]);
                    this.canvas.remove(this.tracesB[i]);
                    this.tracesA[i]=null;
                    this.tracesB[i]=null;
                }
            }
        }

        this.canvas.renderAll();
    }
    requestAnimationFrame(this.animate);
    }

    }

    //Chapter 5:
class header5{

    constructor() {

        this.canvas = new fabric.StaticCanvas('chap5Can');
        this.animating = false;

        this.background;
        this.five;
        this.numTypes = [null, null, null, null, null, null];

        this.apples = [];

        this.poof;

        this.smallApples = [];
        this.negativeApple;
        this.minus;

        this.pie;
        this.piePieces = [null, null, null, null, null, null, null, null];

        this.pi;

        this.qstions = [];

        this.activeAnimations = [];


        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/background.svg', (oImg)=> {
            this.background=oImg; setupScene();
        });
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/5.svg', (oImg)=> {
            this.five=oImg; setupScene();
        });
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/type0.svg", (oImg)=> {this.numTypes[0]=oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/type1.svg", (oImg)=> {this.numTypes[1]=oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/type2.svg", (oImg)=> {this.numTypes[2]=oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/type3.svg", (oImg)=> {this.numTypes[3]=oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/type4.svg", (oImg)=> {this.numTypes[4]=oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/type5.svg", (oImg)=> {this.numTypes[5]=oImg; setupScene();});
        
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/apple.svg', (oImg)=> {
            this.apples.push(oImg);
            this.apples.push(fabric.util.object.clone(oImg)); this.apples.push(fabric.util.object.clone(oImg));
            setupScene();
        });

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/PoofGone.svg', (oImg)=> {
            this.poof=oImg; setupScene();
        });

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/smallApple.svg', (oImg)=> {
            this.smallApples.push(oImg);
            this.smallApples.push(fabric.util.object.clone(oImg)); this.smallApples.push(fabric.util.object.clone(oImg)); this.smallApples.push(fabric.util.object.clone(oImg)); this.smallApples.push(fabric.util.object.clone(oImg)); //For loop seemed overkill            
            setupScene();
        });
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/minus.svg', (oImg)=> {
            this.minus=oImg; setupScene();
        });
        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/negativeApple.svg', (oImg)=> {
            this.negativeApple=oImg; setupScene();
        });

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/applePie.png', (oImg)=> {
            this.pie = oImg; setupScene();
        });
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie0.png", (oImg)=> {this.piePieces[0] = oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie1.png", (oImg)=> {this.piePieces[1] = oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie2.png", (oImg)=> {this.piePieces[2] = oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie3.png", (oImg)=> {this.piePieces[3] = oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie4.png", (oImg)=> {this.piePieces[4] = oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie5.png", (oImg)=> {this.piePieces[5] = oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie6.png", (oImg)=> {this.piePieces[6] = oImg; setupScene();});
        fabric.Image.fromURL("Assets/Forside/Chapters/Chapter5/pie7.png", (oImg)=> {this.piePieces[7] = oImg; setupScene();});

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/pi.svg', (oImg)=> {
            this.pi=oImg;
            setupScene();
        });

        fabric.Image.fromURL('Assets/Forside/Chapters/Chapter5/questionMark.svg', (oImg)=> {
            this.qstions.push(oImg);
            this.qstions.push(fabric.util.object.clone(oImg)); this.qstions.push(fabric.util.object.clone(oImg));
            setupScene();
        });


        let loadedImages = 0;
        let setupScene = ()=>{
            loadedImages++;
            if(loadedImages == 24) {
                
                this.canvas.add(this.background);
                this.canvas.add(this.five); this.five.left = 49.2; this.five.top=62;

                this.canvas.add(this.numTypes[0]); 

                this.resetScene();

                this.animate();
            }
        }
        
    }


    resetScene = ()=>{
        this.numTypes[0].left = 472; this.numTypes[0].top = 85.7; this.numTypes[0].originX = "center"; this.numTypes[0].originY = "center";
        this.numTypes[1].left = 472; this.numTypes[1].top = 85.7; this.numTypes[1].originX = "center"; this.numTypes[1].originY = "center";
        this.numTypes[2].left = 472; this.numTypes[2].top = 85.7; this.numTypes[2].originX = "center"; this.numTypes[2].originY = "center";
        this.numTypes[3].left = 472; this.numTypes[3].top = 83.7; this.numTypes[3].originX = "center"; this.numTypes[3].originY = "center";
        this.numTypes[4].left = 472; this.numTypes[4].top = 85.7; this.numTypes[4].originX = "center"; this.numTypes[4].originY = "center";
        this.numTypes[5].left = 472; this.numTypes[5].top = 85.7; this.numTypes[5].originX = "center"; this.numTypes[5].originY = "center";

        //Natural:
        this.apples[0].left = 625.9; this.apples[0].top = 34; this.apples[0].opacity=0;
        this.apples[1].left = 729.1; this.apples[1].top = 73.6; this.apples[1].originX = "center"; this.apples[1].originY = "center"; this.apples[1].scaleX=1; this.apples[1].scaleY=1; this.apples[1].opacity=0;
        this.apples[2].left = 772.3; this.apples[2].top = 34; this.apples[2].opacity=0;

        //Whole:
        this.poof.left = 730; this.poof.top = 84.851; this.poof.originX = "center"; this.poof.originY = "center"; this.poof.opacity=1; this.poof.scaleX = 1; this.poof.scaleY=1;

        //Negative:
        this.smallApples[0].left = 597.6; this.smallApples[0].top = 51.2; this.smallApples[0].opacity = 0;
        this.smallApples[1].left = 648.9; this.smallApples[1].top = 51.2; this.smallApples[1].opacity = 0;
        this.minus.left = 705.8; this.minus.top=85.98; this.minus.opacity=0;
        this.smallApples[2].left = 736.1; this.smallApples[2].top = 51.2; this.smallApples[2].opacity = 0;
        this.smallApples[3].left = 787.4; this.smallApples[3].top = 51.2; this.smallApples[3].opacity = 0;
        this.smallApples[4].left = 838.7; this.smallApples[4].top = 51.2; this.smallApples[4].opacity = 0;
        this.negativeApple.left = 648.9; this.negativeApple.top =  51.2; this.negativeApple.opacity=0;

        //Rational:
        this.pie.left = 667+81; this.pie.top=143.1-65; this.pie.originX = "center"; this.pie.originY="center"; this.pie.opacity=1;

            //Starting this.pie positions they fly in from:
        this.canvas.add(this.piePieces[0]); this.canvas.add(this.piePieces[1]); this.canvas.add(this.piePieces[2]); this.canvas.add(this.piePieces[3]); this.canvas.add(this.piePieces[4]); this.canvas.add(this.piePieces[5]); this.canvas.add(this.piePieces[6]); this.canvas.add(this.piePieces[7]);
        this.piePieces[0].left = 589; this.piePieces[0].top = 187.5; 
        this.piePieces[1].left = 712.9; this.piePieces[1].top = 201.1; 
        this.piePieces[2].left = 851.4; this.piePieces[2].top = 160.6; 
        this.piePieces[3].left = 919.1; this.piePieces[3].top = 63.7; 
        this.piePieces[4].left = 818; this.piePieces[4].top = -58.6; 
        this.piePieces[5].left = 754.3; this.piePieces[5].top = -66.6; 
        this.piePieces[6].left = 671.14; this.piePieces[6].top = -59.8; 
        this.piePieces[7].left = 625.2; this.piePieces[7].top = -44.9; 

        //Real:
        //this.canvas.add(this.pi);
        this.pi.left = 745.6; this.pi.top = 79.66; this.pi.originX = "center"; this.pi.originY = "center"; 
        this.pi.angle = 180; this.pi.opacity=0.1; this.pi.scaleX = 0.8; this.pi.scaleY = 0.8;

        //Complex:
        this.qstions[0].left = 660; this.qstions[0].top = 60; this.qstions[0].angle=-23; this.qstions[0].scale(1.1); this.qstions[0].opacity=0;
        this.qstions[1].left = 720; this.qstions[1].top = 40; this.qstions[1].angle=-4; this.qstions[1].opacity=0;
        this.qstions[2].left = 780; this.qstions[2].top = 40; this.qstions[2].angle=16; this.qstions[2].scale(1.2); this.qstions[2].opacity=0;
    }


    animate = async ()=>{

        //Prep
        let eas = fabric.util.ease;
        let lin = function (t, b, c, d) {return c*t/d + b;}
        
        let hoverElement = (obj, dur, Amp, freq, phase)=>{
            let hovering = (t, b, c, d)=>{
                return b + Amp*Math.sin(freq*t/1000 - phase);
            }
            
            this.animR(obj, ["top"], [0], [dur], [hovering]);
        }
        
        let currentNumType = 0;
        let changeNumType = async ()=>{
        
            this.numTypes[currentNumType].angle=0;
            this.anim(this.numTypes[currentNumType], 
                ["angle", "opacity", "scaleX", "scaleY"], 
                [360, 0.0, 0.8, 0.8], 
                [1500, 700, 700, 700], 
                [eas.easeInOutCubic, eas.easeInCubic, eas.easeInQuart, eas.easeInQuart]);

            await this.sleep(700); 

            this.canvas.remove(this.numTypes[currentNumType]);
            if(currentNumType == 5){currentNumType=-1;}
            this.canvas.add(this.numTypes[currentNumType+1]); 

            this.numTypes[currentNumType+1].angle = 180; 
            this.numTypes[currentNumType+1].opacity=0.1; 
            this.numTypes[currentNumType+1].scaleX = 0.8; 
            this.numTypes[currentNumType+1].scaleY = 0.8;

            this.anim(this.numTypes[currentNumType+1], 
                ["angle", "opacity", "scaleX", "scaleY"], 
                [360, 1, 1.0, 1.0], 
                [1000, 700, 700, 700], 
                [eas.easeOutCubic, eas.easeOutCubic, eas.easeOutCubic, eas.easeOutCubic]);

            currentNumType++;
            
        
        }

        while(true){

            for(let i =0; i<8; i++) {this.piePieces[i].opacity=0;} 

            this.canvas.add(this.apples[0]); this.canvas.add(this.apples[1]); this.canvas.add(this.apples[2]);

            await this.sleep(50);

            this.anim(this.apples[0], ["opacity"], [1], [850], [eas.easeInOutQuad]);
            this.anim(this.apples[1], ["opacity"], [1], [850], [eas.easeInOutQuad]);
            this.anim(this.apples[2], ["opacity"], [1], [850], [eas.easeInOutQuad]);

            hoverElement(this.numTypes[0], 8000, 2, -2, 0);
            hoverElement(this.apples[0], 6850, 3, 2.5, 0);
            hoverElement(this.apples[1], 6850, 3.2, 2.5, 0.75);
            hoverElement(this.apples[2], 6850, 2.85, 2.5, 0.5);

            await this.sleep(4500); 

            this.canvas.remove(this.apples[2]);
            changeNumType();
            hoverElement(this.numTypes[1], 8000, 2, -2, 0);

            await this.sleep(300); 
            this.canvas.remove(this.apples[0]);
        
            await this.sleep(30); 
            this.anim(this.apples[1], ["scaleX", "scaleY"], [0.5, 0.5], [350, 350], [eas.easeInBack, eas.easeInBack]); 
        
            await this.sleep(400); 
            
            this.canvas.remove(this.apples[1]);
            this.canvas.add(this.poof);
            this.anim(this.poof, ["scaleX", "scaleY", "opacity"], [1.5, 1.5, 0], [2500, 2500, 2500], [eas.easeOutQuad, eas.easeOutQuad, lin]);

            await this.sleep(2000); 
            changeNumType();
            hoverElement(this.numTypes[2], 9000, 2, -2, 0);

            this.canvas.add(this.smallApples[0]); this.canvas.add(this.smallApples[1]); this.canvas.add(this.smallApples[2]); this.canvas.add(this.smallApples[3]); this.canvas.add(this.smallApples[4]);
            this.canvas.add(this.minus);

            for(let i =0; i<5; i++) {
                this.anim(this.smallApples[i], ["opacity"], [1], [1500], [eas.easeInOutQuad]);
                hoverElement(this.smallApples[i], 6000, 2, 2.0, i*0.2);
            }
            this.anim(this.minus, ["opacity"], [1], [1500], [eas.easeInOutQuad]);
            hoverElement(this.minus, 6000, 2, 2.0, 0);

            await this.sleep(2300); 
            this.anim(this.smallApples[4], ["opacity"], [0], [200], [eas.easeInOutQuad]);
            this.anim(this.smallApples[0], ["opacity"], [0], [200], [eas.easeInOutQuad]);
            await this.sleep(200); 
            this.canvas.remove(this.smallApples[4]); this.canvas.remove(this.smallApples[0]); this.canvas.remove(this.poof);

            await this.sleep(900); 

            this.anim(this.smallApples[3], ["opacity"], [0], [200], [eas.easeInOutQuad]);
            this.anim(this.smallApples[1], ["opacity"], [0], [200], [eas.easeInOutQuad]);
            await this.sleep(200);
            this.canvas.remove(this.smallApples[3]); this.canvas.remove(this.smallApples[1]);

            await this.sleep(900); 
            
            this.anim(this.smallApples[2], ["opacity"], [0], [200], [eas.easeInOutQuad]);
            await this.sleep(100); 
            this.anim(this.minus, ["opacity"], [0], [200], [eas.easeInOutQuad]); 

            await this.sleep(250);

            this.canvas.remove(this.smallApples[2]); 
            this.canvas.remove(this.minus); 
            this.canvas.add(this.negativeApple);
            this.anim(this.negativeApple, ["opacity"], [1], [200], [eas.easeInOutQuad]);
            hoverElement(this.negativeApple, 4000, 2, 2.0, 0);

            await this.sleep(3000); 

            changeNumType();
            hoverElement(this.numTypes[3], 9000, 2, -2, 0);
            this.anim(this.negativeApple, ["opacity"], [0], [700], [eas.easeInOutQuad]);
            await this.sleep(200);

            for(let i =0; i<8; i++) {this.piePieces[i].opacity=1;} //Neccesary since they are png files, not svgs. png files have some weird bugs with moving them after they are added/removed from this.canvas. Hard to explain.
            
            this.anim(this.piePieces[0], ["left", "top"], [680.7+15, 135-55], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);
            this.anim(this.piePieces[1], ["left", "top"], [711.2+15, 140.7-63], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);
            this.anim(this.piePieces[2], ["left", "top"], [734.1+15, 137.4-60], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);
            this.anim(this.piePieces[3], ["left", "top"], [734.5+15, 109.9-45], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);
            this.anim(this.piePieces[4], ["left", "top"], [735.0+13, 78.7-50], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);
            this.anim(this.piePieces[5], ["left", "top"], [736.0+13, 78.6-61], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);
            this.anim(this.piePieces[6], ["left", "top"], [701.6+12, 83.3-66], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);
            this.anim(this.piePieces[7], ["left", "top"], [679.0+10, 81.4-52], [3500, 3500], [eas.easeInCirc, eas.easeInCirc]);

            await this.sleep(3600); 
            
            this.canvas.add(this.pie);
            for(let i =0; i<8; i++) {this.piePieces[i].opacity=0;}
            hoverElement(this.pie, 4000, 3, 2, 0);

            await this.sleep(3000); 
            
            changeNumType();
            hoverElement(this.numTypes[4], 9000, 2, -2, 0);

            this.anim(this.pie, 
                ["angle", "opacity", "scaleX", "scaleY"], 
                [360, 0.0, 0.8, 0.8], 
                [1500, 700, 700, 700], 
                [eas.easeInOutCubic, eas.easeInCubic, eas.easeInQuart, eas.easeInQuart]);

            await this.sleep(700); 

            this.canvas.add(this.pi); this.canvas.remove(this.pie);

            this.anim(this.pi, 
                ["angle", "opacity", "scaleX", "scaleY"], 
                [360, 1, 1.3, 1.3], 
                [1000, 700, 700, 700], 
                [eas.easeOutCubic, eas.easeOutCubic, eas.easeOutCubic, eas.easeOutCubic]);

            await this.sleep(3000); 

            changeNumType();
            hoverElement(this.numTypes[5], 9000, 2, -2, 0);

            this.anim(this.pi, ["opacity"], [0], [920], [eas.easeInOutQuad]); 
            await this.sleep(1020); 
            
            this.canvas.remove(this.pi);
            this.canvas.add(this.qstions[0]); this.canvas.add(this.qstions[1]); this.canvas.add(this.qstions[2]);
            this.anim(this.qstions[0], ["opacity"], [1], [850], [eas.easeInOutQuad]);
            this.anim(this.qstions[1], ["opacity"], [1], [850], [eas.easeInOutQuad]);
            this.anim(this.qstions[2], ["opacity"], [1], [850], [eas.easeInOutQuad]);
            hoverElement(this.qstions[0], 5000, 3, 2, 0);
            hoverElement(this.qstions[1], 5000, 3, 2, 0.7);
            hoverElement(this.qstions[2], 5000, 3, 2, 1.3);

            await this.sleep(4000);

            changeNumType();
            hoverElement(this.numTypes[0], 9000, 2, -2, 0);

            this.anim(this.qstions[0], ["opacity"], [0], [850], [eas.easeInOutQuad]);
            this.anim(this.qstions[1], ["opacity"], [0], [850], [eas.easeInOutQuad]);
            this.anim(this.qstions[2], ["opacity"], [0], [850], [eas.easeInOutQuad]);
            await this.sleep(850);
            this.canvas.remove(this.qstions[0]); this.canvas.remove(this.qstions[1]); this.canvas.remove(this.qstions[2]);

            this.resetScene();

        }

    }


    animR = (obj, probs, vals, durs, eases)=>{
        for(let i=0; i<probs.length; i++) {
            vals[i] = obj.get(probs[i]) + vals[i];
        }
        return this.anim(obj, probs, vals, durs, eases);
    }

    anim = (obj, probs, vals, durs, eases)=>{
        return new Promise(resolve => {
            
            let animsComplete = 0; 
            let completedAnim = ()=>{
                animsComplete++;
                if(animsComplete == probs.length) {this.activeAnimations.splice(animIndex, 1); resolve();}
            }
        
            let animChanges = 0; 
            let updateFrame = ()=>{
                animChanges++;
                if(animChanges >= probs.length-animsComplete) {
                    
                    animIndex = this.activeAnimations.indexOf(delRef);

                    for(let i = 0; i < probs.length; i++) {
                        this.activeAnimations[animIndex][3][i] -= frameLength*1000; //THE PROBLEM IS HERE! this.activeAnimations[animIndex] is undefined
                    }
                    
                    this.canvas.renderAll(); animChanges=0;
                }
            }

            this.activeAnimations.push([obj, probs, vals, durs, eases]);
            var animIndex = this.activeAnimations.length-1;
            var delRef = this.activeAnimations[animIndex];
            
            for(let i = 0; i < probs.length; i++) {

                obj.animate(probs[i], vals[i], {
                    onChange: ()=>{
                        updateFrame();
                    },
                    duration: durs[i],
                    easing: eases[i],
                    onComplete: ()=>{completedAnim();}
                });
                
            }
        });
    }

    resumePausedAnimations = ()=>{
        
        //Create a clone of all the original info, then delete it to avoid adding more and more animations over time. 
        let curAnimCopy = [];
        for(let i = 0; i < this.activeAnimations.length; i++) {
            let newAnimInfo = [];
            newAnimInfo.push(this.activeAnimations[i][0]);
            newAnimInfo.push([]); for(let j = 0; j < this.activeAnimations[i][1].length; j++) {newAnimInfo[1].push(this.activeAnimations[i][1][j]);} //Props
            newAnimInfo.push([]); for(let j = 0; j < this.activeAnimations[i][2].length; j++) {newAnimInfo[2].push(this.activeAnimations[i][2][j]);} //Vals
            newAnimInfo.push([]); for(let j = 0; j < this.activeAnimations[i][3].length; j++) {newAnimInfo[3].push(this.activeAnimations[i][3][j]);} //Durs
            newAnimInfo.push([]); for(let j = 0; j < this.activeAnimations[i][4].length; j++) {newAnimInfo[4].push(this.activeAnimations[i][4][j]);} //Eases
            curAnimCopy.push(newAnimInfo);
        }
        this.activeAnimations=[];
        
        let noOfAnims = curAnimCopy.length;
        for(let i = 0; i < noOfAnims; i++) {
            this.anim(curAnimCopy[i][0], curAnimCopy[i][1], curAnimCopy[i][2], curAnimCopy[i][3], curAnimCopy[i][4]);
        }
    }

    sleep = (ms)=>{
        return new Promise(resolve => {
            let countdown = ms;
            let step = ()=>{
                if(this.animating){countdown-=frameLength*1000;}
                if(countdown <= 0){resolve();}
                requestAnimationFrame(step);
            }
            step();
        });
    }

    }

    //Chapter interactivity (making the animations play):
var prepareChapters = function() {
    
    console.log("Preparing the chapters!");
    
    let chap1Con = new header1();
    let chap2Con = new header2();
    let chap25Con = new header25();
    let chap3Con = new header3();
    let chap4Con = new header4();
    let chap5Con = new header5();

    document.getElementById("chap1").addEventListener("mouseenter", (e)=>{chap1Con.animating=true;});
    document.getElementById("chap1").addEventListener("mouseleave", (e)=>{chap1Con.animating=false;});

    document.getElementById("chap2").addEventListener("mouseenter", (e)=>{chap2Con.animating=true;});
    document.getElementById("chap2").addEventListener("mouseleave", (e)=>{chap2Con.animating=false;});

    document.getElementById("chap25").addEventListener("mouseenter", (e)=>{chap25Con.animating=true;});
    document.getElementById("chap25").addEventListener("mouseleave", (e)=>{chap25Con.animating=false;});

    document.getElementById("chap3").addEventListener("mouseenter", (e)=>{chap3Con.animating=true;});
    document.getElementById("chap3").addEventListener("mouseleave", (e)=>{chap3Con.animating=false;});

    document.getElementById("chap4").addEventListener("mouseenter", (e)=>{chap4Con.animating=true;});
    document.getElementById("chap4").addEventListener("mouseleave", (e)=>{chap4Con.animating=false;});

    document.getElementById("chap5").addEventListener("mouseenter", (e)=>{
        chap5Con.animating=true;
        chap5Con.resumePausedAnimations();
    });
    document.getElementById("chap5").addEventListener("mouseleave", (e)=>{
        chap5Con.animating=false;
        fabric.runningAnimations.cancelAll()
    });

    if(isTouchDevise){
    let pmScroll = 0;
    document.addEventListener("scroll", (e)=>{

        let newScroll = window.scrollY;

        let Great = [newScroll > 905.4, newScroll > 1215.4, newScroll > 1665.4, newScroll > 1936.4, newScroll > 2245.4, newScroll > 2683.4, newScroll > 2995.4];
        let pGreat = [pmScroll > 905.4, pmScroll > 1215.4, pmScroll > 1665.4, pmScroll > 1936.4, pmScroll > 2245.4, pmScroll > 2683.4, pmScroll > 2995.4];

        if(Great[0] && !pGreat[0]) {chap1Con.animating = true;}
        if(!Great[0] && pGreat[0]) {chap1Con.animating = false;}
        if(Great[1] && !pGreat[1]) {chap1Con.animating = false; chap2Con.animating = true;}
        if(!Great[1] && pGreat[1]) {chap1Con.animating = true; chap2Con.animating = false;}
        if(Great[2] && !pGreat[2]) {chap2Con.animating = false; chap25Con.animating = true;}
        if(!Great[2] && pGreat[2]) {chap2Con.animating = true; chap25Con.animating = false;}
        if(Great[3] && !pGreat[3]) {chap25Con.animating = false; chap3Con.animating = true;}
        if(!Great[3] && pGreat[3]) {chap25Con.animating = true; chap3Con.animating = false;}
        if(Great[4] && !pGreat[4]) {chap3Con.animating = false; chap4Con.animating = true;}
        if(!Great[4] && pGreat[4]) {chap3Con.animating = true; chap4Con.animating = false;}
        if(Great[5] && !pGreat[5]) {chap4Con.animating = false; chap5Con.animating = true; chap5Con.resumePausedAnimations();}
        if(!Great[5] && pGreat[5]) {chap4Con.animating = true; chap5Con.animating = false; fabric.runningAnimations.cancelAll()}
        if(Great[6] && !pGreat[6]) {chap5Con.animating = false; fabric.runningAnimations.cancelAll()}
        if(!Great[6] && pGreat[6]) {chap5Con.animating = true; chap5Con.resumePausedAnimations();}

        pmScroll=newScroll;

    });}


    document.getElementById("chap1T").addEventListener("click", (e)=>{openBrowser("0","0","1");});
    document.getElementById("chap2T").addEventListener("click", (e)=>{openBrowser("1","0","1");});
    document.getElementById("chap25T").addEventListener("click", (e)=>{openBrowser("2","0","1");});
    document.getElementById("chap3T").addEventListener("click", (e)=>{openBrowser("3","0","1");});
    document.getElementById("chap4T").addEventListener("click", (e)=>{openBrowser("4","0","1");});
    document.getElementById("chap5T").addEventListener("click", (e)=>{openBrowser("5","0","1");});

    document.getElementById("sec21").addEventListener("click", (e)=>{openBrowser("1","0","1");});
    document.getElementById("sec22").addEventListener("click", (e)=>{openBrowser("1","1","1");});
    document.getElementById("sec23").addEventListener("click", (e)=>{openBrowser("1","2","1");});
    document.getElementById("sec24").addEventListener("click", (e)=>{openBrowser("1","3","1");});

    document.getElementById("sec251").addEventListener("click", (e)=>{openBrowser("2","0","1");});
    document.getElementById("sec252").addEventListener("click", (e)=>{openBrowser("2","1","1");});

    document.getElementById("sec41").addEventListener("click", (e)=>{openBrowser("4","0","1");});
    document.getElementById("sec42").addEventListener("click", (e)=>{openBrowser("4","1","1");});
    document.getElementById("sec43").addEventListener("click", (e)=>{openBrowser("4","2","1");});
    document.getElementById("sec44").addEventListener("click", (e)=>{openBrowser("4","3","1");});

    //Expanders:
    document.getElementById("chap1E").addEventListener("click", (e)=>{showResume([0,-1,-1,-1,-1]);});
    document.getElementById("chap2E").addEventListener("click", (e)=>{console.log("Woo! Called showResume!"); showResume([1,-1,-1,-1,-1]);});
    document.getElementById("chap25E").addEventListener("click", (e)=>{showResume([2,-1,-1,-1,-1]);});
    document.getElementById("chap3E").addEventListener("click", (e)=>{showResume([3,-1,-1,-1,-1]);});
    document.getElementById("chap4E").addEventListener("click", (e)=>{showResume([4,-1,-1,-1,-1]);});
    document.getElementById("chap5E").addEventListener("click", (e)=>{showResume([5,-1,-1,-1,-1]);});

    document.getElementById("sec21E").addEventListener("click", (e)=>{showResume([1,0,-1,-1,-1]);});
    document.getElementById("sec22E").addEventListener("click", (e)=>{showResume([1,1,-1,-1,-1]);});
    document.getElementById("sec23E").addEventListener("click", (e)=>{showResume([1,2,-1,-1,-1]);});
    document.getElementById("sec24E").addEventListener("click", (e)=>{showResume([1,3,-1,-1,-1]);});

    document.getElementById("sec251E").addEventListener("click", (e)=>{showResume([2,0,-1,-1,-1]);});
    document.getElementById("sec252E").addEventListener("click", (e)=>{showResume([2,1,-1,-1,-1]);});
    
    document.getElementById("sec41E").addEventListener("click", (e)=>{showResume([4,0,-1,-1,-1]);});
    document.getElementById("sec42E").addEventListener("click", (e)=>{showResume([4,1,-1,-1,-1]);});
    document.getElementById("sec43E").addEventListener("click", (e)=>{showResume([4,2,-1,-1,-1]);});
    document.getElementById("sec44E").addEventListener("click", (e)=>{showResume([4,3,-1,-1,-1]);});


}

//INDHOLDSFORTEGNELSE
let rD = [];
let treeI;

let depthDisplayed = 1;

var prepareToc = function() {
return new Promise((resolve) => {

    document.getElementById("collapseAllImgH0").addEventListener("click", (e)=>{depthDisplayed=0; createToc();
        document.getElementById("collapseAllImgH0").style.paddingTop="5px"; document.getElementById("collapseAllImgH0").style.opacity = 1;
        document.getElementById("collapseAllImgH1").style.paddingTop="1px"; document.getElementById("collapseAllImgH1").style.opacity = 0.5;
        document.getElementById("collapseAllImgH2").style.paddingTop="1px"; document.getElementById("collapseAllImgH2").style.opacity = 0.5;
        document.getElementById("collapseAllImgH3").style.paddingTop="3px"; document.getElementById("collapseAllImgH3").style.opacity = 0.5;
    });
    document.getElementById("collapseAllImgH1").addEventListener("click", (e)=>{depthDisplayed=1; createToc();
        document.getElementById("collapseAllImgH0").style.paddingTop="5px"; document.getElementById("collapseAllImgH0").style.opacity = 1;
        document.getElementById("collapseAllImgH1").style.paddingTop="5px"; document.getElementById("collapseAllImgH1").style.opacity = 1;
        document.getElementById("collapseAllImgH2").style.paddingTop="1px"; document.getElementById("collapseAllImgH2").style.opacity = 0.5;
        document.getElementById("collapseAllImgH3").style.paddingTop="3px"; document.getElementById("collapseAllImgH3").style.opacity = 0.5;
    });
    document.getElementById("collapseAllImgH2").addEventListener("click", (e)=>{depthDisplayed=2; createToc();
        document.getElementById("collapseAllImgH0").style.paddingTop="5px"; document.getElementById("collapseAllImgH0").style.opacity = 1;
        document.getElementById("collapseAllImgH1").style.paddingTop="5px"; document.getElementById("collapseAllImgH1").style.opacity = 1;
        document.getElementById("collapseAllImgH2").style.paddingTop="5px"; document.getElementById("collapseAllImgH2").style.opacity = 1;
        document.getElementById("collapseAllImgH3").style.paddingTop="3px"; document.getElementById("collapseAllImgH3").style.opacity = 0.5;
    });
    document.getElementById("collapseAllImgH3").addEventListener("click", (e)=>{depthDisplayed=3; createToc();
        document.getElementById("collapseAllImgH0").style.paddingTop="5px"; document.getElementById("collapseAllImgH0").style.opacity = 1;
        document.getElementById("collapseAllImgH1").style.paddingTop="5px"; document.getElementById("collapseAllImgH1").style.opacity = 1;
        document.getElementById("collapseAllImgH2").style.paddingTop="5px"; document.getElementById("collapseAllImgH2").style.opacity = 1;
        document.getElementById("collapseAllImgH3").style.paddingTop="5px"; document.getElementById("collapseAllImgH3").style.opacity = 1;
    });

    let initialToc = async function() {
        await parseResumeData();
        createToc();
    }
    let createToc = function(){
        treeI = [-1, -1, -1, -1, -1];
        createChildren(document.getElementById("TOC"));
        
        MathJax.typesetPromise([document.getElementById("TOC")]).then(()=>{
            MathJax.typesetPromise();
        }).catch((err)=>{console.log(err.message);});

        resolve();
    }

    let parseResumeData = async function() {

        let rs;
        await $.get("/Chapters/resumeData.txt", (data)=>{
            rs = data;
        });

        let hn = [-1, -1, -1, -1, -1];
        let param = "";

        let i=0;
        let L = rs.length;
        let num = 0;
        let c; 

        while(i < L) {

            c=rs[i]; 

            if(c == "¤") { //Fill out structure
                num = parseInt(rs[i+1]);

                let listEl = rD;
                for(let i = 0; i < num; i++) {
                    listEl = listEl[hn[i]][0];
                }
                listEl.push([[]]);

                hn[num] += 1;
                for(let i = num+1; i < 5; i++) {
                    hn[i]=-1;
                }

                i+=3; //THIS IS NORMALLY 4, 3 IS A TEST!
            }
            else if(c == "#") { //Push parameters
                num = parseInt(rs[i+1]);

                let listEl = rD;
                for(let i = 0; i < num; i++) {
                    listEl = listEl[hn[i]][0];
                }
                listEl[hn[num]].push(param);
                param="";

                i+=3; //THIS IS NORMALLY 4, 3 IS A TEST!
            }
            else{
                if(c=="\n" || c=="\r") {
                    if(param.length > 15) { //Don't add newlines, *except* for if we're already a way into the string. Then they're just meant as another kind of space
                        param += " ";
                    }
                }
                else{
                    if(!(param == "" && c==" ")) { //Don't add whitespace *before* the parameter has begun
                        param += c;
                    } 
                }
                i++;
            }

        }

    }

    let createChildren = function(par) {

        par.innerHTML="";
    
        let depth = 0; 
        while(treeI[depth] != -1) {depth++;}

        let listEl = rD;
        for(let i = 0; i < depth; i++) {
            listEl = listEl[treeI[i]][0];
        }    

        let L = listEl.length;
        for(let i=0; i < L; i++) {

            let node = document.createElement("div");

            treeI[depth] = i;
            for(let j = depth+1; j < 5; j++) {treeI[j]=-1;}

            let title = listEl[i][1];
            if(title != ""){
                node.setAttribute("class", "TocH TocH" + depth.toString())
                par.appendChild(node);

                let nodeText = document.createElement("span");
                node.appendChild(nodeText);
                nodeText.innerHTML=title;

                let expandImg = document.createElement("img");
                expandImg.setAttribute("class", "expandImg");
                expandImg.setAttribute("src", "Assets/Forside/TocExpand.svg");
                node.appendChild(expandImg);

                let treePath = []; for(let j = 0; j < 5; j++) {treePath.push(treeI[j]);}
                let tempPage = listEl[i][4];
                if(depth < 2){tempPage = "1";}

                let tempDepth = depth;

                expandImg.addEventListener("click", (e)=>{
                    showResume(treePath);
                })

                nodeText.addEventListener("click", (e)=>{
                    if(treePath[1] != -1) {openBrowser(treePath[0], treePath[1], tempPage, true);}
                    else{openBrowser(treePath[0], 0, tempPage, true);}
                })

            }
            if(listEl[i][0].length != 0){
                let cont = document.createElement("div");
                cont.setAttribute("class", "TocCont");
                par.appendChild(cont);

                let collapseImg = document.createElement("img");
                collapseImg.setAttribute("class", "collapseToc");
                collapseImg.setAttribute("src", "Assets/Forside/TocCollapse.svg");

                collapseImg.addEventListener("click", (e)=>{
                    if(cont.style.display=="none") {
                        cont.style.display="block"; 
                        setTimeout(() => {cont.style.opacity=1; cont.style.top="0px"; cont }, 10);
                    } else{
                        cont.style.opacity=0;
                        cont.style.top="-1.5em";
                        setTimeout(() => {cont.style.display="none";}, 100);
                    }
                });
                if(depth > depthDisplayed) {cont.style.display="none"; cont.style.opacity=0; cont.style.top="-1.5em";}

                if(title != "") {
                    node.appendChild(collapseImg);
                }

                createChildren(cont);
            }

        }

    }
    initialToc();

});
}

let changingResume = false;

let showResume = function(treePath) {

    let pars = document.getElementById("resumeParents");
    let childs = document.getElementById("resumeChildren");
    let curs = document.getElementById("resumeCur");

    //reset everything from before
    pars.innerText="";
    childs.innerText="";
    curs.innerText="";

    //Get the depth 
    let depth = 0; 
    while(treePath[depth] != -1 && depth < 5) {depth++;}

    //Set parents and page number
    let latestChildren = rD;
    let latestElement;

    for(let i=0; i < depth; i++){
        latestElement = latestChildren[treePath[i]] 
        latestChildren = latestElement[0];

        if(latestElement[1] != "" && i!=depth-1){
            let parentEl = document.createElement("div");
            parentEl.setAttribute("class", "resumeParentItem");
            pars.appendChild(parentEl);

            parentEl.innerHTML = "> " + latestElement[1];

            let parDepth = i;

            parentEl.addEventListener("click", (e)=>{
                let tempTreePath=[-1, -1, -1, -1, -1];
                for(let j = 0; j < parDepth+1; j++) {tempTreePath[j]=treePath[j];}
                showResume(tempTreePath);
            })

        }

    }
    if(depth > 2) {
        let pageEl = document.createElement("div");
        pars.appendChild(pageEl);
        pageEl.innerHTML = "Side " + latestElement[4];
        pageEl.style.opacity=0.5;
    }

    let secLessChapter = false;
    if(depth == 1 && latestChildren.length == 1) {latestChildren = latestChildren[0][0]; secLessChapter=true;}

    //Set resumeTitle
    document.getElementById("resumeTitle").innerHTML = latestElement[1];

    document.getElementById("resumeTitle").addEventListener("click", (e)=>{
        if(depth==1){openBrowser(treePath[0],0,1);}
        else if(depth==2){openBrowser(treePath[0],treePath[1],1);}
        else{openBrowser(treePath[0], treePath[1], latestElement[4]);}
    });

    //Set length:
    if(depth==1){
        document.getElementById("resumeSectionIL").innerHTML="";
    }
    else if(depth==2){
        let chapDir = rD[treePath[0]][4];
        let secDir = latestElement[4];

        $.get(chapDir+secDir + "IlMeta.txt", (data) => {
            pagesIL=data.split(",");
            let totalIL = 0;
            for(let i = 0; i < pagesIL.length; i++){totalIL += parseFloat(pagesIL[i]);}
            document.getElementById("resumeSectionIL").innerHTML=Math.floor(totalIL/2400).toString() + " normalsider"; 
        });
    }
    else{
        let chapDir = rD[treePath[0]][4];
        let secDir = rD[treePath[0]][0][treePath[1]][4];
        
        $.get(chapDir+secDir + "IlMeta.txt", (data) => {
            pagesIL=data.split(",");

            //Get the page range of this section
            let getPageAtTreePath = function(TP){
                let elDepth = 0; while(TP[elDepth] != -1 && elDepth < 5) {elDepth++;}
                let elLatestChild = rD;
                let elLatestElement;
                
                for(let i = 0; i < elDepth; i++) {
                    elLatestElement = elLatestChild[TP[i]];
                    if(elLatestElement!=undefined){elLatestChild = elLatestElement[0]};
                }
                if(elLatestElement!=undefined){return elLatestElement[4];}
                else{return null;}
            }

            let secPageCount;
            let searchTP = [treePath[0], treePath[1], treePath[2], treePath[3], treePath[4]];
            let searchDepth = depth-1;
            for(let i = depth-1; i > 1; i--){
                searchTP[searchDepth]+=1;
                let searchPage=getPageAtTreePath(searchTP);
                if(searchPage!=null){
                    secPageCount = searchPage-parseInt(latestElement[4]);
                    break;
                }else{
                    searchTP[searchDepth]=-1;
                    searchDepth--;
                }
            }
            if(secPageCount == null){secPageCount = pagesIL.length + 1 - parseInt(latestElement[4]);}

            let totalIL = 0;
            for(let i = 0; i < secPageCount; i++) {
                totalIL+=parseInt(pagesIL[latestElement[4]-1+i]);
            }
            document.getElementById("resumeSectionIL").innerHTML=Math.floor(totalIL/2400).toString() + " normalsider"; 
        });
    }

    //Set resumeText
    document.getElementById("resumeText").innerHTML = latestElement[2];

    //Set children (if any)
    document.getElementById("resumeChildrenTitle").style.display="none";
    if(latestChildren.length != 0) {document.getElementById("resumeChildrenTitle").style.display="block"; }
    for(i=0; i < latestChildren.length; i++) {
        let childEl = document.createElement("li");
        childs.appendChild(childEl);
        childEl.innerHTML = "| " + latestChildren[i][1][0].toUpperCase() + latestChildren[i][1].substring(1);

        let tempIndex = i;
        childEl.addEventListener("click", (e)=>{
            let tempTreePath = [-1, -1, -1, -1, -1];

            for(let j = 0; j < depth; j++) {tempTreePath[j]=treePath[j]; }
            if(secLessChapter) {tempTreePath[depth]=0; tempTreePath[depth+1]=tempIndex;}
            else{tempTreePath[depth] = tempIndex;}
            
            changingResume=true; setTimeout(() => {changingResume=false;}, 500);

            showResume(tempTreePath);
        })
    }

    //Set pensum (if any)
    document.getElementById("resumeCurTitle").style.display="none";
    if(depth < 4 && latestElement[5] != "") {
        document.getElementById("resumeCurTitle").style.display="block";
        let pensumList = latestElement[5].split(", ");
        for(let i =0; i < pensumList.length; i++) {
            let pensumEl = document.createElement("li");
            curs.appendChild(pensumEl);
            pensumEl.innerText = pensumList[i][0].toUpperCase() + pensumList[i].substring(1);
        }
    } 

    //Set important results (if any)
    if(depth==2 || (depth==1 && latestElement[0].length == 1)){
        document.getElementById("resumeImportantResultsTitle").style.display="block";
        document.getElementById("resumeImportantResultsIntro").style.display="block";

        let resultsData;
        if(depth==1){resultsData = latestElement[0][0][6]; }
        else{resultsData = latestElement[6];}

        if(resultsData != undefined){
            resultsData = resultsData.split("@");

            document.getElementById("resumeImportantResultsIntro").innerHTML = "Her ses et par vigtige <i>matematiske</i> resultater i afsnittet, der kan være gode at huske. Dette beskriver langt fra alt indholdet i afsnittet, bare det, der er godt at huske.";
            
            let impResults = document.getElementById("resumeImportantResults");
            impResults.innerHTML=""; 

            for(let i = 0; i < resultsData.length/4; i++){

                //Fill out structure
                let resultBlock = document.createElement("div");
                impResults.appendChild(resultBlock);

                let resultTitle = document.createElement("div"); resultBlock.appendChild(resultTitle); resultTitle.style.fontStyle="italic";
                let resultMath = document.createElement("div"); resultBlock.appendChild(resultMath); 
                let resultDesc = document.createElement("div"); resultBlock.appendChild(resultDesc);
                let resultLink = document.createElement("div"); resultBlock.appendChild(resultLink);

                resultBlock.setAttribute("class", "resumeImportantResultsBlock");

                //Set contents
                resultTitle.innerHTML = resultsData[i*4 + 0];
                resultMath.innerHTML = resultsData[i*4 + 1];
                resultDesc.innerHTML = resultsData[i*4 + 2];
                
                if(resultsData[i*4+2] != "") {
                    resultLink.innerHTML = "Mere info";
                    resultLink.setAttribute("class", "resumeImportantResultsLink");
                    resultLink.addEventListener("click", (e)=>{
                        let browParam = "Browser11.html?" + resultsData[i*4+3].replace(/ /g, "").replace("£", ",");
                        window.open(browParam, "_blank");
                    });
                }

            }
        
        }
        else{
            document.getElementById("resumeImportantResultsTitle").style.display="none";
            document.getElementById("resumeImportantResultsIntro").style.display="none";
            document.getElementById("resumeImportantResults").innerHTML="";
        }
    }
    else{
        document.getElementById("resumeImportantResultsTitle").style.display="none";
        document.getElementById("resumeImportantResultsIntro").style.display="none";
        document.getElementById("resumeImportantResults").innerHTML="";
    }

    //Finally display it:
    MathJax.typesetPromise([document.getElementById("TocResume")]).then(()=>{
        MathJax.typesetPromise();
    }).catch((err)=>{console.log(err.message);});

    document.getElementById("TocResumeCover").style.display = "flex";
    setTimeout(() => {
        document.getElementById("TocResumeCover").style.backgroundColor="rgba(0,0,0,0.5)";
    }, 5);

    setTimeout(() => {
        document.getElementById("contentBackground").style.webkitFilter="blur(0.5px)";
        document.getElementById("searchResults").style.webkitFilter="blur(0.5px)"; 
    }, 50);
    setTimeout(() => {
        document.getElementById("contentBackground").style.webkitFilter="blur(1px)";
        document.getElementById("searchResults").style.webkitFilter="blur(1px)"; 
    }, 150);
    setTimeout(() => {
        document.getElementById("contentBackground").style.webkitFilter="blur(1.5px)";
        document.getElementById("searchResults").style.webkitFilter="blur(1.5px)"; 
    }, 250);
    setTimeout(() => {
        document.getElementById("contentBackground").style.webkitFilter="blur(2px)";
        document.getElementById("searchResults").style.webkitFilter="blur(2px)"; 
    }, 350);

}


function activateEventListeners() {

    document.getElementById("quitLogo").addEventListener("click", (e)=>{
        if(!isTouchDevise){quitLogoAnim();}
        else{quitLogoMobile();}
    });

    document.getElementById("startOffImg").addEventListener("click",(e)=>{
        openBrowser(document.cookie[9], document.cookie[10], document.cookie.substring(11));
    });

    //Scrolling: 
    window.addEventListener("scroll", (e)=>{

        let newScroll = window.scrollY;

        if(!isTouchDevise){
            let newScroll = window.scrollY;

            if(atLogo) {

                if(newScroll > pScroll) {scrollCounter++;}
                if(scrollCounter==5) {
                    quitLogoAnim();
                }

            }
            else if(presentationMode && scrollStep==1){
                if(window.scrollY > 50){scrollStep++;} 
            }
            else if(presentationMode && scrollStep==2){
                if(newScroll > 1302){

                    if(!chaptersPrepared){prepareChapters(); chaptersPrepared=true;}
                    if(!TocPrepared){prepareToc(); TocPrepared=true;}
                    
                    let chaptersH1 = document.getElementById("chaptersH1");
                    chaptersH1.style.marginLeft="365px";
                    chaptersH1.style.opacity=1;

                    scrollStep++;
                } 
            }
            else if(scrollStep == 3){
                if(newScroll > 6152){
                    if(!TocPrepared){prepareToc(); TocPrepared=true;}
                    let tocH1 = document.getElementById("tocH1");
                    tocH1.style.marginLeft="-230px";
                    tocH1.style.opacity=1;
                    scrollStep++;
                }
            }

        }
        else{
            if(scrollStep == 0 && newScroll > 604){
                if(!chaptersPrepared){prepareChapters(); chaptersPrepared=true;}
                if(!TocPrepared){prepareToc(); TocPrepared=true;}
                let chaptersH1 = document.getElementById("chaptersH1");
                chaptersH1.style.marginLeft="365px";
                chaptersH1.style.opacity=1;
                scrollStep++;
            } 
            if(scrollStep == 1 && newScroll > 2554){
                if(!chaptersPrepared){prepareChapters(); chaptersPrepared=true;}
                if(!TocPrepared){prepareToc(); TocPrepared=true;}
                let tocH1 = document.getElementById("tocH1");
                tocH1.style.marginLeft="-230px";
                tocH1.style.opacity=1;
                scrollStep++;
            } 

        }

        pScroll=newScroll;
    });

    //TOOLBAR
    document.getElementById("toolbarIntro").addEventListener("click", (e)=>{
        window.scrollTo(0,5);
        scrollStep=2;
    });

    document.getElementById("toolbarChapters").addEventListener("click", (e)=>{
        
        if(!chaptersPrepared){prepareChapters(); chaptersPrepared=true;}
        if(!TocPrepared){prepareToc(); TocPrepared=true;}

        presentationMode=false;
        let chaptersH1 = document.getElementById("chaptersH1");
        chaptersH1.style.marginLeft="365px";
        chaptersH1.style.opacity=1;
        if(isTouchDevise){window.scrollTo(0,1018.6);}
        else{window.scrollTo(0,2102);}
        scrollStep=3;
    });

    document.getElementById("toolbarToc").addEventListener("click", (e)=>{
        presentationMode=false;
        let chaptersH1 = document.getElementById("chaptersH1");
        chaptersH1.style.marginLeft="365px";
        chaptersH1.style.opacity=1;
        let tocH1 = document.getElementById("tocH1");
        tocH1.style.marginLeft="-230px";
        tocH1.style.opacity=1;

        if(!chaptersPrepared){prepareChapters(); chaptersPrepared=true;}
        if(!TocPrepared){prepareToc(); TocPrepared=true;}
        
        if(isTouchDevise){window.scrollTo(0, 3164.6);}
        else{window.scrollTo(0,6852);}

        scrollStep=4;
    });
    document.getElementById("toolbarContact").addEventListener("click", async (e)=>{
        presentationMode=false;
        let chaptersH1 = document.getElementById("chaptersH1");
        chaptersH1.style.marginLeft="365px";
        chaptersH1.style.opacity=1;
        let tocH1 = document.getElementById("tocH1");
        tocH1.style.marginLeft="-230px";
        tocH1.style.opacity=1;

        if(!chaptersPrepared){prepareChapters(); chaptersPrepared=true;}
        if(!TocPrepared){await prepareToc(); TocPrepared=true;}

        window.scrollTo(0,document.getElementById("contentBackground").clientHeight+500);
    });

    document.getElementById("toolbarProofread").addEventListener("click", (e)=>{
        let resultsBackground = document.getElementById("korrekturGuide");
        document.getElementById("contentBackground").style.display = "none";
        resultsBackground.style.display="block";
        resultsBackground.style.height="100vh";

        let noResultsText = document.createElement("div");
        noResultsText.setAttribute("id", "noResult");
    });
    document.getElementById("korrekturTilbage").addEventListener("click", (e)=>{
        let korrekturGuide = document.getElementById("korrekturGuide");
        korrekturGuide.style.opacity=0;
        setTimeout(() => {korrekturGuide.style.display="none"; korrekturGuide.style.opacity=1;}, 500);

        document.getElementById("contentBackground").style.display = "block";
        
        window.scrollTo(0, scrollBeforeSearch);
    });

    //Searching 
    let searchBar = document.getElementById("searchBar");

    document.getElementById("searchRemove").addEventListener("click",(e)=>{
        let searchResults = document.getElementById("searchResults");
        searchResults.style.opacity=0;
        setTimeout(() => {searchResults.style.display="none"; searchResults.innerHTML=""; searchResults.style.opacity=1;}, 500);

        document.getElementById("contentBackground").style.display = "block";

        searchBar.value="";
        window.scrollTo(0, scrollBeforeSearch);
    });

    searchBar.addEventListener("keydown", async (e)=> {
        if(e.keyCode==13) {
            document.activeElement.blur();
            presentationMode=false;

            let typedQuery = searchBar.value;
            typedQuery = typedQuery.replace(/#|¤|\$|\s+$|^\s+/g, ""); //Remove commas, spaces in start, spaces in end, #, ¤ and $.

            if(!TocPrepared) {await prepareToc(); TocPrepared=true;}
            let sM = doSearch(typedQuery);

            //Show results:
            if(sM.length==0){
                let resultsBackground = document.getElementById("searchResults");
                document.getElementById("contentBackground").style.display = "none";
                resultsBackground.style.display="block";
                resultsBackground.style.height="100vh";

                let noResultsText = document.createElement("div");
                noResultsText.setAttribute("id", "noResult");
                
                resultsBackground.appendChild(noResultsText);
                noResultsText.innerHTML="Sorry, ingen resultater. Jeg er ikke uddannet programmør (endnu!), så min søgningsalgoritme er ikke den bedste i verden. Algoritmen søger hele ikke hele bogen igennem, men kun resuméer, titler, pensum og keywords.";

            }
            else{
                let resultsBackground = document.getElementById("searchResults");
                resultsBackground.style.display="block";
                resultsBackground.innerHTML="";

                let depth;
                let matchEl;

                scrollBeforeSearch = window.scrollY;
                window.scrollTo(0, 0);

                let noOfResults = Math.min(10, sM.length);
                for(let i = 0; i < noOfResults; i++) {

                    let tempIndex = i;

                    //Get the element
                    depth=0;
                    while(sM[i].searchI[depth] != -1 && depth < 5) {depth++;}

                    let latestChildren = rD;
                    for(let j=0; j < depth; j++){
                        matchEl = latestChildren[sM[i].searchI[j]];
                        latestChildren = matchEl[0];
                    }

                    //Display it:
                    let outerBlock = document.createElement("div"); outerBlock.setAttribute("class", "searchResult"); resultsBackground.appendChild(outerBlock);
                    let title = document.createElement("div"); title.setAttribute("class", "searchResultTitle"); outerBlock.appendChild(title);
                    let chapterAndPage = document.createElement("div"); chapterAndPage.setAttribute("class", "searchResultChapterAndPage"); outerBlock.appendChild(chapterAndPage);
                    let description = document.createElement("div"); description.setAttribute("class", "searchResultDescription"); outerBlock.appendChild(description);

                    setTimeout(() => {outerBlock.style.opacity=1;}, 500+150*i);

                    let moreInfo = document.createElement("img");
                    moreInfo.src = "Assets/Forside/TocExpand.svg";
                    moreInfo.setAttribute("class", "searchResultExpand");
                    moreInfo.style.height = "0.65em";
                    moreInfo.addEventListener("click", (e)=>{
                        showResume(sM[tempIndex].searchI);
                    })

                    let titleText = document.createElement("span");
                    title.appendChild(titleText);
                    title.appendChild(moreInfo);
                    titleText.innerHTML=matchEl[1];
                

                    if(depth > 2) {
                        chapterAndPage.innerHTML = rD[sM[i].searchI[0]][0][sM[i].searchI[1]][1]; 
                        chapterAndPage.innerHTML += " / side " + matchEl[4]; 

                        let tempPage = matchEl[4];

                        titleText.addEventListener("click", (e)=>{
                            openBrowser(sM[tempIndex].searchI[0], sM[tempIndex].searchI[1], tempPage);
                        })
                    }

                    description.innerHTML = matchEl[2];

                    MathJax.typesetPromise([outerBlock]).then(()=>{
                    MathJax.typesetPromise();
                    }).catch((err)=>{console.log(err.message);});

                }

                document.getElementById("contentBackground").style.display = "none";
            }

        }
    })

    //Toc: 
    document.getElementById("TocResumeCover").addEventListener("click", (e)=>{
        if(!changingResume) {
            let rec = document.getElementById("TocResume").getBoundingClientRect();
            if(!(e.clientX > rec.x && e.clientX < rec.x + rec.width && e.clientY > rec.y && e.clientY < rec.y + rec.height)) {
                document.getElementById("TocResumeCover").style.backgroundColor="rgba(0,0,0,0)";
                document.getElementById("TocResumeCover").style.display = "none";
                document.getElementById("contentBackground").style.webkitFilter="blur(0px)";
                document.getElementById("searchResults").style.webkitFilter="blur(0px)";
            }
        }
    });

}


        
 