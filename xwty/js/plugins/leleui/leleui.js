; (function (global, $) {
    "use strict";

    var lele = function () {
    };

    lele.prototype = {
    };

    //四则运算化成整数计算方法
    var floatCalc = function (a, b) {
        a = a + '', b = b + '';
        var aNum = a.indexOf('.'),
            bNum = b.indexOf('.'),
            aSum,
            bSum,
            resultNum,
            inta,
            intb;

        aSum = aNum < 0 ? 0 : a.split('.')[1].length;
        bSum = bNum < 0 ? 0 : b.split('.')[1].length;

        resultNum = aSum > bSum ? aSum : bSum;

        inta = aNum < 0 ? Number(a + (Math.pow(10, resultNum) + '').replace('1', '')) : (function () {
            a = a.replace('.', '');
            a = resultNum == aSum ? a : a + (Math.pow(10, resultNum - aSum) + '').replace('1', '');
            return Number(a);
        }())

        intb = bNum < 0 ? Number(b + (Math.pow(10, resultNum) + '').replace('1', '')) : (function () {
            b = b.replace('.', '');
            b = resultNum == bSum ? b : b + (Math.pow(10, resultNum - bSum) + '').replace('1', '');
            return Number(b);
        }())

        return {
            a: inta,
            b: intb,
            num: resultNum
        };
    };

    //加法
    Number.prototype.add = function (n) {
        var o = floatCalc(this, n);
        return (o.a + o.b) / Math.pow(10, o.num);
    };

    //减法
    Number.prototype.minus = function (n) {
        var o = floatCalc(this, n);
        return (o.a - o.b) / Math.pow(10, o.num);
    };

    //乘法
    Number.prototype.subtract = function (n) {
        var o = floatCalc(this, n);
        return (o.a * o.b) / Math.pow(10, o.num * 2);
    };

    //除法
    Number.prototype.divide = function (n) {
        var o = floatCalc(this, n); return (o.a / o.b);
    };

    //获得对象的key
    lele.getObjKeys = function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
                keys[keys.length] = key;
        return keys;
    };

    //读取地址栏参数
    lele.request = function (name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    //判断是否是数字类型，如果是返回true, 否则返回false
    lele.isnumber = function (o) {
        return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
    }

    //替换字符串中包含的全部匹配字串
    lele.replace = function (source, str, to) {
        var index = source.indexOf(str);
        while (index != -1) {
            source = source.replace(str, to);
            index = source.indexOf(str);
        }
        return source;
    }

    //是否手机号
    lele.ismobile = function (mobile) {
        return /^1(3|4|5|7|8)\d{9}$/.test(mobile);
    }

    //是否email
    lele.isemail = function (email) {
        return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(email);
    }

    //jquery.ajax get return json
    lele.get = function (url, async, before, success, error) {
        $.ajax({
            url: url,
            async: async,
            type: "GET",
            dataType: 'json',
            cache: false,
            beforeSend: before,
            success: success,
            error: error
        });
    }

    //jquery.ajax post return json
    lele.post = function (url, async, data, before, success, error) {
        $.ajax({
            url: url,
            async: async,
            type: 'POST',
            data: data,
            dataType: 'json',
            cache: false,
            beforeSend: before,
            success: success,
            error: error
        });
    }

    //ajax 提交表单
    lele.submitform = function (action, data, success, error, submitButton) {
        submitButton.prop("disabled", true);

        lele.post(action, true, data, function () {
            //before
        }, function(result){
            success = eval(success);
            success(result);

            submitButton.prop("disabled", false);
        }, function(){
            if (error != "") {
                error = eval(error);
                error(result);
            } else {
                lele.toast("系统错误!", "text");
            }

            submitButton.prop("disabled", false);
        });
    }

    //ajax自动绑定表单&提交
    lele.autoform = function () {
        $("form").each(function () {
            if ($(this).attr("ajax-lele") == "true") {
                $(this).attr("method", "post");
                var success = $(this).attr("ajax-lele-success");
                if (success == undefined || success == "") {
                    success = "formsuccess";
                    $(this).attr("ajax-lele-success", "formsuccess");
                }

                var error = $(this).attr("ajax-lele-error");
                if (error == undefined) error = "";

                var submitButton = $(this).find(":submit");

                $(this).submit(function () {
                    if (!$(this).valid()) {
                        return false;
                    }

                    var before = $(this).attr("ajax-lele-before");

                    if (before == undefined) before = "";

                    if (before != "") {
                        before = eval(before);
                        if (!before()) return false;
                    }

                    var data = $(this).serialize();
                    var action = this.action;

                    lele.submitform(action, data, success, error, submitButton);
                    return false;
                });
            }
        });
    }

    var smsverificationDefault = { ispost: false, times: 60, interval: null };

    //短信验证码
    lele.smsverification = function (c,mode) {
        if (!smsverificationDefault.ispost) {
            var form = $(c).parents('form');
            var mobile = form.find("input[name='Mobile']").val();
            if (mobile == "") {
                lele.toast("请填写手机号!", "forbidden");
                form.find("input[name='Mobile']").focus();
                return;
            }

            if (!lele.ismobile(mobile)) {
                lele.toast("手机号码错误!", "forbidden");
                return;
            }

            smsverificationDefault.ispost = true;

            lele.post("/Cms/SendSMS", true, { Mobile: mobile, Title: "验证码", Mode: mode }, function () {
            }, function (result) {
                if (result.errorCode == 0) {
                    smsverificationDefault.interval = setInterval(function () {
                        if (smsverificationDefault.times <= 0) {
                            clearInterval(smsverificationDefault.interval);
                            smsverificationDefault.times = 60;
                            smsverificationDefault.ispost = false;

                            $(c).html('获取验证码');
                        } else {
                            $(c).html('<span style="color:#999">重新获取' + smsverificationDefault.times + 's</span>');
                            smsverificationDefault.times--;
                        }
                    }, 1000);

                    lele.toast("验证码发送成功!", "text");
                } else {
                    smsverificationDefault.times = 60;
                    smsverificationDefault.ispost = false;

                    $(c).html('获取验证码');

                    lele.toast("验证码发送失败!", "cancel");
                }
            }, function (result) {
                smsverificationDefault.times = 60;
                smsverificationDefault.ispost = false;

                $(c).html('获取验证码');

                lele.toast("验证码发送失败!", "cancel");
            });
        }
    }

    //微信支付接口
    lele.wechatpay = function (appId, timeStamp, nonceStr, _package, signType, paySign, callback) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId": appId, //公众号名称，由商户传入
            "timeStamp": timeStamp, //时间戳
            "nonceStr": nonceStr, //随机串.........
            "package": _package, //扩展包
            "signType": signType, //微信签名方式:MD5
            "paySign": paySign //微信签名
        }, function (res) {
            callback(res.err_msg);
        });
    }

    //主导航
    lele.navi = function () {
        var shade = $(".qk-navi-main-shade");

        if (shade.length === 0) {
            $("body").append('<div class="qk-shade qk-navi-main-shade"></div>');
            $(".qk-navi-main").slideDown();
            $(".qk-navi-main-shade").click(function () { lele.navi(); });
        } else {
            $(".qk-navi-main").slideUp(function () { shade.remove(); });
        }
    };

    global.lele = lele;

})(this, jQuery);

//注册autoform
$(document).ready(function () {
    lele.autoform();
});

+ function (lele) {

    ////隐藏页面加载前 loading 图标
    lele.hidePageLoading = function () {
        if ($("#loading").length > 0) {
            $("#loading").hide();
        }
    }

    /*leleui.alert leleui.confirm leleui.toast 借用weui*/
    //弹出对话框
    lele.alert = function (title, content) {
        var myConfirmCode = '<div class="leleui-mask leleui-mask--visible"></div>\
    <div class="leleui-dialog leleui-dialog--visible">\
        <div class="leleui-dialog__hd"><strong class="leleui-dialog__title">' + ((content && content != '')?title:'') + '</strong></div>\
        <div class="leleui-dialog__bd">' + (content || title) + '</div>\
        <div class="leleui-dialog__ft"><a class="leleui-dialog__btn primary" href="javascript:;">确定</a></div>\
    </div>';

        $("body").append(myConfirmCode);

        $(".leleui-dialog .leleui-dialog__ft a").unbind("click", "");

        $(".leleui-dialog .leleui-dialog__ft a").click(function (event) {
            $(".leleui-mask").remove();
            $(".leleui-dialog").remove();
        });
    }

    //确认对话框
    lele.confirm = function (title, content, ensuredCallback, cancelCallback) {
        var myConfirmCode = '<div class="leleui-mask leleui-mask--visible"></div>\
    <div class="leleui-dialog leleui-dialog--visible">\
        <div class="leleui-dialog__hd"><strong class="leleui-dialog__title">'+ title + '</strong></div>\
        <div class="leleui-dialog__bd">' + content + '</div>\
        <div class="leleui-dialog__ft"><a name="cancel" class="leleui-dialog__btn default" href="javascript:;">取消</a><a name="ok" class="leleui-dialog__btn primary" href="javascript:;">确定</a></div>\
    </div>';

        if ($(".leleui-mask").length>0)
            $(".leleui-mask").remove();

        if ($(".leleui-mask").length > 0)
            $(".leleui-dialog").remove();

        $("body").append(myConfirmCode);

        $(".leleui-dialog .leleui-dialog__ft").find("a[name='cancel']").unbind("click", "");
        $(".leleui-dialog .leleui-dialog__ft").find("a[name='ok']").unbind("click", "");

        $(".leleui-dialog .leleui-dialog__ft").find("a[name='cancel']").click(function () {
            if (cancelCallback) {
                cancelCallback();
            }
            $(".leleui-mask").remove();
            $(".leleui-dialog").remove();
        });
        $(".leleui-dialog .leleui-dialog__ft").find("a[name='ok']").click(function () {
            if (ensuredCallback) {
                ensuredCallback();
            }
            $(".leleui-mask").remove();
            $(".leleui-dialog").remove();
        });
    }

    //写入提示框html
    lele.toastshow = function (html, className) {
        className = className || "";
        var mask = $("<div class='leleui-mask_transparent'></div>").appendTo(document.body);

        var tpl = '<div class="leleui-toast ' + className + '">' + html + '</div>';
        var dialog = $(tpl).appendTo(document.body);

        dialog.addClass("leleui-toast--visible");
        dialog.show();
    }

    //隐藏提示
    lele.toasthide = function (callback) {
        $(".leleui-mask_transparent").remove();
        var done = false;
        var $el = $(".leleui-toast--visible").removeClass("leleui-toast--visible").transitionEnd(function () {
            var $this = $(this);
            $this.remove();
            callback && callback();
            done = true
        });

        setTimeout(function () {
            if (!done) {
                $el.remove()
                callback && callback();
            }
        }, 1000)
    }

    ////提示框
    lele.toast = function (text, style, duration, callback) {
        var className, iconClassName = 'leleui-icon-success-no-circle';
        duration = duration || 1000;

        if (style == "cancel") {
            className = "leleui-toast_cancel";
            iconClassName = 'leleui-icon-cancel'
        } else if (style == "forbidden") {
            className = "leleui-toast--forbidden";
            iconClassName = 'leleui-icon-warn'
        } else if (style == "text") {
            className = "leleui-toast--text";
        }

        lele.toastshow('<i class="' + iconClassName + ' leleui-icon_toast"></i><p class="leleui-toast_content">' + (text || "已经完成") + '</p>', className);

        setTimeout(function () {
            lele.toasthide(callback);
        }, duration);
    }

    ////show loading
    lele.showLoading = function (text) {
        var html = '<div class="leleui_loading">';
        html += '<i class="leleui-loading leleui-icon_toast"></i>';
        html += '</div>';
        if (text && text != "")
            html += '<p class="leleui-toast_content">' + text + '</p>';
        else
            html += '<p class="leleui-toast_content hidden">' + text + '</p>';

        lele.toastshow(html, 'leleui_loading_toast');
    }

    ////hide loading
    lele.hideLoading = function () {
        lele.toasthide();
    }

    //选择窗口 obj：对应的选择窗口id
    lele.openwindow = function (obj, callback, hideButton) {
        if (typeof (hideButton) != "undefined" && hideButton) {
            hideButton = true;
        } else {
            hideButton = false;
        }

        if ($(obj).length > 0) {
            if ($(obj).find(".qk-shade").length > 0) {
                $(obj).find(".qk-shade").remove();
            }

            $(obj).append('<div class="qk-shade"></div>');
            $(obj).find(".qk-shade").unbind("click", "");
            $(obj).find(".qk-shade").click(function () {
                $(obj).find(".qk-selectbox-content").slideUp(function () { $(obj).hide(); });
                if (callback) callback(false);
            });

            if (!hideButton) {
                if ($(obj).find(".qk-selectbox-control").length > 0) {
                    $(obj).find(".qk-selectbox-control").remove();
                }

                $(obj).find(".qk-selectbox-content").append(' <div class="qk-selectbox-control"><button name="qk-close" class="bg-yellow">取消</button><button name="qk-ok" class="bg-default">确认</button></div>');

                $(obj).find(".qk-selectbox-content").find("button[name='qk-ok']").unbind("click", "");
                $(obj).find(".qk-selectbox-content").find("button[name='qk-ok']").click(function () {
                    $(obj).find(".qk-selectbox-content").slideUp(function () { $(obj).hide(); });
                    if (callback) callback(true);
                });

                $(obj).find(".qk-selectbox-content").find("button[name='qk-close']").unbind("click", "");
                $(obj).find(".qk-selectbox-content").find("button[name='qk-close']").click(function () {
                    $(obj).find(".qk-selectbox-content").slideUp(function () { $(obj).hide(); });
                    if (callback) callback(false);
                });
            }

            $(obj).fadeIn(function () {
                $(obj).find(".qk-selectbox-content").slideDown();
            });
        }
    }

    //侧边筛选栏
    lele.rightside = function (obj, width) {
        var side = $(".qk-rightside");

        if (typeof (obj) != "undefined") side = $(obj);

        if (typeof (width) != "undefined") width = width;
        else width = "70%";

        if (side.css("right") === "0px") {
            side.animate({ right: "-" + width }, function () { $(".qk-shade-rightside").remove(); });
        } else {
            $("body").append('<div class="qk-shade qk-shade-rightside" style="z-index: 9999998;"></div>');
            side.animate({ right: "0" });
            $(".qk-shade-rightside").click(function () { lele.rightside(obj, width); });
        }
    };

    //由下向上滑动
    lele.slideup = function (obj, height) {
        var side = $(obj);

        if (typeof (height) != "undefined") height = height;
        else height = "50%";

        if (side.css("bottom") === "0px") {
            side.stop(true, true).animate({ bottom: "-" + height }, function () { $(".qk-shade-sideup").remove(); });
        } else {
            $("body").append('<div class="qk-shade qk-shade-sideup" style="z-index: 9999998;"></div>');
            side.stop(true, true).animate({ bottom: "0" });

            $(".qk-shade-sideup").unbind("click", "");
            $(".qk-shade-sideup").click(function () { lele.slideup(obj, height); });
        }
    };

    //加减数字输入
    lele.addsubinput = function (obj, callback) {
        var objId = $(obj).attr("id");
        if (objId && objId != "") objId = "#" + objId;
        else objId = "." + $(obj).attr("class");

        $(obj).each(function () {

            var c = this;

            $(this).find("input").keyup(function () {
                var tmptxt = $(this).val().replace(/\D|^0/g, '');
                $(this).val(tmptxt == '' ? 1 : tmptxt);
                if (callback) callback($(this).val(), c);
            }).bind("paste", function () {
                var tmptxt = $(this).val().replace(/\D|^0/g, '');
                $(this).val(tmptxt == '' ? 1 : tmptxt);
                if (callback) callback($(this).val(), c);
            });

            $(this).find("button").eq(0).click(function () {
                var num = $(this).parents(obj).find("input").val() || 0;
                if (num <= 1) num = 1;
                else num--;

                $(this).parents(obj).find("input").val(num);
                if (callback) callback(num, c);
            });
            $(this).find("button").eq(1).click(function () {
                var num = $(this).parents(obj).find("input").val() || 0;
                num++;
                $(this).parents(obj).find("input").val(num);
                if (callback) callback(num, c);
            });

        });
    }

}(lele);

//商品规格选择
+function (lele) {
    "use strict";

    var skuparam = { container: "", has: false, keys: [], data: {}, callback: null, SKUResult: {}, SKUSelectedIds: [] };

    var shopSku = function (pa) {
        skuparam.container = pa.container;
        skuparam.has = pa.has;
        skuparam.keys = pa.keys;
        skuparam.data = pa.data;

        if (pa.callback) skuparam.callback = pa.callback;

        loadtshopsku();

        $(skuparam.container).find(".sku_item div.sku[data-firstattr='true']").click();
    }

    var initshopsku = function () {

        var i, j, skuKeys = lele.getObjKeys(skuparam.data);

        for (i = 0; i < skuKeys.length; i++) {
            var skuKey = skuKeys[i];//一条SKU信息key
            var sku = skuparam.data[skuKey];	//一条SKU信息value
            var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
            skuKeyAttrs.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2);
            });

            //对每个SKU信息key属性值进行拆分组合
            var combArr = combInArray(skuKeyAttrs);
            for (j = 0; j < combArr.length; j++) {
                add2SKUResult(combArr[j], sku);
            }

            //结果集接放入SKUResult
            skuparam.SKUResult[skuKeyAttrs.join(";")] = {
                count: sku.count,
                prices: [sku.price]
            }
        }
    };

    //把组合的key放入结果集SKUResult
    var add2SKUResult = function (combArrItem, sku) {
        var key = combArrItem.join(";");
        if (skuparam.SKUResult[key]) { //SKU信息key属性·
            skuparam.SKUResult[key].count += sku.count;
            skuparam.SKUResult[key].prices.push(sku.price);
        } else {
            skuparam.SKUResult[key] = {
                count: sku.count,
                prices: [sku.price]
            };
        }
    };

    /**
     * 从数组中生成指定长度的组合
     * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
     */
    var combInArray = function (aData) {
        if (!aData || !aData.length) {
            return [];
        }

        var len = aData.length;
        var aResult = [];

        for (var n = 1; n < len; n++) {
            var aaFlags = getCombFlags(len, n);
            while (aaFlags.length) {
                var aFlag = aaFlags.shift();
                var aComb = [];
                for (var i = 0; i < len; i++) {
                    aFlag[i] && aComb.push(aData[i]);
                }
                aResult.push(aComb);
            }
        }

        return aResult;
    };

    /**
     * 得到从 m 元素中取 n 元素的所有组合
     * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
     */
    var getCombFlags = function (m, n) {
        if (!n || n < 1) {
            return [];
        }

        var aResult = [];
        var aFlag = [];
        var bNext = true;
        var i, j, iCnt1;

        for (i = 0; i < m; i++) {
            aFlag[i] = i < n ? 1 : 0;
        }

        aResult.push(aFlag.concat());

        while (bNext) {
            iCnt1 = 0;
            for (i = 0; i < m - 1; i++) {
                if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
                    for (j = 0; j < i; j++) {
                        aFlag[j] = j < iCnt1 ? 1 : 0;
                    }
                    aFlag[i] = 0;
                    aFlag[i + 1] = 1;
                    var aTmp = aFlag.concat();
                    aResult.push(aTmp);
                    if (aTmp.slice(-n).join("").indexOf('0') == -1) {
                        bNext = false;
                    }
                    break;
                }
                aFlag[i] == 1 && iCnt1++;
            }
        }
        return aResult;
    };

    var getSelectedSKUValue = function () {
        var result = [];
        if (skuparam.has) {
            var sid = skuparam.SKUSelectedIds.join(";");
            //alert(sid);
            var d = skuparam.data[sid];
            if (d) {
                if (d.hasmemberprice == 1)
                    result = [sid, d.price, d.count, 1, d.memberprice];
                else
                    result = [sid, d.price, d.count, 0];
            }
        } else {
            var d = skuparam.data["0"];
            if (d.hasmemberprice == 1)
                result = ["0", d.price, d.count, 1, d.memberprice];
            else
                result = ["0", d.price, d.count, 0];
        }
        return result;
    };

    var loadtshopsku = function () {

        initshopsku();

        $(skuparam.container).find(".sku").each(function () {
            var self = $(this);
            var attr_id = self.attr('attr_id');
            if (!skuparam.SKUResult[attr_id]) {
                self.addClass('sku_disabled');
            }
        }).click(function () {
            var self = $(this);

            if (self.attr("class").indexOf("sku_disabled") != -1) {
                return false;
            }

            //选中自己，兄弟节点取消选中
            self.toggleClass('sku-selected').siblings().removeClass('sku-selected');

            if (self.attr("class").indexOf("sku-selected") == -1) {
                self.find(".yxj").remove();
            } else {
                self.append('<div class="yxj"></div>');
            }

            //已经选择的节点
            var selectedObjs = $(skuparam.container).find('.sku-selected');

            if (selectedObjs.length) {
                //获得组合key价格
                var _selectedIds = [];
                selectedObjs.each(function () {
                    _selectedIds.push($(this).attr('attr_id'));
                });
                _selectedIds.sort(function (value1, value2) {
                    return parseInt(value1) - parseInt(value2);
                });
                skuparam.SKUSelectedIds = _selectedIds;
                var len = _selectedIds.length;
                var prices = skuparam.SKUResult[_selectedIds.join(';')].prices;
                var maxPrice = Math.max.apply(Math, prices);
                var minPrice = Math.min.apply(Math, prices);

                //alert(prices);

                if (skuparam.callback) skuparam.callback(minPrice, maxPrice, getSelectedSKUValue());

                //用已选中的节点验证待测试节点 underTestObjs
                $(skuparam.container).find(".sku").not(selectedObjs).not(self).each(function () {
                    var siblingsSelectedObj = $(this).siblings('.sku-selected');
                    var testAttrIds = []; //从选中节点中去掉选中的兄弟节点
                    if (siblingsSelectedObj.length) {
                        var siblingsSelectedObjId = siblingsSelectedObj.attr('attr_id');
                        for (var i = 0; i < len; i++) {
                            (_selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(_selectedIds[i]);
                        }
                    } else {
                        testAttrIds = _selectedIds.concat();
                    }
                    testAttrIds = testAttrIds.concat($(this).attr('attr_id'));
                    testAttrIds.sort(function (value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });
                    if (!skuparam.SKUResult[testAttrIds.join(';')]) {
                        $(this).addClass('sku_disabled').removeClass('sku-selected');
                    } else {
                        $(this).removeClass('sku_disabled');
                    }
                    if ($(this).attr("class").indexOf("sku-selected") == -1) {
                        $(this).find(".yxj").remove();
                    }
                });
            } else {
                //设置默认价格
                //$(priceObj).text('--');
                //设置属性状态
                $(skuparam.container).find('.sku').each(function () {
                    skuparam.SKUResult[$(this).attr('attr_id')] ? $(this).removeClass('sku_disabled') : $(this).addClass('sku_disabled').removeClass('sku-selected');
                });
                if (skuparam.callback) skuparam.callback(0, 0, []);
            }
        });
    }

    lele.shopsku = function (pa) {
        new shopSku(pa);
    }
}(lele);

//借用weui
(function ($) {
    "use strict";

    $.fn.transitionEnd = function (callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
          i, dom = this;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };

    $.support = (function () {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    $.getTouchPosition = function (e) {
        e = e.originalEvent || e; //jquery wrap the originevent
        if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
            return {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            };
        } else {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
    };

    $.fn.scrollHeight = function () {
        return this[0].scrollHeight;
    };

    $.fn.transform = function (transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    };

    $.fn.transition = function (duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };

    $.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
                //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
                //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };

    $.requestAnimationFrame = function (callback) {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else {
            return window.setTimeout(callback, 1000 / 60);
        }
    };

    $.cancelAnimationFrame = function (id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else {
            return window.clearTimeout(id);
        }
    };
})($);

/* ===============================================================================
************   Pull to refreh ************
=============================================================================== */
/* global $:true 借用weui*/
+function ($) {
    "use strict";

    var PTR = function (el, opt) {
        if (typeof opt === typeof function () { }) {
            opt = {
                onRefresh: opt
            }
        }
        if (typeof opt === typeof 'a') {
            opt = undefined
        }
        this.opt = $.extend(PTR.defaults, opt || {});
        this.container = $(el);
        this.attachEvents();
    }

    PTR.defaults = {
        distance: 50,
        onRefresh: undefined,
        onPull: undefined
    }

    PTR.prototype.touchStart = function (e) {
        if (this.container.hasClass("refreshing")) return;
        var p = $.getTouchPosition(e);
        this.start = p;
        this.diffX = this.diffY = 0;
    };

    PTR.prototype.touchMove = function (e) {
        if (this.container.hasClass("refreshing")) return;
        if (!this.start) return false;
        if (this.container.scrollTop() > 0) return;
        var p = $.getTouchPosition(e);
        this.diffX = p.x - this.start.x;
        this.diffY = p.y - this.start.y;
        if (Math.abs(this.diffX) > Math.abs(this.diffY)) return true; // 说明是左右方向的拖动
        if (this.diffY < 0) return;
        this.container.addClass("touching");
        e.preventDefault();
        e.stopPropagation();
        this.diffY = Math.pow(this.diffY, 0.75);
        this.container.css("transform", "translate3d(0, " + this.diffY + "px, 0)");
        this.triggerPull(this.diffY)
    };
    PTR.prototype.touchEnd = function () {
        this.start = false;
        if (this.diffY <= 0 || this.container.hasClass("refreshing")) return;
        this.container.removeClass("touching");
        this.container.removeClass("pull-down pull-up");
        this.container.css("transform", "");
        if (Math.abs(this.diffY) <= this.opt.distance) {
        } else {
            this.triggerPullToRefresh();
        }
    };

    PTR.prototype.triggerPullToRefresh = function () {
        this.triggerPull(this.opt.distance)
        this.container.removeClass('pull-up').addClass("refreshing");
        if (this.opt.onRefresh) {
            this.opt.onRefresh.call(this)
        }
        this.container.trigger("pull-to-refresh");
    }

    PTR.prototype.triggerPull = function (diffY) {

        if (diffY < this.opt.distance) {
            this.container.removeClass("pull-up").addClass("pull-down");
        } else {
            this.container.removeClass("pull-down").addClass("pull-up");
        }

        if (this.opt.onPull) {
            this.opt.onPull.call(this, Math.floor(diffY / this.opt.distance * 100))
        }
        this.container.trigger("pull");
    }

    PTR.prototype.pullToRefreshDone = function () {
        this.container.removeClass("refreshing");
    }

    PTR.prototype.attachEvents = function () {
        var el = this.container;
        el.addClass("leleui-pull-to-refresh");
        el.on($.touchEvents.start, $.proxy(this.touchStart, this));
        el.on($.touchEvents.move, $.proxy(this.touchMove, this));
        el.on($.touchEvents.end, $.proxy(this.touchEnd, this));
    };

    var pullToRefreshDone = function (el) {
        $(el).removeClass("refreshing");
    }

    $.fn.pullToRefresh = function (opt) {
        return this.each(function () {
            var $this = $(this)
            var ptr = $this.data('ptr')
            if (!ptr) $this.data('ptr', ptr = new PTR(this, opt))
            if (typeof opt === typeof 'a') {
                ptr[opt].call(ptr)
            }
        });
    }

    $.fn.pullToRefreshDone = function () {
        return this.each(function () {
            pullToRefreshDone(this);
        });
    }

}($);

/* global $:true 借用weui*/
+function ($) {
    "use strict";

    // fix https://github.com/lihongxun945/jquery-weui/issues/442
    // chrome will always return 0, when use document.body.scrollTop
    // https://stackoverflow.com/questions/43717316/google-chrome-document-body-scrolltop-always-returns-0
    var getOffset = function (container) {
        var tagName = container[0].tagName.toUpperCase()
        var scrollTop
        if (tagName === 'BODY' || tagName === 'HTML') {
            scrollTop = container.scrollTop() || $(window).scrollTop()
        } else {
            scrollTop = container.scrollTop()
        }
        var offset = container.scrollHeight() - ($(window).height() + scrollTop)
        console.log(offset)
        return offset
    }

    var Infinite = function (el, distance) {
        this.container = $(el);
        this.container.data("infinite", this);
        this.distance = distance || 50;
        this.attachEvents();
    }

    Infinite.prototype.scroll = function () {
        var container = this.container;
        this._check();
    }

    Infinite.prototype.attachEvents = function (off) {
        var el = this.container;
        var scrollContainer = (el[0].tagName.toUpperCase() === "BODY" ? $(document) : el);
        scrollContainer[off ? "off" : "on"]("scroll", $.proxy(this.scroll, this));
    };
    Infinite.prototype.detachEvents = function (off) {
        this.attachEvents(true);
    }
    Infinite.prototype._check = function () {
        var offset = getOffset(this.container);
        if (Math.abs(offset) <= this.distance) {
            this.container.trigger("infinite");
        }
    }

    var infinite = function (el) {
        attachEvents(el);
    }

    $.fn.infinite = function (distance) {
        return this.each(function () {
            new Infinite(this, distance);
        });
    }
    $.fn.destroyInfinite = function () {
        return this.each(function () {
            var infinite = $(this).data("infinite");
            if (infinite && infinite.detachEvents) infinite.detachEvents();
        });
    }
}($);

/*===========================
Device/OS Detection
===========================*/
/* global $:true */
; (function ($) {
    "use strict";
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
                            (ipod || iphone) &&
                            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }

    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    $.device = device;
})($);

/*======================================================
************   Picker   ************
======================================================*/
/* global $:true */
/* jshint unused:false */
/* jshint multistr:true */
+ function ($) {
    "use strict";
    var Picker = function (params) {
        var p = this;
        var defaults = {
            updateValuesOnMomentum: false,
            updateValuesOnTouchmove: true,
            rotateEffect: false,
            momentumRatio: 7,
            freeMode: false,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: '完成',
            title: '请选择',
            toolbarTemplate: '<div class="toolbar">\
          <div class="toolbar-inner">\
          <a href="javascript:;" class="picker-button close-picker">{{closeText}}</a>\
          <h1 class="title">{{title}}</h1>\
          </div>\
          </div>',
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.cols = [];
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // 3D Transforms origin bug, only on safari
        var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

        // Should be converted to popover
        function isPopover() {
            var toPopover = false;
            if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
            if (!p.inline && p.params.input) {
                if (p.params.onlyInPopover) toPopover = true;
                else {
                    if ($.device.ios) {
                        toPopover = $.device.ipad ? true : false;
                    }
                    else {
                        if ($(window).width() >= 768) toPopover = true;
                    }
                }
            }
            return toPopover;
        }
        function inPopover() {
            if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
            else return false;
        }

        // Value
        p.setValue = function (arrValues, transition) {
            var valueIndex = 0;
            for (var i = 0; i < p.cols.length; i++) {
                if (p.cols[i] && !p.cols[i].divider) {
                    p.cols[i].setValue(arrValues[valueIndex], transition);
                    valueIndex++;
                }
            }
        };
        p.updateValue = function () {
            var newValue = [];
            var newDisplayValue = [];
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    newValue.push(p.cols[i].value);
                    newDisplayValue.push(p.cols[i].displayValue);
                }
            }
            if (newValue.indexOf(undefined) >= 0) {
                return;
            }
            p.value = newValue;
            p.displayValue = newDisplayValue;
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.displayValue);
            }
            if (p.input && p.input.length > 0) {
                $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initPickerCol = function (colElement, updateItems) {
            var colContainer = $(colElement);
            var colIndex = colContainer.index();
            var col = p.cols[colIndex];
            if (col.divider) return;
            col.container = colContainer;
            col.wrapper = col.container.find('.picker-items-col-wrapper');
            col.items = col.wrapper.find('.picker-item');

            var i, j;
            var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
            col.replaceValues = function (values, displayValues) {
                col.destroyEvents();
                col.values = values;
                col.displayValues = displayValues;
                var newItemsHTML = p.columnHTML(col, true);
                col.wrapper.html(newItemsHTML);
                col.items = col.wrapper.find('.picker-item');
                col.calcSize();
                col.setValue(col.values[0] || '', 0, true);
                col.initEvents();
            };
            col.calcSize = function () {
                if (!col.values.length) return;
                if (p.params.rotateEffect) {
                    col.container.removeClass('picker-items-col-absolute');
                    if (!col.width) col.container.css({ width: '' });
                }
                var colWidth, colHeight;
                colWidth = 0;
                colHeight = col.container[0].offsetHeight;
                wrapperHeight = col.wrapper[0].offsetHeight;
                itemHeight = col.items[0].offsetHeight;
                itemsHeight = itemHeight * col.items.length;
                minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
                maxTranslate = colHeight / 2 - itemHeight / 2;
                if (col.width) {
                    colWidth = col.width;
                    if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                    col.container.css({ width: colWidth });
                }
                if (p.params.rotateEffect) {
                    if (!col.width) {
                        col.items.each(function () {
                            var item = $(this);
                            item.css({ width: 'auto' });
                            colWidth = Math.max(colWidth, item[0].offsetWidth);
                            item.css({ width: '' });
                        });
                        col.container.css({ width: (colWidth + 2) + 'px' });
                    }
                    col.container.addClass('picker-items-col-absolute');
                }
            };
            col.calcSize();

            col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


            var activeIndex = 0;
            var animationFrameId;

            // Set Value Function
            col.setValue = function (newValue, transition, valueCallbacks) {
                if (typeof transition === 'undefined') transition = '';
                var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
                if (typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                    col.value = col.displayValue = newValue;
                    return;
                }
                var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
                // Update wrapper
                col.wrapper.transition(transition);
                col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');

                // Watch items
                if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex) {
                    $.cancelAnimationFrame(animationFrameId);
                    col.wrapper.transitionEnd(function () {
                        $.cancelAnimationFrame(animationFrameId);
                    });
                    updateDuringScroll();
                }

                // Update items
                col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
            };

            col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
                if (typeof translate === 'undefined') {
                    translate = $.getTranslate(col.wrapper[0], 'y');
                }
                if (typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate) / itemHeight);
                if (activeIndex < 0) activeIndex = 0;
                if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
                var previousActiveIndex = col.activeIndex;
                col.activeIndex = activeIndex;
                /*
                col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');
  
                col.items.transition(transition);
                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
                var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
                var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
                */
                //去掉 .picker-after-selected, .picker-before-selected 以提高性能
                col.wrapper.find('.picker-selected').removeClass('picker-selected');
                if (p.params.rotateEffect) {
                    col.items.transition(transition);
                }
                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

                if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                    // Update values
                    col.value = selectedItem.attr('data-picker-value');
                    col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                    // On change callback
                    if (previousActiveIndex !== activeIndex) {
                        if (col.onChange) {
                            col.onChange(p, col.value, col.displayValue);
                        }
                        p.updateValue();
                    }
                }

                // Set 3D rotate effect
                if (!p.params.rotateEffect) {
                    return;
                }
                var percentage = (translate - (Math.floor((translate - maxTranslate) / itemHeight) * itemHeight + maxTranslate)) / itemHeight;

                col.items.each(function () {
                    var item = $(this);
                    var itemOffsetTop = item.index() * itemHeight;
                    var translateOffset = maxTranslate - translate;
                    var itemOffset = itemOffsetTop - translateOffset;
                    var percentage = itemOffset / itemHeight;

                    var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                    var angle = (-18 * percentage);
                    if (angle > 180) angle = 180;
                    if (angle < -180) angle = -180;
                    // Far class
                    if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                    else item.removeClass('picker-item-far');
                    // Set transform
                    item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                });
            };

            function updateDuringScroll() {
                animationFrameId = $.requestAnimationFrame(function () {
                    col.updateItems(undefined, undefined, 0);
                    updateDuringScroll();
                });
            }

            // Update items on init
            if (updateItems) col.updateItems(0, maxTranslate, 0);

            var allowItemClick = true;
            var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
            function handleTouchStart(e) {
                if (isMoved || isTouched) return;
                e.preventDefault();
                isTouched = true;
                var position = $.getTouchPosition(e);
                touchStartY = touchCurrentY = position.y;
                touchStartTime = (new Date()).getTime();

                allowItemClick = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
            }
            function handleTouchMove(e) {
                if (!isTouched) return;
                e.preventDefault();
                allowItemClick = false;
                var position = $.getTouchPosition(e);
                touchCurrentY = position.y;
                if (!isMoved) {
                    // First move
                    $.cancelAnimationFrame(animationFrameId);
                    isMoved = true;
                    startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                    col.wrapper.transition(0);
                }
                e.preventDefault();

                var diff = touchCurrentY - touchStartY;
                currentTranslate = startTranslate + diff;
                returnTo = undefined;

                // Normalize translate
                if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                    returnTo = 'min';
                }
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                    returnTo = 'max';
                }
                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

                // Update items
                col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

                // Calc velocity
                velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
                velocityTime = (new Date()).getTime();
                prevTranslate = currentTranslate;
            }
            function handleTouchEnd(e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;
                col.wrapper.transition('');
                if (returnTo) {
                    if (returnTo === 'min') {
                        col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                    }
                    else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
                }
                touchEndTime = new Date().getTime();
                var velocity, newTranslate;
                if (touchEndTime - touchStartTime > 300) {
                    newTranslate = currentTranslate;
                }
                else {
                    velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                    newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
                }

                newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

                // Active Index
                var activeIndex = -Math.floor((newTranslate - maxTranslate) / itemHeight);

                // Normalize translate
                if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate, 10)) + 'px,0)');

                // Update items
                col.updateItems(activeIndex, newTranslate, '', true);

                // Watch items
                if (p.params.updateValuesOnMomentum) {
                    updateDuringScroll();
                    col.wrapper.transitionEnd(function () {
                        $.cancelAnimationFrame(animationFrameId);
                    });
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleClick(e) {
                if (!allowItemClick) return;
                $.cancelAnimationFrame(animationFrameId);
                /*jshint validthis:true */
                var value = $(this).attr('data-picker-value');
                col.setValue(value);
            }

            col.initEvents = function (detach) {
                var method = detach ? 'off' : 'on';
                col.container[method]($.touchEvents.start, handleTouchStart);
                col.container[method]($.touchEvents.move, handleTouchMove);
                col.container[method]($.touchEvents.end, handleTouchEnd);
                col.items[method]('click', handleClick);
            };
            col.destroyEvents = function () {
                col.initEvents(true);
            };

            col.container[0].f7DestroyPickerCol = function () {
                col.destroyEvents();
            };

            col.initEvents();

        };
        p.destroyPickerCol = function (colContainer) {
            colContainer = $(colContainer);
            if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
        };
        // Resize cols
        function resizeCols() {
            if (!p.opened) return;
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    p.cols[i].calcSize();
                    p.cols[i].setValue(p.cols[i].value, 0, false);
                }
            }
        }
        $(window).on('resize', resizeCols);

        // HTML Layout
        p.columnHTML = function (col, onlyItems) {
            var columnItemsHTML = '';
            var columnHTML = '';
            if (col.divider) {
                columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
            }
            else {
                for (var j = 0; j < col.values.length; j++) {
                    columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
                }
                columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
            }
            return onlyItems ? columnItemsHTML : columnHTML;
        };
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;
            p.cols = [];
            var colsHTML = '';
            for (i = 0; i < p.params.cols.length; i++) {
                var col = p.params.cols[i];
                colsHTML += p.columnHTML(p.params.cols[i]);
                p.cols.push(col);
            }
            pickerClass = 'leleui-picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '') + (p.params.cols.length === 1 ? ' picker-columns-single' : '');
            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                    (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{title}}/g, p.params.title) : '') +
                    '<div class="picker-modal-inner picker-items">' +
                        colsHTML +
                        '<div class="picker-center-highlight"></div>' +
                    '</div>' +
                '</div>';

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput && !isPopover()) {
                var pageContent = p.input.parents('.content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;
                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({ 'padding-bottom': (newPaddingBottom) + 'px' });
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (inPopover()) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.leleui-picker-modal').length === 0) p.close();
            }
            else {
                if ($(e.target).parents('.leleui-picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
                if (p.params.inputReadOnly) {
                    p.input.on('focus mousedown', function (e) {
                        e.preventDefault();
                    });
                }
            }

        }

        if (!p.inline) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.page-content').css({ 'padding-bottom': '' });
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.container.find('.picker-items-col').each(function () {
                p.destroyPickerCol(this);
            });
        }

        p.opened = false;
        p.open = function () {
            var toPopover = isPopover();

            if (!p.opened) {

                // Layout
                p.layout();

                // Append
                if (toPopover) {
                    p.pickerHTML = '<div class="popover popover-picker-columns"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                    p.popover = $.popover(p.pickerHTML, p.params.input, true);
                    p.container = $(p.popover).find('.leleui-picker-modal');
                    $(p.popover).on('close', function () {
                        onPickerClose();
                    });
                }
                else if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                }
                else {
                    p.container = $($.openPicker(p.pickerHTML));
                    $(p.container)
                    .on('close', function () {
                        onPickerClose();
                    });
                }

                // Store picker instance
                p.container[0].f7Picker = p;

                // Init Events
                p.container.find('.picker-items-col').each(function () {
                    var updateItems = true;
                    if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
                    p.initPickerCol(this, updateItems);
                });

                // Set value
                if (!p.initialized) {
                    if (p.params.value) {
                        p.setValue(p.params.value, 0);
                    }
                }
                else {
                    if (p.value) p.setValue(p.value, 0);
                }
            }

            // Set flag
            p.opened = true;
            p.initialized = true;

            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function (force) {
            if (!p.opened || p.inline) return;
            if (inPopover()) {
                $.closePicker(p.popover);
                return;
            }
            else {
                $.closePicker(p.container);
                return;
            }
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click focus', openOnInput);
                $(p.input).data('picker', null);
            }
            $('html').off('click', closeOnHTMLClick);
            $(window).off('resize', resizeCols);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };

    $(document).on("click", ".close-picker", function () {
        var pickerToClose = $('.leleui-picker-modal.leleui-picker-modal-visible');
        if (pickerToClose.length > 0) {
            $.closePicker(pickerToClose);
        }
    });

    //修复picker会滚动页面的bug
    $(document).on($.touchEvents.move, ".picker-modal-inner", function (e) {
        e.preventDefault();
    });

    $.openPicker = function (tpl, className, callback) {

        if (typeof className === "function") {
            callback = className;
            className = undefined;
        }

        $.closePicker();

        var container = $("<div class='leleui-picker-container " + (className || "") + "'></div>").appendTo(document.body);
        container.show();

        container.addClass("leleui-picker-container-visible");

        //关于布局的问题，如果直接放在body上，则做动画的时候会撑开body高度而导致滚动条变化。
        var dialog = $(tpl).appendTo(container);

        dialog.width(); //通过取一次CSS值，强制浏览器不能把上下两行代码合并执行，因为合并之后会导致无法出现动画。

        dialog.addClass("leleui-picker-modal-visible");

        callback && container.on("close", callback);

        return dialog;
    }

    $.updatePicker = function (tpl) {
        var container = $(".leleui-picker-container-visible");
        if (!container[0]) return false;

        container.html("");

        var dialog = $(tpl).appendTo(container);

        dialog.addClass("leleui-picker-modal-visible");

        return dialog;
    }

    $.closePicker = function (container, callback) {
        if (typeof container === "function") callback = container;
        $(".leleui-picker-modal-visible").removeClass("leleui-picker-modal-visible").transitionEnd(function () {
            $(this).parent().remove();
            callback && callback();
        }).trigger("close");
    };

    $.fn.picker = function (params) {
        var args = arguments;
        return this.each(function () {
            if (!this) return;
            var $this = $(this);

            var picker = $this.data("picker");
            if (!picker) {
                params = $.extend({ input: this }, params || {}) // https://github.com/lihongxun945/jquery-weui/issues/432
                var inputValue = $this.val();
                if (params.value === undefined && inputValue !== "") {
                    params.value = (params.cols && params.cols.length > 1) ? inputValue.split(" ") : [inputValue];
                }
                var p = $.extend({ input: this }, params);
                picker = new Picker(p);
                $this.data("picker", picker);
            }
            if (typeof params === typeof "a") {
                picker[params].apply(picker, Array.prototype.slice.call(args, 1));
            }
        });
    };
}($);

/*======================================================
************   Calendar   ************
======================================================*/
/* global $:true */
/*jshint unused: false*/
+function ($) {
    "use strict";
    var rtl = false;
    var defaults;
    var isSameDate = function (a, b) {
        var a = new Date(a),
          b = new Date(b);
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    }
    var Calendar = function (params) {
        var p = this;
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // Is horizontal
        p.isH = p.params.direction === 'horizontal';

        // RTL inverter
        var inverter = p.isH ? (rtl ? -1 : 1) : 1;

        // Animating flag
        p.animating = false;

        // Should be converted to popover
        function isPopover() {
            var toPopover = false;
            if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
            if (!p.inline && p.params.input) {
                if (p.params.onlyInPopover) toPopover = true;
                else {
                    if ($.device.ios) {
                        toPopover = $.device.ipad ? true : false;
                    }
                    else {
                        if ($(window).width() >= 768) toPopover = true;
                    }
                }
            }
            return toPopover;
        }
        function inPopover() {
            if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
            else return false;
        }

        // Format date
        function formatDate(date) {
            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth();
            var month1 = month + 1;
            var day = date.getDate();
            var weekDay = date.getDay();
            return p.params.dateFormat
                .replace(/yyyy/g, year)
                .replace(/yy/g, (year + '').substring(2))
                .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
                .replace(/m/g, month1)
                .replace(/MM/g, p.params.monthNames[month])
                .replace(/M/g, p.params.monthNamesShort[month])
                .replace(/dd/g, day < 10 ? '0' + day : day)
                .replace(/d/g, day)
                .replace(/DD/g, p.params.dayNames[weekDay])
                .replace(/D/g, p.params.dayNamesShort[weekDay]);
        }


        // Value
        p.addValue = function (value) {
            if (p.params.multiple) {
                if (!p.value) p.value = [];
                var inValuesIndex;
                for (var i = 0; i < p.value.length; i++) {
                    if (isSameDate(value, p.value[i])) {
                        inValuesIndex = i;
                    }
                }
                if (typeof inValuesIndex === 'undefined') {
                    p.value.push(value);
                }
                else {
                    p.value.splice(inValuesIndex, 1);
                }
                p.updateValue();
            }
            else {
                p.value = [value];
                p.updateValue();
            }
        };
        p.setValue = function (arrValues) {
            var date = new Date(arrValues[0]);
            p.setYearMonth(date.getFullYear(), date.getMonth());
            p.addValue(+date);
        };
        p.updateValue = function () {
            p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
            var i, inputValue;
            for (i = 0; i < p.value.length; i++) {
                var valueDate = new Date(p.value[i]);
                p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
            }
            if (p.params.onChange) {
                p.params.onChange(p, p.value.map(formatDate), p.value.map(function (d) {
                    return +new Date(typeof d === typeof 'a' ? d.split(/\D/).filter(function (a) { return !!a; }).join("-") : d);
                }));
            }
            if (p.input && p.input.length > 0) {
                if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
                else {
                    inputValue = [];
                    for (i = 0; i < p.value.length; i++) {
                        inputValue.push(formatDate(p.value[i]));
                    }
                    inputValue = inputValue.join(', ');
                }
                $(p.input).val(inputValue);
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initCalendarEvents = function () {
            var col;
            var allowItemClick = true;
            var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
            function handleTouchStart(e) {
                if (isMoved || isTouched) return;
                // e.preventDefault();
                isTouched = true;
                var position = $.getTouchPosition(e);
                touchStartX = touchCurrentY = position.x;
                touchStartY = touchCurrentY = position.y;
                touchStartTime = (new Date()).getTime();
                percentage = 0;
                allowItemClick = true;
                isScrolling = undefined;
                startTranslate = currentTranslate = p.monthsTranslate;
            }
            function handleTouchMove(e) {
                if (!isTouched) return;
                var position = $.getTouchPosition(e);
                touchCurrentX = position.x;
                touchCurrentY = position.y;
                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
                }
                if (p.isH && isScrolling) {
                    isTouched = false;
                    return;
                }
                e.preventDefault();
                if (p.animating) {
                    isTouched = false;
                    return;
                }
                allowItemClick = false;
                if (!isMoved) {
                    // First move
                    isMoved = true;
                    wrapperWidth = p.wrapper[0].offsetWidth;
                    wrapperHeight = p.wrapper[0].offsetHeight;
                    p.wrapper.transition(0);
                }
                e.preventDefault();

                touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
                percentage = touchesDiff / (p.isH ? wrapperWidth : wrapperHeight);
                currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

                // Transform wrapper
                p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

            }
            function handleTouchEnd(e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;

                touchEndTime = new Date().getTime();
                if (touchEndTime - touchStartTime < 300) {
                    if (Math.abs(touchesDiff) < 10) {
                        p.resetMonth();
                    }
                    else if (touchesDiff >= 10) {
                        if (rtl) p.nextMonth();
                        else p.prevMonth();
                    }
                    else {
                        if (rtl) p.prevMonth();
                        else p.nextMonth();
                    }
                }
                else {
                    if (percentage <= -0.5) {
                        if (rtl) p.prevMonth();
                        else p.nextMonth();
                    }
                    else if (percentage >= 0.5) {
                        if (rtl) p.nextMonth();
                        else p.prevMonth();
                    }
                    else {
                        p.resetMonth();
                    }
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleDayClick(e) {
                if (!allowItemClick) return;
                var day = $(e.target).parents('.picker-calendar-day');
                if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
                    day = $(e.target);
                }
                if (day.length === 0) return;
                // if (day.hasClass('picker-calendar-day-selected') && !p.params.multiple) return;
                if (day.hasClass('picker-calendar-day-disabled')) return;
                if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
                if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
                var dateYear = day.attr('data-year');
                var dateMonth = day.attr('data-month');
                var dateDay = day.attr('data-day');
                if (p.params.onDayClick) {
                    p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
                }
                p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
                if (p.params.closeOnSelect && !p.params.multiple) p.close();
            }

            p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
            p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
            p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
            p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
            p.wrapper.on('click', handleDayClick);
            if (p.params.touchMove) {
                p.wrapper.on($.touchEvents.start, handleTouchStart);
                p.wrapper.on($.touchEvents.move, handleTouchMove);
                p.wrapper.on($.touchEvents.end, handleTouchEnd);
            }

            p.container[0].f7DestroyCalendarEvents = function () {
                p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
                p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
                p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
                p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
                p.wrapper.off('click', handleDayClick);
                if (p.params.touchMove) {
                    p.wrapper.off($.touchEvents.start, handleTouchStart);
                    p.wrapper.off($.touchEvents.move, handleTouchMove);
                    p.wrapper.off($.touchEvents.end, handleTouchEnd);
                }
            };


        };
        p.destroyCalendarEvents = function (colContainer) {
            if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
        };

        // Calendar Methods
        p.daysInMonth = function (date) {
            var d = new Date(date);
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        };
        p.monthHTML = function (date, offset) {
            date = new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            if (offset === 'next') {
                if (month === 11) date = new Date(year + 1, 0);
                else date = new Date(year, month + 1, 1);
            }
            if (offset === 'prev') {
                if (month === 0) date = new Date(year - 1, 11);
                else date = new Date(year, month - 1, 1);
            }
            if (offset === 'next' || offset === 'prev') {
                month = date.getMonth();
                year = date.getFullYear();
            }
            var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
                daysInMonth = p.daysInMonth(date),
                firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
            if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;

            var dayDate, currentValues = [], i, j,
                rows = 6, cols = 7,
                monthHTML = '',
                dayIndex = 0 + (p.params.firstDay - 1),
                today = new Date().setHours(0, 0, 0, 0),
                minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
                maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;

            if (p.value && p.value.length) {
                for (i = 0; i < p.value.length; i++) {
                    currentValues.push(new Date(p.value[i]).setHours(0, 0, 0, 0));
                }
            }

            for (i = 1; i <= rows; i++) {
                var rowHTML = '';
                var row = i;
                for (j = 1; j <= cols; j++) {
                    var col = j;
                    dayIndex++;
                    var dayNumber = dayIndex - firstDayOfMonthIndex;
                    var addClass = '';
                    if (dayNumber < 0) {
                        dayNumber = daysInPrevMonth + dayNumber + 1;
                        addClass += ' picker-calendar-day-prev';
                        dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                    }
                    else {
                        dayNumber = dayNumber + 1;
                        if (dayNumber > daysInMonth) {
                            dayNumber = dayNumber - daysInMonth;
                            addClass += ' picker-calendar-day-next';
                            dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                        }
                        else {
                            dayDate = new Date(year, month, dayNumber).getTime();
                        }
                    }
                    // Today
                    if (dayDate === today) addClass += ' picker-calendar-day-today';
                    // Selected
                    if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                    // Weekend
                    if (p.params.weekendDays.indexOf(col - 1) >= 0) {
                        addClass += ' picker-calendar-day-weekend';
                    }
                    // Disabled
                    if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
                        addClass += ' picker-calendar-day-disabled';
                    }

                    dayDate = new Date(dayDate);
                    var dayYear = dayDate.getFullYear();
                    var dayMonth = dayDate.getMonth();
                    rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + (addClass) + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>' + dayNumber + '</span></div>';
                }
                monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
            }
            monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
            return monthHTML;
        };
        p.animating = false;
        p.updateCurrentMonthYear = function (dir) {
            if (typeof dir === 'undefined') {
                p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);
            }
            else {
                p.currentMonth = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-year'), 10);
            }
            p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
            p.container.find('.current-year-value').text(p.currentYear);

        };
        p.onMonthChangeStart = function (dir) {
            p.updateCurrentMonthYear(dir);
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

            p.months.eq(currentIndex).addClass('picker-calendar-month-current');
            p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

            if (p.params.onMonthYearChangeStart) {
                p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
            }
        };
        p.onMonthChangeEnd = function (dir, rebuildBoth) {
            p.animating = false;
            var nextMonthHTML, prevMonthHTML, newMonthHTML;
            p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();

            if (typeof dir === 'undefined') {
                dir = 'next';
                rebuildBoth = true;
            }
            if (!rebuildBoth) {
                newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
            }
            else {
                p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
                prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
                nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
            }
            if (dir === 'next' || rebuildBoth) {
                p.wrapper.append(newMonthHTML || nextMonthHTML);
            }
            if (dir === 'prev' || rebuildBoth) {
                p.wrapper.prepend(newMonthHTML || prevMonthHTML);
            }
            p.months = p.wrapper.find('.picker-calendar-month');
            p.setMonthsTranslate(p.monthsTranslate);
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            if (p.params.onMonthYearChangeEnd) {
                p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
            }
        };
        p.setMonthsTranslate = function (translate) {
            translate = translate || p.monthsTranslate || 0;
            if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var prevMonthTranslate = -(translate + 1) * 100 * inverter;
            var currentMonthTranslate = -translate * 100 * inverter;
            var nextMonthTranslate = -(translate - 1) * 100 * inverter;
            p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
            p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
        };
        p.nextMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
            var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
            var nextDate = new Date(nextYear, nextMonth);
            var nextDateTime = nextDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.maxDate) {
                if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate--;
            if (nextMonth === p.currentMonth) {
                var nextMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
                p.wrapper.append(nextMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('next');
            var translate = (p.monthsTranslate * 100) * inverter;

            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('next');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('next');
            }
        };
        p.prevMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
            var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
            var prevDate = new Date(prevYear, prevMonth + 1, -1);
            var prevDateTime = prevDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.minDate) {
                if (prevDateTime < new Date(p.params.minDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate++;
            if (prevMonth === p.currentMonth) {
                var prevMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                p.wrapper.prepend(prevMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(0)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('prev');
            var translate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('prev');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('prev');
            }
        };
        p.resetMonth = function (transition) {
            if (typeof transition === 'undefined') transition = '';
            var translate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        };
        p.setYearMonth = function (year, month, transition) {
            if (typeof year === 'undefined') year = p.currentYear;
            if (typeof month === 'undefined') month = p.currentMonth;
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var targetDate;
            if (year < p.currentYear) {
                targetDate = new Date(year, month + 1, -1).getTime();
            }
            else {
                targetDate = new Date(year, month).getTime();
            }
            if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
                return false;
            }
            if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
                return false;
            }
            var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
            var dir = targetDate > currentDate ? 'next' : 'prev';
            var newMonthHTML = p.monthHTML(new Date(year, month));
            p.monthsTranslate = p.monthsTranslate || 0;
            var prevTranslate = p.monthsTranslate;
            var monthTranslate, wrapperTranslate;
            var transitionEndCallback = p.animating ? false : true;
            if (targetDate > currentDate) {
                // To next
                p.monthsTranslate--;
                if (!p.animating) p.months.eq(p.months.length - 1).remove();
                p.wrapper.append(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate - 1) * 100 * inverter;
                p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            }
            else {
                // To prev
                p.monthsTranslate++;
                if (!p.animating) p.months.eq(0).remove();
                p.wrapper.prepend(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate + 1) * 100 * inverter;
                p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            }
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            p.animating = true;
            p.onMonthChangeStart(dir);
            wrapperTranslate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd(dir, true);
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd(dir);
            }
        };
        p.nextYear = function () {
            p.setYearMonth(p.currentYear + 1);
        };
        p.prevYear = function () {
            p.setYearMonth(p.currentYear - 1);
        };


        // HTML Layout
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;

            var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0, 0, 0, 0);
            var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
            var currentMonthHTML = p.monthHTML(layoutDate);
            var nextMonthHTML = p.monthHTML(layoutDate, 'next');
            var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
            // Week days header
            var weekHeaderHTML = '';
            if (p.params.weekHeader) {
                for (i = 0; i < 7; i++) {
                    var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
                    var dayName = p.params.dayNamesShort[weekDayIndex];
                    weekHeaderHTML += '<div class="picker-calendar-week-day ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';

                }
                weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
            }
            pickerClass = 'leleui-picker-calendar ' + (p.params.cssClass || '');
            if (!p.inline) pickerClass = 'leleui-picker-modal ' + pickerClass;
            var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
            if (p.params.toolbar) {
                toolbarHTML = p.params.toolbarTemplate
                    .replace(/{{closeText}}/g, p.params.toolbarCloseText)
                    .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
                    .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
            }

            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                    toolbarHTML +
                    '<div class="picker-modal-inner">' +
                        weekHeaderHTML +
                        monthsHTML +
                    '</div>' +
                '</div>';


            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput && !isPopover()) {
                var pageContent = p.input.parents('.page-content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;

                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({ 'padding-bottom': (newPaddingBottom) + 'px' });
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (inPopover()) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.leleui-picker-modal').length === 0) p.close();
            }
            else {
                if ($(e.target).parents('.leleui-picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
                if (p.params.inputReadOnly) {
                    p.input.on('focus mousedown', function (e) {
                        e.preventDefault();
                    });
                }
            }

        }

        //iphone 上无法正确触发 click，会导致点击外面无法关闭
        if (!p.inline) $(document).on('click touchend', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.page-content').css({ 'padding-bottom': '' });
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.destroyCalendarEvents();
        }

        p.opened = false;
        p.open = function () {
            var toPopover = isPopover() && false;
            var updateValue = false;
            if (!p.opened) {
                // Set date value
                if (!p.value) {
                    if (p.params.value) {
                        p.value = p.params.value;
                        updateValue = true;
                    }
                }

                // Layout
                p.layout();

                // Append
                if (toPopover) {
                    p.pickerHTML = '<div class="popover popover-picker-calendar"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                    p.popover = $.popover(p.pickerHTML, p.params.input, true);
                    p.container = $(p.popover).find('.leleui-picker-modal');
                    $(p.popover).on('close', function () {
                        onPickerClose();
                    });
                }
                else if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                }
                else {
                    p.container = $($.openPicker(p.pickerHTML));
                    $(p.container)
                    .on('close', function () {
                        onPickerClose();
                    });
                }

                // Store calendar instance
                p.container[0].f7Calendar = p;
                p.wrapper = p.container.find('.picker-calendar-months-wrapper');

                // Months
                p.months = p.wrapper.find('.picker-calendar-month');

                // Update current month and year
                p.updateCurrentMonthYear();

                // Set initial translate
                p.monthsTranslate = 0;
                p.setMonthsTranslate();

                // Init events
                p.initCalendarEvents();

                // Update input value
                if (updateValue) p.updateValue();

            }

            // Set flag
            p.opened = true;
            p.initialized = true;
            if (p.params.onMonthAdd) {
                p.months.each(function () {
                    p.params.onMonthAdd(p, this);
                });
            }
            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            p.animating = false;  //有可能还有动画没做完，因此animating设置还没改。
            if (inPopover()) {
                $.closePicker(p.popover);
                return;
            }
            else {
                $.closePicker(p.container);
                return;
            }
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click focus', openOnInput);
                p.input.data("calendar", null);
            }
            $('html').off('click', closeOnHTMLClick);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };

    var format = function (d) {
        return d < 10 ? "0" + d : d;
    }


    $.fn.calendar = function (params, args) {
        params = params || {};
        return this.each(function () {
            var $this = $(this);
            if (!$this[0]) return;
            var p = {};
            if ($this[0].tagName.toUpperCase() === "INPUT") {
                p.input = $this;
            } else {
                p.container = $this;
            }

            var calendar = $this.data("calendar");

            if (!calendar) {
                if (typeof params === typeof "a") {
                } else {
                    if (!params.value && $this.val()) params.value = [$this.val()];
                    //默认显示今天
                    if (!params.value) {
                        var today = new Date();
                        params.value = [today.getFullYear() + "/" + format(today.getMonth() + 1) + "/" + format(today.getDate())];
                    }
                    calendar = $this.data("calendar", new Calendar($.extend(p, params)));
                }
            }

            if (typeof params === typeof "a") {
                calendar[params].call(calendar, args);
            }
        });
    };

    defaults = $.fn.calendar.prototype.defaults = {
        value: undefined, // 通过JS赋值，注意是数组
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        firstDay: 1, // First day of the week, Monday
        weekendDays: [0, 6], // Sunday and Saturday
        multiple: false,
        dateFormat: 'yyyy/mm/dd',
        direction: 'horizontal', // or 'vertical'
        minDate: null,
        maxDate: null,
        touchMove: true,
        animate: true,
        closeOnSelect: true,
        monthPicker: true,
        monthPickerTemplate:
            '<div class="picker-calendar-month-picker">' +
                '<a href="javascript:;" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' +
                '<div class="current-month-value"></div>' +
                '<a href="javascript:;" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' +
            '</div>',
        yearPicker: true,
        yearPickerTemplate:
            '<div class="picker-calendar-year-picker">' +
                '<a href="javascript:;" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
                '<span class="current-year-value"></span>' +
                '<a href="javascript:;" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
            '</div>',
        weekHeader: true,
        // Common settings
        scrollToInput: true,
        inputReadOnly: true,
        convertToPopover: true,
        onlyInPopover: false,
        toolbar: true,
        toolbarCloseText: 'Done',
        toolbarTemplate:
            '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                    '{{yearPicker}}' +
                    '{{monthPicker}}' +
                    // '<a href="#" class="link close-picker">{{closeText}}</a>' +
                '</div>' +
            '</div>',
        /* Callbacks
        onMonthAdd
        onChange
        onOpen
        onClose
        onDayClick
        onMonthYearChangeStart
        onMonthYearChangeEnd
        */
    };

}($);