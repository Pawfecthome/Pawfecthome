// Public Pawfecthome catalogue feed.
// This is a public feed address, never an eBay key or admin credential.
const CATALOGUE_URL='https://pawfecthome-catalogue.alex-52d.workers.dev/api/products';
const products=[];
(async()=>{
 try{
  if(CATALOGUE_URL.includes('REPLACE-WITH'))throw Error('The catalogue connection has not been configured yet.');
  const response=await fetch(CATALOGUE_URL,{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('The catalogue is temporarily unavailable. Please try again shortly.');
  const data=await response.json();
  if(data.schemaVersion!==1||!Array.isArray(data.products)||!Number.isFinite(Date.parse(data.updatedAt)))throw Error('The catalogue response is invalid.');
  if(Date.now()-Date.parse(data.updatedAt)>6*3600000)throw Error('The catalogue update is delayed. Please check eBay for current details.');
  products.push(...data.products.filter(p=>p&&typeof p.id==='string'&&/^\d+$/.test(p.id)&&typeof p.title==='string'&&typeof p.price==='string'&&typeof p.sku==='string'&&p.stock>0));
  window.PAWFECTHOME_CATALOGUE_STATE={updatedAt:data.updatedAt};
 }catch(e){window.PAWFECTHOME_CATALOGUE_STATE={error:e.message||'Unable to load products.'};}
 window.dispatchEvent(new Event('catalogue:ready'));
})();
