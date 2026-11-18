(() => {
  'use strict';
  const KEY='cgbl-draft-v1';
  const clone=d=>JSON.parse(JSON.stringify(d));
  let data=clone(window.LAB_DATA), storageOK=true;
  try{const s=localStorage.getItem(KEY);if(s)data=JSON.parse(s);}catch(_){storageOK=false;}
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const get=path=>path.split('.').reduce((o,k)=>o?.[k],data);
  const set=(path,value)=>{const a=path.split('.');const last=a.pop();const obj=a.reduce((o,k)=>o[k],data);obj[last]=value;};
  const toast=msg=>{const el=document.getElementById('editor-toast');el.textContent=msg;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,4500);};
  const groups=[
    ['site','기본 정보','연구실의 이름, 소속과 포인트 색상을 수정합니다.','index.html'],
    ['home','첫 화면','줄바꿈을 넣으면 제목에도 그대로 반영됩니다.','index.html'],
    ['research','연구분야','연구분야를 추가·삭제하거나 설명과 그림을 바꿀 수 있습니다.','research.html'],
    ['professor','교수님 소개','사진, 약력, 학력과 주요활동을 수정합니다.','professor.html'],
    ['highlights','주요 연구','첫 화면의 주요 연구 항목을 수정합니다.','index.html'],
    ['resources','연구자료','연구분야 페이지 아래에 표시되는 소개자료를 수정합니다.','research.html'],
    ['contact','연락처·위치','이메일·전화·호실을 바꾸면 모든 페이지에 함께 반영됩니다.','contact.html']
  ];
  const field=(path,label,type='text',help='')=>{
    const val=get(path)??'';
    if(type==='image')return `<div class="field image-field"><label class="field-label" for="f-${path}">${esc(label)}</label><img src="${/^(assets\/|data:image\/|https?:\/\/)/.test(val)?esc(val):''}" alt="현재 이미지 미리보기"><input class="image-path" id="f-${path}" data-path="${path}" type="text" value="${String(val).startsWith('data:')?'':esc(val)}" placeholder="assets/파일명.webp 또는 이미지 주소"><input type="file" data-upload="${path}" accept="image/png,image/jpeg,image/webp"><span class="help">사진을 선택하면 수정본에 포함됩니다. 권장 크기 1 MB 이하, 최대 8 MB. 업로드한 사진은 data.js에 함께 저장됩니다.</span></div>`;
    const str=type==='lines'?(Array.isArray(val)?val.join('\n'):''):val;
    return `<label class="field"><span class="field-label">${esc(label)}</span>${type==='textarea'||type==='lines'?`<textarea data-path="${path}" ${type==='lines'?'data-lines="true"':''} rows="${type==='lines'?4:3}">${esc(str)}</textarea>`:`<input data-path="${path}" type="${type==='color'?'color':'text'}" value="${esc(str)}">`}<span class="help">${esc(help||(type==='lines'?'한 줄에 하나씩 입력해 주세요.':''))}</span></label>`;
  };
  const list=(path,label,fields,template)=>{
    const arr=get(path)||[];
    templates[path]=template;
    return `<h2 class="form-subheading">${esc(label)}</h2>${arr.map((_,i)=>`<div class="repeat-card"><div class="repeat-head"><strong>${esc(label)} ${i+1}</strong><button type="button" data-remove="${path}" data-index="${i}" aria-label="${esc(label)} ${i+1} 삭제">삭제 ×</button></div>${fields.map(([key,name,type])=>field(`${path}.${i}.${key}`,name,type)).join('')}</div>`).join('')}<button class="add-row" type="button" data-add="${path}">+ ${esc(label)} 추가</button>`;
  };
  let templates={},active='site',timer;
  const form=document.getElementById('content-form'),frame=document.getElementById('live-preview'),pageSelect=document.getElementById('preview-page');
  const status=document.getElementById('save-status');
  const sync=()=>{
    try{localStorage.setItem(KEY,JSON.stringify(data));storageOK=true;status.textContent='● 이 브라우저에 임시 저장됨 · 공개 홈페이지에는 아직 반영되지 않았습니다.';status.classList.remove('status-error');}
    catch(_){storageOK=false;status.textContent='임시 저장에 실패했습니다. 사진 용량을 줄이거나 지금 배포용 파일을 내려받아 보관해 주세요. 미리보기에는 마지막 저장본이 표시됩니다.';status.classList.add('status-error');}
  };
  const preview=()=>{if(!storageOK)return;const url=pageSelect.value+'?preview=1';document.getElementById('open-preview').href=url;frame.src=url;};
  const change=()=>{sync();clearTimeout(timer);timer=setTimeout(preview,700);};
  const render=()=>{
    templates={};const index=groups.findIndex(g=>g[0]===active),group=groups[index];
    document.getElementById('edit-step').textContent=`EDIT CONTENT / 0${index+1}`;
    document.getElementById('edit-title').textContent=group[1];
    document.getElementById('edit-description').textContent=group[2];
    document.getElementById('editor-tabs').innerHTML=groups.map((g,i)=>`<button type="button" data-group="${g[0]}" class="${g[0]===active?'active':''}" ${g[0]===active?'aria-current="true"':''}><span>0${i+1}</span>${g[1]}</button>`).join('');
    const researchFields=[['id','고유 ID (영문·숫자·하이픈)'],['category','분류'],['title','연구분야 제목'],['titleEn','영문 제목'],['summary','짧은 소개','textarea'],['description','자세한 설명','textarea'],['methods','연구 방법 · 키워드','lines'],['image','연구 이미지','image'],['imageAlt','이미지 설명']];
    if(active==='site')form.innerHTML=field('site.name','연구실 이름')+field('site.nameEn','영문 이름')+field('site.shortName','영문 약칭')+field('site.university','대학교')+field('site.department','소속 학과')+field('site.accent','포인트 색상','color');
    if(active==='home')form.innerHTML=field('hero.eyebrow','첫 화면 위 작은 영문 문구')+field('hero.title','메인 제목','textarea')+field('hero.description','메인 소개문','textarea')+field('hero.image','메인 사진','image')+field('hero.imageAlt','메인 사진 설명')+field('hero.caption','사진 아래 문구')+field('about.title','연구실 소개 제목','textarea')+field('about.description','연구실 소개 본문','textarea')+list('crops','연구 작물',[['name','작물 이름'],['latin','학명']],{name:'새 작물',latin:''});
    if(active==='research')form.innerHTML=`<p class="inline-editor-note">첫 화면에는 연구분야 목록의 1번째·2번째·6번째 항목이 소개됩니다. 항목이 적으면 있는 항목만 표시됩니다.</p>`+list('research','연구분야',researchFields,{id:'research-'+Date.now(),category:'새 연구',title:'새 연구분야',titleEn:'Research area',summary:'',description:'',methods:[],image:'assets/population-genomics.webp',imageAlt:''});
    if(active==='professor')form.innerHTML=field('professor.name','교수님 성함')+field('professor.nameEn','영문 성함')+field('professor.title','직함')+field('professor.image','교수님 사진','image')+field('professor.intro','소개문','textarea')+field('professor.interests','연구 관심분야','lines')+list('professor.career','경력',[['period','기간'],['title','소속 · 기관'],['detail','직함 · 설명']],{period:'',title:'',detail:''})+list('professor.education','학력',[['period','기간 · 학위'],['title','학교 · 기관'],['detail','전공 · 설명']],{period:'',title:'',detail:''})+'<h2 class="form-subheading">기타 정보</h2>'+field('professor.activities','주요활동','lines')+field('professor.note','약력 아래 안내 문구','textarea');
    if(active==='highlights')form.innerHTML=list('highlights','주요 연구',[['label','영문 분류'],['title','제목'],['description','소개문','textarea'],['image','이미지','image']],{label:'RESEARCH',title:'새 연구',description:'',image:'assets/gwas.webp'});
    if(active==='resources')form.innerHTML=list('resources','연구자료',[['title','제목'],['description','설명','textarea'],['image','소개자료 이미지','image']],{title:'새 연구자료',description:'',image:'assets/lab-overview.webp'});
    if(active==='contact')form.innerHTML=field('contact.email','이메일')+field('contact.phone','전화번호')+field('contact.location','소속 · 위치')+field('contact.office','교수 연구실')+field('contact.laboratory','실험실')+field('contact.address','상세 주소 (선택)','text','비워 두면 주소 행을 표시하지 않습니다. 지도는 소속·위치로 검색합니다.')+field('contact.message','문의 안내문','textarea');
  };
  document.getElementById('editor-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-group]');if(!b)return;active=b.dataset.group;pageSelect.value=groups.find(g=>g[0]===active)[3];render();preview();});
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('input',e=>{const path=e.target.dataset.path;if(!path)return;const value=e.target.dataset.lines?e.target.value.split('\n').map(s=>s.trim()).filter(Boolean):e.target.value;set(path,value);change();});
  form.addEventListener('change',async e=>{
    if(!e.target.dataset.upload)return;const f=e.target.files[0];if(!f)return;
    if(!['image/png','image/jpeg','image/webp'].includes(f.type)){toast('PNG, JPG, WebP 사진을 선택해 주세요.');return;}
    if(f.size>8*1024*1024){toast('8 MB 이하 사진을 선택해 주세요.');return;}
    const reader=new FileReader();reader.onload=()=>{set(e.target.dataset.upload,reader.result);change();render();toast('사진을 수정본에 넣었습니다. 배포용 파일을 내려받아 반영하세요.');};reader.onerror=()=>toast('사진을 읽지 못했습니다. 다시 선택해 주세요.');reader.readAsDataURL(f);
  });
  form.addEventListener('click',e=>{const b=e.target.closest('[data-add],[data-remove]');if(!b)return;if(b.dataset.add){const path=b.dataset.add;const item=clone(templates[path]);if(path==='research')item.id='research-'+Date.now();get(path).push(item);}else{if(!window.confirm('이 항목을 수정본에서 삭제할까요?'))return;get(b.dataset.remove).splice(Number(b.dataset.index),1);}change();render();});
  pageSelect.addEventListener('change',preview);
  const download=(blob,name)=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);};
  const dataSource=()=>`// editor.html에서 수정한 연구실 홈페이지 데이터\nwindow.LAB_DATA = ${JSON.stringify(data,null,2)};\n`;
  const validate=()=>{
    if(!data.site.name.trim()||!data.professor.name.trim()||!data.hero.title.trim())throw Error('연구실 이름·교수님 성함·메인 제목을 입력해 주세요.');
    const ids=data.research.map(r=>r.id);if(ids.some(id=>!/^\w[\w-]*$/.test(id))||new Set(ids).size!==ids.length)throw Error('연구분야 고유 ID는 겹치지 않게 영문·숫자·하이픈으로 입력해 주세요.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email))throw Error('연락처 이메일을 확인해 주세요.');
  };
  document.getElementById('download-data').addEventListener('click',()=>{try{validate();download(new Blob([dataSource()],{type:'text/javascript;charset=utf-8'}),'data.js');toast('data.js를 GitHub 저장소의 같은 이름 파일에 덮어 올려 주세요.');}catch(err){toast(err.message);}});
  document.getElementById('download-json').addEventListener('click',()=>{download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'lab-content-backup.json');toast('현재 수정 내용을 백업했습니다.');});
  document.getElementById('import-json').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const loaded=JSON.parse(await f.text());for(const key of ['site','hero','about','professor','contact'])if(!loaded[key]||typeof loaded[key]!=='object')throw Error('구조');for(const key of ['research','crops','highlights','resources'])if(!Array.isArray(loaded[key]))throw Error('구조');if(!loaded.professor.career||!loaded.professor.education||!loaded.professor.activities)throw Error('구조');const old=data;data=loaded;try{validate();}catch(err){data=old;throw err;}sync();render();preview();toast('백업 내용을 불러왔습니다.');}catch(_){toast('이 편집기에서 저장한 올바른 JSON 백업 파일을 선택해 주세요.');}e.target.value='';});
  document.getElementById('reset-data').addEventListener('click',()=>{if(!window.confirm('이 브라우저의 수정 내용을 지우고 배포된 원본으로 되돌릴까요? 먼저 백업할 수 있습니다.'))return;data=clone(window.LAB_DATA);sync();render();preview();toast('배포된 원본으로 되돌렸습니다.');});
  // ZIP (store 방식): 외부 라이브러리 없이 GitHub에 올릴 전체 파일을 묶습니다.
  const encoder=new TextEncoder();const table=Array.from({length:256},(_,i)=>{for(let j=0;j<8;j++)i=i&1?0xedb88320^(i>>>1):i>>>1;return i>>>0;});
  const crc32=bytes=>{let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
  const zip=files=>{
    let offset=0;const parts=[],central=[];const now=new Date(),time=(now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1),date=((now.getFullYear()-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate();
    for(const file of files){const name=encoder.encode(file.name),bytes=file.bytes,crc=crc32(bytes),header=new Uint8Array(30+name.length),h=new DataView(header.buffer);h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint16(10,time,true);h.setUint16(12,date,true);h.setUint32(14,crc,true);h.setUint32(18,bytes.length,true);h.setUint32(22,bytes.length,true);h.setUint16(26,name.length,true);header.set(name,30);parts.push(header,bytes);const entry=new Uint8Array(46+name.length),v=new DataView(entry.buffer);v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint16(12,time,true);v.setUint16(14,date,true);v.setUint32(16,crc,true);v.setUint32(20,bytes.length,true);v.setUint32(24,bytes.length,true);v.setUint16(28,name.length,true);v.setUint32(42,offset,true);entry.set(name,46);central.push(entry);offset+=header.length+bytes.length;}
    const size=central.reduce((s,a)=>s+a.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);return new Blob([...parts,...central,end],{type:'application/zip'});
  };
  document.getElementById('download-zip').addEventListener('click',async e=>{
    const b=e.currentTarget;try{validate();if(location.protocol==='file:')throw Error('파일을 직접 연 상태에서는 전체 ZIP을 만들 수 없습니다. 배포용 data.js를 내려받거나 온라인 편집 화면에서 ZIP을 내려받으세요.');b.disabled=true;b.textContent='파일을 묶는 중…';const files=await Promise.all(window.LAB_PACKAGE_FILES.map(async path=>{if(path==='data.js')return{name:path,bytes:encoder.encode(dataSource())};if(path==='.nojekyll')return{name:path,bytes:new Uint8Array(0)};const res=await fetch(path);if(!res.ok)throw Error(`${path} 파일을 읽지 못했습니다.`);return{name:path,bytes:new Uint8Array(await res.arrayBuffer())};}));download(zip(files),'cgbl-github-pages.zip');toast('현재 수정본을 포함한 전체 ZIP을 만들었습니다. 압축을 풀어 GitHub에 올려 주세요.');}catch(err){toast(err.message);}finally{b.disabled=false;b.textContent='전체 사이트 ZIP ↓';}
  });
  sync();render();preview();
})();
