/* ===== DATA (edit here). Images load from the same folder: <name>.jpg ===== */
// q(text, answer, image)  ·  type:true => student types the answer
const q=(t,a,img)=>({t,a,img});
const PLACES=['bakery','hospital','library','bank'];
const BE=['was','were',"wasn't","weren't"];
const LAND=['forest','river','mountain','island','beach','lake'];
const SUP=[['14. The blue whale is the ______ animal in the sea. (large)','the largest'],['15. The giraffe has the ______ neck of all land animals. (long)','the longest'],['16. The cheetah is the ______ runner in the world. (fast)','the fastest'],['17. The elephant is the ______ animal in the group. (big)','the biggest'],['18. The rabbit is the ______ animal in the picture. (small)','the smallest'],['19. The monkey is the ______ animal in the story. (funny)','the funniest'],['20. Mount Everest is the ______ mountain in the world. (high)','the highest']];
const SUP2=[['1. The falcon is the ______ bird. (fast)','the fastest'],['2. The hippo is one of the ______ animals. (heavy)','the heaviest'],['3. The ostrich is the  ______ bird. (tall)','the tallest'],['4. The snail is one of the ______ animals. (slow)','the slowest'],['5. The whale is the ______ animal in the ocean. (large)','the largest'],['6. The ant is one of the ______ animals. (small)','the smallest'],['7. The parrot is one of the ______ birds. (colorful)','the most colorful'],['8. The shark has some of the ______ teeth. (sharp)','the sharpest'],['9. The elephant has the ______ ears. (big)','the biggest'],['10. The gorilla is one of the  ______ animals. (strong)','the strongest']];
const typed=a=>a.map(([t,x])=>({t,a:x,type:1}));

const S=[
{n:'Places in Town',s:'Places',pic:'town',intro:'Look at the town: find the bank, the bakery, the library and the hospital. Then choose the correct place to complete each sentence.',
 parts:[{opts:PLACES,items:[q('1. You can read and borrow books at the ______.','library'),q('2. You can buy fresh bread and rolls at the ______.','bakery'),q('3. A doctor helps sick people at the ______.','hospital')]}]},

{n:'Verb To Be in the Past',s:'Was / Were',intro:'Complete each sentence with was, were, wasn\'t or weren\'t.',
 parts:[{opts:BE,items:[q('4. Yesterday, I ______ at school with my classmates. (affirmative)','was'),q('5. They ______ at the park yesterday because of the rain. (negative)',"weren't"),q('6. The weather ______ very sunny last Sunday. (affirmative)','was'),q('7. My parents ______ at home last night. (affirmative)','were'),q('8. The cat ______ under the table yesterday. (negative)',"wasn't"),q('9. We ______ at the beach last weekend. (affirmative)','were'),q('10. Ana and Luis ______ tired after the game. (negative)',"weren't"),q('11. The movie ______ funny. (affirmative)','was'),q('12. I ______ at the library yesterday. (negative)',"wasn't"),q('13. You ______ late for class this morning. (affirmative)','were')]}]},

{n:'Superlative Adjectives',s:'Superlatives',intro:'Type the superlative form of the adjective in parentheses (example: fast → the fastest). Structure: the ______est / the most ________.',
 parts:[{h:'Part A',items:typed(SUP)},{h:'Part B: Animals',items:typed(SUP2)}]},

{n:'Animals',s:'Animals',intro:'Read each clue and choose the correct answer. Then classify the animals.',
 parts:[{opts:['carnivore','herbivore','omnivore'],items:[q('21. An animal that eats only plants (like an elephant or deer) is a:','herbivore')]},
        {opts:['herbivore','omnivore','carnivore'],items:[q('22. A bear eats both fish and berries. A bear is an:','omnivore')]},
        {h:'Classify the animals',cols:[['Carnivores',''],['Herbivores',''],['Omnivores','']],items:[['Tiger',0],['Lion',0],['Rabbit',1],['Cow',1],['Bear',2],['Pig',2]]}]},

{n:'Nature and Landforms',s:'Landforms',intro:'Look at each picture and choose the correct landform.',
 parts:[{opts:LAND,items:[q('A.','forest','forest'),q('B.','river','river'),q('C.','mountain','mountain'),q('D.','island','island'),q('E.','beach','beach'),q('F.','lake','lake')]},
        {h:'Write a sentence',open:'Write a sentence using one of the landforms from the word bank (forest, river, mountain, island, beach or lake).',words:LAND}]}
];

/* ===== LOGIC ===== */
const app=document.getElementById('app'),nav=document.getElementById('nav');
const MSG=['Not yet. Read again carefully and try once more.','Almost! Look closely at the clue and try again.','That is not it. Think about what you learned in class and try again.'];
let tries=0,pts=0;const st=[];
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const say=(fb,ok,t)=>{fb.textContent=t;fb.className='fb '+(ok?'good':'bad')};
const wrong=fb=>say(fb,false,MSG[tries++%MSG.length]);
const right=fb=>say(fb,true,'Correct! 🎉');

function mark(i,ok){const s=st[i];s.d++;if(ok)pts++;s.c.textContent=s.d+' / '+s.t;if(s.d===s.t){s.win.hidden=false;nav.children[i].classList.add('ok')}}

function quizItem(i,it,opts){
  const d=el('div','item'),o=el('div','opts'),fb=el('p','fb'),im=it.img&&el('img');let miss=0;fb.setAttribute('aria-live','polite');
  if(im){im.src=it.img+'.jpg';im.alt='Landform picture '+it.t;im.onerror=()=>im.remove();d.append(im)}
  d.append(el('p','q',it.t));
  opts.forEach(x=>{const b=el('button','opt',x);b.type='button';b.onclick=()=>{
    if(x===it.a){b.classList.add('good');o.querySelectorAll('button').forEach(k=>k.disabled=true);d.classList.add('done');right(fb);mark(i,!miss)}
    else{miss=1;b.classList.add('bad');b.disabled=true;wrong(fb)}};o.append(b)});
  d.append(o,fb);return d}

function typeItem(i,it){
  const d=el('div','item'),r=el('div','typed'),inp=el('input'),btn=el('button','check','Check'),fb=el('p','fb');let miss=0;
  const n=s=>s.toLowerCase().trim().replace(/\s+/g,' ').replace(/^the /,'');
  inp.placeholder='Type your answer';inp.autocomplete='off';inp.setAttribute('aria-label',it.t);btn.type='button';fb.setAttribute('aria-live','polite');
  const go=()=>{if(!inp.value.trim()||inp.disabled)return;
    if(n(inp.value)===n(it.a)){inp.disabled=btn.disabled=true;d.classList.add('done');right(fb);mark(i,!miss)}
    else{miss=1;wrong(fb)}};
  btn.onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go()};
  r.append(inp,btn);d.append(el('p','q',it.t),r,fb);return d}

function sortPart(i,p){
  const w=el('div'),pool=el('div','pool'),zones=el('div','zones'),fb=el('p','fb');let sel=null;fb.setAttribute('aria-live','polite');
  const place=(c,z)=>{
    if(c.dataset.c===z.dataset.c){z.querySelector('.drop').append(c);c.disabled=true;c.draggable=false;c.classList.remove('sel');c.classList.add('good');sel=null;right(fb);mark(i,!c.dataset.m)}
    else{c.dataset.m=1;c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),400);wrong(fb)}};
  p.cols.forEach(([h,t],k)=>{const z=el('div','zone');z.dataset.c=k;z.append(el('h4','',h),el('p','def',t),el('div','drop'));
    z.onclick=()=>sel&&place(sel,z);z.ondragover=e=>e.preventDefault();
    z.ondrop=e=>{e.preventDefault();const c=pool.querySelector('[data-id="'+e.dataTransfer.getData('text')+'"]');c&&place(c,z)};zones.append(z)});
  p.items.forEach(([t,k],n)=>{const c=el('button','chip',t);c.type='button';c.dataset.c=k;c.dataset.id=n;c.draggable=true;
    c.ondragstart=e=>e.dataTransfer.setData('text',n);
    c.onclick=()=>{pool.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));sel=c;c.classList.add('sel')};pool.append(c)});
  w.append(el('p','def','Tap an animal and then its column, or drag it.'),pool,zones,fb);return w}

function openPart(i,p){
  const d=el('div','item'),fb=el('p','fb'),a=el('input'),btn=el('button','check','Check');let miss=0;btn.type='button';
  a.placeholder='Write your sentence here';a.maxLength=140;d.append(el('p','q',p.open),a);
  btn.onclick=()=>{const v=a.value.trim(),ok=v.split(/\s+/).length>=4&&p.words.some(w=>new RegExp('\\b'+w+'\\b','i').test(v));
    if(!ok){miss=1;say(fb,false,'Write a complete sentence (at least 4 words) with one word from the word bank.')}
    else{say(fb,true,'Great sentence! Your teacher will check your grammar. ✅');if(!d.classList.contains('done')){d.classList.add('done');mark(i,!miss)}}};
  a.onkeydown=e=>{if(e.key==='Enter')btn.click()};d.append(btn,fb);return d}

function show(i){ // opens section i and closes the rest; clicking the open one closes it
  const was=!document.getElementById('s'+i).hidden;
  if(i===S.length)results();
  S.concat([0]).forEach((_,k)=>{const open=k===i&&!was;document.getElementById('s'+k).hidden=!open;
    nav.children[k].classList.toggle('open',open);nav.children[k].setAttribute('aria-expanded',open)});
  if(!was)window.scrollTo({top:0,behavior:'smooth'})}

S.forEach((s,i)=>{
  const b=el('button','tab');b.type='button';b.append(el('b','',i+1),el('span','',s.s));b.title=s.n;
  b.setAttribute('aria-controls','s'+i);b.onclick=()=>show(i);nav.append(b);
  const sec=el('section','sec'),c=el('span','count'),win=el('p','win','🏆 Section completed!');let t=0;
  sec.id='s'+i;sec.hidden=true;win.hidden=true;
  sec.append(c,el('h2','',(i+1)+'. '+s.n),el('p','intro',s.intro));
  if(s.pic){const im=el('img','pic');im.src=s.pic+'.jpg';im.alt='A town with a bank, a bakery, a library and a hospital';im.onerror=()=>im.remove();sec.append(im)}
  s.parts.forEach(p=>{
    if(p.h)sec.append(el('h3','',p.h));
    if(p.cols){t+=p.items.length;sec.append(sortPart(i,p))}
    else if(p.open){t++;sec.append(openPart(i,p))}
    else{p.items.forEach(it=>{t++;sec.append(it.type?typeItem(i,it):quizItem(i,it,p.opts))})}});
  c.textContent='0 / '+t;st.push({d:0,t,c,win});
  const f=el('div','foot'),prev=el('button','go','← Previous'),next=el('button','go','Next →');
  prev.type=next.type='button';prev.onclick=()=>show(i-1);next.onclick=()=>show(i+1);
  f.append(i>0?prev:el('span'),next);sec.append(win,f);app.append(sec)});

/* ===== RESULTS ===== */
const TOT=st.reduce((a,x)=>a+x.t,0),rb=el('button','tab');rb.type='button';rb.append(el('b','','🏁'),el('span','','Score'));rb.title='Results';rb.setAttribute('aria-controls','s'+S.length);rb.onclick=()=>show(S.length);nav.append(rb);
const rs=el('section','sec'),rbox=el('div','result'),again=el('button','go','🔁 Try again'),rprev=el('button','go','← Previous'),rf=el('div','foot');
rs.id='s'+S.length;rs.hidden=true;again.type=rprev.type='button';again.onclick=()=>location.reload();rprev.onclick=()=>show(S.length-1);
rf.append(rprev,el('span'));rs.append(el('h2','','Your score'),rbox,again,rf);app.append(rs);
function results(){const done=st.reduce((a,x)=>a+x.d,0),n=Math.round(pts/TOT*100);rbox.replaceChildren(
  el('p','grade',n+' / 100'),
  el('p','q',n>=90?'Excellent work! 🌟':n>=70?'Very good! 👏':'Keep practicing, you can do it! 💪'),
  el('p','',pts+' correct on the first try out of '+TOT+' exercises.'),
  done<TOT?el('p','fb bad',(TOT-done)+' exercises left to complete. Go back to the sections to finish them.'):el('p','fb good','You completed all the exercises!'))}
show(0);
