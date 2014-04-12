/*!
 * gkaptcha.js v0.0.1
 * http://gesturekit.com/
 *
 * Copyright (c) 2014, RoamTouch
 * Released under the Apache v2 License.
 * http://gesturekit.com/
 */
(function(a){"use strict";function b(a,b){if(!Array.isArray(a))throw Error("shuffle-array expect an array as parameter.");var e,f,c=a,d=a.length;for(b===!0&&(c=a.slice());d;)e=Math.floor(Math.random()*d),d-=1,f=c[d],c[d]=c[e],c[e]=f;return c}b.pick=function(a,b){if(!Array.isArray(a))throw Error("shuffle-array.pick() expect an array as parameter.");if("number"==typeof b&&1!==b){for(var f,c=a.length,d=a.slice(),e=[];b;)f=Math.floor(Math.random()*c),e.push(d[f]),d.splice(f,1),c-=1,b-=1;return e}return a[Math.floor(Math.random()*a.length)]},"function"==typeof a.define&&void 0!==a.define.amd?a.define("shuffle",[],function(){return b}):"undefined"!=typeof module&&void 0!==module.exports?module.exports=b:a.shuffle=b})(this);
(function (window, gesturekit) {
    'use strict';

    var url = 'http://api.gesturekit.com/v1.1/index.php/sdk/getgestures_help/';

    function Captcha(options) {
        var that = this;

        gesturekit.init(options);

        var styles = [
            'background-repeat: no-repeat;',
            'background-size: contain;',
            'background-position: center;'
        ];

        this.loadGestures();

        this.container = window.document.getElementById('sensor');
        this.container.style.cssText = styles.join('');
        this._input = window.document.getElementById('gkaptcha-input');

        gesturekit.on('recognize', function (gesture) {
            if (gesture.name === that._gesture.method) {
                gesturekit.disable();
                that.container.style.backgroundColor = 'rgba(39, 174, 96, .5)';
                that._input.value = that._gesture.method;
                window.document.getElementById('send-form').disabled = false;
            } else {
                that.container.style.backgroundColor = 'rgba(231, 76, 60, .5)';
                window.setTimeout(function () {
                    that.container.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                }, 1000);
            }
        });

        gesturekit.on('notrecognize', function () {
            that.container.style.backgroundColor = 'rgba(231, 76, 60, .5)';
            window.setTimeout(function () {
                that.container.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            }, 1000);
        });

        return this;
    }

    Captcha.prototype.loadGestures = function (gid) {
        var that = this,
            xhr = new window.XMLHttpRequest(),
            status,
            response;

        gid = gid || gesturekit._options.gid;

        xhr.open('GET', url + gid);

        // Add events
        xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.DONE) {
                status = xhr.status;

                if ((status >= 200 && status < 300) || status === 304 || status === 0) {
                    response = JSON.parse(xhr.response || xhr.responseText);
                    that._gestures = response.gestureset.gestures;
                    that.update();
                }
            }
        };

        xhr.send();

        return this;
    };

    Captcha.prototype.update = function () {
        this._gesture = shuffle.pick(this._gestures);
        this.container.style.backgroundImage = 'url("data:image/png;base64,' + this._gesture.img + '")';
        return this;
    }

    /**
     * Expose Captcha
     */
    // AMD suppport
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
        window.define('gkcaptcha', [], function () {
            return Captcha;
        });

    // CommonJS suppport
    } else if (typeof module !== 'undefined' && module.exports !== undefined) {
        module.exports = Captcha;

    // Default
    } else {
        window.gkaptcha = Captcha;
    }

}(this, this.gesturekit));