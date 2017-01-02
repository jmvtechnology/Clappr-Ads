# Clappr-Ads
Pre-roll, mid-roll and post-roll ads for the Clappr player

### Set Up
```JS
var player = new Clappr.Player({
    source: 'http://clappr.io/highline.mp4',
    plugins: [ClapprAds],
    ads: {
        preRoll: {
            src: ['video1.mp4', 'video2.mp4', 'video3.mp4'],
            skip: true,
            timeout: 5
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
|ads.midRoll|object|true|-|-|
|ads.midRoll.at|integer/array|true|-|if unset, ad will play when video reaches 50%. If array, ad will play in the time (seconds) specified. If integer, ad will play once in the the time (seconds) specified|
|ads.midRoll.src|string/array|false|-|If array, it randomly selects a value, unless it matches property 'at' in size, then it will play in order|
|ads.midRoll.skip|boolean|true|true|Shows skip button with countdown|
|ads.midRoll.timeout|integer|true|5|Countdown time|
|ads.postRoll|object|true|-|-|
|ads.postRoll.src|string/array|false|-|If array, it randomly selects a value|
|ads.text|object|true|-|-|
|ads.text.wait|string|true|Wait % seconds|Skip button wait text|
|ads.text.skip|string|true|Skip >|Skip button action text|
