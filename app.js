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
        	players: [],
            stageWalls: [],
            projectiles: [],
            effects: []
        },
        data = {
        	players: [],
        	scores: {}
        },
        playerBounds = [
	    	{ top: 0, bottom: 0, left: 0, right: 0 },
	    	{ top: 0, bottom: 0, left: 0, right: 0 }
        ]

    var gameData = gameData();

	var playerMoveSpeed = 0.5;
	var playerSizeWidth = 100;
	var playerSizeHeight = 160;

	init();

    stage.resizeForHDPI();

    stage.draw(function () {

        this.clear();

        world.Box2D('step');

        this.addToStage(objects.players);
        this.addToStage(objects.stageWalls);

        objects.projectiles.forEach(function(projectile) {
        	if (projectile != undefined)
	    		stage.addToStage(projectile);
        });

        objects.effects.forEach(function(effect) {
        	if (effect != undefined)
	    		stage.addToStage(effect);
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

		var player = p == 'p1' ? objects.players[0] : objects.players[1];
		var bounds = p == 'p1' ? playerBounds[0] : playerBounds[1];

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

		var firstPlayer = p == 'p1';

		var playerObj = firstPlayer ? objects.players[0] : objects.players[1];
		var playerData = firstPlayer ? data.players[0] : data.players[1];

		var playerState = playerObj.Box2D('getCurrentState');

		// Choose projectile
		var selectedProjectileId = playerData.projectile ? playerData.projectile : 'largebox';
		var projectileData = gameData.projectiles[selectedProjectileId];
		if (!projectileData) return;

		playerData.projectile = Object.keys(gameData.projectiles)[Math.floor(Math.random()*Object.keys(gameData.projectiles).length)];

		// Create projectile
		var projectile;
		switch(projectileData.type) {
			default:
			case 'rect':
				projectile = new Facade.Rect(projectileData.options);
			break;
		}

		// Apply positioning
		projectile.setOptions({
			x: firstPlayer ?  playerState.x + playerSizeWidth + 1 : playerState.x - projectileData.options.width-1,
			y: playerState.y
		});

		// Create box2D object
        projectile.Box2D('createObject', world, {
            "type": "dynamic",
            "rotate": true,
            "restitution": 0
        });

        // Set Box2d velocity (X and Y)
        var velocityX = firstPlayer ? projectileData.velocity[0] : -(projectileData.velocity[0]);
		projectile.Box2D('setVelocity', velocityX, projectileData.velocity[1]);

		// Setup projectile collision detection
		var projectileId = objects.projectiles.length;
		projectile.Box2D('setCallback', 'BeginContact', handleCollision);

		// Apply custom properties
		projectile.type = 'projectile';
		projectile.projectileId = projectileId;
		projectile.player = firstPlayer ? 0 : 1;
		projectile.hit = false;

		objects.projectiles.push(projectile);
		//console.log('tracking ' + objects.projectiles.length + ' projectiles!');
	}




    function init() {

    	//sizeCanvas();

    	createStageWalls();

    	createPlayers();

    	attachControls();

    	calculcatePlayerBounds();

    	positionPlayers();

		//$(window).bind("resize", sizeCanvas);

    }

    function createPlayers() {

    	for (var playerId in gameData.players) {
    		var playerData = gameData.players[playerId];

    		var player = generateEntityFromObject({
		     	"options": playerData.options,
		     	"box2d_properties": playerData["box2d_properties"]
		    });

    		player.type = 'player';
    		player.player = playerId;

    		objects.players.push(player);

    		data.players.push(playerData);
    	};

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

		playerBounds[0] = {
			top: 0,
			bottom: height,
			left: 0,
			right: width / 2 - padding
		};
		playerBounds[1] = {
			top: 0,
			bottom: height,
			left: width / 2 + padding,
			right: width
		}

	}

	function createStageWalls() {

		var width = stage._width;
		var height = stage._height;
		var wallSize = 8;


		objects.stageWalls = [

			// Left Wall
			new Facade.Rect({
				"x": -wallSize,
				"y": 0,
				"width": wallSize,
				"height": height,
				"fillStyle": "#0ff"
			}),

			// Right Wall
			new Facade.Rect({
				"x": width,
				"y": 0,
				"width": wallSize,
				"height": height,
				"fillStyle": "#0ff"
			}),

			// Top Wall
			new Facade.Rect({
				"x": 0,
				"y": -wallSize,
				"width": width,
				"height": wallSize,
				"fillStyle": "#0ff"
			}),

			// Bottom Wall
			new Facade.Rect({
				"x": 0,
				"y": height,
				"width": width,
				"height": wallSize,
				"fillStyle": "#0ff"
			})

		];

		objects.stageWalls.forEach(function(stageWall) {

			// Create Box2D Obj
			stageWall.Box2D('createObject', world, {
	            "type": "kinematic",
	            "rotate": false
	        });

	        // Apply wall properties
	        stageWall.type = 'wall';

		});

	}

	function positionPlayers() {



	}

	function handleCollision(a, b) {

		if ((a && !a.type) || (b && !b.type)) {
			console.log('collision of object without TYPE!', a, b);
			return;
		}

		if ((a && a.type == 'projectile') && (b && b.type == 'player')) {
			var projectileId = a.projectileId;

			if (a.hit !== true) {
				a.hit = true;

				if (a.player != b.player) {

					setTimeout(function() {

						if (a && a.Box2D) {

							a.Box2D('destroyObject');

							delete objects.projectiles[projectileId];

							var metrics = a.getAllMetrics();
							explosion(b.type, metrics.x, metrics.y);

						}

					}, 100);

				}
			}
		} else if (
				(a && a.type == 'projectile') && (b && b.type == 'projectile') ||
				(a && a.type == 'projectile') && (b && b.type == 'wall')
		) {
			var projectileId = a.projectileId;

			if (a.hit !== true) {
				a.hit = true;

				if (a && a.Box2D) {

					a.Box2D('destroyObject');

					delete objects.projectiles[projectileId];

					var metrics = a.getAllMetrics();
					explosion(b.type, metrics.x, metrics.y);

				}

			}
		} else {
			console.log("handleCollision fall-through! a: ", a, ", b: ", b);
		}

	}


	function explosion(targetType, x, y) {

		var explosionKey = '';
		switch(targetType) {
			default:
			case 'projectile':
			case 'wall':
				explosionKey = 'quickie';
			break;
			case 'player':
				explosionKey = 'playerHit';
			break;
		}

		var explosionData = gameData.explosions[explosionKey];
		if (!explosionData) {
			console.log("Explosion Data Not Found For Key " + explosionKey);
			return;
		}

		// Setup our custom attributes and callbacks
		var effectId = objects.effects.length;
		explosionData.x = x;
		explosionData.y = y;
		explosionData.callback = function(frame) {
			if (frame != explosionData.frames.length - 1)
				return;

			// Our animation is over, delete ourselves.
			delete objects.effects[effectId];
		};

		var explosion = new Facade.Image(explosionData.url, explosionData);

		explosion.play();

		explosion.effectId = effectId;

		objects.effects.push(explosion);
	}

	function sizeCanvas() {

	    var w = $(window).width();
	    var h = $(window).height();

	    $(canvas).css("width", w + "px");
	    $(canvas).css("height", h + "px");
	}


	function gameData() {


		var data = {
			players: [{
		     	"options": {
	                "x": 150,
	                "y": 390,
	                "width": 90,
	                "height": 150,
	                "fillStyle": "#FF9900"
	            },
	            "box2d_properties": {
	                "type": "kinematic",
	                "rotate": false
	            },
		        'projectile': "minibox"
			}, {
		     	"options": {
	                "x": 650,
	                "y": 390,
	                "width": 90,
	                "height": 150,
	                "fillStyle": "#007AB5"
	            },
	            "box2d_properties": {
	                "type": "kinematic",
	                "rotate": false
	            },
		        'projectile': "largebox"
			}],
			projectiles: {
				'minibox': {
					'type': 'rect',
					'options': {
						"x": 0,
						"y": 0,
						"width": 20,
						"height": 15,
						"fillStyle": "#C688D8"
					},
					'velocity': [50, 0]
				},
				'largebox': {
					'type': 'rect',
					'options': {
						"x": 0,
						"y": 0,
						"width": 40,
						"height": 30,
						"fillStyle": "#0ff"
					},
					'velocity': [40, 0]
				},
				'giganticbox': {
					'type': 'rect',
					'options': {
						"x": 0,
						"y": 0,
						"width": 100,
						"height": 100,
						"fillStyle": "#f0f"
					},
					'velocity': [25, 0]
				},
				'shockwave': {
					'type': 'rect',
					'options': {
						"x": 0,
						"y": 0,
						"width": 30,
						"height": 170,
						"fillStyle": "#f0f"
					},
					'velocity': [35, 0]
				}
			},
			explosions: {
				'quickie': {
					url: 'http://endgate.net/Content/Samples/AnimatedSprites/images/fire_explosion.png',
				    x: 0,
				    y: 0,
				    scale: 1,
				    width: 128,
				    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				    anchor: 'center',
				    speed: 60
				},
				'playerHit': {
					url: 'http://fc02.deviantart.net/fs71/f/2013/010/9/f/explosion_spritesheet_for_games_by_gintasdx-d5r28q5.png',
				    x: 0,
				    y: 0,
				    scale: 1,
				    width: 128,
				    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				    anchor: 'center',
				    speed: 30
				}
			}
		};

		return data;

	}


}());
