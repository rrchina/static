/**公用方法类 */
var comm = {
    host: '/Api/WebApi/ApiProcess',
    listTabs: '/Helper/ListTabs.ashx',
    base: 'http://db.hope55.com/Api/WebApi/ApiProcess',
    login: 'http://db.hope55.com/Arts/Page/Login',
    //事件的执行顺序，分为冒泡和捕获，冒泡由内而外，捕获由而内，监听事件(addEventListener)中分别代表false和true;
    //判断方法
    is:{
        //字符串是否为空
        empty:function(str){return (str==''||str==null||typeof(str)=='undefined');},
        fn:function(f){return typeof f=='function';},
        str:function(str){return typeof str=='string';},
        num:function(a){return typeof a=='number';},
        bool:function(a){return typeof a=='boolean';},
        obj:function(a){return typeof a=='object';},
        array:function(a){return a instanceof Array;},
        url:function(a){return /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test(a);}
    },
    //公用 新增方法
    extendEvent:function(){
        var _this = this;
        //类似于string.Format();可使用索引{0}和名称{abc}
        String.prototype.format = function(str){
            var result = this;
            if (arguments.length > 0) {
                if (arguments.length == 1 && typeof (args) == "object") {
                    for (var key in args) {
                        var reg = new RegExp("({)" + key + "()})", "g");
                        if (args[key] != undefined) {
                            result = result.replace(reg, args[key]);
                        } else {
                            result = result.replace(reg, '');
                        }
                    }
                } else {
                    for (var i = 0; i < arguments.length; i++) {
                        var reg = new RegExp("({)" + i + "(})", "g");
                        if (arguments[i] != undefined) {
                            result = result.replace(reg, arguments[i]);
                        } else {
                            result = result.replace(reg, '');
                        }
                    }
                }
            }
            return result;
        };
        //对一日期值进行格式化并返回对应的字符串
        Date.prototype.format = function (formatStr) {
            var str = formatStr;
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            str = str.replace(/yyyy|YYYY/, this.getFullYear());
            str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
            str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
            str = str.replace(/M/g, (this.getMonth() + 1));
            str = str.replace(/w|W/g, Week[this.getDay()]);
            str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
            str = str.replace(/d|D/g, this.getDate());
            str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
            str = str.replace(/h|H/g, this.getHours());
            str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
            str = str.replace(/m/g, this.getMinutes());
            str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
            str = str.replace(/s|S/g, this.getSeconds());
            return str;
        };
        //去除所有空格
        String.prototype.trimAll=function(){return this?this.replace(/\s+/g,''):'';}
        //json转化为字符串
        //Object.prototype.toStr = function(){
        //    return _this.is.obj(this)?JSON.stringify(this):'';
        //}
        ////字符串转化为json
        //String.prototype.toObj = function(){
        //    return _this.is.str(this)?JSON.parse(this):'';
        //}
    },
    //ajax提交的方法
    ajax: function (config) {
        var data = config.data.d;
        if (!comm.is.str(data)) data = JSON.stringify(data);
        data = AES.en(data);
        $.ajax({
            url: config.url||this.host,
            timeout: config.timeout || 60 * 1000,
            type: config.type || 'post',
            data: { MethodName: config.data.m, Datas: data },
            dataType:config.dataType||'json',
            success: function (data) {
                if (data.ResultCode == -1 && data.ResultMessage.indexOf("令牌失效") >= 0) {
                    layer.alert(data.ResultMessage + "请重新登录");
                    setTimeout(function () { location.href = "http://localhost:8391" + "/Arts/Page/Login"; }, 2000);
                } else {
                    if (data.ResultCode == 1) {
                        if (comm.is.fn(config.error)) { config.error(data.ResultMessage); }
                        else { layer.closeAll(); layer.msg(data.ResultMessage);}
                    }
                    else {//正确的返回
                        var dataInfo = data.ResultData;
                        if (!comm.is.empty(dataInfo)) {
                            dataInfo = AES.de(dataInfo);
                            dataInfo = JSON.parse(dataInfo);
                            console.log(dataInfo);
                            config.callback(dataInfo);
                        } else {
                            comm.is.fn(config.callback) && config.callback();
                        }
                    }
                }
            },
            error: function (e) {
                if (e.statusText.indexOf('timeout') >= 0) {
                    console.trace('timeout');
                    if (comm.is.fn(config.error)) { config.error('超时'); }
                    else { layer.closeAll(); layer.msg('超时'); }
                } else {
                    if (comm.is.fn(config.error)) { config.error(e); }
                    else { layer.closeAll(); layer.alert(e.statusText); }
                }
            }
        })
    },
    //点击事件
    on: function (self,callback,event) {
        $(self).unbind(comm.is.empty(event)?'click':event).bind(comm.is.empty(event)?'click':event, callback);
    },
    //根据key获取url链接上面的值
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) { return unescape(r[2]); }
        return null;
    },
    //页面上面上传图片按钮事件
    page_Up_event: function (myself) {
        comm.on(myself, function () {
            var temp = "<div id='UploadArea' style='display:none;'><form method='post' target='id_iframe' id='_fileForm'><input type='file' name='uploadFile' id='picBtn' /><input type='button' name='picSub' id='picSub');' /></form><iframe id='id_iframe' name='id_iframe'></iframe></div></div>";
            if ($('#UploadArea').length == 0) {
                $('body').append(temp);
            } else {
                $('#UploadArea').remove();
                $('body').append(temp);
            }
            $('#picBtn').click();
            comm.on($('#picBtn'), function () {
                if (this.files && this.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        $('#fileImg').attr('src', evt.target.result).addClass('hasfile');
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            }, 'change');
        });
    },
    //上传到后台
    UploadToBase: function (callback) {
        comm.on($("#picSub"), function () {
            comm.fileUpload(function (data) {
                comm.is.fn(callback) && callback(data);
            });
        });
        $("#picSub").click();
    },
    //上传的公用事件
    fileUpload: function (callback) {
        $('#_fileForm').ajaxSubmit({
            type: 'post',
            url: '/Helper/FileUpload.ashx',
            success: function (data) {
                if (data.indexOf('.') >= 0) {
                    comm.is.fn(callback) && callback(data);
                } else {
                    layer.closeAll();
                    layer.msg('获取上传文件失败');
                }
            }
        })
    },
    //富文本框加载
    KindLoad: function (myself,callback) {
        KindEditor.ready(function (K) {
            var editor = K.create(myself, {
                cssPath: '/Areas/Arts/js/kindE/plugins/code/prettify.css',
                uploadJson: '/Areas/Arts/js/kindE/upload_json.ashx?l=' + comm.GetQueryString('l') + '&token=' + comm.token,
                fileManagerJson: '/Areas/Arts/js/kindE/file_manager_json.ashx',
                allowFileManager: true,
                afterCreate: function () {
                    var $this = this;
                    K.ctrl(document, 13, function () {
                        $this.sync();
                        K('#btnSub')[0].submit();
                    });
                    K.ctrl($this.edit.doc, 13, function () {
                        $this.sync();
                        K('#btnSub')[0].submit();
                    });
                }
            });
            prettyPrint();

            callback(editor);
        })
    },
    //加载样式css
    cssload: function (css) {
        var _this = this;
        if (_this.is.empty(css)) return;

        var list = new Array();
        if (_this.is.str(css)) list.push(css);
        if (_this.is.array(css)) list = css;

        //var mathnum = parseInt(Math.random() * 10, 9);
        for (var i = 0; i < list.length; i++) {
            if (!_this.is.empty(list[i])) {
                var url = list[i];// + "?v=" + mathnum;
                $('head').append('<link rel="stylesheet" href="' + url + '" />');
            }
        }
    },
    //加载js
    jsLoad: function (js,callback,state) {
        var _this = this;
        var loadCount = 0;
        var body = document.body;
        if (_this.is.empty(js)) { _this.is.fn(callback) && callback(); return; }
        var list = new Array();
        if (_this.is.str(js)) list.push(js);
        else if (_this.is.array(js)) list = js;
        if (!state) {
            if (list.length == 0) return;
            js_load();
            function js_load() {
                var url = list[loadCount];
                if (comm.is.empty(url)) return;
                if (loadCount == list.length) return;
                loadJs(url, function () {
                    loadCount++;
                    js_load();
                })
            }
            function loadJs(url,callback) {
                var node = document.createElement("script");
                node.src = url;// + "?v=" + mathnum;
                node.onload = node.onerror = null;
                node.onload = function () {
                    _this.is.fn(callback) && callback();
                }
                body.appendChild(node);
            }
        } else {
            //var mathnum = parseInt(Math.random() * 10, 9);
            for (var i = 0; i < list.length; i++) {
                if (!_this.is.empty(list[i])) {
                    var node = document.createElement("script");
                    node.src = list[i];// + "?v=" + mathnum;
                    node.onload = node.onerror = null;
                    node.onload = function () {
                        //移除节点
                        //body.removeChild(node);
                        loadCount++;
                        //所有js加载完成
                        if (loadCount == list.length) {
                            _this.is.fn(callback) && callback();
                        }
                    }
                    body.appendChild(node);
                }
            }
        }
    },
    //获取html
    htmlload: function (html, callback) {
        var _this = this;
        if (_this.is.empty(html)) return;

        //var mathnum = parseInt(Math.random() * 10, 9);
        var url = html //+ "?v=" + mathnum;
        $.get(url, function (data) {
            _this.is.fn(callback) && callback(data);
        })
    },
    date: function (format, timestamp) {
        var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date()); 
        var pad = function(n, c){ 
            if((n = n + "").length < c){ 
                return new Array(++c - n.length).join("0") + n; 
            } else { 
                return n; 
            } 
        }; 
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
        var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"}; 
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
        var f = { 
            // Day 
            d: function(){return pad(f.j(), 2)}, 
            D: function(){return f.l().substr(0,3)}, 
            j: function(){return jsdate.getDate()}, 
            l: function(){return txt_weekdays[f.w()]}, 
            N: function(){return f.w() + 1}, 
            S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'}, 
            w: function(){return jsdate.getDay()}, 
            z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0}, 
        
            // Week 
            W: function(){ 
                var a = f.z(), b = 364 + f.L() - a; 
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1; 
                if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){ 
                    return 1; 
                } else{ 
                    if(a <= 2 && nd >= 4 && a >= (6 - nd)){ 
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31"); 
                        return date("W", Math.round(nd2.getTime()/1000)); 
                    } else{ 
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0); 
                    } 
                } 
            }, 
        
            // Month 
            F: function(){return txt_months[f.n()]}, 
            m: function(){return pad(f.n(), 2)}, 
            M: function(){return f.F().substr(0,3)}, 
            n: function(){return jsdate.getMonth() + 1}, 
            t: function(){ 
                var n; 
                if( (n = jsdate.getMonth() + 1) == 2 ){ 
                    return 28 + f.L(); 
                } else{ 
                    if( n & 1 && n < 8 || !(n & 1) && n > 7 ){ 
                        return 31; 
                    } else{ 
                        return 30; 
                    } 
                } 
            }, 
        
            // Year 
            L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0}, 
            //o not supported yet 
            Y: function(){return jsdate.getFullYear()}, 
            y: function(){return (jsdate.getFullYear() + "").slice(2)}, 
        
            // Time 
            a: function(){return jsdate.getHours() > 11 ? "pm" : "am"}, 
            A: function(){return f.a().toUpperCase()}, 
            B: function(){ 
                // peter paul koch: 
                var off = (jsdate.getTimezoneOffset() + 60)*60; 
                var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off; 
                var beat = Math.floor(theSeconds/86.4); 
                if (beat > 1000) beat -= 1000; 
                if (beat < 0) beat += 1000; 
                if ((String(beat)).length == 1) beat = "00"+beat; 
                if ((String(beat)).length == 2) beat = "0"+beat; 
                return beat; 
            }, 
            g: function(){return jsdate.getHours() % 12 || 12}, 
            G: function(){return jsdate.getHours()}, 
            h: function(){return pad(f.g(), 2)}, 
            H: function(){return pad(jsdate.getHours(), 2)}, 
            i: function(){return pad(jsdate.getMinutes(), 2)}, 
            s: function(){return pad(jsdate.getSeconds(), 2)}, 
            //u not supported yet 
        
            // Timezone 
            //e not supported yet 
            //I not supported yet 
            O: function(){ 
                var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4); 
                if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t; 
                return t; 
            }, 
            P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))}, 
            //T not supported yet 
            //Z not supported yet 
        
            // Full Date/Time 
            c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()}, 
            //r not supported yet 
            U: function(){return Math.round(jsdate.getTime()/1000)} 
        }; 
        
        return format.replace('/[\]?([a-zA-Z])/g', function(t, s){ 
            if( t!=s ){ 
                // escaped 
                ret = s; 
            } else if( f[s] ){ 
                // a date function exists 
                ret = f[s](); 
            } else{ 
                // nothing special 
                ret = s; 
            } 
            return ret; 
        }); 
    }
};
comm.extendEvent();

//加载条
//var loading = {
//    open: function () { $('.loading-container').show(); },
//    close: function () { $('.loading-container').hide(); }
//}