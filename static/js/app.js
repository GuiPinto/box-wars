/*jslint browser: true */
/*globals Facade, Gamepad, $ */

define(function (require) {
    'use strict';

    var $ = require('jquery'),
        Facade = require('facade'),
        Gamepad = require('gamepadjs'),
        stage = new Facade(document.querySelector('canvas')),
        controls = new Gamepad();

    require('facadejs-Box2D-plugin');

    console.log('Game.js Loaded');

    var world = new Facade.Entity().Box2D('createWorld', { canvas: stage.canvas, gravity: [ 0, 0 ] }),
        objects = {
            players: [],
            stageWalls: [],
            projectiles: [],
            effects: []
        },
        data = {
            players: [],
            scores: {},
            playerBounds: [
                { top: 0, bottom: 0, left: 0, right: 0 },
                { top: 0, bottom: 0, left: 0, right: 0 }
            ]
        },
        gameData = require('./game-data');


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

        // world.Box2D('drawDebug');

    });


    function movePlayer(playerId, moveX, moveY) {

        var playerObj = objects.players[playerId];

        console.log(playerObj);

        playerObj.setOptions({ y: '+=10' });

    }

    function fire(playerId, projectileId) {


    }




    function init() {

        //sizeCanvas();

        createPlayers();

        attachControls();

        //$(window).bind("resize", sizeCanvas);

    }

    function createPlayers() {

        for (var playerId in gameData.players) {
            var playerData = gameData.players[playerId];

            // Create player rectangle
            var player = new Facade.Rect(playerData.options);

            // Create Box2D Object
            player.Box2D('createObject', world, playerData.box2d_properties);

            // Attach custom attributes
            player.type = 'player';
            player.player = playerId;

            objects.players.push(player);

            data.players.push(playerData);
        };

    }

    function attachControls() {

        var player1Data = data.players[0];
        var player2Data = data.players[1];

        controls.on('hold', 'd_pad_up', function () {
            console.log('d_pad_up');
            movePlayer(1, 0, -(player2Data.moveSpeed[1]));
        });

    }







});
