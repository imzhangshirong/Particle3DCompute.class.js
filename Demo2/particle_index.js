/*Particle effect beta1.2 created by Jarvis 2015.5.22*/
var particles_3d_x=new Array();
var particles_3d_y=new Array();
var particles_3d_z=new Array();
var particles_3d_pR=new Array();
var particles_2d_x=new Array();
var particles_2d_y=new Array();
var particles_2d_rgb=new Array();
var particles_2d_deep=new Array();
var particles_move_vector_x=new Array();
var particles_move_vector_y=new Array();
var particles_move_vector_z=new Array();
var particles_move_v=new Array();
var particles_move_vt=new Array();
var particles_move_vk=new Array();
var eye_position=new Array(3);
var eye_view=new Array(2);
var eye_vector_x=new Array(3);
var eye_vector_y=new Array(3);
var eye_vector_z=new Array(3);
var eye_focus;
var particle_en_angle=new Array(2);
var space_con;
var space_size_x;
var space_size_y;
var canvas_buffer;//双缓冲
var buffer;
var canvas;
var connect_max;
var color=new Array(3);
var color_c_r=new Array(6);
var color_c_g=new Array(6);
var color_c_b=new Array(6);
var color_c=0;
window.onresize = function(){
	changesize();
}
function changesize(){
	space_size_x=document.body.clientWidth;
	space_size_y=document.body.clientHeight;
	buffer.height=space_size_y;
	buffer.width=space_size_x;
	buffer.height=space_size_y;
	buffer.width=space_size_x;
	var ele_div=document.getElementById(space_con);
	ele_div.height=space_size_y;
	ele_div.width=space_size_x;
	canvas_buffer.strokeStyle = 'rgba(255,255,255,0.9)';//颜色
}
function particle_start(con,p_num){
	space_con=con;
	connect_max=5;
	color=[100,184,184];
	color_c_r=[0,1,0,0,-1,0];
	color_c_g=[-1,0,0,1,0,0];
	color_c_b=[0,0,-1,0,0,1];
	var ele_div=document.getElementById(space_con);
	canvas = ele_div.getContext('2d');
	buffer = document.createElement('canvas');
	canvas_buffer = buffer.getContext('2d');
	canvas_buffer.strokeStyle ='rgba(255,255,255,0.9)';//颜色
	changesize();
	eye_view=[0,0];
	for(var i=0;i<p_num;++i){
		particles_3d_x[i]=200*(1-Math.random()*2);
		particles_3d_y[i]=200*(1-Math.random()*2);
		particles_3d_z[i]=150*(1-Math.random()*2);
		particles_move_vector_x[i]=1-Math.random()*2;
		particles_move_vector_y[i]=1-Math.random()*2;
		particles_move_vector_z[i]=1-Math.random()*2;
		particles_move_v[i]=Math.random()*Math.random()*3;
		particles_move_vt[i]=0;
		particles_move_vk[i]=1;
		particles_3d_pR[i]=1;
	}
	//alert(particles_3d_x[0])
	//particles_3d_x=[100,100,100,100,-100,-100,-100,-100];
	//particles_3d_y=[100,100,-100,-100,-100,100,100,-100];
	//particles_3d_z=[100,-100,-100,100,100,100,-100,-100];
	eye_focus=800;
	eye_position=[space_size_y/2*2/(space_size_x*0.8)*eye_focus,0,0];
	particle_drawn();
	particle_encircle();
}
function particle_move(){
	for(var i=0;i<particles_3d_x.length;++i){
		particles_3d_x[i]+=particles_move_vt[i]*particles_move_vector_x[i];
		particles_3d_y[i]+=particles_move_vt[i]*particles_move_vector_y[i];
		particles_3d_z[i]+=particles_move_vt[i]*particles_move_vector_z[i];
		particles_move_vt[i]+=0.01*particles_move_vk[i];
		if(Math.abs(particles_move_vt[i])>particles_move_v[i]){
			particles_move_vk[i]=-particles_move_vk[i];
		}
		if(particles_move_vt[i]==0){
			particles_move_vector_x[i]=1-Math.random()*2;
			particles_move_vector_y[i]=1-Math.random()*2;
			particles_move_vector_z[i]=1-Math.random()*2;
			particles_move_v[i]=Math.random()*Math.random()*3;
			particles_move_vt[i]=particles_move_v[i];
		}
	}
}
function particle_encircle(){
	var temp=new Array(3),r,d;
	eye_view[0]+=0.5;
	eye_view[0]=eye_view[0]%360;
	r=Math.pow(Math.pow(eye_position[0],2)+Math.pow(eye_position[1],2)+Math.pow(eye_position[2],2),0.5);
	eye_position=particle_sphr2rect(-eye_view[0],90-eye_view[1],r);
	particle_move();
	particle_drawn();
	color[0]+=color_c_r[color_c]*0.5;
	color[1]+=color_c_g[color_c]*0.5;
	color[2]+=color_c_b[color_c]*0.5;
	if (color[0]>184 || color[0]<100){
		if (color_c_r[color_c]!=0){
			color[0]+=-color_c_r[color_c];
			color_c++;
		}
	}
	if (color[1]>184 || color[1]<100){
		if (color_c_g[color_c]!=0){
			color[1]+=-color_c_g[color_c];
			color_c++;
		}
	}
	if (color[2]>184 || color[2]<100){
		if (color_c_b[color_c]!=0){
			color[2]+=-color_c_b[color_c];
			color_c++;
		}
	}
	color_c=color_c%6;
	//console.log("%d",color_c);
	//console.log('%f,%f,%f',color[0],color[1],color[2]);
	setTimeout("particle_encircle()",40);
}
function particle_drawn(){
	particle_eye_vector();
	canvas_buffer.clearRect(0,0,space_size_x,space_size_y);
	canvas_buffer.fillStyle='rgb('+Math.round(color[0]).toString()+','+Math.round(color[1]).toString()+','+Math.round(color[2]).toString()+')';
	//console.log("%s",canvas_buffer.fillStyle);
	canvas_buffer.fillRect(0,0,space_size_x,space_size_y);
	var k,rgb,num=0;
	for(var i=0;i<particles_3d_x.length;++i){
		k=particle_3d22d(i);
		canvas_buffer.beginPath();
		canvas_buffer.arc(particles_2d_x[i],particles_2d_y[i], particles_3d_pR[i]*k, 0, Math.PI*2, true);
		canvas_buffer.closePath();
		//rgb=255*(k-0.8);
		canvas_buffer.fillStyle = 'rgba(255,255,255,'+(k-0.8).toString()+')';
		//canvas_buffer.fillStyle="red";
		//alert( 'rgba(0,255,0,'+(k-0.5).toString()+')')
		canvas_buffer.fill();
	}
	var _connect_s=new Array();
	var _connect_e=new Array();
	var _connect_deep=new Array();
	var wk=0;
	for(var i=0;i<particles_3d_x.length;++i){
		wk=0;
		for(var o=0;o<particles_3d_x.length-(i+1);++o){
			d=Math.pow(Math.pow(particles_3d_x[i]-particles_3d_x[i+1+o],2)+Math.pow(particles_3d_y[i]-particles_3d_y[i+1+o],2)+Math.pow(particles_3d_z[i]-particles_3d_z[i+1+o],2),0.5);
			if(d<=70){
				_connect_s[num]=i;
				_connect_e[num]=i+1+o;
				_connect_deep[num]=d;
				num++;
				wk++;
			}
			if(wk>connect_max){
				break;
			}
		}
	}
	//alert(_connect_s.length)
	for (var i =0; i<_connect_s.length;++i) {
		canvas_buffer.beginPath();
		canvas_buffer.moveTo(particles_2d_x[_connect_s[i]],particles_2d_y[_connect_s[i]]);
		canvas_buffer.lineTo(particles_2d_x[_connect_e[i]],particles_2d_y[_connect_e[i]]);
		canvas_buffer.lineWidth=2*(1-_connect_deep[i]/70);//线宽
		
		canvas_buffer.closePath();
		canvas_buffer.stroke();
	};
	for(var i=0;i<particles_3d_x.length;i++){

	}
	
	//if(i==0){canvas_buffer.moveTo(particles_2d_x[i],particles_2d_y[i]);}
		//else{canvas_buffer.lineTo(particles_2d_x[i],particles_2d_y[i]);}
		//alert(particles_3d_pR[i]*k);
		//canvas_buffer.beginPath();
		//canvas_buffer.arc(particles_2d_x[i]-particles_3d_pR[i]*k*2,particles_2d_y[i]-particles_3d_pR[i]*k*2, particles_3d_pR[i]*k, 0, Math.PI*2, true);
		//canvas_buffer.closePath();
		//rgb=255*(k-0.8);
		//canvas_buffer.fillStyle = 'rgba(120,120,120,'+(k-0.8).toString()+')';
		//canvas_buffer.fillStyle="red";
		//alert( 'rgba(0,255,0,'+(k-0.5).toString()+')')
		//canvas_buffer.fill();

	
	//canvas_buffer.stroke();
	canvas.clearRect(0,0,space_size_x,space_size_y);
	canvas.drawImage(buffer, 0, 0);
}
function particle_3d22d(id){
	var temp=new Array(3);
	var temp_position=new Array(3);
	var k=0;
	temp[0]=particles_3d_x[id]-eye_position[0];
	temp[1]=particles_3d_y[id]-eye_position[1];
	temp[2]=particles_3d_z[id]-eye_position[2];
	temp_position[0]=temp[0]*eye_vector_x[0]+temp[1]*eye_vector_x[1]+temp[2]*eye_vector_x[2];
	temp_position[1]=temp[0]*eye_vector_y[0]+temp[1]*eye_vector_y[1]+temp[2]*eye_vector_y[2];
	temp_position[2]=temp[0]*eye_vector_z[0]+temp[1]*eye_vector_z[1]+temp[2]*eye_vector_z[2];
	if(temp_position[0]<0){
		k=-eye_focus/temp_position[0];
		particles_2d_x[id]=k*temp_position[1]+space_size_x/2;
		particles_2d_y[id]=-k*temp_position[2]+space_size_y/2;
	}
	particles_2d_deep[id]=temp_position[0];
	//alert(particles_2d_x[id].toString()+","+particles_2d_y[id].toString());
	return k;
}
function particle_eye_vector(){
	var r=1,a,b;
	a=360-eye_view[0];
	b=90+eye_view[1];
	eye_vector_x=particle_sphr2rect(a,b,r);
	a=90-eye_view[0];
	b=90;
	eye_vector_y=particle_sphr2rect(a,b,r);
	a=360-eye_view[0];
	b=eye_view[1];
	eye_vector_z=particle_sphr2rect(a,b,r);
}
function particle_sphr2rect(angle1,angle2,r){
	var temp=new Array(3);
	temp[0]=r*Math.sin(angle2/180*Math.PI)*Math.cos(angle1/180*Math.PI);
	temp[1]=r*Math.sin(angle2/180*Math.PI)*Math.sin(angle1/180*Math.PI);
	temp[2]=r*Math.cos(angle2/180*Math.PI);
	return temp;
}
function particle_rect2sphr(x,y,z){
	var temp=new Array(3);
	var t1,t2,t3,r;
	r=pow(x,2)+pow(y,2)+pow(z,2);
	t3=pow(x,2)+pow(y,2);
	t2=y/t3;
	t1=x/t3;
	if(t1>=0 && t2>=0){temp[0]=Math.acos(t1)/Math.PI*180}
	else if(t1<0 && t2>0){temp[0]=Math.acos(t1)/Math.PI*180}
	else if(t1<0 && t2<0){temp[0]=180-Math.asin(t2)/Math.PI*180}
	else if(t1>0 && t2<0){temp[0]=360+Math.asin(t2)/Math.PI*180}
	temp[1]=Math.acos(t3/r)*180/Math.PI;
	temp[2]=r;
	alert()
	return temp;
}
