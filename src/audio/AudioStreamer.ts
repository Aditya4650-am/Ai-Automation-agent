/** Captures mono PCM16 at 16 kHz for Gemini Live. */
export class AudioStreamer {
 private context?:AudioContext; private source?:MediaStreamAudioSourceNode; private processor?:ScriptProcessorNode; private stream?:MediaStream;
 async start(onPCM:(base64:string)=>void, onLevel:(level:number)=>void) {
  this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  this.context=new AudioContext(); await this.context.resume();
  this.source=this.context.createMediaStreamSource(this.stream); this.processor=this.context.createScriptProcessor(2048,1,1);
  this.processor.onaudioprocess=(event)=>{const input=event.inputBuffer.getChannelData(0);let peak=0; for(const x of input)peak=Math.max(peak,Math.abs(x)); onLevel(peak);
   const ratio=this.context!.sampleRate/16000, len=Math.floor(input.length/ratio), pcm=new Int16Array(len);
   for(let i=0;i<len;i++){const s=Math.max(-1,Math.min(1,input[Math.floor(i*ratio)]));pcm[i]=s<0?s*0x8000:s*0x7fff}
   const bytes=new Uint8Array(pcm.buffer); let raw=''; for(let i=0;i<bytes.length;i++)raw+=String.fromCharCode(bytes[i]);onPCM(btoa(raw));
  }; this.source.connect(this.processor);this.processor.connect(this.context.destination);
 }
 stop(){this.processor?.disconnect();this.source?.disconnect();this.stream?.getTracks().forEach(t=>t.stop());this.context?.close();this.processor=undefined;}
}
