// Website summaries are separate from eBay prices, stock and images.
const websiteSummaries = {
  'TOY-PLU-HOP-HARE': 'A long, floppy hare for dogs who enjoy carrying, shaking and cuddling their toys. Made with soft tweed, corduroy and faux sheepskin, with a squeaker inside.\n\n• Approximately 76cm long\n• Best for gentle play and cuddling\n• Pawfecthome toughness rating: 2/5\n\nSupervise play and replace the toy if damaged. Not suitable for heavy chewing.'
};
const productDetailStyle = document.createElement('style');
productDetailStyle.textContent = `#detail-description{white-space:pre-line;line-height:1.75;overflow-wrap:anywhere;font-size:1rem}.detail-copy{min-width:0}.detail-copy h2{font-size:clamp(1.65rem,3vw,2.1rem);line-height:1.2;overflow-wrap:anywhere}.detail.open{align-items:start}.detail-panel{margin-block:auto}.detail-panel>img{height:auto;max-height:520px;align-self:start}@media(max-width:700px){.detail-panel>img{height:250px;min-height:0}.detail-copy{padding:28px 24px}}`;
document.head.appendChild(productDetailStyle);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeImage=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:''}catch{return ''}};
const safeEbay=value=>{try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='www.ebay.co.uk'&&/^\/itm\/\d+$/.test(u.pathname)?u.href:''}catch{return ''}};
    const skuCategories={
      'WAL-LEAD':['Walking','Leads'],'WAL-COL':['Walking','Collars'],'WAL-HAR':['Walking','Harnesses'],
      'TOY-PLU':['Toys','Plush'],'TOY-RUB':['Toys','Rubber'],'TOY-ROP':['Toys','Rope & Tug'],'TOY-FET':['Toys','Fetch'],'TOY-PUP':['Toys','Puppy'],
      'BED-CUS':['Beds','Cushions'],'BED-MAT':['Beds','Mats'],'BED-BED':['Beds','Beds'],'BED-COV':['Beds','Covers'],
      'CLO-COA':['Clothing','Coats'],'CLO-JUM':['Clothing','Jumpers'],'FED-BOW':['Feeding','Bowls'],'FED-DSP':['Feeding','Feeders'],
      'CLN-SHA':['Grooming','Shampoo'],'CLN-GRM':['Grooming','Grooming']
    };
    function classifySku(sku){const parts=String(sku||'').trim().toUpperCase().split('-');const category=skuCategories[parts.slice(0,2).join('-')]||(parts[0]==='GFT'?['Gifts']:['Other']);return {type:category.join(' · '),brand:({HOP:'House of Paws',GOR:'Gor Pets',KNG:'KONG',DBN:'Doodlebone',PWH:'Pawfecthome'})[parts[2]]||''};}
    products.forEach(product=>Object.assign(product,classifySku(product.sku)));
    let selected='All';const grid=document.getElementById('products');const detail=document.getElementById('detail');
    function render(){const q=document.getElementById('search').value.toLowerCase().trim();const matches=products.filter(p=>(selected==='All'||p.type.startsWith(selected))&&(`${p.title} ${p.type} ${p.sku}`).toLowerCase().includes(q));grid.innerHTML=matches.length?matches.map(p=>`<article class="card"><a class="card-image" href="?product=${encodeURIComponent(p.id)}" data-open="${escapeHTML(p.id)}" aria-label="View ${escapeHTML(p.title)}"><img loading="lazy" src="${escapeHTML(safeImage(p.image))}" alt="${escapeHTML(p.title)}" onerror="this.style.visibility='hidden'"></a><div class="card-body"><span class="card-type">${escapeHTML(p.type)}</span><h3>${escapeHTML(p.title)}</h3><div class="card-bottom"><span class="price">${escapeHTML(p.price)}</span><a class="small-link" href="?product=${encodeURIComponent(p.id)}" data-open="${escapeHTML(p.id)}">View details</a></div></div></article>`).join(''):'<p class="empty">No products match your search.</p>'}
    function openProduct(id,push=true){const p=products.find(x=>x.id===id);if(!p)return;document.getElementById('detail-image').src=safeImage(p.image);document.getElementById('detail-image').alt=p.title;document.getElementById('detail-type').textContent=p.type;document.getElementById('detail-title').textContent=p.title;document.getElementById('detail-price').textContent=p.price;document.getElementById('detail-description').textContent=(typeof p.websiteDescription==='string'&&p.websiteDescription.trim())||websiteSummaries[p.sku]||'See the eBay listing for the full product description, specifications and care information.';document.getElementById('detail-action').innerHTML=safeEbay(p.ebay)?`<a class="btn" href="${escapeHTML(safeEbay(p.ebay))}" target="_blank" rel="noopener noreferrer">See it on eBay</a>`:'<p class="demo">This product is currently unavailable on eBay.</p>';detail.classList.add('open');document.body.style.overflow='hidden';if(push)history.pushState({product:id},'',`?product=${encodeURIComponent(id)}`);document.getElementById('close').focus()}
    function closeProduct(push=true){detail.classList.remove('open');document.body.style.overflow='';if(push)history.pushState({},'',location.pathname+location.hash)}
    document.addEventListener('click',e=>{const open=e.target.closest('[data-open]');if(open){e.preventDefault();openProduct(open.dataset.open)}const category=e.target.closest('[data-category]');if(category){selected=category.dataset.category;document.querySelectorAll('.filter').forEach(b=>{const active=b.dataset.filter===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});render()}const filter=e.target.closest('[data-filter]');if(filter){selected=filter.dataset.filter;document.querySelectorAll('.filter').forEach(b=>{const active=b===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});render()}});
    document.getElementById('search').addEventListener('input',render);document.getElementById('close').addEventListener('click',()=>closeProduct());detail.addEventListener('click',e=>{if(e.target===detail)closeProduct()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&detail.classList.contains('open'))closeProduct()});window.addEventListener('popstate',()=>{const id=new URLSearchParams(location.search).get('product');id?openProduct(id,false):closeProduct(false)});
    const menu=document.getElementById('menu');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',expanded);document.getElementById('nav').classList.toggle('open',expanded)});document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.getElementById('nav').classList.remove('open')}));render();const initial=new URLSearchParams(location.search).get('product');if(initial)openProduct(initial,false);
  
function showCatalogue(){
 products.forEach(product=>Object.assign(product,classifySku(product.sku)));
 const filters=document.querySelector('.filters');
 const all=['All',...new Set(products.map(p=>p.type.split(' · ')[0]))];
 filters.replaceChildren(...all.map(name=>{const b=document.createElement('button');b.className='filter'+(name===selected?' active':'');b.dataset.filter=name;b.setAttribute('aria-pressed',String(name===selected));b.textContent=name;return b}));
 render();const state=window.PAWFECTHOME_CATALOGUE_STATE;
 const note=document.querySelector('.sample-note');
 if(note)note.textContent=state.error?state.error:'Prices and availability from eBay. Updated '+new Date(state.updatedAt).toLocaleString('en-GB')+'. Check the listing before buying.';
 if(state.error&&!products.length)grid.innerHTML='<p class="empty">Products are temporarily unavailable. Please try again shortly.</p>';
 const id=new URLSearchParams(location.search).get('product');if(id)openProduct(id,false);
}
window.addEventListener('catalogue:ready',showCatalogue);
if(window.PAWFECTHOME_CATALOGUE_STATE)showCatalogue();
else grid.innerHTML='<p class="empty">Loading products…</p>';
