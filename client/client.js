/*!
 * tiny-msg-client - Version 0.1.0
 * client for tiny real-time messaging server
 * Author: Steve Ottoz <so@dev.so>
 * Build date: 2016-03-19
 * Copyright (c) 2016 Steve Ottoz
 * Released under the MIT license
 */
!function(a,b,c){"use strict";var d=function(a,b,c,d){this.url="<%=url%>",this.channel=a,this.onmsg=b,this.onerror=c,this.context=d||this,this.q=[],this._init()};d.prototype={_init:function(){if(a){var b=this;b.ws=new a(b.url,b.channel),b.ws.onopen=b._open.bind(b),b.ws.onmessage=b._message.bind(b),b.ws.onerror=b._error.bind(b),b.ws.onclose=b._close.bind(b)}},_open:function(a){for(var b=this;b.q.length;)try{b.ws.send(b.q.shift())}catch(a){}},_message:function(a){var b=a.data;try{b=JSON.parse(b)}catch(a){}/^f/.test(typeof this.onmsg)&&this.onmsg.apply(this.context,[b,a,this])},_error:function(a){/^f/.test(typeof this.onerror)&&this.onerror.apply(this.context,[a,this])},_close:function(a){clearTimeout(this.timeout),this.timeout=setTimeout(this._init.bind(this),5e3)},send:function(a){try{a=JSON.stringify(a)}catch(b){}if(1===this.ws.readyState)try{this.ws.send(a)}catch(b){this.q.push(a)}else this.q.push(a)}},b.Msg=d}(WebSocket,window);