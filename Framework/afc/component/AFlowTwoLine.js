
/**
	JH
 */
 
AFlowTwoLine = class AFlowTwoLine extends AComponent
{
	constructor()
	{
		super();
		
	}
}

AFlowTwoLine.CONTEXT = 
{
    tag: '<svg data-base="AFlowTwoLine" data-bending-value="100" data-class="AFlowTwoLine" data-direct="0" data-arrow-position="start" data-linecolor="black" class="AFlowTwoLine-Style">'+
		 	'<defs>'+
				'<marker id="arrowStart" markerWidth="8" markerHeight="10" refX="0" refY="5" orient="auto">'+
		 			'<path d="M8,0 L0,5 L8,10" stroke-width="1" stroke="black" fill="none"/>'+
		 		'</marker>'+
		 		'<marker id="arrowEnd" markerWidth="8" markerHeight="10" refX="8" refY="5" orient="auto">'+
		 			'<path d="M0,0 L8,5 L0,10" stroke-width="1" stroke="black" fill="none"/>'+
		 		'</marker>'+
			'</defs>'+
		 	'<path id="mainPath" d="M0 0 L0 200 L150 200" stroke-width="1" stroke="black" fill="none"></path></svg>',

    defStyle: 
    {
        width:'150px', height:'200px', overflow:'visible'
    },

    events: []
};

AFlowTwoLine.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this._getPathEle();
	this.setLineColor(this.getAttr('data-linecolor'));
	this.setArrowPosition(this.getAttr('data-arrow-position'));
	
};

AFlowTwoLine.prototype._getPathEle = function()
{
	var d = new Date();
	this.timeCode = d.getTime()%1000000;
	
	this.pathEle = this.element.getElementsByTagName('path').mainPath;
	
	var marker = this.element.getElementsByTagName('marker');
	
	marker[0].setAttribute('id', 'arrowStart'+this.timeCode);
	marker[1].setAttribute('id', 'arrowEnd'+this.timeCode);
};

AFlowTwoLine.prototype.resizePath = function()
{
	this.drawPath();
};

AFlowTwoLine.prototype.drawPath = function()
{
	var width = parseFloat(this.$ele.css('width'));
	var height = parseFloat(this.$ele.css('height'));
	
	var bending = this.getAttr('data-bending-value')/100;
	
	var str;
	if(this.getAttr('data-direct') == "0")
	{
		if(bending == 1) str = "M0 0 L0 "+(height*bending)+" L"+width+" "+(height*bending);
		else if(bending == 0) str = "M0 0 L"+width+" "+(height*bending)+" L"+width+" "+height;
		else str = "M0 0 L0 "+(height*bending)+" L"+width+" "+(height*bending)+" L"+width+" "+height;
	}
	else if(this.getAttr('data-direct') == "90")
	{
		if(bending == 1) str = "M"+width+" 0 L"+width*(1-bending)+" 0 L"+width*(1-bending)+" "+height;
		else if(bending == 0) str = "M"+width+" 0 L"+width*(1-bending)+" "+height+" L0 "+height;
		else str = "M"+width+" 0 L"+width*(1-bending)+" 0 L"+width*(1-bending)+" "+height+" L0 "+height;
	}
	else if(this.getAttr('data-direct') == "180")
	{
		if(bending == 1) str = "M0 0 L"+(width*bending)+" 0 L"+(width*bending)+" "+height;
		else if(bending == 0) str = "M0 0 L"+(width*bending)+" "+height+" L"+width+" "+height;
		else str = "M0 0 L"+(width*bending)+" 0 L"+(width*bending)+" "+height+" L"+width+" "+height;
	}
	else if(this.getAttr('data-direct') == "270")
	{
		if(bending == 1) str = "M"+width+" 0 L"+width+" "+(height*bending)+" L0 "+(height*bending);
		else if(bending == 0) str = "M"+width+" 0 L0 "+(height*bending)+" L0 "+height;
		else str = "M"+width+" 0 L"+width+" "+(height*bending)+" L0 "+(height*bending)+" L0 "+height;
	}
	
	if(str) this.pathEle.setAttribute('d', str);
};

AFlowTwoLine.prototype.setArrow = function(info)
{
	if(info)
	{
		if(this.getAttr('data-arrow-position') == "start") this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
		else if(this.getAttr('data-arrow-position') == "end") this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
		else if(this.getAttr('data-arrow-position') == "both") 
		{
			this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
			this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
		}
	}
	else
	{
		this.pathEle.removeAttribute('marker-start');
		this.pathEle.removeAttribute('marker-end');
	}
};

AFlowTwoLine.prototype.setArrowPosition = function(info)
{
	if(!this.getAttr('data-arrow')) return;
	
	if(info == "start")
	{
		this.pathEle.removeAttribute('marker-end');
		this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
	}
	else if(info == "end")
	{
		this.pathEle.removeAttribute('marker-start');
		this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
	}
	else if(info == "both")
	{
		this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
		this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
	}
	
};

AFlowTwoLine.prototype.setLineColor = function(color)
{
	var path = this.element.getElementsByTagName('path');
	for(var i=0;i<path.length;i++)
	{
		path[i].setAttribute('stroke', color);
	}
};

AFlowTwoLine.prototype.setStrokeWidth = function(value)
{
	this.pathEle.setAttribute('stroke-width', value);
};

AFlowTwoLine.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	this.resizePath();
};
