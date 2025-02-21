
class AVideo extends AComponent
{
	constructor()
	{
		super()
	
	}

	
	
}

window.AVideo = AVideo

AVideo.CONTEXT = 
{
	//	실제로 구현하고자 하는 컴포넌트의 태그로 변경하십시요.
	tag:'<video data-base="AVideo" data-class="AVideo" class="AVideo-Style" autoplay></video>',

    defStyle: 
    {
    	width:'200px', height:'100px' 
    },
   
    events: ['load']
};

AVideo.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);


};

AVideo.prototype.setSource = function(url)
{
	var ele = this.element;
	if(!ele) return;
	
	if(ele.dm) url = ele.dm.mask(url);
	
	if(url)
	{
		this.setAttr('src', url);
	}
	else
	{		
		this.removeAttr('src');
	}
};

AVideo.prototype.getSource = function()
{
	if(this.element.dm) return this.element.dm.unmask();
	else return this.getAttr('src');
};

AVideo.prototype.setData = function(data)
{
	this.setSource(data);
};

AVideo.prototype.getData = function()
{
	return this.getSource();
};

