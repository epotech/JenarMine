  /**
   * Initialize the RedmineNotifier object.
   * @constructor
   */
  function RedmineNotifier() {
    this._lastExecutionTime = null;
    this._settings = null;
    this._fetchTimer = null;
    this._fetchMode = null;
  }


  /**
   * Read the settings from the localStorage.
   * @return {Object} Current object.
   */
  RedmineNotifier.prototype.readStoredSettings = function() {
    this._settings = {
      url: localStorage.getItem('url_redmine'),
      apiKey: localStorage.getItem('API_key_redmine'),
      projectId: localStorage.getItem('14'),
      fetchIntervalSec: localStorage.getItem('notification_interval_redmine')
    };

    return this;
  };


//var jenkinsJob = function() {
  var url = "http://172.31.93.59/redmine/";
  var apiKey = "1168f084936321ddb372b226d8fad09af578a02c";
  var userName = "hkiya";
//};

console.log(url);
console.log(apiKey);

//var settings.url = url;
//var settings.apiKey = apiKey;

RedmineNotifier.prototype.fetch = function() {
  console.log("a");
  var _this = this;
  var xhr = new XMLHttpRequest();
  var requestParams = '?updated_on=%3E%3D' + this._lastExecutionTime + STATIC_REQUEST_PARAMS;
  


  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      _this.notify(JSON.parse(xhr.responseText).issues);
    }
  };

  //xhr.open('GET', this._settings.url + '/issues.json' + requestParams);
  xhr.open('GET', url + '/issues.json' + requestParams);

  xhr.setRequestHeader('X-Redmine-API-Key', this._settings.apiKey);
  xhr.setRequestHeader('X-Redmine-API-Key', apiKey);

  xhr.send();

  this.updateLastExecutionTime();
};