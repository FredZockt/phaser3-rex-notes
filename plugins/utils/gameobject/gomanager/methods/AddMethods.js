import AddTintRGBProperties from '../../../../behaviors/tintrgb/AddTintRGBProperties.js';
import AddViewportCoordinateProperties from '../../../../behaviors/viewportcoordinate/AddViewportCoordinateProperties.js';

const RemoveItem = Phaser.Utils.Array.Remove;

export default {
    has(name) {
        return this.bobs.hasOwnProperty(name);
    },

    get(name) {
        return this.bobs[name];
    },

    getGO(name) {
        var bob = this.get(name);
        return (bob) ? bob.gameObject : null;
    },

    addGO(name, gameObject) {
        this.remove(name);

        var hasTintChange = (!!gameObject.setTint) && (this.fadeTime > 0);
        if (hasTintChange) {
            AddTintRGBProperties(gameObject);
        }

        if (this.viewportCoordinateEnable) {
            AddViewportCoordinateProperties(gameObject);
        }

        gameObject.once('destroy', function () {
            RemoveItem(this.removedGOs, gameObject);
            if (this.isEmpty) {
                this.emit('empty');
            }
        }, this);

        var bob = new this.BobClass(this, gameObject, name);
        this.bobs[name] = bob;

        return this;
    },

    add(name, ...args) {
        var gameObject = this.createGameObjectCallback(this.scene, ...args);
        this.addGO(name, gameObject);
        var bob = this.get(name);

        var hasTintChange = (!!gameObject.setTint) && (this.fadeTime > 0);
        var hasAlphaChange = (!!gameObject.setAlpha) && (this.fadeTime > 0);
        if (hasTintChange) {
            bob
                .setProperty('tintGray', 0)
                .easeProperty('tintGray', 255, this.fadeTime)
        } else if (hasAlphaChange) {
            bob
                .setProperty('alpha', 0)
                .easeProperty('alpha', 1, this.fadeTime)
        }

        return this;
    }
}