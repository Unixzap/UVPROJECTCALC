(async function(){
  try{
    window.__UVPC_INITIAL_STATE__=await window.UVPCStorage.getState();
    const script=document.createElement('script');script.src='app.js?build=1059';script.onload=()=>window.dispatchEvent(new Event('uvpc-storage-ready'));document.body.appendChild(script);
  }catch(error){
    console.error('Local database startup failed',error);
    window.__UVPC_INITIAL_STATE__=null;
    const script=document.createElement('script');script.src='app.js?build=1059';document.body.appendChild(script);
  }
  if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./service-worker.js').catch(console.warn);
})();
