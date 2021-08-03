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
     qkui.loginswitch = function (now) {        
        var obj = $($(now).data('obj')); 
        $(".login-register").children("div").css("display", "none");
        obj.css("display", "block");
        $(now).parent().find(".qk-arrow").fadeOut(function () { $(now).find(".qk-arrow").fadeIn(); });
    };
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
    qkui.rightside = function (obj) {
        var side = $(".qk-rightside");

        if (typeof (obj) != "undefined") side = $(obj);

        if (side.css("right") === "0px") {
            side.animate({ right: "-70%" }, function () { $(".qk-shade-rightside").remove(); });
        } else {
            $("body").append('<div class="qk-shade qk-shade-rightside" style="z-index: 9999998;"></div>');
            side.animate({ right: "0" });
            $(".qk-shade-rightside").click(function () { qkui.rightside(obj); });
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
        var styles = ["qk-dialog-wd", "qk-dialog-wdt"]; //对话框风格
        var date = new Date();
        var dialogId = 'qkdialog' + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();

        var html = '<div id="' + dialogId + '" class="qk-dialog">' + (parame.shade ? '<div class="qk-dialog-shade"></div>' : '') + '<div class="qk-dialog-edge"></div> <div class="' + styles[parame.style] + '"> <i class="qk-dialog-cl iconfont icon-closex"></i>'
            + '<div class="qk-dialog-tt">' + parame.title + '</div>  <div class="qk-dialog-ct">' + parame.content + '</div></div>  <div class="qk-dialog-edge"></div></div>';
        $("body").append(html); 
        $("#" + dialogId).find(".qk-dialog-shade").click(function () { $("#" + dialogId).fadeOut(function () { $("#" + dialogId).remove(); }) });
        $("#" + dialogId).find(".qk-dialog-cl").click(function () { $("#" + dialogId).fadeOut(function () { $("#" + dialogId).remove(); }) });
        return dialogId;
    };

    //关闭当前对象所在对话框
    qkui.dialog.colse = function (now) { $(now).closest(".qk-dialog").fadeOut(function () { $(now).closest(".qk-dialog").remove(); }) };

    //关闭指定对话框
    qkui.dialog.colseId = function (dialog) { $("#" + dialog).fadeOut(function () { $("#" + dialog).remove(); }) };

    //关闭所有对话框
    qkui.dialog.colseall = function () { $(".qk-dialog").fadeOut(function () { $(".qk-dialog").remove(); })};

    //复制
    qkui.copy = function (obj) { 
        alert(typeof(obj));
        switch (typeof(obj)) {
            case 'string': valu = obj; break;
            case 'object': valu = obj.text(); break;
        }
         
        window.clipboardData.setData("Text", valu);
    };

    //加载广告
    qkui.advert = function (params) { 
        var parame = {
            style: 0, //风格
            shade: true,//遮罩
            title: "",//标题
            content: "",//内容
            adverts: [{obj:"",type:""}] //obj：展现广告的容器对象，type：广告类型
        };
        for (var para in params) {
            parame[para] = params[para];
        }

         //默认广告数据
        var advertDefaultData = { // time：每次展现时间，delay：延迟时间，rate：展现频率，number：执行次数（0为无限次），items：数据数组
            advert_full: { time: 15, delay: 10, rate: 20, number: 0, items: [{ title: "全屏广告标题", image: "/image/test/tu7.jpg", url: "http://m.mrtqm.com", depict: "昴日天启全屏广告" }]}, //全屏广告
            advert_banner: { time: 5, delay: 10, rate: 20, number: 0, items: [{ title: "banner广告标题", image: "/image/test/banner3.jpg", url: "http://m.mrtqm.com", depict: "昴日天启banner广告" }, { title: "banner广告标题", image: "/image/test/banner4.jpg", url: "http://m.mrtqm.com", depict: "昴日天启banner广告" }, { title: "banner广告标题", image: "/image/test/banner5.jpg", url: "http://m.mrtqm.com", depict: "昴日天启banner广告" }] },//banner广告
            advert_dialog: { time: 5, delay: 10, rate: 20, number: 0, items: [{ title: "弹窗广告标题", image: "/image/test/tu4.jpg", url: "http://m.mrtqm.com", depict: "昴日天启弹窗广告" }] },//弹窗广告
            advert_corner: { time: 5, delay: 10, rate: 20, number: 0, items: [{ title: "边角广告标题", image: "/image/test/tu7.jpg", url: "http://m.mrtqm.com", depict: "昴日天启边角广告" }] },//边角广告
            advert_topbar: { time: 5, delay: 10, rate: 20, number: 0, items: [{ title: "顶部条状广告标题", image: "/image/test/tu7.jpg", url: "http://m.mrtqm.com", depict: "昴日天启顶部条状广告" }] },//顶部条状广告
            advert_bottombar: { time: 5, delay: 10, rate: 20, number: 0, items: [{ title: "底部条状广告标题", image: "/image/test/tu7.jpg", url: "http://m.mrtqm.com", depict: "昴日天启底部条状广告" }] }//底部条状广告
        };

        var nowAdverts = new Array(); //当前页面需要展现的广告
        for (var advert in advertDefaultData) {
            if ($('.' + advert).length > 0) {
                nowAdverts.push(advert);
            }
        }

        
        var advertData=null; //广告数据

        //获取广告数据
        $.ajax({
            url: "#",
            data: { Adverts: nowAdverts },
            success: function (result) {  if (result.state === 200)  advertData = result.data;  },
            error: function (xhr, status, error) {  },
            complete: function (xhr, status) { GetDataCallback(); }
        });
       

        //获取广告数据回调
        function GetDataCallback() { 
            if (advertData === null)
                advertData = advertDefaultData;
            for (var index in nowAdverts) { 
                if (typeof (eval(nowAdverts[index])) === "function") {
                    eval(nowAdverts[index]).apply(this, [advertData[nowAdverts[index]]]);
                }
            }           
        }

        //加载全屏广告
        function advert_full(dataArray) {
            if (dataArray === undefined) return;
           // var advertId = "advert_fullId" + Math.round(Math.random()*10000)
            var html = '<div class="advert-time" > <span class="time-number"></span> <label>关闭</label> </div> <div class="swiper-container advert-full-swiper">  <div class="swiper-wrapper">';
            
            for (var i in dataArray.items) {
                var item = dataArray.items[i];
                html += '<div class="swiper-slide"><img src="' + item.image+'" /></div>';
            }
            html+= '</div>  <div class="swiper-pagination"></div> ';

            var advert = $(".advert_full");
            advert.html(html);
            advert.children(".advert-time").click(function () {
                $(this).closest(".advert_full").fadeOut(1000, function () { $(this).closest(".advert_full").remove(); });
            }); //手动关闭

            var time = dataArray.time;
            var nub = advert.find(".time-number");        
            nub.text(time);
            var interval = setInterval(function () {
                time--; 
                if (time < 0) {
                    clearInterval(interval);
                    nub.closest(".advert_full").fadeOut(1000, function () { nub.closest(".advert_full").remove(); });
                } else
                nub.text(time);
            }, 1000);

            //初始化广告动画
            var swiper2 = new Swiper('.advert-full-swiper', { 
                autoplay: {
                    disableOnInteraction: false
                },
                loop: dataArray.items.length>1,
                pagination: {
                    el: dataArray.items.length > 1?'.swiper-pagination':"",
                    clickable: true
                }
            });

        }


        //加载Banner广告
        function advert_banner(dataArray) {
            if (dataArray === undefined) return;
            // var advertId = "advert_fullId" + Math.round(Math.random()*10000)
            var html = '<div class="swiper-container advert-banner-swiper"> <div class="swiper-wrapper">';

            for (var i in dataArray.items) {
                var item = dataArray.items[i];
                html += '<div class="swiper-slide"><a href="' + item.url+'"><img src="' + item.image + '" /></a></div>';
            }
            html += '</div>  <div class="swiper-pagination"></div> ';

            var advert = $(".advert_banner");
            advert.html(html);
                    
            //初始化广告动画
             new Swiper('.advert-banner-swiper', {
                autoplay: {
                    disableOnInteraction: false
                },
                loop: dataArray.items.length > 1,
                pagination: {
                    el: dataArray.items.length > 1 ? '.swiper-pagination' : "",
                    clickable: true
                }
            });

        }

        //对话框广告
        function advert_dialog(dataArray) { 
            if (dataArray === undefined) return;
            setTimeout(function () {
                var number = dataArray.number;

                var interval = setInterval(function () {
                    
                    if (dataArray.number === 0 || number > 0) {
                        var advertId = qkui.dialog({
                            style: 1,
                            content: '<a href="' + dataArray.items[0].url+'"><img src="' + dataArray.items[0].image + '" /></a>'
                        });
                        setTimeout(function () { qkui.dialog.colseId(advertId); }, dataArray.time * 1000);
                    } else {
                        clearInterval(interval);
                    }
                    number--;

                }, dataArray.rate*1000);

            }, dataArray.delay*1000);
        }

    };



if (typeof module !== 'undefined' && module.exports) module.exports = qkui;  //兼容CommonJs规范  
if (typeof define === 'function') define(function () { return qkui; });  //兼容AMD/CMD规范 
global.qkui = qkui;//注册全局变量

}) (this, jQuery);


