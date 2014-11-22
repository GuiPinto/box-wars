/*jslint browser: true */
/*globals Facade, Gamepad, $ */

(function () {

    'use strict';

    var stage = new Facade(document.querySelector('canvas')),
        controls = new Gamepad(),
        world = new Facade.Entity().Box2D('createWorld', { canvas: stage.canvas, gravity: [ 0, 0 ] }),
        objects = {
            playerA: null,
            playerB: null
        },
        playerBounds = {
	    	playerA: { top: 0, bottom: 0, left: 0, right: 0 },
	    	playerB: { top: 0, bottom: 0, left: 0, right: 0 }
        }

	var playerMoveSpeed = 0.4;
	var playerSizeWidth = 100;
	var playerSizeHeight = 160;

	init();    

    stage.resizeForHDPI();

    stage.draw(function () {

        this.clear();

        world.Box2D('step');

        this.addToStage(objects.playerA);
        this.addToStage(objects.playerB);
        

        //world.Box2D('drawDebug');

    });


    function generateEntityFromObject(data) {

        var entity;

        entity = new Facade.Rect(data.options);

        entity.Box2D('createObject', world, data.box2d_properties);

        return entity;

    }

	function movePlayer(p, moveX, moveY) {
	
		var player = p == 'p1' ? objects.playerA : objects.playerB;
		var bounds = p == 'p1' ? playerBounds.playerA : playerBounds.playerB;
		
		var playerState = player.Box2D('getCurrentState');
		var playerPosition = player.Box2D('getPosition')
				
		var x = playerPosition.x + moveX;
		var y = playerPosition.y + moveY;
		
		if (moveX < 0 && playerState.x < bounds.left) x = playerPosition.x;
		if (moveX > 0 && playerState.x + playerSizeWidth > bounds.right) x = playerPosition.x;
		if (moveY < 0 && playerState.y < bounds.top) y = playerPosition.y;
		if (moveY > 0 && playerState.y + playerSizeHeight > bounds.bottom) y = playerPosition.y;
		
        player.Box2D('setPosition', x, y);
		
	}
	




        
    function init() {
	    	
	    	createPlayers();
	    	
	    	attachControls();
	    	
	    	calculcatePlayerBounds();
	    	
	    
    }
    
    function createPlayers() {
	    
	     objects.playerA = generateEntityFromObject({ 
	     	"options": {
	                "x": 150,
	                "y": 390,
	                "width": playerSizeWidth,
	                "height": playerSizeHeight,
	                "fillStyle": "#0f0"
	            },
	            "box2d_properties": {
	                "type": "dynamic",
	                "rotate": false
	            }
	        }
	     );

	    
	     objects.playerB = generateEntityFromObject({
            "options": {
                "x": 450,
                "y": 390,
                "width": playerSizeWidth,
                "height": playerSizeHeight,
                "fillStyle": "#ff0"
            },
            "box2d_properties": {
                "type": "dynamic",
                "rotate": false
            }
	    });
	    
	}
	
	function attachControls() {
		
	    controls.on('press', 'p1_fire', function () {
			movePlayer('p1', 0, -1);
	    });
	    controls.on('hold', 'p1_left', function () {
	        movePlayer('p1', -playerMoveSpeed, 0);
	    });
	    controls.on('hold', 'p1_right', function () {
	        movePlayer('p1', playerMoveSpeed, 0);
	    });
	    controls.on('hold', 'p1_up', function () {
	        movePlayer('p1', 0, -playerMoveSpeed);
	    });
	    controls.on('hold', 'p1_down', function () {
	        movePlayer('p1', 0, playerMoveSpeed);
	    });
	    
	    
	    
	    controls.on('press', 'p2_fire', function () {
			movePlayer('p2', 0, -1);
	    });
	    controls.on('hold', 'p2_left', function () {
	        movePlayer('p2', -playerMoveSpeed, 0);
	    });
	    controls.on('hold', 'p2_right', function () {
	        movePlayer('p2', playerMoveSpeed, 0);
	    });
	    controls.on('hold', 'p2_up', function () {
	        movePlayer('p2', 0, -playerMoveSpeed);
	    });
	    controls.on('hold', 'p2_down', function () {
	        movePlayer('p2', 0, playerMoveSpeed);
	    });
		
	}
	
	function calculcatePlayerBounds() {
		
		var width = stage._width;
		var height = stage._height;
		
		playerBounds = {
			playerA: { 
				top: 0, 
				bottom: height, 
				left: 0, 
				right: width / 2 
			},
			playerB: { 
				top: 0, 
				bottom: height, 
				left: width/2, 
				right: width 
			}
		}
		
	}
    


}());