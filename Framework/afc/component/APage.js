                 
/**
 * @author asoocool
 */

//	APage 는 부모컨테이너 밑의 풀화면으로 추가될 수 있다.
//	싱글페이지만 사용할 경우 open() 함수를 호출하면 된다.
//	네비게이션 기능을 이용할 경우 ANavigator 객체와 같이 사용해야 한다.
class APage extends AContainer
{
	constructor(containerId)
	{
		super(containerId)
		
		this.navigator = null;
		this.pageData = null;	//deprecated
	}

	

	
}

window.APage = APage

APage.prototype.init = function(context)
{
	this.setOption(
	{
		isOneshot: false,			//활성화시 로드되고 비활성화시 바로 삭제한다. true 이면 매번 새로 로드된다.
		
	}, true);

	//	no overwrite 가 true 이기 때문에 
	//	부모의 옵션보다 우선 하려면 init 위에 두어야 한다.
	//------------------------------------------------------------

	AContainer.prototype.init.call(this, context);

	//afc.log('APage init');
};

APage.prototype.open = function(viewUrl, parent)
{
	return AContainer.prototype.open.call(this, viewUrl, parent, 0, 0, '100%', '100%');
};

APage.prototype.getNavigator = function()
{
	return this.navigator;
};

//deprecated, instead use getData
APage.prototype.getPageData = function()
{
	return this.pageData;
};

APage.prototype.onBackKey = function()
{
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(false);
        return true;
    }
    
	return false;
};
