# Clappr-Ads
Pre-roll &amp; post-roll ads for the Clappr player

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

### Options

|Parameter|type|Optional|Default Value|Description|
|---|---|---|---|---|
|ads.preRoll|object|true|-|-|
|ads.preRoll.src|object/array|false|-|If array, it randomly selects a value|
|ads.preRoll.skip|boolean|true|true|Shows skip button with countdown|
|ads.preRoll.timeout|integer|true|5|Countdown time|
|ads.postRoll|object|true|-|-|
|ads.postRoll.src|object/array|false|-|If array, it randomly selects a value|
|ads.text|object|true|-|-|
|ads.text.wait|string|true|Wait % seconds|Skip button wait text|
|ads.text.skip|string|true|Skip >|Skip button action text|