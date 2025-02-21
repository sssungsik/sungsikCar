
/**
Constructor
Do not call Function in Constructor.
*/
class AFileUploaderItem extends AView
{
    constructor()
    {
        super()

        this.winURL		= window.URL || window.webkitURL;
        
        //this.baseView	= null;
        this.fileTfd	= null;		//보여지는 파일명 객체 텍스트필드
        this.findBtn	= null;		//파일찾기 버튼객체
        //this.deleteBtn	= null;		//삭제 버튼객체
        
        this.infoView	= null;	//파일수/사이즈 정보 뷰객체
        
        this.upload_url	= null;
        this.acceptTypeArr = [
            ['Direct input', ''],
            ['All Files', '*.*'],	
            ['Image Files', 'image/*'],
            ['Text Files', 'text/plain'],
            ['Html Files', 'text/html']
        ];
        this.multiple = false;	//다중첨부 여부
        this.accept = '';	//파일 종류
        this.dragdrop = false;	//첨부파일 드래그앤드랍 사용여부
        this.sendSize = 0;	//전송파일 총 용량(사이즈)

        this.filesInfo = null; //선택한 파일 정보
    }

}

window.AFileUploaderItem = AFileUploaderItem

AFileUploaderItem.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	AFileUploaderItem.thisObj = this;
	
	this.setHeight("100%");
	
	var children = this.getChildren();
	
	this.fileTfd = children[0];
	this.findBtn = children[1];

	this.fileTfd.setStyleObj({
		"padding-left":"5px"
	});
	
	this.findBtn.addEventListener('click', this, 'onFindBtnClick');

};


//초기화
AFileUploaderItem.prototype.removeAll = function()
{
	var fileObj = this.$ele.find('input[type=file]');

	for(var i=fileObj.length-1; i>=0; i--)
	{
		//fileObj[i].remove();	//익스(test:익스10)에서 에러가 발생함.
		//or
		fileChild = document.getElementById(fileObj[i].id);
		this.element.removeChild(fileChild);
	}

	this.sendSize = 0;
    this.filesInfo = null;
    this.fileTfd.reset();
};


AFileUploaderItem.prototype.formatBytes = function(a, b)
{
	if(0==a) return "0 bytes";
	var c=1024, 
		d=b||0, 
		e=["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		f=Math.floor(Math.log(a)/Math.log(c));
		
	return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f];
};


//파일 찾기 클릭시...
AFileUploaderItem.prototype.onFindBtnClick = function(acomp, info)
{
	var compReadonly = acomp.$ele.attr("readonly"),
		compDisabled = acomp.$ele.attr("disabled");
	if(compReadonly || compDisabled) return;

	var thisObj = this, 
		onInputFileChange = function(){
			//afc.log(this.files.length);

			for(var i=0; i<this.files.length; i++)
			{
				var fileTxt = [ this.files[i].name, " (", thisObj.formatBytes(this.files[i].size, 0),")" ].join("");

				thisObj.fileTfd.setText(fileTxt);
				thisObj.sendSize += this.files[i].size;
			}

            thisObj.filesInfo = this.files;
		};
		
	//파일 INPUT TAG 삭제
	this.removeAll();
	
	//초기화
	this.accept = this.$ele.parent().parent().attr('data-accept-type');
	if(this.accept=="direct") this.accept = "";

	var inputFile = document.createElement("INPUT");
	inputFile.id = new Date().getTime();	//timestamp
	inputFile.setAttribute("type","file");
	if(this.multiple) inputFile.setAttribute("multiple","");	
	inputFile.setAttribute("accept", this.accept);
	inputFile.setAttribute("style","display:none;");
	inputFile.addEventListener('change', onInputFileChange, false);

	this.$ele.prepend(inputFile);
	
	inputFile.click();
	
	return false;
};

AFileUploaderItem.prototype.onInputFileChange = function(files)
{
	var formatBytes = function(a, b){	//bytes, decimals
		if(0==a) return "0 bytes";
		var c=1024, 
			d=b||0, 
			e=["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
			f=Math.floor(Math.log(a)/Math.log(c));
			
		return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f];
	};
	
	for(var i=0; i<files.length; i++)
	{
		//console.log(files);
		/*
		files[i].name,
		files[i].size,
		files[i].type
		*/
		
		var fileTxt = [ files[i].name, " (", formatBytes(files[i].size, 0),")" ].join("");
		this.fileTfd.setText(fileTxt);
		this.sendSize += files[i].size;
	}

    this.filesInfo = files;

};


//업로드 URL 가져오기
AFileUploaderItem.prototype.getUrl = function()
{
	return this.$ele.parent().parent().attr('data-upload-url');
};

//파일타입 종류 가져오기
AFileUploaderItem.prototype.getAllAcceptType = function()
{
	return this.acceptTypeArr;
};


//파일찾기 타입 선택
AFileUploaderItem.prototype.setAccept = function(type)
{
	this.accept = type;
	this.$ele.parent().parent().attr('data-accept-type', type);
};


//다중첨부 여부 [true|false]
AFileUploaderItem.prototype.setMultiple = function(bln)
{
	this.multiple = bln;
};


//드래그드랍 여부 [true|false]
AFileUploaderItem.prototype.setDragdrop = function(bln)
{
	this.dragdrop = bln;
};



//전송 여부
AFileUploaderItem.prototype.getSize = function()
{
	return this.sendSize;
};


AFileUploaderItem.prototype.getFilesInfo = function()
{
	return this.filesInfo;
};



//전송
//<textarea data-type="application/json">success</textarea>
AFileUploaderItem.prototype.send = function(data, callback)
{
	this.upload_url = this.getUrl();
	
	if(!this.upload_url) 
	{
		if(callback) callback({ result: false, message: "업로드할 주소가 없습니다." });
		return false;
	}

	var regex = /(http(s?))\:\/\//gi;
	if(!regex.test(this.upload_url))
	{
		if(callback) callback({ result: false, message: "http(s):// 프로토콜을 추가하여 주세요." });
		return false;
	}
	
	if(!window.FormData || afc.isIos) this.iframeSend(data, callback); 
	else this.formdataSend(data, callback);
};


//formData 파일전송
AFileUploaderItem.prototype.formdataSend = function(data, callback)
{
	var formData = new FormData();	//폼객체 생성
	
	if(data)
	{
		for(var key in data) formData.append(key, data[key]);
	}
	
	var fileObj = this.$ele.find('input[type=file]');
	for(var i=0; i<fileObj.length; i++)
	{
		for(var j=0; j<fileObj[i].files.length; j++) 
		{
			formData.append("uploadFile", fileObj[i].files[j]);
		}
	}
	
	$.support.cors = true;	
	$.ajax({
		url:this.upload_url,
		cache:false,
		crossDomain : true,
		timeout : 30*1000,
		xhrFields: 
		{
			withCredentials: true
		},
		type: "POST",
		data:formData,
		async: true,	//false:동기, true:비동기
		xhr: function(){
			var myXhr = $.ajaxSettings.xhr();
            myXhr.upload.onprogress = function (e)
			{
				//For uploads
				if(e.lengthComputable) {
					if(callback) callback({ result: "progress", message: (e.loaded / e.total *100|0)+"%" });
				}
            };
			return myXhr;
        },
	
		contentType: false,	//파일업로드일 경우 사용
		processData: false,	//파일업로드일 경우 사용  

		success:function(data){
			if(callback) callback({ result: "success", message: data });
        },

		/*complete : function(jqXHR, textStatus)
		{
			if(callback) callback({ result: "complete" });
		},*/
		
        error: function(error){
			if(callback) callback({ result: false, message: error.statusText });
        }
	});
};

//iframe 파일전송
AFileUploaderItem.prototype.iframeSend = function(data, callback)
{
	var markers,
		fileObj = this.$ele.find('input[type=file]'),
		key = $.now(),
		formName = 'frm_'+key,
		iframeName = 'ifrm_'+key,
		formObj = $("<form id='"+formName+"' enctype='multipart/form-data' method='post'></form>").hide().attr({action: this.upload_url, target: iframeName}),
		iframeObj = $("<iframe src='about:blank' name='" + iframeName + "' id='" + iframeName + "' style='display:none'></iframe>");

	for(var i=0; i<fileObj.length; i++) fileObj[i].setAttribute("name", "uploadFile");

	$.each(data || {}, function(name, value) {
		if ($.isPlainObject(value)) {
			name = value.name;
			value = value.value;
		}
		$("<input type='hidden' />").attr({name:  name, value: value}).
		appendTo(formObj);
	});

	markers = fileObj.after(function(idx) {
		var $this = $(this),
			$clone = $this.clone().prop("disabled", true);
		$this.data("clone", $clone);
		return $clone;
	}).next();
	fileObj.appendTo(formObj);

	$("body").append(formObj, iframeObj);

	iframeObj.one("load", function() {
		var doc = this.contentWindow ? this.contentWindow.document :
		(this.contentDocument ? this.contentDocument : this.document),
			root = doc.documentElement ? doc.documentElement : doc.body,
			textarea = root.getElementsByTagName("textarea")[0],
			type = textarea && textarea.getAttribute("data-type") || null,
			result = type?$.trim(textarea.value):root?$.trim((root.textContent || root.innerText)) : null,
			content = {
				result: "success",
				message: (typeof(result)=="string")?JSON.parse($.url.decode(result)):(typeof(result)=="object")?result:{}
			};


		fileObj.each(function(i, file){
			var $file = $(file);
			$file.data("clone").replaceWith($file);
		});
		formObj.remove();
		iframeObj.one("load", function() { iframeObj.remove(); });
		iframeObj.attr("src", "about:blank");

		callback(content);
	});

	formObj[0].submit();
};




