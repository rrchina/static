/*
 *
 *   电子标签模板设计框架
 *   version 1.0
 *
*/
; (function (global, $) {
    "use strict";

    var tag = function () {
    };

    tag.prototype = {
    };

    global.tag = tag;

})(this, jQuery);

+function (tag) {
    "use strict";

    var container = "";

    var toolbox = "#toolbox";

    var row = 0;
    var t_row = 0;

    var selData = {
        "row_0": { ItemId: 0, ItemIndex: 0, TemplateId: 0, CreateUserId: 0, ItemType: 0, ValueStr: "", X: 0, Y: 0, Height: 0, Width: 0, Color: "#000000", FontSize: 20, FontFamily: "微软雅黑,Microsoft YaHei", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 }
    };

    var deviceType;

    var preview;

    var preview_out = "";

    var tablist;
    var tabcontent;

    var offset = 40;

    var items;

    var skuId = "";

    var uploadId;

    var defaultPrice = "88.88";
    var defaultTitle = "标题内容";

    var titleCallback = "";
    var priceCallback = "";

    var tablistbox;

    var box_content = '<div class="tag_tool_box">\
        <button type="button" class="btn btn-default" onclick="tag.AddItem(4)"><span class="fa fa-font"></span> 文字</button>\
                                    <button type="button" class="btn btn-default" onclick="tag.AddItem(5)"><span class="fa fa-image"></span> 图片</button>\
                                    <div class="btn-group" role="group">\
                                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                            <span class="fa fa-rmb"></span> 价格\
                                            <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" style="left: 0px;right:auto;border:#ddd solid 1px;">\
                                            <li><a href="javascript:;" onclick="tag.AddItem(1)">完整 <small style="color:#999">如:100.99</small></a></li>\
                                            <li><a href="javascript:;" onclick="tag.AddItem(2)">整数 <small style="color:#999">如:100</small></a></li>\
                                            <li><a href="javascript:;" onclick="tag.AddItem(3)">小数 <small style="color:#999">如:.99</small></a></li>\
                                        </ul>\
                                    </div>\
                                    <div class="btn-group" role="group">\
                                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                            <span class="fa fa-qrcode"></span> 二维码\
                                            <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" style="left: 0px;right:auto;border:#ddd solid 1px;">\
                                            <li><a href="javascript:;" onclick="tag.AddItem(6)"><span class="fa fa-link"></span> 网址二维码</a></li>\
                                            <li><a href="javascript:;" onclick="tag.AddItem(7)"><span class="fa fa-shopping-bag"></span> 商品二维码</a></li>\
<li role="separator" class="divider" style="height: 1px;margin: 2px 5px;"></li>\
<li><a href="javascript:;" onclick="tag.AddItem(8)"><span class="fa fa-ellipsis-h"></span> 条形码</a></li>\
                                        </ul>\
                                    </div>\
                                    <div class="btn-group" role="group">\
                                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                            <span class="fa fa-square"></span> 画图\
                                            <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu" style="left: 0px;right:auto;border:#ddd solid 1px;">\
                                            <li><a href="javascript:;" onclick="tag.AddItem(9)"><span class="fa fa-square" style="color:#999"></span> 矩形</a></li>\
                                            <li><a href="javascript:;" onclick="tag.AddItem(10)"><span class="fa fa-circle" style="color:#999"></span> 圆形</a></li>\
                                            <li role="separator" class="divider" style="height: 1px;margin: 2px 5px;"></li>\
                                            <li><a href="javascript:;" onclick="tag.AddItem(11)"><span class="fa fa-arrows-h" style="color:#999"></span> 横线</a></li>\
                                            <li><a href="javascript:;" onclick="tag.AddItem(12)"><span class="fa fa-arrows-v" style="color:#999;padding-left:3px;padding-right:4px;"></span> 竖线</a></li>\
                                        </ul>\
                                    </div><div id="{0}_upload"></div>\
        </div>\
<div class="tag_preview_box">\
<img onload="tag.Preview(this.src)" id="{0}_preview" />\
<hr style="margin-bottom:0; margin-top:0;"><small>尺寸：{w}*{h}</small>\
</div>\
<div class="tag_tab_box">\
                                <div id="{0}_tablistbox" style="overflow:hidden;border-bottom:#ddd solid 1px;">\
                                    <div id="{0}_tablistbox_left" class="tag_listbox_left">\
                                        <ul class="nav nav-tabs nav-tabs2" role="tablist" id="{0}_tablist" style="position:relative; display:inline-flex"></ul>\
                                    </div>\
                                    <div id="{0}_tablistbox_right" class="tag_listbox_right">\
                                        <span id="{0}_tablistbox_more" style="float:left; display:block; margin-left:5px; color:#999"></span>\
                                        <div class="btn-group" role="group" aria-label="...">\
                                            <button onclick="tag.tabLeft()" id="{0}_tablistbox_btn_left" type="button" class="btn btn-xs btn-default">←</button>\
                                            <button onclick="tag.tabRight()" id="{0}_tablistbox_btn_right" type="button" class="btn btn-xs btn-default">→</button>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="tab-content" id="{0}_tabcontent" style="border-left: #ddd solid 1px; border-right: #ddd solid 1px;border-bottom: #ddd solid 1px;padding: 10px;text-align:left;">\
                                </div>\
</div>';

    var tagTemplate = function (pa) {
        container = pa.container;
        row = pa.row;
        selData = pa.selData;
        deviceType = pa.deviceType;
        items = pa.items;
        skuId = pa.skuId;

        if (typeof (pa.defaultPrice) != "undefined") defaultPrice = pa.defaultPrice;
        if (typeof (pa.defaultTitle) != "undefined") defaultTitle = pa.defaultTitle;
        if (typeof (pa.titleCallback) != "undefined") titleCallback = pa.titleCallback;
        if (typeof (pa.priceCallback) != "undefined") priceCallback = pa.priceCallback;
        if (typeof (pa.offset) != "undefined") offset = pa.offset;
        if (typeof (pa.preview_out) != "undefined") preview_out = pa.preview_out;
        
        InitTemplate();
    };

    var InitTemplate = function () {
        preview = container + "_preview";
        tablist = container + "_tablist";
        tabcontent = container + "_tabcontent";
        uploadId = container + "_upload";
        tablistbox = container + "_tablistbox";

        box_content = replace(box_content, "{0}", container.replace("#", ""));
        box_content = replace(box_content, "{w}", deviceType.Width);
        box_content = replace(box_content, "{h}", deviceType.Height);

        $(container).html(box_content);

        var uploader = WebUploader.create({
            compress: false,
            // 选完文件后，是否自动上传。
            auto: true,
            //fileNumLimit: 1,
            // swf文件路径
            swf: '/js/plugins/webuploader-0.1.5/expressInstall.swf',
            // 文件接收服务端。
            server: '/Management/Upload/UploadPicture',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: uploadId, multiple: false
            },
            formData: {
                basePath: "/upload/dzbq/template/"
            },
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        uploader.on('uploadSuccess', function (file, response) {
            if (response.errorCode == 0) {
                $("#row_" + t_row).find("input[name='ValueStr']").val(response.data);

                tag.DrawImage();
            }
        });

        $.each(selData, function (i, m) {
            tag.AddItem(m.ItemType, m.ItemIndex);
        });

        $(tablist + " li").eq(0).find("a").click();

        tag.DrawImage();

        document.onkeydown = function (event) {
            var rowItem = $("#row_" + t_row);

            if (rowItem.length > 0) {
                var e = event || window.event || arguments.callee.caller.arguments[0];

                if (e && (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)) {
                    if (e && e.keyCode == 37) {//左
                        tag.toLeft(rowItem.find("button[name='left']")); //alert('37=左键');
                    }

                    if (e && e.keyCode == 38) {//上
                        tag.toUp(rowItem.find("button[name='up']")); //alert('38=上键');
                    }

                    if (e && e.keyCode == 39) {//右
                        tag.toRight(rowItem.find("button[name='right']")); //alert('39=右键');
                    }

                    if (e && e.keyCode == 40) {//下
                        tag.toDown(rowItem.find("button[name='down']")); //alert('40=下键');
                    }

                    e.preventDefault && e.preventDefault();
                    e.returnValue = false;
                    e.stopPropagation && e.stopPropagation();
                }
            }
        };

        $(window).resize(function () {  //当浏览器大小变化时
            setTabSize();
        });

        setTabSize();

        $(tablist).css("left", 0);

        $(preview).click(function () {
            var mPos = getMousePos();
            var iPos = getAbsPos(this);

            getTabByPos({ x: (mPos.x - iPos.x), y: (mPos.y - iPos.y) });
        });
    };

    //重载
    tag.ReloadTemplate = function (_row, _data) {
        row = _row;
        selData = _data;

        $(container).html(box_content);

        $.each(selData, function (i, m) {
            tag.AddItem(m.ItemType, m.ItemIndex);
        });

        $(tablist + " li").eq(0).find("a").click();

        tag.DrawImage();

        setTabSize();

        $(tablist).css("left", 0);
    };

    var setTabSize = function() {
        var width = (document.body.offsetWidth - offset);

        $(tablistbox).css("width", width + "px");
        $(container + "_tablistbox_left").css("width", (width - 100) + "px");
        $(container + "_tablistbox_right").css("width", "100px");

        tabLeftRight();
    };

    tag.tabLeft = function () {
        var p = $("#tab_row_" + t_row).prev();
        if (p.length <= 0) {
            return false;
        }

        t_row = parseInt(p.attr("data-index"));

        $("#tab_row_" + t_row).find("a").click();

        tabLeftRight();
    };

    tag.tabRight = function () {
        var n = $("#tab_row_" + t_row).next();
        if (n.length <= 0) {
            return false;
        }

        t_row = parseInt(n.attr("data-index"));

        $("#tab_row_" + t_row).find("a").click();

        var tab_offset = $("#tab_row_" + t_row).offset();
        var tablist_offset = $(tablist).offset();

        var left_width = tab_offset.left - tablist_offset.left;

        if ($(tablist).outerWidth() - left_width < $(tablistbox + "_tablistbox_left").width() - 50) {
            return;
        }

        $(tablist).css("left", -left_width + "px");

        tabLeftRight();
    };

    var tabLeftRight = function (move) {
        var p = $("#tab_row_" + t_row).prev();
        if (p.length <= 0) {
            $(container + "_tablistbox_btn_left").attr("disabled", true);
        } else {
            $(container + "_tablistbox_btn_left").attr("disabled", false);
        }

        var n = $("#tab_row_" + t_row).next();
        if (n.length <= 0) {
            $(container + "_tablistbox_btn_right").attr("disabled", true);
        } else {
            $(container + "_tablistbox_btn_right").attr("disabled", false);
        }

        var width = (document.body.offsetWidth - offset);

        if ($(tablist).width() > width) {
            $(container + "_tablistbox_more").html("...");
        } else {
            $(container + "_tablistbox_more").html("");
        }

        if (typeof (move) == "undefined") move = true;
        else move = move;

        if (!move) return false;

        var tab_offset = $("#tab_row_" + t_row).offset();
        var tablist_offset = $(tablist).offset();

        var tablist_left = parseInt($(tablist).css("left").replace("px", ""));

        var left_width = tab_offset.left - tablist_offset.left;

        if ($(tablist).outerWidth() - left_width < $(tablistbox + "_tablistbox_left").width() - 50 && tablist_left > left_width) {
            return;
        }

        $(tablist).css("left", -left_width + "px");
    };

    var replace = function (source, str, to) {
        var index = source.indexOf(str);
        while (index != -1) {
            source = source.replace(str, to);
            index = source.indexOf(str);
        }
        return source;
    };

    var isNumber = function (str) {
        return /^[\d]+\.?\d*$/.test(str);
    };

    var isChinese = function (str) {
        return /^[\u4e00-\u9fa5]+$/.test(str);
    };

    var isEn = function (str) {
        return /[^a-z^A-Z^0-9]*$/.test(str);
    };

    var getTabByPos = function (pos) {
        $(tabcontent + " .tab-pane").each(function () {
            var itemIndex = $(this).find("input[name='ItemIndex']").val();
            var valueStr = $(this).find("input[name='ValueStr']").val();
            var itemType = $(this).find("input[name='ItemType']").val();
            var x = parseInt($(this).find("input[name='X']").val());
            var y = parseInt($(this).find("input[name='Y']").val());
            var width = parseInt($(this).find("input[name='Width']").val());
            var height = parseInt($(this).find("input[name='Height']").val());
            var fontSize = parseInt($(this).find("input[name='FontSize']").val());

            if (itemType == 0 || itemType == 1 || itemType == 2 || itemType == 3 || itemType == 4) {
                var baseWidth = 8;
                var baseHeight = 8;

                var len = valueStr.length;

                if (fontSize <= 8) {
                    baseHeight = 8;
                } else if (fontSize > 8 && fontSize <= 10) {
                    baseHeight = 13;
                } else if (fontSize > 10 && fontSize <= 12) {
                    baseHeight = 15;
                } else if (fontSize > 12 && fontSize <= 16) {
                    baseHeight = 17;
                } else if (fontSize > 16 && fontSize <= 20) {
                    baseHeight = 20;
                } else if (fontSize > 20 && fontSize <= 30) {
                    baseHeight = 24;
                } else if (fontSize > 30 && fontSize <= 40) {
                    baseHeight = 28;
                } else if (fontSize > 40 && fontSize <= 60) {
                    baseHeight = 30;
                } else {
                    baseHeight = 33;
                }

                if (isChinese(valueStr))
                    baseWidth = parseInt((baseHeight * len) * 1.5);
                else
                    baseWidth = parseInt((baseHeight * len) * .6);

                if (pos.x >= x && pos.y >= y && pos.x <= (x + baseWidth) && pos.y <= (y + baseHeight)) {
                    $("#tab_row_" + itemIndex).find("a").click();
                    t_row = itemIndex;

                    tabLeftRight(true);
                    return false;
                }
            } else {
                if (pos.x >= x && pos.y >= y && pos.x <= (x + width) && pos.y <= (y + height)) {
                    $("#tab_row_" + itemIndex).find("a").click();
                    t_row = itemIndex;

                    tabLeftRight(true);
                    return false;
                }
            }
        });
    };

    var getAbsPos = function (p) {
        var _x = 0;
        var _y = 0;

        while (p.offsetParent) {
            _x += p.offsetLeft;
            _y += p.offsetTop;
            p = p.offsetParent;
        }

        _x += p.offsetLeft;
        _y += p.offsetTop;

        return { x: _x, y: _y };
    };

    var getMousePos = function (evt) {
        var _x, _y;

        evt = evt || window.event;

        if (evt.pageX || evt.pageY) {
            _x = evt.pageX;
            _y = evt.pageY;
        } else if (evt.clientX || evt.clientY) {
            _x = evt.clientX + document.body.scrollLeft - document.body.clientLeft;
            _y = evt.clientY + document.body.scrollTop - document.body.clientTop;
        } else {
            return getAbsPos(evt.target);
        }

        return { x: _x, y: _y };
    };

    tag.setSkuId = function (_skuid) {
        skuId = _skuid;
    };

    tag.setDeviceType = function (_deviceType) {
        deviceType = _deviceType;
    };

    tag.setDefaultPrice = function (_defaultPrice) {
        defaultPrice = _defaultPrice;
    };

    tag.setTRow = function (_row) {
        t_row = _row;

        tabLeftRight(false);
    };

    tag.Preview = function (src) {
        if ($(preview_out).length > 0) {
            $(preview_out).attr("src", src);
        }
    };

    //绘制图形
    tag.DrawImage = function () {
        var _items = [];

        var displaySequence = 0;

        $(tabcontent + " .tab-pane").each(function () {
            var id = $(this).attr("id");

            selData[id].ItemId = $(this).find("input[name='ItemId']").val();
            selData[id].ItemIndex = $(this).find("input[name='ItemIndex']").val();
            selData[id].ItemType = $(this).find("input[name='ItemType']").val();
            selData[id].ValueStr = $(this).find("input[name='ValueStr']").val();
            selData[id].X = $(this).find("input[name='X']").val();
            selData[id].Y = $(this).find("input[name='Y']").val();
            selData[id].Color = $(this).find("select[name='Color']").val();
            selData[id].FontFamily = $(this).find("select[name='FontFamily']").val();
            selData[id].FontSize = $(this).find("input[name='FontSize']").val();
            selData[id].FontStyle = $(this).find("select[name='FontStyle']").val();
            selData[id].HasDot = $(this).find("input[name='HasDot']").prop("checked");
            selData[id].HasRmb = $(this).find("input[name='HasRmb']").prop("checked");
            selData[id].Width = $(this).find("input[name='Width']").val();
            selData[id].Height = $(this).find("input[name='Height']").val();
            selData[id].CornerRadiu = $(this).find("input[name='CornerRadiu']").val();
            selData[id].DrawType = $(this).find("select[name='DrawType']").val();
            selData[id].BorderSize = $(this).find("input[name='BorderSize']").val();

            if (selData[id].ItemType == 0 || selData[id].ItemType == 1 || selData[id].ItemType == 2 || selData[id].ItemType == 3 || selData[id].ItemType == 4) {
                if (selData[id].ItemType == 1 || selData[id].ItemType == 2 || selData[id].ItemType == 3) {
                    if (selData[id].ValueStr == "") {
                        selData[id].ValueStr = "0.00";
                    } else {
                        if (selData[id].ValueStr.indexOf('.') == -1) {
                            selData[id].ValueStr += ".00";
                        } else {
                            if (selData[id].ValueStr.split('.')[1] == "") {
                                selData[id].ValueStr += "00";
                            }
                        }
                    }
                }

                $(tablist + " li").find("a[aria-controls='row_" + selData[id].ItemIndex + "']").attr("title", selData[id].ValueStr);
            } else if (selData[id].ItemType == 5) {
                $(tablist + " li").find("a[aria-controls='row_" + selData[id].ItemIndex + "']").html('<img src="' + selData[id].ValueStr + '" style="width:18px;height:18px" /> 图片');
            }

            var item = { DisplaySequence:displaySequence, ItemId: selData[id].ItemId, ItemType: selData[id].ItemType, ValueStr: selData[id].ValueStr, X: selData[id].X, Y: selData[id].Y, Height: selData[id].Height, Width: selData[id].Width, Color: selData[id].Color, FontSize: selData[id].FontSize, FontFamily: selData[id].FontFamily, FontStyle: selData[id].FontStyle, HasDot: selData[id].HasDot, HasRmb: selData[id].HasRmb, CornerRadiu: selData[id].CornerRadiu, DrawType: selData[id].DrawType, BorderSize: selData[id].BorderSize };
            _items.push(item);

            displaySequence++;
        });

        $.ajax({
            url: "/Management/Dzbq_TagTemplate/TemplatePreview",
            type: "POST",
            dataType: "json",
            data: { DeviceType: deviceType, TemplateItems: _items },
            success: function (result) {
                if (result.errorCode == 0)
                    $(preview).attr("src", "data:image/jpeg;base64," + result.data);
            }
        });

        $(items).val(JSON.stringify(_items));
    };

    tag.toLeft = function (c) {
        var _parent = $(c).parent().parent().parent();
        _parent.find("input[name='X']").val(parseInt(_parent.find("input[name='X']").val()) - 1);

        tag.DrawImage();
    };

    tag.toRight = function (c) {
        var _parent = $(c).parent().parent().parent();
        _parent.find("input[name='X']").val(parseInt(_parent.find("input[name='X']").val()) + 1);

        tag.DrawImage();
    };

    tag.toUp = function (c) {
        var _parent = $(c).parent().parent().parent();
        _parent.find("input[name='Y']").val(parseInt(_parent.find("input[name='Y']").val()) - 1);

        tag.DrawImage();
    };

    tag.toDown = function (c) {
        var _parent = $(c).parent().parent().parent();
        _parent.find("input[name='Y']").val(parseInt(_parent.find("input[name='Y']").val()) + 1);

        tag.DrawImage();
    };

    tag.SelectImage = function (c) {
        var _parent = $(c).parent().parent().parent().parent().parent();
        t_row = _parent.find("input[name='ItemIndex']").val();
        $(uploadId).find("input").click();
    };

    //删除项
    tag.RemoveItem = function (c) {
        myConfirm("温馨提示：", "确定要删除当前参数吗？", "确定", function () {
            var _parent = $(c).parent().parent().parent();

            tag.DirectRemoveItem(_parent, true);
        });
    };

    tag.DirectRemoveItem = function (_parent, drawImage) {

        var id = _parent.attr("id");

        var itemType = _parent.find("input[name='ItemType']").val();
        var itemId = _parent.find("input[name='ItemId']").val();

        if (itemId > 0) {
            $.ajax({
                url: "/Management/Dzbq_TagTemplate/DeleteItem/" + itemId,
                type: "POST",
                dataType: "json",
                success: function (result) {
                    if (result.errorCode == 0) {
                        $(tablist + " li").each(function () {
                            if ($(this).find("a").attr("aria-controls") == id) {
                                $(this).remove();
                            }
                        });

                        _parent.remove();

                        delete selData[id];

                        $(tablist + " li").eq(0).find("a").click();

                        tag.DrawImage();

                        setTabSize();
                    } else {
                        parent.layer.msg('删除失败,请稍后再试!');
                    }
                }
            });
        } else {
            $(tablist + " li").each(function () {
                if ($(this).find("a").attr("aria-controls") == id) {
                    $(this).remove();
                }
            });

            _parent.remove();

            delete selData[id];

            $(tablist + " li").eq(0).find("a").click();

            if (drawImage)
                tag.DrawImage();

            setTabSize();
        }
    };

    //mode == 0 left | 1 right
    tag.ItemDisplaySequence = function (mode, _row) {
        var rowItem = $("#row_" + _row); //当前对象
        var tabRowItem = $("#tab_row_" + _row); //当前对象

        if (rowItem.length > 0 && tabRowItem.length > 0) {
            if (mode == 0) {
                var prevItem = rowItem.prev(); //前面对象
                var prevTabItem = tabRowItem.prev(); //前面对象

                if (prevItem.length > 0 && prevTabItem.length > 0) {
                    rowItem.insertBefore(prevItem);
                    tabRowItem.insertBefore(prevTabItem);
                }
            } else {
                var nextItem = rowItem.next(); //后面对象
                var nextTabItem = tabRowItem.next(); //后面对象

                if (nextItem.length > 0 && nextTabItem.length > 0) {
                    nextItem.insertBefore(rowItem);
                    nextTabItem.insertBefore(tabRowItem);
                }
            }
        }

        tag.DrawImage();

        setTabSize();
    };

    //添加项
    tag.AddItem = function (type, _row) {
        //0标题 1价格 2价格整数 3价格小数 4文字 5图片 6网址二维码 7商品二维码 8条形码 9矩形 10圆形 11横线 12竖线
        //DeviceType.Color 黑白 = 0,黑白红 = 1,黑白黄 = 2,黑白蓝 = 3

        if (typeof (_row) != "undefined" && _row >= 0) _row = _row;
        else _row = -1;

        var _selItem;

        if (_row == -1) {
            row++;

            if (type == 1) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: defaultPrice, X: 10, Y: 35, Height: 0, Width: 0, Color: "#000000", FontSize: 20, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 2) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: defaultPrice, X: 10, Y: 55, Height: 0, Width: 0, Color: "#000000", FontSize: 20, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 3) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: defaultPrice, X: 40, Y: 55, Height: 0, Width: 0, Color: "#000000", FontSize: 20, FontFamily: "微软雅黑", FontStyle: "", HasDot: true, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 4) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "文字", X: 10, Y: 35, Height: 0, Width: 0, Color: "#000000", FontSize: 16, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 5) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "", X: 10, Y: 45, Height: 60, Width: 60, Color: "", FontSize: 0, FontFamily: "", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 6) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "http://www.baidu.com", X: 10, Y: 45, Height: 60, Width: 60, Color: "", FontSize: 0, FontFamily: "", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 7) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: skuId, X: 10, Y: 45, Height: 60, Width: 60, Color: "", FontSize: 0, FontFamily: "", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 8) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "6901028075725", X: 10, Y: 70, Height: 35, Width: 150, Color: "#000000", FontSize: 20, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 9) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "", X: 0, Y: 45, Height: 30, Width: deviceType.Width, Color: "#000000", FontSize: 20, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 10) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "", X: 30, Y: 45, Height: 0, Width: 50, Color: "#000000", FontSize: 20, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 11) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "", X: 0, Y: 55, Height: 1, Width: deviceType.Width, Color: "#000000", FontSize: 0, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else if (type == 12) {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: "", X: 80, Y: 0, Height: deviceType.Height, Width: 1, Color: "#000000", FontSize: 0, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            } else {
                _selItem = { ItemId: 0, ItemIndex: row, TemplateId: 0, CreateUserId: 0, ItemType: type, ValueStr: defaultTitle, X: 10, Y: 55, Height: 0, Width: 0, Color: "#000000", FontSize: 16, FontFamily: "微软雅黑", FontStyle: "", HasDot: false, HasRmb: false, CornerRadiu: 0, DrawType: 0, BorderSize: 0 };
            }

            selData["row_" + row] = _selItem;
        } else {
            _selItem = selData["row_" + _row];
        }

        var txt = "标题";
        var ValueStrTxt = "标题";

        if (type == 1) {
            txt = "价格";
            ValueStrTxt = "价格";
        } else if (type == 2) {
            txt = "价格整数";
            ValueStrTxt = "价格";
        } else if (type == 3) {
            txt = "价格小数";
            ValueStrTxt = "价格";
        } else if (type == 4) {
            txt = "文字";
            ValueStrTxt = "文字";
        } else if (type == 5) {
            txt = "图片";
            ValueStrTxt = "";
        } else if (type == 6) {
            txt = "网址二维码";
            ValueStrTxt = "网址";
        } else if (type == 7) {
            txt = "商品二维码";
            ValueStrTxt = "";
        } else if (type == 8) {
            txt = "条形码";
            ValueStrTxt = "内容";
        } else if (type == 9) {
            txt = "矩形";
            ValueStrTxt = "";
        } else if (type == 10) {
            txt = "圆形";
            ValueStrTxt = "";
        } else if (type == 11) {
            txt = "横线";
            ValueStrTxt = "";
        } else if (type == 12) {
            txt = "竖线";
            ValueStrTxt = "";
        }

        $(tablist).prepend('<li data-index="' + _selItem.ItemIndex + '" id="tab_row_' + _selItem.ItemIndex + '" role="presentation"><a href="#row_' + _selItem.ItemIndex + '" aria-controls="row_' + _selItem.ItemIndex + '" onclick="tag.setTRow(' + _selItem.ItemIndex + ')" role="tab" data-toggle="tab">' + txt + '</a></li>');
        $(tabcontent).prepend('<div role="tabpanel" class="tab-pane" id="row_' + _selItem.ItemIndex + '">\
                                        <input type="hidden" name="ItemType" value="' + _selItem.ItemType + '" />\
                                        <input type="hidden" name="ItemIndex" value="' + _selItem.ItemIndex + '" />\
                                        <input type="hidden" name="ItemId" value="' + _selItem.ItemId + '" />\
<table style="width:100%;border-bottom:#eee solid 1px; margin-bottom:10px;">\
                                            <tr>\
                                                <td>\
                                                    <button type="button" onclick="tag.ItemDisplaySequence(0,' + _selItem.ItemIndex + ')" class="btn btn-default btn-sm" style="float:left;"><span class="fa fa-angle-left" style="color:green"></span> <font color="green">上移一层</font></button>\
                                                    <button type="button" onclick="tag.ItemDisplaySequence(1,' + _selItem.ItemIndex + ')" class="btn btn-default btn-sm" style="float:right;"><font color="green">下移一层</font> <span class="fa fa-angle-right" style="color:green"></span></button>\
                                                 </td>\
                                            </tr>\
                                        </table>\
<div class="tag_tools_item' + ((type == 5 || type == 7 || type == 9 || type == 10 || type == 11 || type == 12) ? " hide" : "") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">' + ValueStrTxt + '</span>\
                                                        <input name="ValueStr" value="' + _selItem.ValueStr + '"' + ((type == 1 || type == 2 || type == 3) ? " onkeyup=\"if(isNaN(value))execCommand('undo')\" onafterpaste=\"if(isNaN(value))execCommand('undo')\"" : "") + ' onblur="tag.DrawImage();' + ((type == 1 || type == 2 || type == 3) && priceCallback != "" ? priceCallback + "(this.value);" : "") + (type == 0 && titleCallback != "" ? titleCallback + "(this.value);" : "") + '" placeholder="' + ValueStrTxt + '" class="form-control">\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + (((type == 1 || type == 2) && type != 3) ? "" : " hide") + '"><div class="input-group">\
                                                        <label onclick="tag.DrawImage()" style=" font-weight:normal"><input' + (_selItem.HasRmb ? " checked=\'checked\'" : "") + ' name="HasRmb" type="checkbox" /> 显示￥符号</label>\
                                                </div></div>\
<div class="tag_tools_item' + (((type == 2 || type == 3) && type != 1) ? "" : " hide") + '"><div class="input-group">\
                                                        <label onclick="tag.DrawImage()" style=" font-weight:normal"><input' + (_selItem.HasDot ? " checked=\'checked\'" : "") + ' name="HasDot" type="checkbox" /> 显示小数点</label>\
                                                </div></div>\
<div class="tag_tools_item">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">X</span>\
                                                        <input name="X" value="' + _selItem.X + '" onblur="tag.DrawImage()" class="form-control" style="width:60px; text-align:center;">\
                                                        <span class="input-group-addon input-group-addon2" style="border-left:none; border-right:none;">Y</span>\
                                                        <input name="Y" value="' + _selItem.Y + '" onblur="tag.DrawImage()" class="form-control" style="width:60px; text-align:center;">\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item"><div class="input-group">\
                                                    <button type="button" name="left" onclick="tag.toLeft(this)" class="btn btn-default"><span class="fa fa-angle-left" style="color:#999"></span> 左移</button>\
                                                    <button type="button" name="right" onclick="tag.toRight(this)" class="btn btn-default">右移 <span class="fa fa-angle-right" style="color:#999"></span></button>\
                                                    <button type="button" name="up" onclick="tag.toUp(this)" class="btn btn-default"><span class="fa fa-angle-double-up" style="color:#999"></span> 上移</button>\
                                                    <button type="button" name="down" onclick="tag.toDown(this)" class="btn btn-default"><span class="fa fa-angle-double-down" style="color:#999"></span> 下移</button>\
                                                </div></div>\
<div class="tag_tools_item' + ((type == 5 || type == 6 || type == 7 || type == 8) ? " hide" : "") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">颜色</span>\
                                                        <select name="Color" onchange="tag.DrawImage()" class="form-control">\
                                                            <option style="background:#000000;color:#ffffff;" value="#000000"' + (_selItem.Color == "#000000" ? " selected=\'selected\'" : "") + '>黑色</option>\
                                                            <option style="background:#ffffff;color:#000000;" value="#ffffff"' + (_selItem.Color == "#ffffff" ? " selected=\'selected\'" : "") + '>白色</option>\
' + (deviceType.Color == 1 ? '<option style="background:#ff0000;color:#ffffff;" value="#ff0000"' + (_selItem.Color == "#ff0000" ? " selected=\'selected\'" : "") + '>红色</option>' : '') + '\
' + (deviceType.Color == 2 ? '<option style="background:#ffff00;color:#000;" value="#ffff00"' + (_selItem.Color == "#ffff00" ? " selected=\'selected\'" : "") + '>黄色</option>' : '') + '\
' + (deviceType.Color == 3 ? '<option style="background:#0000ff;color:#ffffff;" value="#0000ff"' + (_selItem.Color == "#0000ff" ? " selected=\'selected\'" : "") + '>蓝色</option>' : '') + '\
                                                        </select>\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + ((type == 5 || type == 6 || type == 7 || type == 8 || type == 9 || type == 10 || type == 11 || type == 12) ? " hide" : "") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">字体</span>\
                                                        <select name="FontFamily" onchange="tag.DrawImage()" class="form-control">\
                                                            <option' + (_selItem.FontFamily == "微软雅黑" ? " selected=\'selected\'" : "") + ' value="微软雅黑" style="font-family:微软雅黑,Microsoft YaHei">微软雅黑</option>\
                                                            <option' + (_selItem.FontFamily == "黑体" ? " selected=\'selected\'" : "") + ' value="黑体" style="font-family:黑体, SimHei">黑体</option>\
                                                            <option' + (_selItem.FontFamily == "宋体" ? " selected=\'selected\'" : "") + ' value="宋体" style="font-family:宋体,SimSun">宋体</option>\
                                                            <option' + (_selItem.FontFamily == "楷体" ? " selected=\'selected\'" : "") + ' value="楷体" style="font-family:楷体,楷体_GB2312, SimKai">楷体</option>\
                                                            <option' + (_selItem.FontFamily == "隶书" ? " selected=\'selected\'" : "") + ' value="隶书" style="font-family:隶书, SimLi">隶书</option>\
<option' + (_selItem.FontFamily == "方正准圆简体" ? " selected=\'selected\'" : "") + ' value="方正准圆简体" style="font-family:方正准圆简体">方正准圆简体</option>\
<option' + (_selItem.FontFamily == "方正幼线简体" ? " selected=\'selected\'" : "") + ' value="方正幼线简体" style="font-family:方正幼线简体">方正幼线简体</option>\
<option' + (_selItem.FontFamily == "方正流行体简体" ? " selected=\'selected\'" : "") + ' value="方正流行体简体" style="font-family:方正流行体简体">方正流行体简体</option>\
<option' + (_selItem.FontFamily == "方正水柱简体" ? " selected=\'selected\'" : "") + ' value="方正水柱简体" style="font-family:方正水柱简体">方正水柱简体</option>\
<option' + (_selItem.FontFamily == "方正细珊瑚简体" ? " selected=\'selected\'" : "") + ' value="方正细珊瑚简体" style="font-family:方正细珊瑚简体">方正细珊瑚简体</option>\
<option' + (_selItem.FontFamily == "方正姚体简体" ? " selected=\'selected\'" : "") + ' value="方正姚体简体" style="font-family:方正姚体简体">方正姚体简体</option>\
<option' + (_selItem.FontFamily == "方正硬笔楷书简体" ? " selected=\'selected\'" : "") + ' value="方正硬笔楷书简体" style="font-family:方正硬笔楷书简体">方正硬笔楷书简体</option>\
<option' + (_selItem.FontFamily == "方正隶书简体" ? " selected=\'selected\'" : "") + ' value="方正隶书简体" style="font-family:方正隶书简体">方正隶书简体</option>\
<option' + (_selItem.FontFamily == "方正隶二简体" ? " selected=\'selected\'" : "") + ' value="方正隶二简体" style="font-family:方正隶二简体">方正隶二简体</option>\
<option' + (_selItem.FontFamily == "方正楷体简体" ? " selected=\'selected\'" : "") + ' value="方正楷体简体" style="font-family:方正楷体简体">方正楷体简体</option>\
<option' + (_selItem.FontFamily == "方正琥珀简体" ? " selected=\'selected\'" : "") + ' value="方正琥珀简体" style="font-family:方正琥珀简体">方正琥珀简体</option>\
<option' + (_selItem.FontFamily == "方正仿宋简体" ? " selected=\'selected\'" : "") + ' value="方正仿宋简体" style="font-family:方正仿宋简体">方正仿宋简体</option>\
<option' + (_selItem.FontFamily == "方正大黑简体" ? " selected=\'selected\'" : "") + ' value="方正大黑简体" style="font-family:方正大黑简体">方正大黑简体</option>\
<option' + (_selItem.FontFamily == "方正粗圆简体" ? " selected=\'selected\'" : "") + ' value="方正粗圆简体" style="font-family:方正粗圆简体">方正粗圆简体</option>\
<option' + (_selItem.FontFamily == "方正粗宋简体" ? " selected=\'selected\'" : "") + ' value="方正粗宋简体" style="font-family:方正粗宋简体">方正粗宋简体</option>\
<option' + (_selItem.FontFamily == "方正超粗黑简体" ? " selected=\'selected\'" : "") + ' value="方正超粗黑简体" style="font-family:方正超粗黑简体">方正超粗黑简体</option>\
<option' + (_selItem.FontFamily == "方正彩云简体" ? " selected=\'selected\'" : "") + ' value="方正彩云简体" style="font-family:方正彩云简体">方正彩云简体</option>\
<option' + (_selItem.FontFamily == "方正北魏楷书简体" ? " selected=\'selected\'" : "") + ' value="方正北魏楷书简体" style="font-family:方正北魏楷书简体">方正北魏楷书简体</option>\
                                                            <option' + (_selItem.FontFamily == "Arial" ? " selected=\'selected\'" : "") + ' value="Arial" style="font-family:Arial">Arial</option>\
                                                            <option' + (_selItem.FontFamily == "Script MT Bold" ? " selected=\'selected\'" : "") + ' value="Script MT Bold" style="font-family:Script MT Bold">Script MT Bold</option>\
                                                            <option' + (_selItem.FontFamily == "comic sans ms" ? " selected=\'selected\'" : "") + ' value="comic sans ms" style="font-family:comic sans ms">comic sans ms</option>\
                                                            <option' + (_selItem.FontFamily == "Impact" ? " selected=\'selected\'" : "") + ' value="Impact" style="font-family:Impact">Impact</option>\
                                                            <option' + (_selItem.FontFamily == "times new roman" ? " selected=\'selected\'" : "") + ' value="times new roman" style="font-family:times new roman">times new roman</option>\
                                                            <option' + (_selItem.FontFamily == "Stencil Std" ? " selected=\'selected\'" : "") + ' value="Stencil Std" style="font-family:Stencil Std">Stencil Std</option>\
                                                            <option' + (_selItem.FontFamily == "LCD" ? " selected=\'selected\'" : "") + ' value="LCD" style="font-family:LCD">LCD</option>\
<option' + (_selItem.FontFamily == "Pixel LCD7" ? " selected=\'selected\'" : "") + ' value="Pixel LCD7" style="font-family:Pixel LCD7">Pixel LCD7</option>\
<option' + (_selItem.FontFamily == "LED BOARD" ? " selected=\'selected\'" : "") + ' value="LED BOARD" style="font-family:LED BOARD">LED BOARD</option>\
<option' + (_selItem.FontFamily == "NI7SEG" ? " selected=\'selected\'" : "") + ' value="NI7SEG" style="font-family:NI7SEG">NI7SEG</option>\
<option' + (_selItem.FontFamily == "Transponder AOE" ? " selected=\'selected\'" : "") + ' value="Transponder AOE" style="font-family:Transponder AOE">Transponder AOE</option>\
                                                        </select>\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + ((type == 5 || type == 6 || type == 7 || type == 8 || type == 9 || type == 10 || type == 11 || type == 12) ? " hide" : "") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">样式</span>\
                                                        <select name="FontStyle" onchange="tag.DrawImage()" class="form-control">\
                                                            <option value="">正常</option>\
                                                            <option' + (_selItem.FontStyle == "bolder" ? " selected=\'selected\'" : "") + ' value="bolder" style="font-weight:bold">加粗</option>\
                                                            <option' + (_selItem.FontStyle == "italic" ? " selected=\'selected\'" : "") + ' value="italic" style="font-style:italic">斜体</option>\
                                                        </select>\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + ((type == 5 || type == 6 || type == 7 || type == 8 || type == 9 || type == 10 || type == 11 || type == 12) ? " hide" : "") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">字号</span>\
                                                        <input name="FontSize" value="' + _selItem.FontSize + '" onblur="tag.DrawImage()" class="form-control" style="width:60px; text-align:center;">\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + ((type == 5 || type == 6 || type == 7 || type == 8 || type == 9 || type == 10 || type == 11 || type == 12) ? "" : " hide") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">' + (type == 10 ? "直径" : "宽度") + '</span>\
                                                        <input name="Width" value="' + _selItem.Width + '" onblur="tag.DrawImage()" class="form-control" style="width:60px; text-align:center;">\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + ((type == 5 || type == 6 || type == 7 || type == 8 || type == 9 || type == 11 || type == 12) ? "" : " hide") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">高度</span>\
                                                        <input name="Height" value="' + _selItem.Height + '" onblur="tag.DrawImage()" class="form-control" style="width:60px; text-align:center;">\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + (type == 9 ? "" : " hide") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">圆角</span>\
                                                        <input name="CornerRadiu" value="' + _selItem.CornerRadiu + '" onblur="tag.DrawImage()" class="form-control" style="width:60px; text-align:center;">\
                                                    </div>\
                                                </div>\
<div class="tag_tools_item' + ((type == 9 || type == 10) ? "" : " hide") + '">\
                                                    <select onchange="tag.changeDrawType(this)" name="DrawType" class="form-control">\
        <option' + (_selItem.DrawType == 0 ? " selected=\'selected\'" : "") + ' value="0">填充</option>\
        <option' + (_selItem.DrawType == 1 ? " selected=\'selected\'" : "") + ' value="1">边框</option>\
    </select>\
                                                </div>\
<div class="tag_tools_item' + ((_selItem.DrawType == 1 && (_selItem.ItemType == 9 || _selItem.ItemType == 10)) ? "" : " hide") + '">\
                                                    <div class="input-group">\
                                                        <span class="input-group-addon input-group-addon2">边框</span>\
                                                        <input name="BorderSize" value="' + _selItem.BorderSize + '" onblur="tag.DrawImage()" class="form-control" style="width:60px; text-align:center;">\
                                                    </div>\
                                                </div>\
        <div class="tag_tools_item' + (type == 5 ? "" : " hide") + '"><div class="input-group">\
                                                        <button type="button" onclick="tag.SelectImage(this)" class="btn btn-success"><span class="fa fa-image"></span> 重新选择图片</button>\
                                                </div></div>\
        <div class="tag_tools_item' + (_selItem.ItemType == 0 ? " hide" : "") + '"><div class="input-group">\
                                                    <button type="button" onclick="tag.RemoveItem(this)" class="btn btn-danger"><span class="fa fa-remove"></span></button>\
                                                </div></div>\
                                    </div>');

        $(tablist + " li").eq(0).find("a").click();

        if (_selItem.ItemType == 5 && _row == -1) {
            t_row = _selItem.ItemIndex;
            $(uploadId).find("input").click();
        }

        if (_row == -1) {
            tag.DrawImage();
        }
    };

    tag.changeDrawType = function (c) {
        if ($(c).val() == 0) {
            $(c).parent().next().hide();
            $(c).parent().next().find("input[name='BorderSize']").val(0);
        } else {
            $(c).parent().next().show();

            if (parseInt($(c).parent().next().find("input[name='BorderSize']").val()) <= 0) {
                $(c).parent().next().find("input[name='BorderSize']").val(1);
            }
        }
        tag.DrawImage();
    };

    tag.template = function (pa) {
        new tagTemplate(pa);
    };

}(tag);