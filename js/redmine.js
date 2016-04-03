'use strict';

var ipc = require('ipc');




var input = document.getElementsByTagName('input');
input.addEventListener('keydown', function(event) {
    alert('keydown');
    if (event.code === 'Enter') {
        alert('called' + event);
        // send() じゃないので注意！
        ipc.sendToHost('search:start', input.value);
    }
});