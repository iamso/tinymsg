# Tiny Msg

Tiny real-time messaging server.

## Deploy

### Dokku, Heroku etc.
Clone the repo and push to Dokku, Heroku etc.

*Unfortunately I had to remove the Heroku deploy button, because it doesn't work wit git submodules.*

### Run locally
Clone the repo by running the following commands:

```bash
git clone --recursive https://github.com/iamso/tinymsg.git
npm install
npm start
```

#### Client

To edit/recompile the client run the following commands:

```bash
cd path/to/repo/client
npm install
gulp
```
**Note:** `gulp-cli` must be installed globally.

To compile the dist version run `gulp dist`.




## Usage example

### Include client script

```html
<script src="//domain.tld/client.js"></script>
```

### Create client instance

```javascript

const msg = new Msg('channelname');

msg
  .on('message', (e, data) => {
    // do something
  })
  .on('error', (e) => {
    // do something
  });

// sending a message
msg.send('string'); // send a string
msg.send({key: 'value'}); // send an object
msg.send([1,2,3]); // send an array   
```

## HTTP interface

You can also send messages to a channel through http requests.

#### GET

Send the message as query parameter:

```
http(s)://domain.tld/send/{channelname}?message=blabla
```

#### POST

Send the message as post data or raw body:

```
http(s)://domain.tld/send/{channelname}
```

## License
Copyright (c) 2017 Steve Ottoz

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
