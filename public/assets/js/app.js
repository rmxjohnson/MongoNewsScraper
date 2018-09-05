
$(document).ready(function () {

    var winwidth = $(window).width();
    $("img.main-img").attr({
        width: winwidth
    });
    $(window).bind("resize", function () {
        var winwidth = $(window).width();
        $("img.main-img").attr({
            width: winwidth
        });
    });

    // call route to scrape the NY Times website
    $(".scrape").click(function (event) {
        event.preventDefault();
        $.get("/api/fetch").then(function (data) {
            $(".articles").remove();
            $.get("/").then(function () {
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message +
                    "</h3", function (result) {
                        location.reload()
                    });
            });
        });
    });

    // move an article to the "saved articles" view
    $(".save-article").click(function (event) {
        event.preventDefault();
        var articleToSave = {};
        articleToSave.id = $(this).data("id")
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToSave
        }).then(function (data) {
            location.reload();
        });
    });

    // remove an article from the "saved articles" view
    $(".removeSaved").click(function () {
        event.preventDefault();
        var articleToRemoveSaved = {};
        articleToRemoveSaved.id = $(this).data("id");
        articleToRemoveSaved.saved = false;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToRemoveSaved
        }).then(function (data) {
            location.reload();
        });
    });

    // display the notes associated with the selected article
    $(".saved-buttons").on("click", function () {
        event.preventDefault();
        var currentId = $(this).attr("data-value");

        var tempTitle = $(this).closest(".panel-title").text();
        console.log("current id = ", currentId);
        console.log("closest title = ", tempTitle);

        $("#saveButton").attr({ "data-value": currentId });

        $.get("/notes/" + currentId, function (data) {

            // reset note fields
            $("#noteModalLabel").empty();
            $("#notesBody").empty();
            $("#notestext").val("");
            $("#article-for-note").empty();

            $("#article-for-note").append(" " + currentId);
            $("noteModalLabel").append(" " + currentId);
            // add all notes to the body of of the modal
            for (var i = 0; i < data.note.length; i++) {
                var button = '<a href=/deleteNote/' + data.note[i]._id +
                    '><i class="pull-right fa fa-times fa-2x delete-x" aria-hidden="true"></i></a>';
                $('#notesBody').append('<div class="panel panel-default"><div class="noteText panel-body">'
                    + data.note[i].body + ' ' + button + '</div></div>');
            }
        });
    });

    // call route to save a new note
    $(".savenote").click(function () {
        event.preventDefault();

        // get the id associated with the article from the submit button
        var currentId = $(this).attr("data-value");

        // do not save a blank note, just close the modal
        if ($("#notestext").val().trim().length > 0) {
            $.ajax({
                method: "POST",
                url: "/notes/" + currentId,
                data: {
                    // value from the note text area
                    body: $("#notestext").val().trim()
                }
            }).done(function (data) {
                //console.log(data);
                $("noteModal").modal("hide");
            });
        }
    });

});