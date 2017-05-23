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
        this.muteButton = this._initMuteButton();

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

    Video.prototype._initSkipButton = function (timeout) {
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
        el.style.right = '-1px';
        el.disabled = true;
        el.addEventListener('click', this._end.bind(this));
        this._skipButtonCountdown(el, timeout);
        return el;
    };

    Video.prototype._initMuteButton = function() {
        var el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.bottom = '145px';
        el.style.right = '100px';
        el.style.padding = '15px';
        el.style.backgroundColor = '#000';
        el.style.border = 'solid thin #000';
        el.style.fontSize = '12px';
        el.style.color = '#FFF';
        el.innerText = 'Volume';
        el.addEventListener('click', function () {
            this.video.muted = !this.video.muted;
        }.bind(this));
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
        if (typeof(this.onEnd) === "function") {
            this.onEnd();
        }
    };

    Video.prototype.play = function() {
        this.video.play();
    };

    Video.prototype.pause = function() {
        this.video.pause();
    };

    Video.prototype.attachMuteButton = function () {
        this.wrapper.appendChild(this.muteButton);
    };

    var ClapprAds = Clappr.UICorePlugin.extend({
        _isAdPlaying: false,
        _hasPreRollPlayed: false,
        _hasPostRollPlayed: false,
        _preRoll: false,
        _midRoll: false,
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
                    if ('src' in this._options.ads.preRoll) {
                        this._preRoll = this._options.ads.preRoll;
                    } else {
                        throw "No source";
                    }
                }

                if ('midRoll' in this._options.ads) {
                    if ('src' in this._options.ads.midRoll) {
                        this._midRoll = this._options.ads.midRoll;

                        // transform string src into an array
                        if (typeof(this._midRoll.src) === "string") {
                            this._midRoll.src = [this._midRoll.src];
                        }

                        if ('at' in this._midRoll) {
                            // if not an array, transform to array
                            if (typeof(this._midRoll.at) != "object") {
                                this._midRoll.at = [this._midRoll.at];
                            }
                        }
                    } else {
                        throw "No source";
                    }
                }

                if ('postRoll' in this._options.ads) {
                    if ('src' in this._options.ads.postRoll) {
                        this._postRoll = this._options.ads.postRoll;
                    } else {
                        throw "No source";
                    }
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
                // listeners
                container.listenTo(container.playback, Clappr.Events.PLAYBACK_PLAY, this._onPlaybackPlay.bind(this, container));
                container.listenTo(container.playback, Clappr.Events.PLAYBACK_TIMEUPDATE, this._onPlaybackTimeUpdate.bind(this, container));
                container.listenTo(container.playback, Clappr.Events.PLAYBACK_ENDED, this._onPlaybackEnd.bind(this));
            }).bind(this));
        },

        _onPlaybackPlay: function(container) {
            // if ad is playing, pause
            // otherwise, start pre-roll
            if (this._isAdPlaying) {
                container.playback.pause();
            } else {
                // pre-roll will not run if played before or unset
                if (!this._preRoll || this._hasPreRollPlayed)
                    return;

                this.playPreRoll(container);
            }
        },

        _onPlaybackTimeUpdate: function(container) {
            // fetch current time and duration
            var current = container.currentTime;
            var duration = container.getDuration();

            if (this._midRoll) {
                var atTimes;
                if ('at' in this._midRoll) {
                    atTimes = this._midRoll.at;
                } else {
                    atTimes = [Math.floor(duration / 2)];
                }

                var inAtTimes = false, at, index;
                for (var i = 0; i < atTimes.length; i++) {
                    at = atTimes[i];
                    if (Math.floor(current) == at) {
                        index = i;
                        inAtTimes = true;
                    }
                }

                if (inAtTimes) {
                    if (this._midRoll.at.length === this._midRoll.src.length) {
                        this.playMidRoll(container, index);
                    } else {
                        this.playMidRoll(container);
                    }
                }
            }

            // post-roll will not run if played before
            if (this._postRoll && !this._hasPostRollPlayed && current) {
                // if the video is in it's end, play post-roll
                if (Math.round(current * 1000) == Math.round(duration * 1000)) {
                    this.playPostRoll(container);
                }
            }
        },

        _onPlaybackEnd: function() {
            this._isAdPlaying = false;
            this._hasPreRollPlayed = false;
        },

        playPreRoll: function(container) {
            // bail if ad is playing
            if (this._isAdPlaying)
                return;

            // if src is an array
            // select randomly one of the videos
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

            // add mute button
            if (this._preRoll.muteButton) {
                video.attachMuteButton();
            }

            // render video
            container.$el.append(video.wrapper);
            video.play();

            // call user's callback if it is set
            if ('onPlay' in this._preRoll) {
                this._preRoll.onPlay(this._preRoll, { position: 'preroll' });
            }

            // make sure pre-roll wont play again
            this._hasPreRollPlayed = true;
        },

        playMidRoll: function(container, index) {
            // bail if ad is playing
            if (this._isAdPlaying)
                return;

            this._isAdPlaying = true;

            // pause playback
            container.playback.pause();

            // go to next second
            // to prevent a midroll loop
            container.playback.seek(parseInt(Math.floor(container.currentTime + 1)));

            var src;

            // if index was not set
            // select source randomly
            // otherwise get source index
            if (index === undefined) {
                src = this._midRoll.src[this._rand(0, this._midRoll.src.length - 1)];
            } else {
                src = this._midRoll.src[index];
            }

            // initialize video
            video = new Video(src, this._midRoll.skip, this._midRoll.timeout);

            // add mute button
            if (this._midRoll.muteButton) {
                video.attachMuteButton();
            }

            // render video
            container.$el.append(video.wrapper);
            video.play();

            // call user's callback if it is set
            if ('onPlay' in this._midRoll) {
                this._midRoll.onPlay(this._midRoll, { position: 'preroll' });
            }

            video.onEnd = (function () {
                this._isAdPlaying = false;
            }).bind(this);

        },

        playPostRoll: function(container) {
            // bail if ad is playing
            if (this._isAdPlaying)
                return;

            this._isAdPlaying = true;

            // prevent multiple calls whilst running
            this._hasPostRollPlayed = true;

            // pause playback
            container.playback.pause();

            // if src is an array
            // select randomly one of the videos
            var src;
            if (typeof(this._postRoll.src) === "object") {
                src = this._postRoll.src[this._rand(0, this._postRoll.src.length - 1)];
            } else {
                src = this._postRoll.src;
            }

            // initialize video
            video = new Video(src);

            // add mute button
            if (this._postRoll.muteButton) {
                video.attachMuteButton();
            }

            // render video
            container.$el.append(video.wrapper);
            video.play();

            // call user's callback if it is set
            if ('onPlay' in this._postRoll) {
                this._postRoll.onPlay(this._postRoll, { position: 'preroll' });
            }

            video.onEnd = (function () {
                this._isAdPlaying = false;
            }).bind(this);
        },

        _onPreRollEnd: function(video, playback) {
            this._isAdPlaying = false;
            setTimeout(function() { playback.play(); }, 100);
        },
    });

    w.ClapprAds = ClapprAds;

})(window);