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
    }
    var id;
    
    launch = function(balls){
	ctx.clearRect(0,0,c.width,c.height);
	balls.forEach(function(ball){
	    
	    if(Math.sqrt( Math.pow(balls[0].x-balls[1].x , 2) + Math.pow(balls[0].y - balls[1].y , 2) ) < balls[0].size + balls[1].size ){
//		balls[0].stop();
//		balls[1].stop();
		console.log("balls[0].x - balls[1].x " + (balls[0].x - balls[1].x));
		console.log(Math.sqrt( Math.pow(balls[0].x-balls[1].x , 2) + Math.pow(balls[0].y - balls[1].y , 2) ));
		console.log(balls[0].size + balls[1].size);

		var x0 = balls[0].xvel;
		var x1 = balls[1].xvel;
		var y0 = balls[0].yvel;
		var y1 = balls[1].yvel;

		balls[0].xvel = ( (balls[0].mass -balls[1].mass)*x0 + 2 * balls[1].mass * x1 ) / (balls[0].mass + balls[1].mass );
		balls[0].yvel = ( (balls[0].mass -balls[1].mass)*y0 + 2 * balls[1].mass * y1 ) / (balls[0].mass + balls[1].mass );
		balls[1].xvel = ( 2 * balls[0].mass * x0 + (balls[1].mass - balls[0].mass)*x1 ) / (balls[0].mass + balls[1].mass );
		balls[1].yvel = ( 2 * balls[0].mass * y0 + (balls[1].mass - balls[0].mass)*y1 ) / (balls[0].mass + balls[1].mass );
		
	    }
 	    if(ball.x > c.width - ball.size){
		ball.x = c.width-ball.size;
		ball.bounce('x');
	    }
	    if(ball.x <= 0 + ball.size){
		ball.x = ball.size;
		ball.bounce('x');
	    }
	    if(ball.y <  ball.size){
		ball.y = ball.size;
		ball.bounce('y');
	    }
	    if(ball.y > c.height - ball.size ){
		ball.y = c.height-ball.size;
		ball.bounce('y');
	    }
//v1 = [ (m1 - m2)u1 + 2m2 u2 ] / (m1 + m2)
//v2 = [ 2m1 u1 + (m2 - m1)u2 ] / (m1 + m2)
//	    if(Math.abs(balls[0].x - balls[1].x) < balls[0].size + balls[1].size && Math.abs(balls[0].y - balls[1].y) < balls[0].size + balls[1].size){
	    
	    ball.move();
	    ball.draw();

	});
    }
    var ball = new Ball(250,250,2,-1,0,'red', 1, 30);
    var ball2 = new Ball(0,499,1,3,0,'purple', 1, 30);
    var ball3 = new Ball(0,0,30,100,40,'cyan');
    var ball4 = new Ball(0,0,100,500,30,'blue');
    var ball5 = new Ball(0,0,7,400,3,'orange');

    id = window.setInterval(function(){
	launch([ball , ball2]);//, ball3, ball4, ball5]);
    },1);
    
    drop = function(ball,x,y,a,yvel,xvel, trace){
//	var ball = new Ball();
	ball.x = x;
	ball.y = y;
	ball.yvel = yvel;
	ball.xvel = xvel;
	console.log(Date.now());
	id = window.setInterval(function(){
	    if(trace!=true){
		ctx.clearRect(0,0,c.width,c.height);
	    }
	    ctx.fillStyle = 'red';
	    ctx.beginPath(); 
	    ctx.arc(ball.x,ball.y,10,0,2*Math.PI); // a circle with center point (100,100) and radius 80
	    ctx.fill();
	    ball.x += ball.xvel;

	    ball.yvel += a*.01;
	    ball.y = ball.y + .5*a*.001 + ball.yvel * .01;

	    //bounce right
	    if(ball.x > c.width-10){
		console.log('right');
		console.log(ball.x+' : '+c.width+'  '+ball.xvel);
		ball.x = c.width-10;
		ball.xvel = -.9 * ball.xvel;
		ball.yvel = .9 * ball.yvel;
	    }
	    //bounce left
	    if(ball.x <0){
		ball.x = 0;
		ball.xvel = -.9 * ball.xvel;
		ball.yvel = .9 * ball.yvel;
	    }

	    //bounce bottom
	    if(ball.y > c.height-10){
		ball.y = c.height-10;
		console.log(ball.vel);
		ball.yvel = - .9 * ball.yvel;
		ball.xvel = .9 * ball.xvel;
	
	
	    }
	    //bounce top
	    if(ball.y < 0){
		ball.y = 0;
		console.log('top');
		ball.yvel = -.95 * ball.yvel;
		ball.xvel = .9 * ball.xvel;
	    }
	    
	}, 10)
    }
    
    $('#launch').on('click', function(){
	
	var arr = [$('#xpos').val() , $('#ypos').val() ,$('#gravity').val(), $('#yvel').val() , $('#xvel').val()];
	for(x in arr){
	    arr[x] = parseInt(arr[x]);
	}
	var ball = new Ball();
	drop(ball, arr[0], arr[1], arr[2] , arr[3] , arr[4] , arr[5]);
	console.log(arr);
    });
    $('#stop').on('click' , function(){
	window.clearTimeout(id);
	ctx.clearRect(0,0,c.width,c.height);
    });
    function ct(){
	window.clearTimeout(id);
    }
    //c.onclick(cleart(id));
    
});

var drop;
var launch;
var ctx;
