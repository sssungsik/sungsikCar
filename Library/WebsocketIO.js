/**
 * @author asoocool
 */

WebsocketIO = class WebsocketIO extends NetworkIO
{
    static workerId = 0;
    constructor(listener, isSSL)
    {
        super(listener)

        this.workerId = 0;
        this.socket = null;
        this.protocols = undefined;
        this.isSSL = isSSL;
        this._pingDelay = null;
        this._isAlive = false;
    }
}


WebsocketIO.prototype.isStart = function()
{
	return (this.socket!=null);
};

WebsocketIO.prototype.setProtocols = function(protocols)
{
	this.protocols = protocols;
};

WebsocketIO.prototype.setHeartbeat = function(delay)
{
	this._pingDelay = delay;
	
	if(delay != null) this._setPingInterval();
	else this._clearPingInterval();
};

WebsocketIO.prototype._setPingInterval = function()
{
	if(this.isStart() && (this._pingDelay != null))
	{
		this._clearPingInterval();
		this.itvl = setInterval(() => {
			if(!this._isAlive)
			{
				this.stopIO(true);
				this.onClosed();
			}

			this._isAlive = false;
			this.socket.send('ping');

		}, this._pingDelay);
	}
};

WebsocketIO.prototype._clearPingInterval = function()
{
	if(this.itvl)
	{
		clearInterval(this.itvl);
		this.itvl = null;
	}
};

WebsocketIO.prototype.startIO = function(address, port)
{
	if(this.isStart()) return;
	
	var thisObj = this;
	
	this.selfClose = false;
	this.address = address;
	this.port = port;
	
	var scheme = 'ws://';
	
	if(this.isSSL) scheme = 'wss://';
	
	var url = scheme + address;
	if(port) url += ':' + port;
	
	var socket = new WebSocket(url, this.protocols);
	
	socket.binaryType = 'arraybuffer';
	
	//var listener = this.listener;//, abuf = new ABuffer(), buf = null;
    const workerId = ++WebsocketIO.workerId;
    this.workerId = workerId;
	
	socket.onopen = function(event) 
	{
        if(workerId != thisObj.workerId) return;

		thisObj.socket = socket;

		thisObj._isAlive = true;
		
		thisObj._onConnected(true);
		
		thisObj._setPingInterval();
	};	
	
	socket.onmessage = function(event) 
	{
        if(workerId != thisObj.workerId) return;

		if(event.data == 'pong') thisObj._isAlive = true;
		else thisObj.onReceived(event.data);
	};

	socket.onclose = function(event) 
	{
        if(workerId != thisObj.workerId) return;

		if(!thisObj._isAlive) return; //Alive 체크에 의해 닫힌 경우 자체 처리함
		
		if(afc.isIos && afc.iosVer < 11 && event.code == 1006)
		{
			if(!thisObj.isStart())
			{
				socket.isConnectFail = true;
				thisObj._onConnected(false);
			}
		}
		
		if(!socket.isConnectFail)
		{
			thisObj.stopIO(true);
			thisObj.onClosed();
		}
	};
	
	socket.onerror = function(event) 
	{
        if(workerId != thisObj.workerId) return;
		//console.log('onError');
	
		if(!thisObj.isStart())
		{
			socket.isConnectFail = true;
			thisObj._onConnected(false);
		}

	};
	
};

WebsocketIO.prototype.stopIO = function(isClosed)
{
	if(!this.isStart()) return;

	this.selfClose = !isClosed;
	
	this._clearPingInterval();
	
	this.socket.close();
	this.socket = null;
	this._isAlive = false;
};

//data is String, Blob, ArrayBuffer(Uint8Array)
WebsocketIO.prototype.sendData = function(data, callback)
{
	if(!this.isStart()) return;
	
	this.socket.send(data, callback);
};


