function getAjax(url, async, success, error, beforeSend) {
    $.ajax({
        url: url,
        async: (typeof async != "undefined") ? async : false,
        type: "GET",
        dataType: 'json',
        cache: false,
        beforeSend:beforeSend,
        success: success,
        error: error
    });
}

function postAjax(url, data, success, beforeSend, error) {
    $.ajax({
        url: url,
        async: false,
        type: 'POST',
        data: data,
        dataType: 'json',
        cache: false,
        beforeSend:beforeSend,
        success: success,
        error: error
    });
}

function TipsShow(msg, type, callBack, title) {
    switch (type) {
        case "success":
            var divID = "divtips" + (new Date().getTime());
            var tips = '<div style="z-index: 10000; top: 65px; left: 50%; position: fixed;display:none" id="' + divID + '"><div class="alert in fade alert-success" style="text-indent:20px;padding:15px;"><i style="display:block;width:18px;height:18px;background:url(/admin/images/true.gif) no-repeat;position:absolute;left:10px; top:18px;"></i>' + msg + '</div></div>';
            $(document.body).append(tips);
            var obj = $("#" + divID);
            var divLeft = ($("body").width() - obj.width()) / 2;
            obj.css("left", divLeft + "px")
            obj.slideDown("slow", function () { setTimeout(function () { obj.slideUp("slow", function () { if (callBack) { callBack() } obj.remove(); }) }, 1500) });
            //obj.slideDown("slow");
            break;
        case "fail":
        case "error":
            var divID = "divfailtips";//+ (new Date().getTime());
            if (document.getElementById(divID)) { $("#" + divID).remove(); }
            var tips = '<div class="modal fade in" id="' + divID + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false"><div class="modal-dialog"><div class="alert alert-danger" style="text-indent:20px;position: relative;padding: 15px;"><i style="display:block;width:18px;height:18px;background:url(/admin/images/false.gif) no-repeat;position:absolute;left:10px; top:15px;"></i>' + msg + '<a href="#" class="close" data-dismiss="modal" aria-hidden="true" style="position: absolute; top: 15px; right: 7px;">&times;</a></div></div></div>';
            $(document.body).append(tips);
            $('#' + divID).modal('show');

            $("#" + divID).on('hide.bs.modal', function () {
                $("body").removeAttr("style");
                if (callBack) {
                    callBack();
                }
            })
            break;
        case "warning":
            var divID = "divwarningtips";//+ (new Date().getTime());
            if (document.getElementById(divID)) { $("#" + divID).remove(); }
            var tips = '<div class="modal fade in" id="' + divID + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false"><div class="modal-dialog"><div class="alert alert-warning" style="text-indent:20px;position: relative;padding: 15px;"><i style="display:block;width:18px;height:18px;background:url(/admin/images/warning.gif) no-repeat;position:absolute;left:10px;"></i>' + msg + '<a href="#" class="close" data-dismiss="modal" aria-hidden="true" style="position: absolute; top: 2px; right: 7px;">&times;</a></div></div></div>';
            $(document.body).append(tips);
            //window.location = "#divwarningtips";
            $('#' + divID).modal('show');

            $("#" + divID).on('hide.bs.modal', function () {

                if (callBack) {
                    callBack();
                }
            })
            break;
        case "confirm":
            var objID = callBack;
            var divID = "divconfirmtips";//+ (new Date().getTime());
            if (document.getElementById(divID)) { $("#" + divID).remove(); }
            var tips = '<div class="modal fade mymodal" id="' + divID + '">' +
                '    <div class="modal-dialog">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '            </div>' +
                '            <div class="modal-body">' +
                '                <div class="information clearfix">' +
                '                    <i class="glyphicon glyphicon-exclamation-sign fl"></i>' +
                '                    <div class="info">' + msg +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-success btn-sm"  data-dismiss="modal" onclick="isconfirmOK=true;$(\'#' + objID + '\').trigger(\'click\');isconfirmOK=false;">确定</button>' +
                '                <button type="button" class="btn btn-sm" data-dismiss="modal">取消</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';

            $(document.body).append(tips);
            $('#' + divID).modal('toggle').children().css({
                width: '500px'
            })
            break;
        case "confirmII":
            //回调函数型
            var divID = "divconfirmtips";//+ (new Date().getTime());
            var Stitle = "信息提醒";
            if (title != null) {
                Stitle = title;

            };
            if (document.getElementById(divID)) { $("#" + divID).remove(); }
            var tips = '<div class="modal fade mymodal" id="' + divID + '">' +
                '    <div class="modal-dialog">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title" style="text-align:left;margin-bottom:3px;line-height:14px" >' + Stitle + '</h4>' +
                '            </div>' +
                '            <div class="modal-body">' +
                '                <div class="information clearfix">' +
                '                    <i class="glyphicon glyphicon-exclamation-sign fl"></i>' +
                '                    <div class="info">' + msg +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-success btn-sm" id="Confirm_' + divID + '" >确定</button>' +
                '                <button type="button" class="btn btn-sm" data-dismiss="modal">取消</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';

            $(document.body).append(tips);
            $('#' + divID).modal('toggle').children().css({
                width: '500px'
            });
            $("#Confirm_" + divID).click(function () {
                $('#' + divID).modal('toggle');
                if (callBack) {
                    callBack();
                }
            })
            break;
        default:
            break;
    }
}

function myConfirm(title, content, ensureText, ensuredCallback) {
    var myConfirmCode = '<div class="modal fade" id="myConfirm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title" id="myModalLabel">' + title + '</h4>\
                      </div>\
                      <div class="modal-body">\
                        ' + content + '\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                        <button type="button" class="btn btn-danger">' + ensureText + '</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>';
    if ($("#myConfirm").length > 0) {
        $("#myConfirm").remove();
    }

    $("body").append(myConfirmCode);
    
    $('#myConfirm').modal();

    $('#myConfirm button.btn-danger').unbind("click", "");
    $('#myConfirm button.btn-danger').click(function (event) {
        if (ensuredCallback)
            ensuredCallback();
        $('#myConfirm').modal('hide')
    });
}

function myConfirm1(title, content, canceText, ensureText, ensuredCallback) {
    var myConfirmCode = '<div class="modal fade" id="myConfirm1" tabindex="-1" role="dialog" aria-hidden="true">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" name="btn_cancel" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title">' + title + '</h4>\
                      </div>\
                      <div class="modal-body">\
                        ' + content + '\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" name="btn_cancel" class="btn btn-default" data-dismiss="modal">' + canceText + '</button>\
                        <button type="button" name="btn_ok" class="btn btn-danger">' + ensureText + '</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>';
    if ($("#myConfirm1").length > 0) {
        $("#myConfirm1").remove();
    }

    $("body").append(myConfirmCode);

    $('#myConfirm1').modal({ backdrop: "static" });
    $('#myConfirm1 button[name=\'btn_ok\']').unbind("click", "");
    $('#myConfirm1 button[name=\'btn_cancel\']').unbind("click", "");

    $('#myConfirm1 button[name=\'btn_ok\']').click(function (event) {
        if (ensuredCallback)
            ensuredCallback(true);
        $('#myConfirm1').modal('hide')
    });
    $('#myConfirm1 button[name=\'btn_cancel\']').click(function (event) {
        if (ensuredCallback)
            ensuredCallback(false);
        $('#myConfirm1').modal('hide')
    });

}

function alert_h(content, ensuredCallback) {
    var myConfirmCode = '<div class="modal fade" id="alert_h" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <h5 class="modal-title" id="myModalLabel">操作提示</h5>\
                      </div>\
                      <div class="modal-body" style="font-size:14px;">\
                        ' + content + '\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btn btn-danger" data-dismiss="modal">确认</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>';

    if ($("#alert_h").length != 0) {
        $('#alert_h').remove();
    }
    $("body").append(myConfirmCode);
    $('#alert_h').modal();

    $('#alert_h').off('hide.bs.modal').on('hide.bs.modal', function (e) {
        if (ensuredCallback)
            ensuredCallback();
    });
}

function ShowDialog(title, ensureText, content_id, ensuredCallback) {
    var clonecontent = $('#' + content_id).css({ display: 'block' }).clone();
    $('#' + content_id).replaceWith('<div id="msgtable"></div>');
    $("#myConfirm").remove();
    var myConfirmCode = '<div class="modal fade" id="myConfirm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title" id="myModalLabel">' + title + '</h4>\
                      </div>\
                      <div class="modal-body">\
                        ' + clonecontent[0].outerHTML + '\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                        <button type="button" class="btn btn-danger">' + ensureText + '</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>';

    $("body").append(myConfirmCode);
    $('#myConfirm').modal();
    $('#myConfirm button.btn-danger,#myConfirm button.btn-default').unbind("click", "");
    $('#myConfirm button.btn-default').click(function () {
        $("#" + content_id).remove();
        $("#msgtable").replaceWith($(clonecontent).css({ display: 'none' })[0].outerHTML);
    });
    $('#myConfirm button.btn-danger').click(function (event) {
        if (ensuredCallback) {
            if (ensuredCallback()) {
                $('#myConfirm').modal('hide');
                $("#" + content_id).remove();
                $("#msgtable").replaceWith(clonecontent[0].outerHTML);
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////
// String Helper
///////////////////////////////////////////////////////////////////////////////////
String.format = function () {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

//读取QueryString里的Name
function getRequestString(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//字符串类型转换为Boolean类型
function parseBool(val) {
	if ((typeof val === "string" && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes')) || val === 1)
		return true;
	else if ((typeof val === "string" && (val.toLowerCase() === 'false' || val.toLowerCase() === 'no')) || val === 0)
		return false;

	return null;
}

//判断是否是数字类型，如果是返回true, 否则返回false
function isNumber(o) {
	return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

//字符串转换为Integer
Number.tryParseInt = function (str, defaultValue) {
	if (isNumber(str) == true) {
		return parseInt(str);
	}

	var retValue = defaultValue;
	if (str != null) {
		if (str.length > 0) {
			if (!isNaN(str)) {
				retValue = parseInt(str);
			}
		}
	}
	return retValue;
}

//字符串转换为Float
Number.tryParseFloat = function (str, defaultValue) {
	if (isNumber(str) == true) {
		return parseFloat(str);
	}

	var retValue = defaultValue;
	if (str != null) {
		if (str.length > 0) {
			if (!isNaN(str)) {
				retValue = parseFloat(str);
			}
		}
	}
	return retValue;
}

//替换字符串中包含的全部匹配字串
String.prototype.replaceAll = function (stringToFind, stringToReplace) {
	var temp = this;
	var index = temp.indexOf(stringToFind);
	while (index != -1) {
		temp = temp.replace(stringToFind, stringToReplace);
		index = temp.indexOf(stringToFind);
	}
	return temp;
}

function IsPhone(phone) {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone)))
        return false;

    return true;
}