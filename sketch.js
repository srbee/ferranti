function setup() {
  createCanvas(1000, 1000);
  angleMode(DEGREES);
  
  stroke('red')
  xy=[0 ,0];xy1=[0 ,0];xy3=[0 ,0];xy4=[0 ,0];xy5=[0 ,0]
  
  strokeWeight(2)
  textSize(20)
  //amplifyCurrent=1
  E_mag=300;
  XbyR = 10// X/R ratio
  R=1
  X= XbyR * R
  P=0//active power P
  VA=0 //volt-amp
  Q=0//reactive power
  phi=0//angle bet V , I
  loadPfAngle=0
  addr="https://srbee.github.io/srbee/"
  linkText="Back To Main Menu"
  mantra="_blank"
  link=createA(addr,linkText,mantra)
  link.position(width/2,height/100)
  link.style("font-size",15+"px")
  
  XL_slider=createSlider(-15,10,1,1)//RL
  XL_slider.position(40,300)
  XL_slider.style('width', '180px');

  RL_slider=createSlider(0,20,1,.5)//XL
  RL_slider.position(40,200)
}// end of function setup()

function draw() {
 background(220,200,200);
 translate(width/2,height/2);
 circle(0,0,10)
 XL=XL_slider.value()
  
  RL=RL_slider.value()
  Rt=R+RL_slider.value()
  Xt=X+XL_slider.value()
  
  Zmag=sqrt(Rt*Rt+Xt*Xt)
  I_mag=E_mag/Zmag
  I_mag=I_mag
  ang=-1*atan2(Xt,Rt)
  //ang=ang.toFixed(2)
  
 xy1=phasor(xy[0],xy[1],E_mag,0)//E phasor 
 push();stroke('green')
 xy5=phasor(xy[0],xy[1],I_mag*8,ang)// current phasor
 
 pop()
 
 push();stroke(255,255,0)
 xy3=phasor(xy1[0],xy1[1],R*I_mag,ang+180)//IR drop 
 pop()
 
 push();stroke('blue')
 xy4=phasor(xy3[0],xy3[1],X*I_mag,ang+90+180)//IX drop 
 pop()
  V_mag= sqrt(xy4[0]*xy4[0]+xy4[1]*xy4[1])
  
 delta=atan2(xy4[1],xy4[0])
  //delta=atan2(xy4[1],xy[0])
 push()
 stroke(255,0,0)
 phasor(xy[0],xy[1],V_mag,-delta)//draws the V phasor
  
 pop()
 
 myText()
 phi=ang+delta
 P=((V_mag*I_mag*cos(phi))/1000)//kW
 VA=V_mag*I_mag/1000//kVA
 Q=((V_mag*I_mag*sin(phi))/1000)//kVAr
 loadPfAngle=atan(XL/RL)
  //print('loadpf='+loadPfAngle+'phi='+phi)
  
}//  end of draw()

function myText(){
  push()
  stroke('yellow')
  text('E',100-10,18)
  text('IR',xy3[0],xy3[1])
  text('IX',(xy3[0]+xy4[0])/2,(xy3[1]+xy4[1])/2)
  text('I = '+round(I_mag)+' A',xy5[0]+5,xy5[1])
  text(' XL= '+XL_slider.value()+' ohm',-width/2.4,-height/4.9)
  push();textSize(12)
  text('Cap',-width/2.07,-height/5.4)
  text('Ind',-width/3.6,-height/5.4)
  pop()
  push();textSize(24)
  text('Drawing Power Through Inductive Circuit',-width/3.9,-height/4.1)
  push();textSize(15)
  text('P  = '+P.toFixed(2)+' kW',-width/3.9,-height/4.8)
  text('Q  = '+Q.toFixed(2)+' kVAR',-width/3.9,-height/5.7)
  text('VA = '+VA.toFixed(2)+' kVA',-width/3.9,-height/7.1)
  text('PF Angle= '+loadPfAngle.toFixed(2)+' deg',-width/3.9,-height/9.5)
  text('PF      = '+cos(loadPfAngle).toFixed(2)+'',-width/3.9,-height/13.5)
  pop()
  pop()
  text(' RL= '+RL_slider.value()+' ohm',-width/2.4,-height/3.3)
  
  
  push();stroke('blue')
  // to supress displaying voltage angle if mgtd is zero
  if(round(V_mag)==0){text('V = '+round(V_mag),80,-240)}
  else {text('V = '+round(V_mag)+'/_'+(- delta.toFixed(2)),60,-355)}
  text('RL=  '+RL,210,-395)
  text('XL=  '+XL,210,-345)
   
  text('E = '+round(E_mag),-170,-355)
  text('/_ '+0,-95,-355)
  pop()
  stroke('yellow')
  text('V',xy4[0]/2,xy4[1]/2)
  stroke('yellow')
  push();textSize(12)
  text('R='+ R +' ohm'+ ' : jX= '+' j'+X+' ohm',-70,-440)
  pop()
  pop()
  text('--> I = '+round(I_mag)+'/_'+(ang.toFixed(2))+' A',-90,-395)
  
  myFig()
  addText()
}//end of function myText()

function phasor(start_x,start_y,Mgtd,theta){
  //==================================================
  //draws arrow from (sx,sy) of length M @/_theta
  //and returns (x,y) coods of end point
  //angleMode(DEGREES) required 
  //====================================================
  a=theta
  m=Mgtd
  x1=start_x ; y1=start_y
  x2=x1+m*cos(theta); y2=y1-m*sin(theta)
  turnBack=20
  aL=0.1//arrowLength=0.1
  aPI=a+180;//turn back angle
  a1=aPI-turnBack ; a2=aPI+turnBack;
  // advance and retard by 20 to 30 deg for good looking arrow
  x3=x2+aL*m*cos(a1);y3=y2-aL*m*sin(a1);
  x4=x2+aL*m*cos(a2);y4=y2-aL*m*sin(a2);
  
  line(x1,y1,x2,y2);
  line(x2,y2,x3,y3);
  line(x2,y2,x4,y4);
  
  return[x2,y2]
};// end of function phasor()

function myFig(){
  //rect(-50,-270,80,10)
  x= -width/20;y=-height/2.3;w=width/10;h=width/60
  rect(x,y,w,h)
  xaa=-width/20;ya=-height/2.35;xa=-width/5;yaa=ya
  line(xa,ya,xaa,yaa)//left conn line
  xbb= width/20;yb=-height/2.35;xb=+width/5;ybb=yb
  line(xa,ya+height/8,xb,ya+height/8)//bottom line
  line(xb,yb,xbb,ybb)//right conn line
  xc=xa;yc=ya+height/16;radius=50
  circle(xc,yc,radius)
  line(xa,ya,xa,ya+height/26)
  line(xa,ya+height/11.5,xa,ya+height/8)
  push();textSize(30)
  text('~',xa-width/100,ya+height/14)
  pop()
  line(xb,yb,xb,yb+height/50)
  bw=width/100;bh=height/50
  rect(xb-width/169,yb+height/50,bw,bh)//Rload box
  line(xb,yb+height/25,xb,yb+height/15)
  rect(xb-width/169,yb+height/15,bw,bh)
  line(xb,ya+height/8,xb,ya+height/11.5)
}//end of function myFig()

function addText(){
  strokeWeight(1)
  push();textSize(12);stroke('blue')
  text('This app can be used to study:',-width/2.5,-height/23)
  text('  (1) Transformer Regulation',-width/2.5,-height/50)
  text('  (2) Syncgronous Machine Regulation',-width/2.5,-height/340)
  text('  (3) Maximum Power Transfer Theorem',-width/2.5,height/54)
  text('  (4) Ferranti Effect',-width/2.5,height/24)
  pop()
}//end of function addText()


