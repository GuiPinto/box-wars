require.config({
    'paths': {
        'box2dweb': '../bower_components/facadejs-Box2D-plugin/vendor/box2dweb/Box2dWeb-2.1.a.3',
        'facade': '../bower_components/facade.js/facade.min',
        'facadejs-Box2D-plugin': '../bower_components/facadejs-Box2D-plugin/facadejs-Box2D',
        'gamepadjs': '../bower_components/gamepad.js/gamepad.min',
        'jquery': '../bower_components/jquery/dist/jquery.min'
    },
    'shim': {
        'box2dweb': {
            'exports': 'Box2D'
        }
    }
});

define(['app']);
