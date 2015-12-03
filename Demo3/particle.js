/**
 * Created by Jarvis on 2015/11/8.
 */
var pt=Particle3DCompute.createNew();
var size=[window.screen.availWidth,window.screen.availHeight];//[width,height]
var time=25;//刷新时间
var canvasE=document.getElementById('space');//指定的id
canvasE.style.marginLeft=-size[0]/2+'px';
canvasE.style.marginTop=-size[1]/2+'px';
var canvas = canvasE.getContext('2d');
var bufferCanvasE = document.createElement('canvas');
var bufferCanvas = bufferCanvasE.getContext('2d');
var tetrahedron=new Array();
var eyePosition=[size[0]*1,0,0];
var eyeView=[0,0];
var eyeFocus=size[0];
var move=1;
var tetGo=0;
var rotation=[0.3,0];
for(var a=0;a<300;a++){
	var r=10+(Math.random()*2-1)*4;
	var roll=[Math.random()*360,(Math.random()*2-1)*180];
	var roll_v=rotate(roll[0],roll[1]);
	var temp_=new Array(3);
	var tempPo=new Array(11);//中心坐标，点1，点2，点3，点4，r,旋转角，旋转增量+-1，速度,目标坐标，路径函数,函数值
	tempPo[5]=r;
	tempPo[6]=roll;
	var roll_v_k=[Math.random(),Math.random()];
	if(roll_v_k[0]>0.5){roll_v_k[0]=1;}
	else if(roll_v_k[0]<0.5){roll_v_k[0]=-1;}
	if(roll_v_k[1]>0.5){roll_v_k[1]=1;}
	else if(roll_v_k[1]<0.5){roll_v_k[1]=-1;}
	tempPo[7]=roll_v_k.concat();
	tempPo[8]=Math.random();
	//if(tempPo[8]>0){tempPo[8]*=50;}
	//else{tempPo[8]*=80;}
	tempPo[9]=[(Math.random()*2-1)*size[0]/1.5,(Math.random()*2-1)*size[0]/1.5,(Math.random()*2-1)*size[0]/1.5];
	var temp_2=120+0;
	var temp;
	temp=[(Math.random()*2-1)*size[0]/1.5,(Math.random()*2-1)*size[0]/1.5,(Math.random()*2-1)*size[0]/1.5];
	tempPo[0]=temp;
	temp=pt.sphr2rect(0,0,r);
	tempPo[1]=temp.concat();
	temp=pt.sphr2rect(0,temp_2,r);
	tempPo[2]=temp.concat();
	temp=pt.sphr2rect(120,temp_2,r);
	tempPo[3]=temp.concat();
	temp=pt.sphr2rect(240,temp_2,r);
	tempPo[4]=temp.concat();
	tetrahedron[tetrahedron.length]=tempPo;
	var temp_d=(tempPo[9][0]-tempPo[0][0]);
	tempPo[10]=[tempPo[0][0]+temp_d*Math.random(),tempPo[0][0]+temp_d*Math.random(),tempPo[0][0]];

}
canvasE.width=size[0];
canvasE.height=size[1];
bufferCanvasE.width=size[0];
bufferCanvasE.height=size[1];
setInterval(function(){
	if(move){
		var r;
		eyeView[1]+=rotation[1];
		eyeView[0]+=rotation[0];
		r=Math.pow(Math.pow(eyePosition[0],2)+Math.pow(eyePosition[1],2)+Math.pow(eyePosition[2],2),0.5);
		eyePosition=pt.sphr2rect(-eyeView[0],90+eyeView[1],r);
	}
	drawn();
},time)
drawn();

function drawn(){
	bufferCanvas.clearRect(0,0,size[0],size[1]);
	for(var a=0;a<tetrahedron.length;a++){
		var temp=tetrahedron[a].concat(),temp_3d,temp_2d,x=size[0]/2,y=size[1]/2;
		var temp_=pt.thDims2twDims(temp[0],eyePosition,eyeView,eyeFocus);
		var temp_go_vie=[0,0];
		if(temp_[1]<0){
			var roll=temp[6];
			var roll_k=temp[7]
			roll[0]=(roll[0]+roll_k[0]*2);
			roll[1]=(roll[1]+roll_k[1]*2);
			if(roll[0]>360)roll[0]-=360;
			if(roll[0]<-360)roll[0]+=360;
			if(roll[1]>360)roll[1]-=360;
			if(roll[1]<-360)roll[1]+=360;
			var roll_v=rotate(roll[0],90-roll[1]);
			var temp_go_vie=[0,0];
			if(tetGo && Math.abs(temp[0][0]-temp[9][0])>1){
				temp_go_vie=pt.thDimsView(temp[0],temp[9]);
				roll_v=rotate(roll[0],90-temp_go_vie[1]);
				var orgiX=temp[0][0];
				var R=Math.pow(Math.pow(temp[0][0]-temp[9][0],2)+Math.pow(temp[0][1]-temp[9][1],2)+Math.pow(temp[0][2]-temp[9][2],2),0.5)/size[1];
				//console.log(R,Math.pow(temp[8]*R/10,2)*(orgiX-temp[9][0])/Math.abs((orgiX-temp[9][0])));
				temp[0][0]-=Math.pow(temp[8]*R,2)*(orgiX-temp[9][0])/Math.abs((orgiX-temp[9][0]));
				temp[0][1]=(temp[0][1]-temp[9][1])/(orgiX-temp[9][0])*(temp[0][0]-temp[9][0])+temp[9][1];
				temp[0][2]=(temp[0][2]-temp[9][2])/(orgiX-temp[9][0])*(temp[0][0]-temp[9][0])+temp[9][2];
				tetrahedron[a][0]=temp[0].concat();
				temp[8]*=R;
				tetrahedron[a][8]=temp[8];
				var tempL=temp[8]*30;
				var temp_2=120+tempL;
				temp[2]=pt.sphr2rect(0,temp_2,r).concat();
				temp[3]=pt.sphr2rect(120,temp_2,r).concat();
				temp[4]=pt.sphr2rect(240,temp_2,r).concat();
				tetrahedron[a][2]=temp[2].concat();
				tetrahedron[a][3]=temp[3].concat();
				tetrahedron[a][4]=temp[4].concat();
			}
			else if(tetrahedron[a][8]!=0){
				temp[8]=0;
				tetrahedron[a][8]=temp[8];
				var tempL=temp[8]*30;
				var temp_2=120+tempL;
				temp[2]=pt.sphr2rect(0,temp_2,r).concat();
				temp[3]=pt.sphr2rect(120,temp_2,r).concat();
				temp[4]=pt.sphr2rect(240,temp_2,r).concat();
				tetrahedron[a][2]=temp[2].concat();
				tetrahedron[a][3]=temp[3].concat();
				tetrahedron[a][4]=temp[4].concat();
			}
			var temp_1=new Array(3);
			temp_1[0]=temp[1][0]*roll_v[0][0]+temp[1][1]*roll_v[0][1]+temp[1][2]*roll_v[0][2];
			temp_1[1]=temp[1][0]*roll_v[1][0]+temp[1][1]*roll_v[1][1]+temp[1][2]*roll_v[1][2];
			temp_1[2]=temp[1][0]*roll_v[2][0]+temp[1][1]*roll_v[2][1]+temp[1][2]*roll_v[2][2];
			temp[1]=temp_1.concat();
			temp_1[0]=temp[2][0]*roll_v[0][0]+temp[2][1]*roll_v[0][1]+temp[2][2]*roll_v[0][2];
			temp_1[1]=temp[2][0]*roll_v[1][0]+temp[2][1]*roll_v[1][1]+temp[2][2]*roll_v[1][2];
			temp_1[2]=temp[2][0]*roll_v[2][0]+temp[2][1]*roll_v[2][1]+temp[2][2]*roll_v[2][2];
			temp[2]=temp_1.concat();
			temp_1[0]=temp[3][0]*roll_v[0][0]+temp[3][1]*roll_v[0][1]+temp[3][2]*roll_v[0][2];
			temp_1[1]=temp[3][0]*roll_v[1][0]+temp[3][1]*roll_v[1][1]+temp[3][2]*roll_v[1][2];
			temp_1[2]=temp[3][0]*roll_v[2][0]+temp[3][1]*roll_v[2][1]+temp[3][2]*roll_v[2][2];
			temp[3]=temp_1.concat();
			temp_1[0]=temp[4][0]*roll_v[0][0]+temp[4][1]*roll_v[0][1]+temp[4][2]*roll_v[0][2];
			temp_1[1]=temp[4][0]*roll_v[1][0]+temp[4][1]*roll_v[1][1]+temp[4][2]*roll_v[1][2];
			temp_1[2]=temp[4][0]*roll_v[2][0]+temp[4][1]*roll_v[2][1]+temp[4][2]*roll_v[2][2];
			temp[4]=temp_1.concat();
			if(tetGo && Math.abs(temp[0][0]-temp[9][0])>1){
				temp[1]=rotateZ(temp[1],-temp_go_vie[0]);
				temp[2]=rotateZ(temp[2],-temp_go_vie[0]);
				temp[3]=rotateZ(temp[3],-temp_go_vie[0]);
				temp[4]=rotateZ(temp[4],-temp_go_vie[0]);
			}
			bufferCanvas.fillStyle="rgba(0,0,0,"+temp_[2]*temp_[2]/2+")";
			bufferCanvas.beginPath();
			temp_3d=merge(temp[0],temp[1]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.moveTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[2]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[3]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			bufferCanvas.fill();
			bufferCanvas.beginPath();
			temp_3d=merge(temp[0],temp[1]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.moveTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[2]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[4]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			bufferCanvas.fill();
			bufferCanvas.beginPath();
			temp_3d=merge(temp[0],temp[1]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.moveTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[3]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[4]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			bufferCanvas.fill();
			bufferCanvas.beginPath();
			temp_3d=merge(temp[0],temp[2]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.moveTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[3]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			temp_3d=merge(temp[0],temp[4]);
			temp_2d=pt.thDims2twDims(temp_3d,eyePosition,eyeView,eyeFocus)[0];
			temp_2d[0]+=x;temp_2d[1]+=y;
			bufferCanvas.lineTo(temp_2d[0], temp_2d[1]);
			bufferCanvas.fill();
		}

	}
	canvas.clearRect(0,0,size[0],size[1]);
	canvas.drawImage(bufferCanvasE, 0, 0);
}
//console.log(rotate(30,40))
function rotate(angle1,angle2){//坐标系旋转
	var temp1=angle1;
	var temp2=angle2;
	return pt.CeyeVector([temp1,temp2]);
}
function rotateZ(thPos,angleXY){//旋转
	var temp=thPos.concat();
	var angle=angleXY;
	var r=Math.pow(Math.pow(temp[0],2)+Math.pow(temp[1],2),0.5)
	var ank=[temp[0]/r,temp[1]/r];
	var an=Math.acos(Math.abs(ank[0]));
	var ang;
	if(ank[0]>0 && ank[1]<0){ang=2*Math.PI-an;}
	else if(ank[0]<0 && ank[1]<0){ang=Math.PI+an;}
	else if(ank[0]<0 && ank[1]>0){ang=Math.PI-an;}
	else{ang=an;}
	angle=(angle%360)/180*Math.PI;
	ang+=angle;
	temp[0]=r*Math.cos(ang);
	temp[1]=r*Math.sin(ang);
	return temp;
}
function merge(a,b){
	if (b.length>a.length){
		var t=a;a=b;b=t;
	}
	return a.map(function(v,i){
		return v+(b[i]||0);
	});
}
$('#space').click(function(){
	//if(tetGo){
	//	tetGo=0;
	//}
	//else {
		for (var a = 0; a < tetrahedron.length; a++) {
			tetrahedron[a][8] = Math.random() / 2;
			//if(tempPo[8]>0){tempPo[8]*=50;}
			//else{tempPo[8]*=80;}
			tetrahedron[a][9] = [(Math.random() * 2 - 1) * size[0] / 1.5, (Math.random() * 2 - 1) * size[0] / 1.5, (Math.random() * 2 - 1) * size[0] / 1.5];
		}
		tetGo = 1;
	//}
})
$('#space').mousemove(function(e){
	rotation[0]=(e.clientX-$(window).width()/2)/$(window).width()/2*3;
	rotation[1]=($(window).height()/2- e.clientY)/$(window).height()/2*3;
})
