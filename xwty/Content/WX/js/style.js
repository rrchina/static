	$(window).load(function(){
		var h=$('.nav_list>a').size()*0.6+'rem';
		$('.nav').click(function(){
			var hi=$('.nav_list').height();
			if(hi<=0){
				$('.nav_list').animate({'height':h},350);
			}else{
				$('.nav_list').animate({'height':0},350);
			}
		})
		var mySwiper1 = new Swiper('.banner', {
	        autoplay:{
		        delay:3000,//自动播放
		        disableOnInteraction:false, //滑动时是否停止自动播放
	        },
	        pagination:{
	        	el:'.img_dot',
	        	bulletElement:'li',
	        	clickable :true
	        }, // 如果需要分页器
	        direction: 'horizontal', //水平切换
	        loop: true, //无限循环
	        speed:800 //播放速度
	    });
	    var mySwiper2 = new Swiper('.school_banner', {
        autoplay:{
	        delay:2500,//自动播放
	        disableOnInteraction:false, //滑动时是否停止自动播放
        },
        pagination:{
        	el:'.school_dot',
        	clickable :true
        }, // 如果需要分页器
        direction: 'horizontal', //水平切换
        loop: true, //无限循环
        speed:800 //播放速度
    });
	    //文字超出隐藏
		try{
			var p=$(".sw_03>a>p");
			ellipsis(p,58);
		}catch(e){
			//TODO handle the exception
		}
	})
	//文字超出隐藏
	function ellipsis(obj,num){
		obj.each(function(){	
			var maxwidth=num;
			if($(this).text().length>maxwidth){
				$(this).text($(this).text().substring(0,maxwidth));
				$(this).html($(this).html()+'...');
			}					 
		});
	}
