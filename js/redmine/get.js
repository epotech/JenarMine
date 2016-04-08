var RestClient = require('node-rest-client').Client;


var ENDPOINT_BASE = 'http://172.31.93.59/redmine/';

var rmClient = new RestClient();

var getTicketList = function (params, project, callback) {
    rmClient.get(ENDPOINT_BASE + '/projects/' + project + '/issues.json', {
        headers: {
            'Content-type': 'application/json',
            'X-Redmine-API-Key': '1168f084936321ddb372b226d8fad09af578a02c'
        },
        parameters: params
    }, function (data, response) {
        var result = JSON.parse(data.toString('utf8'));
        callback(result);
    });
};

/*
getTicketList({}, '14', function (result) {
    console.log(result);
}); 
*/


getTicketList(param, '14', function (result) {
    console.log(result);
}); 

