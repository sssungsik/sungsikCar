               
/**
 * @author asoocool
 */


class AImage extends AComponent
{
	constructor()
	{
		super()
	
	}

	
	
}

window.AImage = AImage


AImage.CONTEXT = 
{
    //tag: '<span data-base="AImage" data-class="AImage" class="AImage-Style"></span>',
	tag: '<img data-base="AImage" data-class="AImage" class="AImage-Style aimage-blank">',
    
    defStyle: 
    {
        width:'170px', height:'120px' 
    },

    events: ['load']
};

AImage.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	/*
	this.$ele.mousedown(function()
	{
		return false;
	});
	*/
	
	this.$ele.on('dragstart', function(e) 
	{ 
		e.preventDefault(); 
	});
};

AImage.prototype.setImage = function(url)
{
	var ele = this.element;
	if(!ele) return;
	
	if(ele.dm) url = ele.dm.mask(url);
	
	if(url)
	{
		this.setAttr('src', url);
		this.removeClass('aimage-blank');
	}
	else
	{		
		this.removeAttr('src');
		this.addClass('aimage-blank');
	}
};

AImage.prototype.getImage = function()
{
	if(this.element.dm) return this.element.dm.unmask();
	else return this.getAttr('src');

	//return this.getStyle('background-image');
};

AImage.prototype.setData = function(data)
{
	this.setImage(data);
};

AImage.prototype.getData = function()
{
	return this.getImage();
};

AImage.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length == 0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getImage();
};

AImage.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(dataArr.length==0) return;
	
	//리얼컴포넌트로 등록되면 
	//리얼데이터 수신 시 매핑되지 않은 데이터도 들어온다.	
	var value = dataArr[0][keyArr[0]];
	if(value==undefined) return;
	
	this.setImage(value);
};

AImage.prototype.setMaskValue = AImage.prototype.setImage;

