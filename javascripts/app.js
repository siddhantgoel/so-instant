$(document).ready(function() {
    /* Initialization code */
    $("#query").focus();
    $("#error_div").hide();
    var endpoint = "https://api.stackexchange.com/2.1/search/advanced?site=stackoverflow";
    var application_key = 'A3a8pTUXjWuDDLPQcZ8OSA((';
    SE.init({
        clientId: 1562,
        key: application_key,
        channelUrl: window.location.toString() + 'blank',
        complete: function(data) {
            console.log("SE API initialized");
        }
    });
    
    /* Utility functions */
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
    };
    var pluralize = function(what, count) {
        if (count == 1) {
            return what;
        } else {
            return what + 's';
        }
    };
    var capitalize = function(string) {
        if (string.length > 0) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    };
    /* http://stackoverflow.com/a/1909508 */
    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
    
    /* Update the table with the search query results */
    var update_results = function(data) {
        $("#results_tbody").empty();
        if (data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                $("#results_table > tbody:last").append([
                    '<tr>',
                    data.items[i].is_answered ? '<td><i class="icon-ok answered"></i></td>' : '<td></td>',
                    '<td><a href="' + data.items[i].link + '">' + data.items[i].title + '</a></td>',
                    '<td>' + String(data.items[i].score) + ' ' + pluralize('vote', data.items[i].score) + ' </td>',
                    '<td>' + String(data.items[i].view_count) + ' ' + pluralize('view', data.items[i].view_count) + ' </td>',
                    '<td>' + String(data.items[i].answer_count) + ' ' + pluralize('answer', data.items[i].answer_count) + ' </td>',
                    '</tr>'
                ].join(""));
            }
            $(".answered").tooltip({ title: 'Answered', placement: 'bottom' });
        }
    };
    
    /* Fetch search results from the StackExchange API */
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
                body: query,
                key: application_key
            }).done(function(data) {
                update_results(data);
                $.jStorage.set(query, data, { TTL: 25000 });
                $("#error_div").hide();
            }).fail(function(data) {
                data = $.parseJSON(data.responseText);
                $("#error_message").html(capitalize(data.error_message));
                $("#error_div").show();
            });
        }
    };
    
    /* Bind the event handler for the text input box */
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
    
    /* Bind the login button to log in to StackExchange */
    $("#signin").click(function() {
        SE.authenticate({
            success: function(data) {
                console.log("Successfully logged in");
                console.log(data);
            },
            error: function(data) {
                console.log("Error with logging in");
                console.log(data);
            },
            networkUsers: true
        });
    });
    
});