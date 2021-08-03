//qkui操作函数

; (function (global, $) {
    "use strict";
    var qkui = function (parameter) {
        this.param = {

        };
        //this.param = $.extend(this.param, parameter);
        for (var para in parameter) {
            this.param[para] = parameter[para];
        }

    };

    qkui.prototype = {
        ////获取当前页号
        //get pageNumber() { return this.param.pageNumber; },
        ////设置当前页号
        //set pageNumber(val) { return this.param.pageNumber = val; },


    };

    //登录方式切换
    qkui.loginswitch = function () { $(".login-pwd").toggle(); $(".login-msg").toggle(); };

    //返回顶部
    qkui.returntop = function () {
        if (document.body.scrollHeight > document.body.offsetHeight) {
            $("body").append('<div class="return-top"> <i class="iconfont icon-dingbu"></i></div>');
            $(".return-top").click(function () { $("html,body").animate({ scrollTop: 0 }, 500); });
        }
    };

    //快捷导航
    qkui.shortcutnavi = function () {
        if ($(".navi-footer").length === 0 && $(".shortcut-control").length === 0) {
            var html = '<div class="shortcut-control">'
                + ' <div class="shortcut-navi">'
                + '     <div class="shortcut-title" ><i class="iconfont icon-lefts"></i></div>'
                + '     <footer class="shortcut-menu">'
                + '         <a class="now" href="index.html"><i class="iconfont icon-home"></i>首页</a>'
                + '         <a href="tel:13658034284"><i class="iconfont icon-kefu"></i>客服</a>'
                + '         <a href="classify.html"><i class="iconfont icon-fenlei"></i>分类</a>'
                + '         <a href="shopcart.html"><i class="iconfont icon-gouwuche1"></i>购物车</a>'
                + '         <a href="my.html"><i class="iconfont icon-user"></i>我的</a>'
                + '     </footer> </div> </div>';

            $("body").append(html);
            $(".shortcut-control").find(".shortcut-title").click(function () {
                var shortcut = $(".shortcut-control");
                if (shortcut.css("right") === "0px") {
                    shortcut.animate({ right: "-80%" }, 500, function () {
                        shortcut.children().animate({ marginLeft: "-1.6rem" }, 100);
                        shortcut.find(".shortcut-title").children("i").removeClass("icon-rights").addClass("icon-lefts");
                    });
                } else {
                    shortcut.animate({ right: 0 }, 500, function () {
                        shortcut.children().animate({ marginLeft: 0 }, 100);
                        shortcut.find(".shortcut-title").children("i").removeClass("icon-lefts").addClass("icon-rights");
                    });
                }
            });
        }
    };

    //加减输入框数值 now：当前元素对象this
    qkui.formcount = function (now) {
        var isAdd = $(now).text() === "+";
        var input = $(now).closest(".qk-form-count").find("input");
        var val = parseInt(input.val());
        val = isAdd ? val + 1 : val - 1;
        val = val < 1 ? 1 : val;
        input.val(val);

        var skuId = $(now).parent().parent().parent().parent().next().find("input[name='skuId']").val();
        shop.post("/UserCenter/UpdateShoppingCartNumber", false, { skuId: skuId, number: val, type: 0 }, function (result) {
            //
        });
    };

    //选择窗口 obj：对应的选择窗口id
    qkui.selectbox = function (obj) {

        if ($(obj).length > 0) {
            if ($(obj).find(".qk-shade").length === 0) {
                $(obj).append('<div class="qk-shade"></div>');
                $(obj).find(".qk-shade").click(function () {
                    $(obj).find(".qk-selectbox-content").slideUp(function () { $(obj).hide(); });
                });
            }
            if ($(obj).find(".qk-selectbox-control").length === 0) {
                $(obj).find(".qk-selectbox-content").append(' <div class="qk-selectbox-control"><button class="bg-yellow">取消</button><button class="bg-default">确认</button></div>');


                $(obj).find(".qk-selectbox-content").find("button").click(function () {
                    $(obj).find(".qk-selectbox-content").slideUp(function () { $(obj).hide(); });
                });
            }

            $(obj).fadeIn(function () {
                $(obj).find(".qk-selectbox-content").slideDown();
            });
        }
    };

    //商品显示列表样式切换
    qkui.listswitch = function (now) {
        var obj = $(now).attr("data-obj");
        var options = $(now).attr("data-options").split(',');
        var icons = $(now).attr("data-icons").split(',');
        var index = parseInt($(now).attr("data-index"));
        $(obj).removeClass(options[index]);
        $(now).find(".iconfont").removeClass(icons[index]);
        index = index >= options.length - 1 ? 0 : index + 1;
        $(obj).addClass(options[index]);
        $(now).attr("data-index", index);
        $(now).find(".iconfont").addClass(icons[index]);
    };

    //主导航
    qkui.navi = function () {
        var shade = $(".qk-navi-main-shade");
        if (shade.length === 0) {

            $("body").append('<div class="qk-shade qk-navi-main-shade"></div>');
            $(".qk-navi-main").slideDown();
            $(".qk-navi-main-shade").click(function () { qkui.navi(); });
        } else {
            $(".qk-navi-main").slideUp(function () { shade.remove(); });

        }

    };

    //侧边筛选栏
    qkui.rightside = function () {
        var side = $(".qk-rightside");
        if (side.css("right") === "0px") {
            side.animate({ right: "-70%" }, function () { $(".qk-shade-rightside").remove(); });
        } else {
            $("body").append('<div class="qk-shade qk-shade-rightside" style="z-index: 9999998;"></div>');
            side.animate({ right: "0" });
            $(".qk-shade-rightside").click(function () { qkui.rightside(); });
        }
    };

    //复选框选择事件
    qkui.checkbox = function (now) {
        //check-group 复选框分组   check-parent : 父级选框  check-child ：子级选框

        if ($(now).hasClass("check-child")) {
            var group = $(now).closest(".check-group");
            var cLen = group.find(".check-child").length;
            var cdLen = group.find(".check-child:checked ").length;
            if (cLen === cdLen) {
                group.find(".check-parent").prop("checked", true);
            } else {
                group.find(".check-parent").prop("checked", false);
            }

        } else if ($(now).hasClass("check-parent")) {
            var grou = $(now).closest(".check-group");
            grou.find(".check-child").prop("checked", $(now).prop("checked"));
        }

    };

    //统计购物车价格
    qkui.countprice = function () {
        var price = 0; //总价
        var number = 0; //商品总量
        var count = 0; //商品总类量
        $.each($(".product-item"), function () {
            if ($(this).find(".check-child").prop("checked")) {
                var pri = parseFloat($(this).find(".price").text());
                var num = parseInt($(this).find(".number").val());
                price += pri * num;
                number += num;
                count++;
            }
        });
        $(".price-count").text("￥" + price.toFixed(2));
        $(".goods-count").text(count);

        if (count <= 0) {
            $("#cartSubmit").prop("disabled", true);
        }
    };

    //对话框
    qkui.dialog = function (params) {
        var parame = {
            style: 0, //风格
            shade: true,//遮罩
            title: "",//标题
            content: ""//内容
        };
        for (var para in params) {
            parame[para] = params[para];
        }
        var styles = ["qk-dialog-wd", "qk-dialog-wdt"];
        var date = new Date();
        var dialogId = 'qkdialog' + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();

        var html = '<div id="' + dialogId + '" class="qk-dialog"><div class="qk-dialog-edge"></div> <div class="' + styles[parame.style] + '"> <i class="qk-dialog-cl iconfont icon-closex"></i>'
            + '<div class="qk-dialog-tt">' + parame.title + '</div>  <div class="qk-dialog-ct">' + parame.content + '</div></div> ' + (parame.shade ? '<div class="qk-dialog-shade"></div>' : '') + ' <div class="qk-dialog-edge"></div></div>';
        $("body").append(html); 
        $("#" + dialogId).find(".qk-dialog-shade").click(function () { $("#" + dialogId).fadeOut(function () { $("#" + dialogId).remove(); }) });
        $("#" + dialogId).find(".qk-dialog-cl").click(function () { $("#" + dialogId).fadeOut(function () { $("#" + dialogId).remove(); }) });
    };

    //关闭当前对象所在对话框
    qkui.dialog.colse = function (now) { $(now).closest(".qk-dialog").fadeOut(function () { $(now).closest(".qk-dialog").remove(); }) };

    //关闭所有对话框
    qkui.dialog.colseall = function () { $(".qk-dialog").fadeOut(function () { $(".qk-dialog").remove(); })};




if (typeof module !== 'undefined' && module.exports) module.exports = qkui;  //兼容CommonJs规范  
if (typeof define === 'function') define(function () { return qkui; });  //兼容AMD/CMD规范 
global.qkui = qkui;//注册全局变量

}) (this, jQuery);


