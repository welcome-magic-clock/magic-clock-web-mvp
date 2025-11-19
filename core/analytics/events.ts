
export function track(event:string, payload:any={}){
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mc-analytics', { detail:{ event, payload }}));
    console.log("[analytics]", event, payload);
  }
}
