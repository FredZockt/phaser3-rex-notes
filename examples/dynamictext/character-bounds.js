import phaser from 'phaser/src/phaser.js';
import DynamicTextPlugin from '../../plugins/dynamictext-plugin.js';

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {

    }

    create() {
        var text = this.add.rexDynamicText(
            {
                x: 400, y: 300,
                padding: 20,
                style: {
                    fontSize: '60px',
                },

                childrenInteractive: true
            }
        )

        text.appendText('Phaser');
        var result = text.runWordWrap({
            lineHeight: 60,
            maxLines: 0,       // Set maxLines to 0
            letterSpacing: 5,
            padding: { bottom: 10 },
        });

        var drawBounds = function (bob) {
            var text = bob.text;
            if ((text === ' ') || (text === '\n')) {
                return;
            }

            var context = bob.context;

            var savedLineCap = context.lineCap;
            context.lineCap = 'butt';

            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(bob.drawTLx, bob.drawTLy);
            context.lineTo(bob.drawBLx, bob.drawBLy);
            context.lineTo(bob.drawBRx, bob.drawBRy);
            context.lineTo(bob.drawTRx, bob.drawTRy);
            context.closePath();
            context.stroke();

            context.lineCap = savedLineCap;
        }
        var children = result.children;
        for (var i = 0, cnt = children.length; i < cnt; i++) {
            children[i]
                .setAngle((Math.random() - 0.5) * 30)
                .modifyStyle({ fontSize: Phaser.Math.Between(30, 60) })
                .setDrawAboveCallback(drawBounds)
        }

        text
            .on('child.pointerover', function (child) {
                child.modifyStyle({
                    color: 'green'
                })
            })
            .on('child.pointerout', function (child) {
                child.modifyStyle({
                    color: 'white'
                })
            })
    }

    update() { }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Demo,
    plugins: {
        global: [{
            key: 'rexDynamicText',
            plugin: DynamicTextPlugin,
            start: true
        }]
    }
};

var game = new Phaser.Game(config);