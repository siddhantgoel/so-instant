$(document).ready(function() {
    $("#query").focus();
    
    var endpoint = "https://api.stackexchange.com//2.1/search/advanced?site=stackoverflow"
    
    var get_query = function() {
        var query = $("#query").val();
        if (query.length > 0) {
            query = $.trim(query.replace(/\W/g, ' '));
        }
        if (query.length > 0) {
            return query;
        } else {
            return '';
        }
    }
    
    /* http://stackoverflow.com/a/1909508 */
    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
    
    var update_results = function(data) {
        if (data.items.length > 0) {
            $("#results_tbody").empty();
            for (var i = 0; i < data.items.length; i++) {
                $("#results_table > tbody:last").append([
                    '<tr><td><a href="http://stackoverflow.com/q/',
                    String(data.items[i].question_id),
                    '">',
                    data.items[i].title,
                    '</a></td></tr>'
                ].join(""));
            }
        }
    };
    
    var fetch = function() {
        var query = get_query();
        if (query.length > 0) {
            var data = $.jStorage.get(query);
            if (data) {
                update_results(data);
            } else {
                $.getJSON(endpoint, {
                    order: 'desc',
                    sort: 'relevance',
                    accepted: 'True',
                    q: query,
                    body: query
                }).done(function(data) {
                    update_results(data);
                    $.jStorage.set(query, data, { TTL: 25000 });
                });
            }
        } else {
            $("#results_tbody").empty();
        }
    };
    
    $("#query").on("keyup", function(e) {
        if (typeof(e.which) == "number" && e.which > 0 && !(e.ctrlKey || e.metaKey || e.altKey)) {
            if (get_query().length > 0) {
                delay(fetch, 250);
            }
        }
    });
    
});