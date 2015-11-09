/*Particle 3D compute beta 2.0 created by Jarvis 2015.7.1*/
var Particle3DCompute = {
	createNew: function() {
		var ptc={};
		//thDimsPos三维坐标
		//eyePos观察点位置
		//eyeView视角偏转[水平偏转角,数值偏转角]
		//eyeFocus焦距
		ptc.sphr2rect=function(angle1,angle2,r){//球坐标到直角坐标
			var temp=new Array(3);
			temp[0]=r*Math.sin(angle2/180*Math.PI)*Math.cos(angle1/180*Math.PI);
			temp[1]=r*Math.sin(angle2/180*Math.PI)*Math.sin(angle1/180*Math.PI);
			temp[2]=r*Math.cos(angle2/180*Math.PI);
			return temp;
		}
		ptc.CeyeVector=function(eyeView){//返回视角向量[x[x1,y1,z1],y[x2,y2,z2],z[x3,y3,z3]]
			var r=1,a,b,eyeVector=new Array(3);
			a=360-eyeView[0];
			b=90+eyeView[1];
			eyeVector[0]=this.sphr2rect(a,b,r);
			a=90-eyeView[0];
			b=90;
			eyeVector[1]=this.sphr2rect(a,b,r);
			a=360-eyeView[0];
			b=eyeView[1];
			eyeVector[2]=this.sphr2rect(a,b,r);
			return eyeVector;
		}
		ptc.thDims2twDims=function(thDimsPos,eyePos,eyeView,eyeFocus){//三维投影到二维平面，返回[[x,y],深度,比例系数]
			var temp=new Array(3);
			var temp_position=new Array(3);
			var k=0;
			var twDimsPos= new Array(3);
			var eyeVector=this.CeyeVector(eyeView);
			temp[0]=thDimsPos[0]-eyePos[0];
			temp[1]=thDimsPos[1]-eyePos[1];
			temp[2]=thDimsPos[2]-eyePos[2];
			temp_position[0]=temp[0]*eyeVector[0][0]+temp[1]*eyeVector[0][1]+temp[2]*eyeVector[0][2];
			temp_position[1]=temp[0]*eyeVector[1][0]+temp[1]*eyeVector[1][1]+temp[2]*eyeVector[1][2];
			temp_position[2]=temp[0]*eyeVector[2][0]+temp[1]*eyeVector[2][1]+temp[2]*eyeVector[2][2];
			twDimsPos[0]=new Array(2);
			if(temp_position[0]<0){
				k=-eyeFocus/temp_position[0];
				//console.log(temp_position);
				twDimsPos[0][0]=k*k*temp_position[1];
				twDimsPos[0][1]=-k*k*temp_position[2];
				//console.log(twDimsPos[0]);
			}
			twDimsPos[1]=temp_position[0];
			twDimsPos[2]=k;
			return twDimsPos;
		}
		ptc.thDimsView=function(thDimsPos1,thDimsPos2){// 返回A，B两点三维直角坐标，以A点朝向B的视角角度
			var temp_vector=new Array(3);
			var eyeView=new Array(2);
			var d,temp1,temp2,angle1,angle2;
			temp_vector[0]=thDimsPos2[0]-thDimsPos1[0];
			temp_vector[1]=thDimsPos2[1]-thDimsPos1[1];
			temp_vector[2]=thDimsPos2[2]-thDimsPos1[2];
			temp1=Math.pow(Math.pow(temp_vector[0],2)+Math.pow(temp_vector[1],2),0.5);
			d=Math.pow(Math.pow(temp_vector[0],2)+Math.pow(temp_vector[1],2)+Math.pow(temp_vector[2],2),0.5);
			angle1=Math.acos(temp1/d)/Math.PI*180;
			if(temp_vector[2]<0){angle1=-angle1;}
			angle2=180-Math.acos(temp_vector[0]/temp1)/Math.PI*180;
			if(temp_vector[1]<0){angle2=-angle2;}
			eyeView[0]=angle2;
			eyeView[1]=angle1;
			return eyeView;
		}
		ptc.thDimsVector=function(thDimsPos1,thDimsPos2){// 返回A，B两点三维直角坐标，以A点朝向B的视角向量坐标
			return this.CeyeVector(this.thDimsView(thDimsPos1,thDimsPos2));
		}
		return ptc;
	}
}