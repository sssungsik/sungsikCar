


class ALabel extends AComponent
{
	constructor()
	{
		super()
	
	}

	
}

window.ALabel = ALabel

ALabel.CONTEXT = 
{
    tag:'<label data-base="ALabel" data-class="ALabel" class="ALabel-Style">Label</label>',
	
    defStyle: { width:'auto', height:'auto' },
	
    events: ['click', 'longtab']
};

ALabel.NAME = "ALabel";

ALabel.prototype.beforeInit = function()
{
	//init 이후에 처리하게 되면 Localizing 처리가 pre 아닌 상태로 되므로 beforeInit으로 위치 변경
	//asoocool 20180419
	this.isPre = this.getAttr('data-pre');
};

ALabel.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
};

ALabel.prototype.setHtml = function(html)
{
	if(!this.element) return;
	
	this.$ele.html(html);
};

ALabel.prototype.setText = function(text)
{
	if(!this.isValid()) return;
	
	var ele = this.element;
	
	if(ele.dm) text = ele.dm.mask(text);
	
	//asoocool 20180419
	if(this.isPre) this.$ele.html('<pre>'+text+'</pre>');
	else this.$ele.text(text);
	
	if(ele.shrinkInfo) AUtil.autoShrink(ele, ele.shrinkInfo);
};

ALabel.prototype.getText = function()
{
	if(this.element.dm) return this.element.dm.unmask();
	
	return this.$ele.text();
};

ALabel.prototype.setTextAlign = function(align)
{
	this.$ele.css('text-align', align);
};

ALabel.prototype.setData = function(data)
{
	this.setText(data);
};

ALabel.prototype.getData = function()
{
	return this.getText();
};

ALabel.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length == 0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
};

ALabel.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(dataArr.length==0) return;
	
	//리얼컴포넌트로 등록되면 
	//리얼데이터 수신 시 매핑되지 않은 데이터도 들어온다.	
	var value = dataArr[0][keyArr[0]];
	if(value==undefined) return;
	
	this.setText(value);
};

ALabel.prototype.setMaskValue = ALabel.prototype.setText;

