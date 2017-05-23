# Clappr-Ads
Pre-roll, mid-roll and post-roll ads for the Clappr player

## Link css and js

Add javsscript and css files to your project.

```
    <script type="text/javascript" src="clappr.ads.js"></script>
    <link rel="stylesheet" href="clappr.ads.css"></link>
```

You can change design of skip and mute buttons with CSS classes. See
`clappr.ads.css` for class names. Default css colors are black for both
mute and skip button.

Keep `sound-on.svg` and `sound-off.svg` files in the same folder as the
`clappr.ads.css` file.


### Set Up
```JS
var player = new Clappr.Player({
    source: 'http://clappr.io/highline.mp4',
    plugins: [ClapprAds],
    ads: {
        preRoll: {
            src: ['video1.mp4', 'video2.mp4', 'video3.mp4'],
            skip: true,
            timeout: 5,
            onPlay: function(ad, parameters) {
                console.log('Started palying ad:', ad, ' with params:', params);
            },
            onClick: function(ad, caller, evt) {
                console.log('Click on ad', ad, caller, evt);
            },
            muteButton: true
        },
        midRoll: {
            at: [10, 20, 35],
            src: ['video_1.mp4', 'video_2.mp4', 'video_3.mp4'],
            skip: true,
            timeout: 5
        },
        postRoll: {
            src: 'video1.mp4'
        },
        text: {
            wait: 'Wait % seconds...',
            skip: 'Skip >'
        }
    }
});
```

### Mid-Roll

#### Simplest Setup

Ad will play once halfway through the video

```JS
midRoll: {
    src: 'video.mp4',
},
```

#### Time Setup

Specifying when ad will play

```JS
midRoll: {
    at: 30, // 30 seconds
    src: 'video.mp4',
},
```

#### Random Videos Setup

Ad will be randomly selected

```JS
midRoll: {
    src: ['video1.mp4', 'video2.mp4', 'video3.mp4']
},
```

#### Multiple Videos Setup

Ads will play in different parts of the video

```JS
midRoll: {
    at: [30, 60, 120],
    src: ['video1.mp4', 'video2.mp4', 'video3.mp4']
},
```

#### Skipable Setup

Ad will be skipable

```JS
midRoll: {
    src: 'video.mp4',
    skip: true,
    timeout: 5
},
```

### Options

|Parameter|Type|Optional|Default Value|Description|
|---|---|---|---|---|
|ads.preRoll|object|true|-|-|
|ads.preRoll.src|string/array|false|-|If array, it randomly selects a value|
|ads.preRoll.skip|boolean|true|true|Shows skip button with countdown|
|ads.preRoll.timeout|integer|true|5|Countdown time|
|ads.preRoll.onPlay|callback|true|null|Callback function to execute when ad starts playing|
|ads.preRoll.onClick|callback|true|null|Callback that gets fired if user clicks on video ad|
|ads.preRoll.muteButton|boolean|true|false|Adds optional mute/unmute button to video ad|
|ads.midRoll|object|true|-|-|
|ads.midRoll.at|integer/array|true|-|if unset, ad will play when video reaches 50%. If array, ad will play in the time (seconds) specified. If integer, ad will play once in the the time (seconds) specified|
|ads.midRoll.src|string/array|false|-|If array, it randomly selects a value, unless it matches property 'at' in size, then it will play in order|
|ads.midRoll.skip|boolean|true|true|Shows skip button with countdown|
|ads.midRoll.timeout|integer|true|5|Countdown time|
|ads.midRoll.onPlay|callback|true|null|callback function to execute when ad starts playing|
|ads.midRoll.onClick|callback|true|null|Callback that gets fired if user clicks on video ad|
|ads.midRoll.muteButton|boolean|true|false|Adds optional mute/unmute button to video ad|
|ads.postRoll|object|true|-|-|
|ads.postRoll.src|string/array|false|-|If array, it randomly selects a value|
|ads.postRoll.onPlay|callback|true|null|callback function to execute when ad starts playing|
|ads.postRoll.onClick|callback|true|null|Callback that gets fired if user clicks on video ad|
|ads.postRoll.muteButton|boolean|true|false|Adds optional mute/unmute button to video ad|
|ads.text|object|true|-|-|
|ads.text.wait|string|true|Wait % seconds|Skip button wait text|
|ads.text.skip|string|true|Skip >|Skip button action text|
