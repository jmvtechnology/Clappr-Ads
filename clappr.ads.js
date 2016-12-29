(function(w) {

    var Video = function(src, skip, timeout) {
        this.text = {
            wait: 'Wait % seconds...',
            skip: 'Skip >'
        };
        this.onEnd = false;
        this.wrapper = this._initWrapper();  
        this.video = this._initVideo(src);
        this.wrapper.appendChild(this.video);

        // if skip is true
        // add skip button
        if (skip) {
            this.skipButton = this._initSkipButton(timeout);
            this.wrapper.appendChild(this.skipButton);
        }
    };

    Video.prototype._initWrapper = function() {
        var el = document.createElement('div');
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.top = '0px';
        el.style.left = '0px';
        el.style.zIndex = 10000;
        return el;
    };

    Video.prototype._initVideo = function(src) {
        var el = document.createElement('video');
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.width = '100%';
        el.style.height = '100%';
        el.controls = false;
        el.src = src;
        el.addEventListener('ended', this._end.bind(this));
        return el;
    };

    Video.prototype._initSkipButton = function(timeout) {
        var el = document.createElement('button');
        el.style.display = 'none';
        el.style.position = 'absolute';
        el.style.bottom = '45px';
        el.style.right = '0px';
        el.style.padding = '15px';
        el.style.backgroundColor = '#000';
        el.style.border = 'solid thin #000';
        el.style.fontSize = '12px';
        el.style.color = '#FFF';
        el.disabled = true;
        el.addEventListener('click', this._end.bind(this));
        this._skipButtonCountdown(el, timeout);
        return el;
    };

    Video.prototype._skipButtonCountdown = function(el, timeout) {
        var countDown = setInterval((function() {
            el.style.display = 'block';
            if (timeout > 0) {
                el.innerHTML = this.text.wait.replace('%', timeout);
                timeout--;
            } else {
                el.innerHTML = this.text.skip;
                el.disabled = false;
                clearInterval(countDown);
            }
        }).bind(this), 1000);
    };

    Video.prototype._end = function(evt) {
        // if click, prevent default
        if (evt)
            evt.preventDefault();
        
        // remove video from the DOM
        this.wrapper.parentNode.removeChild(this.wrapper);

        // fire on end
        if ('onEnd' in this) {
            this.onEnd();
        }
    };

    Video.prototype.play = function() {
        this.video.play();
    };

    Video.prototype.pause = function() {
        this.video.pause();
    };

    var ClapprAds = Clappr.UICorePlugin.extend({
        _isAdPlaying: false,
        _hasPreRollPlayed: false,
        _preRoll: false,
        _postRoll: false,
        _videoText: {},
        _rand: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        name: 'clappr_ads',

        initialize: function() {
            // get adplayer options
            if ('ads' in this._options) {
                if ('preRoll' in this._options.ads) {
                    this._preRoll = this._options.ads.preRoll;
                }

                if ('postRoll' in this._options.ads) {
                    this._postRoll = this._options.ads.postRoll;
                }
                if ('text' in this._options.ads) {
                    var text = this._options.ads.text;
                    if ('wait' in text) {
                        this._videoText.wait = text.wait;
                    }
                    if ('skip' in text) {
                        this._videoText.skip = text.skip;
                    }
                }
            }

            this.bindEvents();
        },

        bindEvents: function() {
            // wait for core to be ready
            this.listenTo(this.core, Clappr.Events.CORE_READY, (function() {
                // get container
                var container = this.core.getCurrentContainer();
                // listen to play
                container.listenTo(container.playback, Clappr.Events.PLAYBACK_PLAY, this._onPlaybackPlay.bind(this, container));
                // listen to video end
                container.listenTo(container.playback, Clappr.Events.PLAYBACK_ENDED, this.playPostRoll.bind(this, container));
            }).bind(this));
        },

        _onPlaybackPlay: function(container) {
            // if ad is playing, pause
            // otherwise, start pre-roll
            if (this._isAdPlaying) {
                container.playback.pause();
            } else {
                this.playPreRoll(container);
            }
        },

        playPreRoll: function(container) {
            // pre-roll will not run if played before or unset
            if (!this._preRoll || this._hasPreRollPlayed)
                return;
            
            // if src is an array
            // select randomly one of the videos
            // and play it
            var src;
            if (typeof(this._preRoll.src) === "object") {
                src = this._preRoll.src[this._rand(0, this._preRoll.src.length - 1)];
            } else {
                src = this._preRoll.src;
            }
            
            // pause playback
            container.playback.pause();

            // initialize video
            video = new Video(src, this._preRoll.skip, this._preRoll.timeout);
            video.onEnd = this._onPreRollEnd.bind(this, video, container.playback);

            // video text
            if ('wait' in this._videoText) {
                video.text.wait = this._videoText.wait;
            }

            if ('skip' in this._videoText) {
                video.text.skip = this._videoText.skip;
            }

            // render video
            container.$el.append(video.wrapper);
            video.play();
            this._isAdPlaying = true;

            // make sure pre-roll wont play again
            this._hasPreRollPlayed = true;
        },

        playPostRoll: function(container) {

        },

        _onPreRollEnd: function(video, playback) {
            this._isAdPlaying = false;
            setTimeout(function() { playback.play(); }, 100);
        },
    });

    w.ClapprAds = ClapprAds;

})(window);