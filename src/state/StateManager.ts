export type AM TECHState = 'disconnected' | 'connecting' | 'listening' | 'speaking';
type Listener=(state:AM TECHState)=>void;
export class StateManager { private value:AM TECHState='disconnected'; private listeners=new Set<Listener>();
 get state(){return this.value} set(next:AM TECHState){this.value=next;this.listeners.forEach(fn=>fn(next))} subscribe(fn:Listener){this.listeners.add(fn);return()=>this.listeners.delete(fn)} }
