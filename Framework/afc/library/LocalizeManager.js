/*
	로컬라이즈 특정언어에서 테스트가 필요할때 방법
	theApp에서 ready된후에
	LocalizeManager.LANGUAGE 에 언어를 지정해준다. en, ko, zh 등등
	!!주의 : 첫 페이지를 로드하기 전에 해야함.
*/

var LocalizeManager = {};

LocalizeManager.loadMap = function()
{
	LocalizeManager.resMap = AUtil.readTextFile('Resource/LocalizeInfo.json');
};

if(PROJECT_OPTION.general.localizing)
{
	LocalizeManager.loadMap();
}


LocalizeManager.isExistFile = function(url, lang)
{
	if(LocalizeManager.resMap && LocalizeManager.resMap[lang])
	{
		return LocalizeManager.resMap[lang][url] || LocalizeManager.resMap[lang][LocalizeManager.FLAVOR][url];
	}
};

LocalizeManager.getFlavor = function()
{
	return PROJECT_OPTION.general.flavor;
};

LocalizeManager.setFlavor = function(flavor)
{
	LocalizeManager.FLAVOR = flavor || PROJECT_OPTION.general.flavor;
	
	//변경시 화면 전부 변경처리
	document.querySelectorAll('[data-localizing-key]').forEach(ele => {
		if(!ele.acomp || !ele.acomp.setText) return;
		ele.acomp.setText(LocalizeManager.getLocalizedStr(ele.getAttribute('data-localizing-key')));
	});
};

LocalizeManager.getLanguage = function()
{	
	var langStr;
	//ie11
	if(afc.isIE && afc.strIEVer == "msie") langStr = navigator.browserLanguage;
	else langStr = navigator.language;
	
	if(langStr) return langStr.split('-')[0];
	else return PROJECT_OPTION.general.language || 'en';
};

LocalizeManager.LANGUAGE = LocalizeManager.getLanguage();
LocalizeManager.FLAVOR = LocalizeManager.getFlavor();

LocalizeManager.conversionText = function(key, callback)
{
	//if(PROJECT_OPTION.general.localizing)
	{
		LocalizeManager.getLocalizedStr(key, callback);
	}
};

LocalizeManager.getLocalizedStr = function(key, callback)
{
	var ret, arr = LocalizeManager.DATA_ARRAY,
		flavor = LocalizeManager.FLAVOR;
	if(!arr)// || LocalizeManager.DATA_ARRAY[0] != LocalizeManager.LANGUAGE)
	{
		arr = LocalizeManager.DATA_ARRAY = [];
		const lang = PROJECT_OPTION.general.localizing?LocalizeManager.LANGUAGE:'common';
		arr.push(lang);
		var resData = AUtil.readTextFile('Resource/'+lang+'.json');
		if(resData)
		{
			var obj = resData[flavor];
			if(!obj) { 
				obj = {};
				obj[flavor] = resData;
				resData = obj;
			}
			arr.push(resData);
		}
		else
		{
			//arr.push({});
		}
	}
	
	if(arr[1]) ret = arr[1][flavor][key];
	else ret = null;
	
	if(callback) callback(ret);
	return ret;
};

String.prototype.localize = function()
{
	if(!window.LocalizeManager) return this;
	return LocalizeManager.getLocalizedStr(this);
};
