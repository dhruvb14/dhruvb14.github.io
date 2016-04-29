//Get Github Authorization Token with proper scope, print to console
$(document).ready(function () {
    loadTemplates();
    var cookie = getCookie("ChocoStarter");
    currentPrograms = cookie ? JSON.parse(cookie) : [];
    cookie = getCookie('token');
    githubToken = cookie ? cookie : undefined;
    $("#APIKey").val(githubToken);
    githubToken ? $("#loginCredentials").hide() : $("#APICredentials").hide();
    updateCodeDisplay()
    $('#searchQuery').keypress(function (e) {
        if (e.which == 13) {
            searchQuery();
            return false;    //<---- Add this line
        }
    });
});
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
        setCookie('token', githubToken, 7);
        $("#APIKey").val(githubToken);
        createGist(githubToken, JSON.stringify($("#autoGenerator").text()));
        githubToken ? $("#loginCredentials").hide() : $("#APICredentials").show();
        console.log(response);
    });

    return deferred;
}
function submitUnPw() {
    var token = $("#APIKey").val();
    token ? createGist(githubToken, JSON.stringify($("#autoGenerator").text())) :getAuth($("#GithubUsername").val(), $("#GithubPassword").val());
}
var gist = null;
//Create a Gist with token from above
function createGist(token, gist) {
    var body = '{"description": "a gist for a user with token api call via ajax","public": true,"files": {"boxstarter.ps1": {"content": ' + gist + '}}}';
    $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "token " + token);
        },
        data: body,
    }).done(function (response) {
        console.log(response);
        gist = response;
        var url = gist.files["boxstarter.ps1"].raw_url;
        $('#viewGist').append("<br><a href=\"http://boxstarter.org/package/nr/url?" + url + "\" target='_blank'>Start Installer</a><br><br>");
        $('#viewGist').append("<a href=\"" + url + "\" target='_blank'>View Gist</a>");
    });
}
var queryResponse = null;
function randomApiSearch(query) {
    var deferred = $.Deferred();
    // var url = "https://chocolatey.org/api/v2/Search()?$filter=IsLatestVersion&$orderby=Id&$skip=0&$top=50&searchTerm='" + encodeURIComponent(query) + "'&targetFramework=''&includePrerelease=false";
    var url = "https://chocolatey.org/api/v2/Packages()?$filter=(IsPrerelease%20eq%20false%20or%20IsPrerelease%20eq%20false)%20and%20(IsLatestVersion%20or%20IsAbsoluteLatestVersion)%20and%20(substringof('" + encodeURIComponent(query) + "',Id)%20or%20substringof('" + encodeURIComponent(query) + "',Title))&$skip=0&$top=50"
    var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';

    // Request that YSQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    $.getJSON(yql, function (data) {
        var x2js = new X2JS();
        queryResponse = x2js.xml_str2json(data.results[0]);
        deferred.resolve(queryResponse);
        console.log(queryResponse);
        compileHtml();
    });

    return deferred;
}
function compileHtml() {
    var template = Handlebars.compile($('#search').html());
    var html = template(queryResponse);
    $('#results').html(html);
}
function searchQuery() {
    $("#results").html('<p class="text-center"><i class="fa fa-spinner fa-spin fa-5x fa-fw margin-bottom"></i><span class="sr-only">Loading...</span></p>');
    randomApiSearch($("#searchQuery").val());
}
var currentPrograms = []
function addToInstallScript(item, index) {
    var found = currentPrograms.indexOf(item);
    if (found > -1) {
        currentPrograms.splice(found, 1);
    } else {
        currentPrograms.push(item);
    }
    $("#searchResult" + index).html(checkInstall(item, null))
    var currentInstall = JSON.stringify(currentPrograms);
    setCookie('ChocoStarter', currentInstall, 7);
    updateCodeDisplay();
    console.log(currentPrograms);
}
function updateCodeDisplay() {
    var buffer = "\n# Install Script Generated by: https://dhruvb14.github.io\n";
    buffer += "# Inspiration borrowed from http://blog.zerosharp.com/provisioning-a-new-development-machine-with-boxstarter/\n";
    buffer += "# Boxstarter options\n";
    buffer += "$Boxstarter.RebootOk=$true # Allow reboots?\n";
    buffer += "$Boxstarter.NoPassword=$false # Is this a machine with no login password?\n";
    buffer += "$Boxstarter.AutoLogin=$true # Save my password securely and auto-login after a reboot\n";
    $.each(currentPrograms, function (index, value) {
        buffer += "if (Test-PendingReboot) { Invoke-Reboot }\n" + value + "\n";
    })
    $("#autoGenerator").text(buffer)
    Prism.highlightAll()
}

function loadTemplates() {
    $("#searchTemplate").load("search.html");
    $("#tabsTemplate").load("tabs.html", function () {
        getPredefinedPackages();
    });
}
function getPredefinedPackages(){
    $.ajax({
        url: 'predefinedpackages.json',
        type: 'get',
    }).done(function (response) {
        var template = Handlebars.compile($('#tabs').html());
        var html = template(response);
        $('#info').html(html);
    });
}


function checkInstall(context, options) {
    var check = '<i class="fa fa-check-square-o" aria-hidden="true"></i>';
    var ret = '<i class="fa fa-square-o" aria-hidden="true"></i>';
    $.each(currentPrograms, function (index, value) {
        if (context == value) {
            ret = check;
        }
    })
    return ret;
}