
class ACanvas extends AComponent
{
	constructor()
	{
		super()
	
		this.ctx = null;

		//this.data = new Array();
		this.data = null;
	}
	
}

window.ACanvas = ACanvas

ACanvas.CONTEXT = 
{
    tag: '<canvas data-base="ACanvas" data-class="ACanvas" class="ACanvas-Style"></canvas>',

    defStyle: 
    {
        width:'200px', height:'200px'
    },

    events: []
};


ACanvas.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this.ctx = this.element.getContext('2d');
	
	this.actionToFocusComp();
};

ACanvas.prototype.updatePosition = function(pWidth, pHeight)
{
    AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	this.resizeCanvas();
	
	if(this.onUpdateCanvas) this.onUpdateCanvas();
};

ACanvas.prototype.setData = function(data)
{
    this.data = data;
};

ACanvas.prototype.getData = function()
{
	return this.data;
};

//	사이즈가 바뀌면 context 정보가 초기화되므로 다시 셋팅한다.
//	updatePosition 시점에 자동으로 호출된다.
ACanvas.prototype.resetContextState = function()
{
	
};


ACanvas.prototype.resizeCanvas = function()
{
	var w = this.getWidth();
	var h = this.getHeight();
	
	//this.$ele.attr('width', w+'px');
	//this.$ele.attr('height', h+'px');
	
	this.element.width = w;
	this.element.height = h;
	
	this.resetContextState();
};

ACanvas.prototype.disableAnti = function(w, h)
{
	//-----------------------------------------------------------------
	//	disable blur, anti
	//	모바일 환경에서는 
	//	캔버스 사이즈를 크게 하고 스케일 적용해 축소해야 
	//	안티 효과 없이 깨끗하게 그려진다.
	
	var scale = window.devicePixelRatio;
	
	this.element.style.width = w + "px";
	this.element.style.height = h + "px";

	this.element.width = w * scale;
	this.element.height = h * scale;

	this.ctx.scale(scale, scale);
	
	//disable line anti
	if(afc.isPC)
	{
		this.ctx.translate(0.5, 0.5);
		//this.ctx.lineWidth *= 0.5;
	}
	
	//-----------------------------------------------------------------	

};


