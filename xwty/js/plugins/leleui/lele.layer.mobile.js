//layer 扩展
+function (lele) {
    "use strict";

    lele.layer_alert = function (content, btn, shade) {
        var shade;

        if (typeof (shade) != "undefined") shade = shade;
        else shade = true;

        layer.open({
            shade: shade,
            content: content,
            btn: btn || '确认'
        });
    };

    lele.layer_msg = function (content, time, call, skin) {
        layer.open({
            content: content,
            skin: skin || 'msg',
            time: time || 2,
            end: function () {
                if (call) call();
            }
        });
    };

    lele.layer_confirm = function (content, ensuredCallback, cancelCallback, ensuredText, cancelText, skin, shade) {
        var shade;

        if (typeof (shade) != "undefined") shade = shade;
        else shade = true;

        layer.open({
            shade: shade,
            shadeClose: false,
            content: content,
            btn: [ensuredText || '确定', cancelText || '取消'],
            skin:skin || '',
            yes: function (index) {
                if (ensuredCallback) ensuredCallback();
                layer.close(index);
            },
            no: function (index) {
                if (cancelCallback) cancelCallback();
                layer.close(index);
            }
        });
    };

    lele.layer_loading = function (content, shadeClose) {
        var data = {
            shadeClose: shadeClose || false,
            type: 2
        };

        if (typeof (content) != "undefined") {
            data = {
                shadeClose: shadeClose || false,
                type: 2,
                content: content
            };
        }

        layer.open(data);
    };

    lele.layer_win = function (pa) {
        var title = pa.title;
        var content = "";
        var iframe = false;
        var anim = "up";
        var style = "position:fixed; bottom:0; left:0; width: 100%; height: 100%; padding:0; margin:0; border:none;";
        var showtitle = true;
        var shade;

        if (typeof (pa.content) != "undefined") content = pa.content;
        if (typeof (pa.anim) != "undefined") anim = pa.anim;
        if (typeof (pa.style) != "undefined") style = pa.style;
        if (typeof (pa.showtitle) != "undefined") showtitle = pa.showtitle;
        if (typeof (pa.iframe) != "undefined") iframe = pa.iframe;

        if (typeof (pa.shade) != "undefined") shade = pa.shade;
        else shade = true;

        var content_html = '<div class="layui-layer-extend-title">' + title + '<a onclick="layer.closeAll()" href="javascript:;">关闭</a></div>';

        if (!showtitle) content_html = '';

        if (iframe) {
            content_html += '<iframe width="100%" height="100%" style="width:100%;height:100%;" scrolling="auto" allowtransparency="true" onload="this.className=\'layui-layer-extend-iframe\';" class="layui-layer-extend-load" frameborder="0" src="' + content + '"></iframe>';
        } else {
            content_html += content;
        }

        layer.open({
            shade: shade,
            type: 1,
            content: content_html,
            anim: anim,
            className: 'layui-m-extend-layercont',
            style: style
        });
    };

}(lele);