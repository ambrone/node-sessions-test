$(document).ready(function(){
    var c = document.getElementById('canvas');
    c.height = 500;
    c.width = 500;
    ctx = c.getContext('2d');
    var Ball = function(x,y,xvel,yvel,a, color,mass, size){
	if(mass){
	    this.mass = mass;
	}else{
	    this.mass = 1;
	}
	this.size = size;
	this.color = color;
	this.x = x;
	this.y = y;
	this.xvel = xvel;
	this.yvel = yvel;
	this.a = a;
	this.move = function(){
	    this.x += this.xvel;
	    if(this.a == 0){
		this.y += this.yvel;
	    }else{
		this.y = this.y + .5*a*.00001 + this.yvel * .001;
		this.yvel += a*.001;
	    }
	}
	this.draw = function(){
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	    ctx.fill();
	}
	this.bounce = function(dir){
	    if(dir == 'x'){
		this.xvel *= -1;
	    }
	    if(dir == 'y'){
		this.yvel *= -1;
	    }
	}
	this.stop = function(){
	    this.xvel = 0;
	    this.yvel = 0;
	    window.clearInterval(id);
	}
	this.walled = 0;
    }
    var id;
    launch = function(balls){
	ctx.clearRect(0,0,c.width,c.height);
    
	if(Math.sqrt( Math.pow(balls[0].x-balls[1].x , 2) + Math.pow(balls[0].y - balls[1].y , 2) ) < balls[0].size + balls[1].size-3 ){
	    if(balls[0].walled  == 1 || balls[1].walled == 1){
		//balls[0].stop();
		//balls[1].stop();
		console.log("balls[0].x - balls[1].x " + (balls[0].x - balls[1].x));
		console.log(Math.sqrt( Math.pow(balls[0].x-balls[1].x , 2) + Math.pow(balls[0].y - balls[1].y , 2) ));
		//console.log(balls[0].size + balls[1].size);

		console.log('theta= '+theta);
//		ctx.rotate(theta);
		var b = Math.abs( balls[0].x - balls[1].x );
		var theta = Math.PI - 2 * Math.asin(b /(balls[0].size + balls[1].size));
//		ctx.rotate(theta);
		console.log('theta= '+theta);
		console.log('b= '+b);
		
		var x0 = balls[0].xvel;
		var x1 = balls[1].xvel;
		var y0 = balls[0].yvel;
		var y1 = balls[1].yvel;
		
		x01 = x0 * Math.cos(theta) - y0 * Math.sin(theta);
		y0 = y0 * Math.cos(theta) + x0 * Math.sin(theta);
		
		x11 = x1 * Math.cos(theta) - y1 * Math.sin(theta);
		y1 = y1 * Math.cos(theta) + x1 * Math.sin(theta);
		
		balls[0].xvel =x01;// ( (balls[0].mass -balls[1].mass)*x01 + 2 * balls[1].mass * x11 ) / (balls[0].mass + balls[1].mass );
		balls[0].yvel =y0;// ( (balls[0].mass -balls[1].mass)*y0 + 2 * balls[1].mass * y1 ) / (balls[0].mass + balls[1].mass );
		balls[1].xvel =x11; //( 2 * balls[0].mass * x01 + (balls[1].mass - balls[0].mass)*x11 ) / (balls[0].mass + balls[1].mass );
		balls[1].yvel =y1;// ( 2 * balls[0].mass * y0 + (balls[1].mass - balls[0].mass)*y1 ) / (balls[0].mass + balls[1].mass );
		balls[0].walled = 0;
		balls[1].walled = 0;
	    }
	}
	balls.forEach(function(ball){
  	    if(ball.x > c.width - ball.size){
		ball.x = c.width-ball.size;
		ball.bounce('x');
		ball.walled = 1;
	    }
	    if(ball.x <= 0 + ball.size){
		ball.x = ball.size;
		ball.bounce('x');
		ball.walled = 1;
	    }
	    if(ball.y <  ball.size){
		ball.y = ball.size;
		ball.bounce('y');
		ball.walled = 1;
	    }
	    if(ball.y > c.height - ball.size ){
		ball.y = c.height-ball.size;
		ball.bounce('y');
		ball.walled = 1;
	    }
	    //v1 = [ (m1 - m2)u1 + 2m2 u2 ] / (m1 + m2)
	    //v2 = [ 2m1 u1 + (m2 - m1)u2 ] / (m1 + m2)
	    //	    if(Math.abs(balls[0].x - balls[1].x) < balls[0].size + balls[1].size && Math.abs(balls[0].y - balls[1].y) < balls[0].size + balls[1].size){
	    
	    ball.move();
	    ball.draw();
	});
	
    }
    var ball = new Ball(270,0,0,1,0,'red', 1, 30);
    var ball2 = new Ball(250,499,0,1,0,'purple', 1, 30);
    var ball3 = new Ball(0,0,30,100,40,'cyan');
    var ball4 = new Ball(0,0,100,500,30,'blue');
    var ball5 = new Ball(0,0,7,400,3,'orange');

    id = window.setInterval(function(){
	launch([ball , ball2]);//, ball3, ball4, ball5]);
    },1);
    $('#launch').on('click', function(){
	
	var arr = [$('#xpos').val() , $('#ypos').val() ,$('#gravity').val(), $('#yvel').val() , $('#xvel').val()];
	for(x in arr){
	    arr[x] = parseInt(arr[x]);
	}
    });
    $('#stop').on('click' , function(){
	window.clearTimeout(id);
	ctx.clearRect(0,0,c.width,c.height);
    });
    function ct(){
	window.clearTimeout(id);
    }
    //c.onclick(cleart(id));
    $('canvas').on('click' , function(){
	clearInterval(id);
    });
});

var drop;
var launch;
var ctx;
