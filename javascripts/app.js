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
        $("#results_tbody").empty();
        if (data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                $("#results_table > tbody:last").append([
                    '<tr>',
                    data.items[i].is_answered ? '<td><i class="icon-ok answered"></i></td>' : '<td></td>',
                    '<td><a href="' + data.items[i].link + '">' + data.items[i].title + '</a></td>',
                    '<td>' + String(data.items[i].score) + ' votes</td>',
                    '<td>' + String(data.items[i].view_count) + ' views</td>',
                    '<td>' + String(data.items[i].answer_count) + ' answers</td>',
                    '</tr>'
                ].join(""));
            }
            $(".answered").tooltip({ title: 'Answered', placement: 'bottom' });
        }
    };
    
    var fetch = function() {
        var query = get_query();
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
    };
    
    $("#query").on("keyup", function(e) {
        if (typeof(e.which) == "number" && e.which > 0) {
            if (!(e.ctrlKey || e.metaKey || e.altKey) && !(e.keyCode >= 37 && e.keyCode <= 40)) {
                if (get_query().length > 0) {
                    delay(fetch, 250);
                } else {
                    $("#results_tbody").empty();
                }
            }
        }
    });
    
});