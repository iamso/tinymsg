# Tiny Msg

Tiny real-time messaging server.

## Deploy

### Dokku, Heroku etc.
Clone the repo and push to Dokku, Heroku etc.

Or just press the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/iamso/tinymsg)

### Run locally
Clone or download the repo. Then run the following commands:

```bash
cd path/to/repo
npm install
npm start
```

#### Client

To edit/recompile the client run the following commands:

```bash
cd path/to/repo/client
npm install
grunt
```
**Note:** `grunt-cli` needs to be installed globally.

To compile the dist version run `grunt dist`.




## Usage example

### Include client script

```html
<script src="//domain.tld/client.js"></script>
```

### Create client instance

```javascript
'use strict';

var msg = new Msg('channelname', onMessage, onError);

function onMessage(data) {
  // do something
}
function onError(e) {
  // do something
}

// sending a message
msg.send('string'); // send a string
msg.send({key: 'value'}); // send an object
msg.send([1,2,3]); // send an array   
```

## License
Copyright (c) 2016 Steve Ottoz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
