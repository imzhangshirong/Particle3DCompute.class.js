/*Particle effect created by Jarvis*/
var pt=Particle3DCompute.createNew();
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
	canvas_buffer.strokeStyle = 'rgba(100,100,100,0.4)';//颜色
}
function particle_start(con,p_num){
	space_con=con;
	connect_max=5;
	var ele_div=document.getElementById(space_con);
	canvas = ele_div.getContext('2d');
	buffer = document.createElement('canvas');
	canvas_buffer = buffer.getContext('2d');
	canvas_buffer.strokeStyle = 'rgba(100,100,100,0.4)';//颜色
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
	var r;
	eye_view[0]+=0.5;
	eye_view[0]=eye_view[0]%360;
	r=Math.pow(Math.pow(eye_position[0],2)+Math.pow(eye_position[1],2)+Math.pow(eye_position[2],2),0.5);
	eye_position=particle_sphr2rect(-eye_view[0],90-eye_view[1],r);
	particle_move();
	particle_drawn();
	setTimeout("particle_encircle()",40);
}
function particle_drawn(){
	particle_eye_vector();
	canvas_buffer.clearRect(0,0,space_size_x,space_size_y);
	var k,rgb,num=0;
	for(var i=0;i<particles_3d_x.length;++i){
		k=particle_3d22d(i);
		canvas_buffer.beginPath();
		canvas_buffer.arc(particles_2d_x[i],particles_2d_y[i], particles_3d_pR[i]*k, 0, Math.PI*2, true);
		//canvas_buffer.closePath();
		canvas_buffer.fillStyle = 'rgba(150,150,150,'+(k-0.8).toString()+')';
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
	for (var i =0; i<_connect_s.length;++i) {
		canvas_buffer.beginPath();
		canvas_buffer.moveTo(particles_2d_x[_connect_s[i]],particles_2d_y[_connect_s[i]]);
		canvas_buffer.lineTo(particles_2d_x[_connect_e[i]],particles_2d_y[_connect_e[i]]);
		canvas_buffer.lineWidth=2*(1-_connect_deep[i]/70);//线宽
		//canvas_buffer.closePath();
		canvas_buffer.stroke();
	};
	canvas.clearRect(0,0,space_size_x,space_size_y);
	canvas.drawImage(buffer, 0, 0);
}
function particle_3d22d(id){
	var temp_pos=[particles_3d_x[id],particles_3d_y[id],particles_3d_z[id]];
	var temp=pt.thDims2twDims(temp_pos,eye_position,eye_view,eye_focus);
	if(temp[1]<0){
		particles_2d_x[id]=temp[0][0]+space_size_x/2;
		particles_2d_y[id]=temp[0][1]+space_size_y/2;
	}
	particles_2d_deep[id]=temp[1];
	return temp[2];
}
function particle_eye_vector(){
	var eye_vector_;
	eye_vector_=pt.CeyeVector(eye_view);
	eye_vector_x=eye_vector_[0];
	eye_vector_y=eye_vector_[1];
	eye_vector_z=eye_vector_[2];
}
function particle_sphr2rect(angle1,angle2,r){
	return pt.sphr2rect(angle1,angle2,r);
}