

class APagingItem extends AView
{
    constructor()
    {
        super()

        this.delegator 	= null;	//delegator
        this.component	= null;
        this.parentComp	= null;

        this.defaultStyle = null;
        /*
        스타일...PagingAttrProp.lay > Style.lay key
        Paging.js에서 세팅됨
        */
        this.signOverStyle 		= null;
        this.signDownStyle 		= null;
        this.signDisableStyle 	= null;
        this.numberOverStyle 	= null;
        this.numberDownStyle 	= null;
        this.numberDisableStyle = null;
        
        this.fontSize			= null;
        this.buttonWidth		= null;
        this.buttonDisabled		= null;
        this.buttonReadonly		= null;

        /*
        옵션...PagingAttrProp.lay > Option.lay key
        Paging.js에서 세팅됨
        */
        this.isCenter	= null;	//가운데...
        
        this.param		= {};	//전달할 정보 key/value

        this.totalPage	= 0;	//전체 페이지 수
        this.totalCount	= 0;	//레코드 총 카운트 수
        this.pageIdx	= 1;	//현재 페이지 번호
        this.perPage 	= 10;	//페이지당 레코드 수
        this.block 		= 10;	//블럭당 페이지 수
    }
	
	
}

window.APagingItem = APagingItem

APagingItem.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	var thisObj = this;
	this.parentComp = this.element.parentElement.parentElement.acomp;

	//초기화-----------------------------------------------------------------------
	this.defaultStyle 		= this.parentComp.getAttr('data-style');
	this.signOverStyle 		= this.parentComp.getAttr('data-sign-style-over');
	this.signDownStyle 		= this.parentComp.getAttr('data-sign-style-down');
	this.signDisableStyle 	= this.parentComp.getAttr('data-sign-style-disable');
	this.numberOverStyle 	= this.parentComp.getAttr('data-number-style-over');
	this.numberDownStyle 	= this.parentComp.getAttr('data-number-style-down');
	this.numberDisableStyle = this.parentComp.getAttr('data-number-style-disable');
	
	this.fontSize 			= this.parentComp.getStyle('font-size');	
	this.buttonWidth 		= this.parentComp.getAttr('data-button-width');	
	this.buttonDisabled		= this.parentComp.getAttr('disabled');
	this.buttonReadonly		= this.parentComp.getAttr('readonly');
	
	this.isCenter 			= this.parentComp.getAttr('data-iscenter-button');
	//초기화-----------------------------------------------------------------------
	
	//페이징 초기화
	this.removeChildren();
	
	if(this.isDev())
	{
		//페이징 버튼 객체 생성
		this.createPageButton("sign-left2");
		this.createPageButton("sign-left");
		for(var i=1;i<=this.perPage;i++) this.createPageButton("number", i);
		this.createPageButton("sign-right");
		this.createPageButton("sign-right2");

		setTimeout(function(){
			var $child = thisObj.$ele.children();
			$child.first().css("margin-left","none");
			$child.last().css("margin-right","none");
			
			var padNum = $child.eq(1).css('margin-left').replace('px','')*1||0;
			$child.eq(2).css("margin-left",padNum+"px");
			thisObj.updateWidth();
		},20);
	}
	
	this.$ele.css({"width": "auto", "height": "auto"});
	this.parentComp.$ele.css({"width":"auto", "height": "auto"});
};


//paging컴포넌트 가로길이 재정의
APagingItem.prototype.updateWidth = function()
{
	/*
	var thisw=0, children = this.getChildren();
	for(var i=0; i<children.length; i++)
	{
		if(i==0) children[i].$ele.css('margin-left', '0px'); 

		thisw += children[i].$ele.outerWidth(); //children[i].getWidth();
		thisw += children[i].$ele.css('margin-left').replace('px','')*1||0;
		thisw += children[i].$ele.css('margin-right').replace('px','')*1||0;
	}
	
	this.setWidth(thisw);
	this.parentComp.setWidth(thisw);	
	*/
};

//paging컴포넌트 가운데 처리함수
APagingItem.prototype.pagingCenter = function()
{
	/*
	if(this.isCenter)
	{
		//가운데처리
		var pagingPos = this.parentComp.getPos(),
			pagingW = this.parentComp.getWidth(),
			parentView = this.parentComp.parent,
			parentW = parentView.getWidth();
			pagingPos.left = Math.floor((parentW - pagingW)/2);

		this.parentComp.setPos(pagingPos);
	}
	*/
};


//페이지버튼 객체 생성
APagingItem.prototype.createPageButton = function(stl, txt, data)	//스타일헤드, 텍스트, 데이터(key/value)
{
	var defaultStyle, 
		signOverStyle, signDownStyle, signDisableStyle,
		numberOverStyle, numberDownStyle, numberDisableStyle,
		btn = new AButton();	
    btn.init();
    btn.setText(txt||"　");
	btn.setAttr('data-paging-kind',stl);
	
	if(!this.signOverStyle)
	{
		if(stl=="sign-left") signOverStyle = "sign sign-left-def-over";
		else if(stl=="sign-left2") signOverStyle = "sign sign-left2-def-over";
		else if(stl=="sign-right2") signOverStyle = "sign sign-right2-def-over";
		else  signOverStyle = "sign sign-right-def-over";
	}
	else signOverStyle = this.signOverStyle;

	if(!this.signDownStyle)
	{
		if(stl=="sign-left") signDownStyle	= "sign sign-left-def-down";
		else if(stl=="sign-left2") signDownStyle	= "sign sign-left2-def-down";
		else if(stl=="sign-right2") signDownStyle	= "sign sign-right2-def-down";
		else signDownStyle	= "sign sign-right-def-down";
	}
	else signDownStyle = this.signDownStyle;

	if(!this.signDisableStyle)
	{
		if(stl=="sign-left") signDisableStyle = "sign sign-left-def-disable";
		else if(stl=="sign-left2") signDisableStyle = "sign sign-left2-def-disable";
		else if(stl=="sign-right2") signDisableStyle = "sign sign-right2-def-disable";
		else signDisableStyle = "sign sign-right-def-disable";
	}
	else signDisableStyle = this.signDisableStyle;

	if(!this.numberOverStyle) 	numberOverStyle 	= "number number-def-over";
	else numberOverStyle = this.numberOverStyle;

	if(!this.numberDownStyle)	numberDownStyle 	= "number number-def-down";
	else numberDownStyle = this.numberDownStyle;

	if(!this.numberDisableStyle) numberDisableStyle	= "number number-def-disable";
	else numberDisableStyle = this.numberDisableStyle; 
	//if(!this.defaultStyle)		this.defaultStyle		= "page-def-style";

	if(!this.defaultStyle)
	{
		if(stl=="sign-left") defaultStyle = "sign sign-left-def-down";
		else if(stl=="sign-left2") defaultStyle = "sign sign-left2-def-down";
		else if(stl=="sign-right2") defaultStyle = "sign sign-right2-def-down";
		else if(stl=="sign-right") defaultStyle = "sign sign-right-def-down";
		else defaultStyle = "number number-def-down";
	}
	else defaultStyle = this.defaultStyle;
	//afc.log(this.defaultStyle);
	
	if(stl.indexOf("sign")>-1 && signOverStyle) btn.setBtnStyle(AButton.OVER, signOverStyle);
	if(stl.indexOf("sign")>-1 && signDownStyle) btn.setBtnStyle(AButton.DOWN, signDownStyle);
	if(stl.indexOf("sign")>-1 && signDisableStyle) btn.setBtnStyle(AButton.DISABLE, signDisableStyle);
	if(stl=="number" && numberOverStyle) btn.setBtnStyle(AButton.OVER, numberOverStyle);
	if(stl=="number" && numberDownStyle) btn.setBtnStyle(AButton.DOWN, numberDownStyle);
	if(stl=="number" && numberDisableStyle) btn.setBtnStyle(AButton.DISABLE, numberDisableStyle);	

	if(defaultStyle) btn.setDefStyle(defaultStyle);
	
	//if(this.fontSize) btn.$ele.css('font-size', this.fontSize);	
	//if(this.buttonWidth) btn.$ele.css('width', this.buttonWidth);	
	//else btn.$ele.css('width', '20px');	
	if(this.buttonDisabled) btn.$ele.attr('disabled', this.buttonDisabled);	
	if(this.buttonReadonly) btn.$ele.attr('readonly', this.buttonReadonly);	
    btn.setStyleObj({ width:'auto', height:'100%'});

	btn.changeBtnState(1);
	
    btn.addEventListener('click', this, 'onPageBtnClick');
	if(data) btn.oridata = this.parentComp.clone(data);
	
	this.addComponent(btn);
	
	/*setTimeout(function(b){
   		if(b.$ele.css("background-image")!='none'){
			b.setText("");
		}
	}, 1, btn);*/
	
	return btn;
};


//페이지뷰 세팅
APagingItem.prototype.setPageView = function()
{
	//페이징 초기화(remove)
	this.removeChildren();
	
	//전체카운트가 없다면..
	if(this.totalCount < 1)
	{
		this.updateWidth();
		this.pagingCenter();
		return;
	}

	var data = this.parentComp.clone(this.param);
	if(this.pageIdx < 1) this.pageIdx = 1;
	
	//1페이지임.
	if(this.totalCount < this.perPage)
	{
		data.pageIdx = 1;
		var btn = this.createPageButton("number", data.pageIdx, data);
		btn.enable(false); //선택버튼 스타일처리
		btn.changeBtnState(2);

		this.updateWidth();
		this.pagingCenter();		
		return;
	}
	
	var total_page	= Math.ceil(this.totalCount / this.perPage),
		total_block	= Math.ceil(total_page / this.block),
		blocks		= Math.ceil(this.pageIdx / this.block),
		first_page	= (blocks - 1) * this.block,
		last_page	= blocks * this.block,
		prev_page	= first_page,
		next_page	= last_page + 1,
		go_page		= first_page + 1;

	if(total_block <= blocks) last_page = total_page;

	if(blocks > 1)
	{
		//처음 START ===========================
		data.pageIdx = 1;
		this.createPageButton("sign-left2", "", data);
		//처음 END =============================

		//이전 START ===========================
		data.pageIdx = prev_page;	
		this.createPageButton("sign-left", "", data);
		//이전 END =============================
	}

	for(var i=go_page; i<=last_page; i++)
	{
		if(i == this.pageIdx)
		{
			data.pageIdx = i;
			var btn = this.createPageButton("number", this.pageIdx, data);
			btn.enable(false); //선택버튼 스타일처리
			btn.changeBtnState(2);
			
			if(i==go_page)
			{
				var $node = btn.$ele,
					prev = $node.prev().css('margin-left'),
					padNum = (prev)?prev.replace('px','')*1:0;

				$node.css("margin-left",padNum+"px");
			}
		}
		else
		{
			data.pageIdx = i;	
			var btn = this.createPageButton("number", i, data);
			
			if(i==go_page)
			{
				var $node = btn.$ele,
					prev = $node.prev().css('margin-left'),
					padNum = (prev)?prev.replace('px','')*1:0;

				$node.css("margin-left",padNum+"px");
			}			
		}
		
		if(i >= last_page) break; //page value over
	}
	
	if(blocks < total_block)
	{
		//다음 START ===========================
		data.pageIdx = next_page;		
		this.createPageButton("sign-right", "", data);
		//다음 END =============================

		//끝 START =============================
		data.pageIdx = total_page;		
		this.createPageButton("sign-right2", "", data);
		//끝 END ===============================
	}
	
	this.totalPage = total_page;
	
	this.updateWidth();
	this.pagingCenter();
};


//모든버튼 스타일 초기화
/*APagingItem.prototype.onInitStyleButton = function()
{
	var children = this.getChildren();
	for(var i=0; i<children.length; i++)
	{
		children[i].enable(true);
		children[i].changeBtnState(AButton.OVER);
		//acomp.overState();
	}
};*/


//페이지 버튼 클릭했을 경우.
APagingItem.prototype.onPageBtnClick = function(acomp, info)
{
	if(!this.delegator) return;
	
	this.pageIdx = acomp.oridata.pageIdx;
	
	//모든버튼 스타일 초기화
	//this.onInitStyleButton();
	
	if(this.delegator.pagingBindData)
		this.delegator.pagingBindData(this.component, acomp.oridata);
	
		
};

// 컴포넌트 내부에 드랍 가능여부 리턴
APagingItem.prototype.getDroppable = function()
{
	return false;
};








