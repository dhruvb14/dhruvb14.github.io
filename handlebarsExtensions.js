Handlebars.registerHelper('imageProxy', function (context, options) {
    var url = "www.acsu.buffalo.edu/~rslaine/imageNotFound.jpg"
    if (context) {
        url = context.replace("http://", "");
        url = url.replace("https://", "");
    }
    return "https://images.weserv.nl/?url=" + url + "&w=100&h=100&t=square&a=center&t=fitup";
});
Handlebars.registerHelper('checkInstall', function(context, title, options){
    return checkInstall(context, title, options);
});
Handlebars.registerHelper("moduloIf", function(index_count,mod,block) {
  if(parseInt(index_count)%(mod)=== 0){
    return block.fn(this);}
});

Handlebars.registerHelper("DateFormatter", function(input,caller) {
return moment(input).format("dddd, MMMM Do YYYY, h:mm:ss a"); 
});