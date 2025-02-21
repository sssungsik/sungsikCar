               

class AProgress extends AComponent
{
	constructor()
	{
		super()
	
		this.value = 0;
		this.bar = null;
	}

	

}

window.AProgress = AProgress

AProgress.CONTEXT = 
{
    tag: '<div data-base="AProgress" data-class="AProgress" class="AProgress-Style"><div></div></div>',

    defStyle: 
    {
        width:'200px', height:'20px' 
    },

    events: []
};


AProgress.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.bar = this.$ele.children();
	this.setValue(0);
};

AProgress.prototype.setValue = function(value)
{
	var prgWidth = this.getWidth();
	value = parseInt(prgWidth*(value/100), 10);
	
	if(value>prgWidth) value = prgWidth;
	else if(value<0) value = 0;
	
	this.bar.css('width', value + 'px');
	this.value = value;
};

AProgress.prototype.getValue = function()
{
	return this.value;
};

AProgress.prototype.setData = function(data)
{
	this.setValue(data);
};

AProgress.prototype.getData = function()
{
	return this.getValue();
};

AProgress.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getValue();
};

AProgress.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.setValue(value);
};
