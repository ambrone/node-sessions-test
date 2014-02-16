$(document).ready(function(){
    var c = document.getElementById('canvas');
    c.height = 500;
    c.width = 500;
    var ctx = c.getContext('2d');
    var Ball = function(x,y,xvel,yvel,a, color){
	this.x = x;
	this.y = y;
	this.xvel = xvel;
	this.yvel = yvel;
	this.a = a;
	this.move = function(){
	    console.log(this.x);
	    this.x += this.xvel;
	    this.y = this.y + .5*a*.001 + this.yvel * .01;
	    this.yvel += a*.01;
	}
	this.color = color;
	this.draw = function(){
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc(this.x,this.y,10,0,2*Math.PI);
	    ctx.fill();
	}
	this.bounce = function(dir){
	    console.log(this.xvel);
	    if(dir == 'x'){
		this.xvel *= -1;
	    }
	    if(dir == 'y'){
		this.yvel *= -1;
	    }
	}
    }
    var id;
    
    launch = function(balls){
	ctx.clearRect(0,0,c.width,c.height);
	balls.forEach(function(ball){
	    ball.move();
	    ball.draw();
	    if(ball.x > c.width){
		ball.x = c.width;
		ball.bounce('x');
	    }
	    if(ball.x <= 0){
		ball.x = 5;
		ball.bounce('x');
	    }
	    if(ball.y < 0){
		ball.y = 0;
		ball.bounce('y');
	    }
	    if(ball.y > c.height){
		ball.y = c.height;
		ball.bounce('y');
	    }


	    if(Math.abs(balls[0].x - balls[1].x) < 10 && Math.abs(balls[0].y - balls[1].y) < 10){
		var x0 = balls[0].xvel;
		var x1 = balls[1].xvel;
		var y0 = balls[0].yvel;
		var y1 = balls[1].yvel;

		balls[0].xvel = x1;
		balls[0].yvel = y1;
		balls[1].xvel = x0;
		balls[1].yvel = y0;
		
	    }
	    
	});
    }
    var ball = new Ball(499,499,-2,-300,30,'red');
    var ball2 = new Ball(0,499,3,100,30,'purple');
    var ball3 = new Ball(0,0,30,100,40,'cyan');
    var ball4 = new Ball(0,0,100,500,30,'blue');
    var ball5 = new Ball(0,0,7,400,3,'orange');

    window.setInterval(function(){
	launch([ball , ball2]);//, ball3, ball4, ball5]);
    },10);
    
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
		//window.clearTimeout(id);
		//drop(ball.x , ball.y, a, -.9*ball.vel, xvel,trace);
	    }
	    //bounce top
	    if(ball.y < 0){
		ball.y = 0;
		console.log('top');
		ball.yvel = -.95 * ball.yvel;
		ball.xvel = .9 * ball.xvel;
	    }
	    //stop
//	    if(ball.y > c.height-10 && Math.abs(ball.vel) < 2 ){
//		window.clearTimeout(id);
//		ctx.fillRect(ball.x,ball.y,10,10);
//	    }
	    
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
