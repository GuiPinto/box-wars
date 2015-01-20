
requirejs.config({
	baseUrl: 'static/jabascript',
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'facade': '../bower_components/facade.js/facade.min',
		'gamepad': 'libs/gamepad.min',
		'box2dweb': '../bower_components/facadejs-Box2D-plugin/vendor/box2dweb/Box2dWeb-2.1.a.3.min',
		'facadejs-box2d': '../bower_components/facadejs-Box2D-plugin/facadejs-Box2D'
	},
    shim: {
    	'facade': {
	        deps: ['box2dweb', 'facadejs-box2d']
    	},
    	'facadejs-box2d': {
	        deps: ['box2dweb']
    	}
    }
});

requirejs(['game']);
