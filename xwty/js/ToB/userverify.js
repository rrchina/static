$(function () {
    $.fn.serializeJSON = function (checkboxValToString, removeEmpty, selector) {
        if (!selector) {
            selector = 'input:not([type=file]),select,textarea';
        }
        var json = {};
        $.each(this.find(selector), function (i) {
            var el = $(this), key = el.attr('name'), val = $.trim(el.val());
            if (val !== undefined && val !== null && (!removeEmpty || val != '')) {
                if (el.is(':checkbox')) {
                    if (!checkboxValToString) {
                        el.prop('checked') && ($.isArray(json[key]) ? json[key].push(val) : json[key] = [val]);
                    } else {
                        el.prop('checked') && (json[key] = json[key] ? json[key] + "," + val : val);
                    }
                } else if (el.is(':radio')) {
                    el.prop('checked') && (json[key] = val);
                } else {
                    json[key] = val;
                }
            }
        });
        return json;
    };
    $("#Agree").click(function () {
        checkagree();
    });
    $("#btn_verify").click(function () {
        if ($("#v_form").valid()) {
            var data = $("#v_form").serializeJSON();
            if (!$("#Agree")[0].checked) {
                layer.msg("未同意协议", { time: 2000 });
            } else {
                var data = $("#v_form").serializeJSON(true);
                showmask(true, { opacity: 0.3 });
                showwaitmsg(true, "正在验证你的信息...");
                setTimeout(function () {
                    $.ajax({
                        url: "/livebetter/checkuser", type: "post", dataType: "json", data: data,
                        success: function (r) {
                            showwaitmsg(false);
                            showmask(false);
                            if (r.errorCode == 1 || r.errorCode == 99) {
                                layer.open({
                                    title: "提示",
                                    content:"验证成功！<br/>请前往<b>个人中心</b>上传相关资料成为代理！",
                                    closeBtn: 0,
                                    area: ["80%", "auto"],
                                    btn: ["立即前往"], btn1: function () {
                                        location.href = _rurl;
                                    }
                                });
                            } else {
                                showmask(false);
                                layer.msg(r.errorMessage, { time: 2000 });
                            }
                        }, error: function (r) {
                            showwaitmsg(false);
                            showmask(false);
                            layer.msg("信息验证失败", { time: 2000 });
                        }
                    });
                }, 1000);
            }
        }
        return false;
    });
    $("#btn_read").click(function () {
        layer.open({
            type: 1,closeBtn:0, title:"协议内容", area: ["90%", "80%"], btn: ["完成阅读"], content: $("#agreement").html(),
            btn1: function () {
                $("#v_panel").show(500);
            }
        });
    });
    $(window).resize(winresize);
    winresize();
    checkagree();
});
function winresize() {
    $(".outer").css("min-height", $(window).height());
}
function checkagree() {
    $("#btn_verify").prop("disabled", !$("#Agree")[0].checked)
}

function showwaitmsg(show, msg, opts) {
    if (show) {
        if (!opts) {
            opts = {};
        }
        if (!opts.bg) {
            opts.bg = "#000000";
        }
        if (!opts.opacity) {
            opts.opacity = 0.8;
        }
        if (!opts.color) {
            opts.color = "#ffffff";
        }
        if (!opts.fontsize) {
            opts.fontsize = "1em";
        }
        if (!opts.position) {
            opts.positon = "middle";
        }
        var $p = $('<div id="_rr_wait_msg" abc style="background:' + opts.bg + ';opacity:' + opts.opacity + ';color:' + opts.color + ';font-size:' + opts.fontsize + ';border-radius:3px;position:fixed;left:50%;white-space:nowrap;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);z-index:980;text-align:center;padding:1em;box-shadow:0 0 8px #555555">' + msg + '</div>');
        $("body").append($p);
        if (opts.position == "top") {
            $p.css({ top: '15%' });
        } else if (opts.position == "bottom") {
            $p.css({ bottom: '15%' });
        } else {
            $p.css({ top: '50%' });
        }
    } else {
        $("#_rr_wait_msg").remove();
    }
}
function showmask(show, opts) {
    if (show) {
        if (!opts) {
            opts = {};
        }
        if (!opts.bg) {
            opts.bg = "#000000";
        }
        if (!opts.opacity) {
            opts.opacity = 0.5;
        }
        $("body").append('<div id="_rr_mask" style="position:fixed;left:0;top:0;width:100%;height:100%;opacity:' + opts.opacity + ';background:' + opts.bg + ';z-index:900;"></div>');
    } else {
        $("#_rr_mask").remove();
    }
}