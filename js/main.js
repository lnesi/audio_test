

var audioContext = new AudioContext();

function init() {
	console.log("INIT");
	MainApp.init();	
}
//60,000 / 120 BPM = 500 ms
MainApp={
	stage:null,
	buffers:[],
	channels:[],
	duration:70.24566893424036*1000,
	bpm:123,
	loopBars:12,
	metricNumerator:4,
	isPlaying:false,
	clock:null,
	init:function(){
		window.addEventListener('resize', this.resize, false);
		this.stage = new createjs.Stage("stage");
		createjs.Ticker.addEventListener("tick",this.update);
		this.loadTaracks();
	},
	loadTaracks:function(){
		var queue = new createjs.LoadQueue();
		queue.installPlugin(createjs.Sound);
		queue.on("complete", this.loadComplete, this);
		queue.loadManifest("manifest.json");
	},
	loadComplete:function(e){
		this.buffers[0]=e.target.getResult('bass');
		this.buffers[1]=e.target.getResult('drums');
		this.buffers[2]=e.target.getResult('g1');
		this.buffers[3]=e.target.getResult('g2');
		this.buffers[4]=e.target.getResult('g3');
	},
	play:function(){
		if(!this.isPlaying){
			var self=this;
			$.each(this.buffers,function(i,v){
				self.channels[i]=self.createChannel(v);
			});
			quearterNote=60000/this.bpm;
			loopDuration=quearterNote*this.metricNumerator*this.loopBars;
			console.log("loopDuration",loopDuration);
			this.isPlaying=true;
			this.clock=setTimeout(this.loop,loopDuration);
		}

	},
	loop:function(){
		console.log("LOOP");
		MainApp.stop();
		MainApp.play();
	},
	stop:function(){
		clearTimeout(this.clock);
		$.each(this.channels,function(i,v){
			v.stop(0);
		});
		this.isPlaying=false;
	},
	createChannel:function(buffer){
		var source = audioContext.createBufferSource();
		source.buffer=buffer;
		source.connect(audioContext.destination);
		source.start(0);
		return source;
		
	},
	update:function(){
		MainApp.stage.update();
	},
	resize:function(){
		if(MainApp.stage.canvas){
			MainApp.stage.canvas.width = window.innerWidth;
			MainApp.stage.canvas.height = window.innerHeight;	
		}
		
	}

}