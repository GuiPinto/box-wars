/*jslint browser: true */
/*globals Facade, Gamepad, $ */

/*
http://minddotout.wordpress.com/2013/01/06/html5-space-invaders-with-box2dweb-physics/#bullets
*/

(function () {

    'use strict';

	var canvas = document.querySelector('canvas');
    var stage = new Facade(canvas),
        controls = new Gamepad(),
        world = new Facade.Entity().Box2D('createWorld', { canvas: stage.canvas, gravity: [ 0, 0 ] }),
        objects = {
            playerA: null,
            playerB: null,
            stageWalls: [],
            projectiles: []
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

        objects.projectiles.forEach(function(projectile) {
	    	stage.addToStage(projectile);
        });


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

	function fire(p) {

		var playerA = p == 'p1';

		var player = playerA ? objects.playerA : objects.playerB;

		var playerState = player.Box2D('getCurrentState');

		var projectileX = playerA ?  playerState.x + playerSizeWidth + 50 : playerState.x - 50;

		var velocityX = playerA ? 50 : -50;

		var projectile = new Facade.Rect({
			"x": projectileX,
			"y": playerState.y,
			"width": 20,
			"height": 15,
			"fillStyle": "#0ff"
		});

        projectile.Box2D('createObject', world, {
            "type": "dynamic",
            "rotate": true,
            "restitution": 0
        });

		projectile.Box2D('setVelocity', velocityX, 0);


		var projectileId = objects.projectiles.length;

		projectile.Box2D('setCallback', 'BeginContact', function (a, b) {
			console.log('A => ', a);
			console.log('b => ', b);
			console.log('projectileId => ', projectileId);

			var tmpVelocity = b.Box2D('getVelocity');

			if (a && a.Box2D) {

				a.Box2D('destroyObject');

				setTimeout(function () {

					b.Box2D('setVelocity', tmpVelocity.x, tmpVelocity.y);
				});

				//self.data.rects.splice(self.data.rects.indexOf(self.data.objects[key]), 1);

				delete objects.projectiles[projectileId];

			}


		});

		objects.projectiles.push(projectile);

		console.log('tracking ' + objects.projectiles.length + ' projectiles!');

	}




    function init() {

    	//sizeCanvas();

    	createPlayers();

    	attachControls();

    	calculcatePlayerBounds();

    	positionPlayers();

		//$(window).bind("resize", sizeCanvas);

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
	                "type": "kinematic",
	                "rotate": false
	            }
	        }
	     );


	     objects.playerB = generateEntityFromObject({
            "options": {
                "x": 650,
                "y": 390,
                "width": playerSizeWidth,
                "height": playerSizeHeight,
                "fillStyle": "#ff0"
            },
            "box2d_properties": {
                "type": "kinematic",
                "rotate": false
            }
	    });

	}

	function attachControls() {

	    controls.on('press', 'p1_fire', function () {
			fire('p1');
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
			fire('p2');
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
		var padding = 8;

		playerBounds = {
			playerA: {
				top: 0,
				bottom: height,
				left: 0,
				right: width / 2 - padding
			},
			playerB: {
				top: 0,
				bottom: height,
				left: width / 2 + padding,
				right: width
			}
		}

	}

	function createStageWalls() {

		objects.stageWalls.push({



		});





	}

	function positionPlayers() {



	}


	function setupProjectileCollisionDetection() {

	}

	function sizeCanvas() {

	    var w = $(window).width();
	    var h = $(window).height();

	    $(canvas).css("width", w + "px");
	    $(canvas).css("height", h + "px");
	}


}());
