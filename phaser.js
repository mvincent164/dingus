// Simple Slime.io-style Multiplayer Game
// Frontend (Client) using Phaser.js

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let socket;
let players = {};

function preload() {
    this.load.image('slime', 'slime.png'); // Load a slime sprite
}

function create() {
    socket = io();
    player = this.physics.add.sprite(400, 300, 'slime');
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    
    socket.emit('newPlayer');
    
    socket.on('updatePlayers', (serverPlayers) => {
        Object.keys(serverPlayers).forEach((id) => {
            if (!players[id]) {
                players[id] = this.physics.add.sprite(serverPlayers[id].x, serverPlayers[id].y, 'slime');
            } else {
                players[id].x = serverPlayers[id].x;
                players[id].y = serverPlayers[id].y;
            }
        });
    });
}

function update() {
    let movement = { dx: 0, dy: 0 };
    if (cursors.left.isDown) movement.dx = -5;
    if (cursors.right.isDown) movement.dx = 5;
    if (cursors.up.isDown) movement.dy = -10;
    
    player.x += movement.dx;
    player.y += movement.dy;
    
    socket.emit('playerMove', { x: player.x, y: player.y });
}
