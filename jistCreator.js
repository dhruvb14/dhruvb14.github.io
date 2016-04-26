/*
Assuming jQuery Ajax instead of vanilla XHR
*/

//Get Github Authorization Token with proper scope, print to console
var githubToken = null;
function getAuth(username, password) {
    var deferred = $.Deferred();
    var auth = username + ":" + password;
    $.ajax({
        url: 'https://api.github.com/authorizations',
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(auth));
        },
        data: '{"scopes":["gist"],"note":"Chocolaty and Boxstarter automation' + Math.ceil(Math.random() * 1000) + '"}'
    }).done(function (response) {
        deferred.resolve(response);
        githubToken = response.token;
        console.log(response);
    });

    return deferred;
}
var gist = null;
//Create a Gist with token from above
function createGist(token) {
    $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "token " + token);
        },
        data: '{"description": "a gist for a user with token api call via ajax","public": true,"files": {"file1.txt": {"content": "String file casdsadontents via ajax"}}}'
    }).done(function (response) {
        console.log(response);
        gist = response;
        var url = gist.files["file1.txt"].raw_url;
        $('body').append("<a href=\"" + url + "\" target='_blank'>Open Gist</a>")
        $('body').append
    });

}
var queryResponse = null;
function randomApiSearch(query) {
    var deferred = $.Deferred();
    var url = "https://chocolatey.org/api/v2/Search()?$filter=IsLatestVersion&$orderby=Id&$skip=0&$top=10&searchTerm='" + query + "'&targetFramework=''&includePrerelease=false";

    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';

    // Request that YSQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    $.getJSON(yql, function (data) {
        var x2js = new X2JS();
        queryResponse = x2js.xml_str2json(data.results[0]);
        deferred.resolve(queryResponse);
        console.log(queryResponse);
        var template = Handlebars.compile($('#search').html());
        var html = template(queryResponse);
        $('#results').html(html);
    });

    return deferred;
}
function searchQuery(){
    randomApiSearch($("#searchQuery").val());
}
var currentPrograms = []
function addToInstallScript(item){
    currentPrograms.push(item);
    console.log(currentPrograms);
}
//Using Gist ID from the response above, we edit the Gist with Ajax PATCH request
// $.ajax({
//     url: 'https://api.github.com/gists/GIST-ID-FROM-PREVIOUS-CALL',
//     type: 'PATCH',
//     beforeSend: function (xhr) {
//         xhr.setRequestHeader("Authorization", "token TOKEN-FROM-AUTHORIZATION-CALL");
//     },
//     data: '{"description": "updated gist via ajax","public": true,"files": {"file1.txt": {"content": "updated String file contents via ajax"}}}'
// }).done(function (response) {
//     console.log(response);
// });