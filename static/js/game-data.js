/*jslint browser: true */
/*globals Facade, Gamepad, $ */

define(function (require) {

    'use strict';

    return {

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
	        "projectile": "minibox",
	        "moveSpeed": [0.1, 0.1]
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
	        "projectile": "largebox",
	        "moveSpeed": [0.5, 0.5]
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
			'playerImpact': [{
				url: 'static/images/fire_explosion.png',
			    scale: 0.6,
			    width: 128,
			    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
			    anchor: 'center',
			    speed: 45
			}, {
				url: 'static/images/explosion_lq.png',
			    scale: 1,
			    width: 128,
			    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			    anchor: 'center',
			    speed: 30
			}],
			'wallImpact': {
				url: 'static/images/fire_explosion.png',
			    scale: 1,
			    width: 128,
			    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
			    anchor: 'center',
			    speed: 60
			},
			'projectileImpact': {
				url: 'static/images/explosion_hq.png',
			    scale: 1.5,
			    width: 118,
			    frames: [0, 1, 2, 3, 4],
			    anchor: 'center',
			    speed: 60
			},
		}
	};

});
