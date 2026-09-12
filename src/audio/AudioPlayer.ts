/** Queues 24 kHz PCM response chunks without gaps and permits barge-in. */
export class AudioPlayer { private context?:AudioContext; private nextTime=0; private nodes=new Set<AudioBufferSourceNode>();
 async init(){this.context??=new AudioContext({sampleRate:24000});await this.context.resume()}
 play(base64:string,onLevel:(value:number)=>void){if(!this.context)return;const raw=atob(base64),data=new Int16Array(raw.length/2);for(let i=0;i<data.length;i++)data[i]=((raw.charCodeAt(i*2)&255)|((raw.charCodeAt(i*2+1)&255)<<8));const buffer=this.context.createBuffer(1,data.length,24000),channel=buffer.getChannelData(0);for(let i=0;i<data.length;i++)channel[i]=data[i]/32768;
 const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;source.connect(gain).connect(this.context.destination);const start=Math.max(this.context.currentTime+.03,this.nextTime);source.start(start);this.nextTime=start+buffer.duration;this.nodes.add(source);source.onended=()=>{this.nodes.delete(source);if(!this.nodes.size)onLevel(0)};let max=0;for(const x of channel)max=Math.max(max,Math.abs(x));onLevel(max)}
 interrupt(){this.nodes.forEach(n=>{try{n.stop()}catch{}});this.nodes.clear();this.nextTime=this.context?.currentTime??0}
 close(){this.interrupt();this.context?.close();this.context=undefined}
}
