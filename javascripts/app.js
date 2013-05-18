$(document).ready(function() {
    $("#query").focus();
    
    var location = "https://api.stackexchange.com/2.1/search?site=stackoverflow";
    
    $.getJSON(location, { order: 'desc', max: 10, sort: 'votes', intitle: 'python generators'}).done(function(data) {
        console.log(data);
    })
});