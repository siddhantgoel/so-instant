$(document).ready(function() {
    $("#query").focus();
    
    var endpoint = "https://api.stackexchange.com/2.1/search?site=stackoverflow";
    
    $.getJSON(endpoint, {
        order: 'desc',
        max: 10,
        sort: 'votes',
        intitle: 'python generators'
    }).done(function(data) {
        if (data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                $("#results > tbody:last").append([
                    '<tr><td><a href="http://stackoverflow.com/q/',
                    String(data.items[i].question_id),
                    '">',
                    data.items[i].title,
                    '</a></td></tr>'
                ].join(""));
            }
        }
    });
});