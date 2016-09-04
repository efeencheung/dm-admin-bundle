+function($){
    'use strict';

    var AudioPlayer = function(element){
        var that = this;

        this.template = '' + 
            '<div class="audio-progress-bar">' +
                '<div class="audio-progress-bar audio-progress-bar-played" style="width: 0%">' +
                    '<span class="progress-btn"></span>' +
                '</div>' +
            '</div>' +
            '<div>' +
                '<div class="audio-btn-left">' +
                    '<div class="audio-control-btn">' +
                        '<i class="audio-btn play-control-btn icon-control-play"></i>' +
                    '</div>' +
                '</div>' +
                '<div class="audio-btn-right">' +
                    '<div class="audio-time-wrap">' +
                        '<div class="audio-time">' +
                            '<span class="audio-timer"></span> / <span class="audio-duration"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="audio-control-btn">' +
                        '<i class="volume-control-btn icon-volume-2"></i>' +
                    '</div>' +
                    '<div class="volume-bar-container">' +
                        '<div class="volume-bar">' +
                            '<div class="volume-bar-now" style="width: 90%"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="clearfix"></div>' +
            '</div>';

        $(element).append(this.template);

        this.source = $(element).find('audio').attr('src');
        this.playBtn = $(element).find('.play-control-btn');
        this.progressBar = $(element).find('.audio-progress-bar');
        this.progressBarPlayed = $(element).find('.audio-progress-bar-played');
        this.progressBtn = $(element).find('.progress-btn');
        this.intervalId;
        this.isProgressBtnActive = false;
        this.volumeBar = $(element).find('.volume-bar');
        this.volumeBarNow = $(element).find('.volume-bar-now');
        this.timer = $(element).find('.audio-timer');
        this.duration = $(element).find('.audio-duration');       
        this.sound = new Howl({
            src: this.source,
            html5: true,
        });

        /* 
         * 播放按钮事件 
         */
        this.playBtn.on('click', function(){
            if (that.sound.playing()) {
                that.pause();
            } else {
                that.play();
            }
        }); 

        /*
         * 进度条点击和拖拽事件
         */
        this.progressBar.on('click', function(e){
            var per = (e.pageX - that.progressBar.offset().left) / that.progressBar.width(); 
            that.seek(per);
            that.updateProgressBar(per);
        });
        this.progressBtn.on('mousedown', function(){
            that.isProgressBtnActive = true;
        });
        $(document).on('mouseup', function(){
            that.isProgressBtnActive = false;
        });
        $(document).on('mousemove', function(e){
            if (that.isProgressBtnActive) {
                var per = (e.pageX - that.progressBar.offset().left) / that.progressBar.width();
                per = per > 0 ? per : 0;
                per = per < 1 ? per : 1;
                that.seek(per);
                that.updateProgressBar(per);
            }
        });

        /*
         * 音量控制条事件
         */
        this.volumeBar.on('click', function(e){
            var per = (e.pageX - that.volumeBar.offset().left) / that.volumeBar.width(); 
            that.sound.volume(per);
            that.updateVolumeBar(per);
        });

        /**
         * 音频自带事件
         */
        this.sound.on('end', function(){
            that.playBtn.removeClass('icon-control-pause');
            that.playBtn.addClass('icon-control-play');
            that.updateProgressBar(0);
            that.timer.html(that.formatTime(0));
            clearInterval(that.intervalId);
        });

        this.sound.on('load', function(){
            that.duration.html(that.formatTime(that.sound.duration()));
            that.timer.html(that.formatTime(that.sound.seek()));
        });
    };
    
    AudioPlayer.prototype = {
		constructor: AudioPlayer,

        play : function(){
            var that = this;

            this.sound.play();
            this.playBtn.removeClass('icon-control-play');
            this.playBtn.addClass('icon-control-pause');

            this.intervalId = setInterval(function(){
                var seek = that.sound.seek();
                that.timer.html(that.formatTime(seek));
                that.updateProgressBar(seek / that.sound.duration());
            }, 1000);
        },

        pause : function(){
            this.sound.pause();
            this.playBtn.removeClass('icon-control-pause');
            this.playBtn.addClass('icon-control-play');
            clearInterval(this.intervalId);
        },

        seek : function(per) {
            this.sound.seek(this.sound.duration() * per);
        },

        updateProgressBar : function(per){
            this.progressBarPlayed.css('width', per * 100 + '%');
        },

        updateVolumeBar : function(per){
            this.volumeBarNow.css('width', per * 100 + '%');
        },

        formatTime : function(secs) {
            secs = Math.round(secs);
            var minutes = Math.floor(secs / 60) || 0;
            var seconds = (secs - minutes * 60) || 0;

            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        } 
    };

    $.fn.audioplayer = function () {
        if (this.length > 0) {
            new AudioPlayer(this);
        }
    };
	$.fn.audioplayer.defaults = {};
	$.fn.audioplayer.Constructor = AudioPlayer;
}(jQuery);
