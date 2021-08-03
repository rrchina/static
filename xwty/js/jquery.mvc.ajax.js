function AjaxLele(form) {
    
    var error = $(form).attr("ajax-lele-error");
    var success = $(form).attr("ajax-lele-success");

    if (error == undefined) error = "";

    $(form).find(":submit").attr("disabled", true);

    $.ajax({
        url: form.action,
        type: "POST",
        data: $(form).serialize(),
        dataType: "json",
        success: function (result) {
        	success = eval(success);
            success(result);

            $(form).find(":submit").attr("disabled", false);
        },
        error: function (result) {
            if (error != "") {
                error = eval(error);
                error(result);
            } else {
                alert("系统错误.");
            }

            $(form).find(":submit").attr("disabled", false);
        }
    });
}

$(document).ready(function () {

    $("form").each(function () {
        $(this).submit(function () {
            if (!$(this).valid()) return false;

            var before = $(this).attr("ajax-lele-before");

            if (before == undefined) before = "";

            if (before != "") {
                before = eval(before);
                if (!before()) return false;
            }

            if ($(this).attr("ajax-lele") == "true") {
                AjaxLele(this);
                return false;
            }
        });
    });

});