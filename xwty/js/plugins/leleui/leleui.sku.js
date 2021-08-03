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

        var i, j, skuKeys = getObjKeys(skuparam.data);

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
    var add2SKUResult = function(combArrItem, sku) {
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
    var combInArray = function(aData) {
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
    var getCombFlags = function(m, n) {
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

    //获得对象的key
    var getObjKeys = function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
                keys[keys.length] = key;
        return keys;
    };

    var getSelectedSKUValue = function() {
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
                $(priceObj).text('--');
                //设置属性状态
                $(skuparam.container).find('.sku').each(function () {
                    skuparam.SKUResult[$(this).attr('attr_id')] ? $(this).removeClass('sku_disabled') : $(this).addClass('sku_disabled').removeClass('sku-selected');
                })
            }
        });
    }

    lele.shopsku = function (pa) {
        new shopSku(pa);
    }
}(lele);