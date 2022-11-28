import{S as Ye,i as Xe,s as Ze,a as Qe,e as B,c as xe,b as M,g as pe,t as F,d as de,f as J,h as G,j as et,o as Se,k as tt,l as nt,m as rt,n as ve,p as q,q as at,r as st,u as ot,v as Y,w as X,x as Le,y as Z,z as Q,A as Be}from"./chunks/index-e8cb9686.js";import{g as Fe,f as Je,s as z,a as Re,b as it,i as lt}from"./chunks/singletons-c75b403f.js";function ct(r,e){return r==="/"||e==="ignore"?r:e==="never"?r.endsWith("/")?r.slice(0,-1):r:e==="always"&&!r.endsWith("/")?r+"/":r}function ft(r){for(const e in r)r[e]=r[e].replace(/%23/g,"#").replace(/%3[Bb]/g,";").replace(/%2[Cc]/g,",").replace(/%2[Ff]/g,"/").replace(/%3[Ff]/g,"?").replace(/%3[Aa]/g,":").replace(/%40/g,"@").replace(/%26/g,"&").replace(/%3[Dd]/g,"=").replace(/%2[Bb]/g,"+").replace(/%24/g,"$");return r}const ut=["href","pathname","search","searchParams","toString","toJSON"];function pt(r,e){const t=new URL(r);for(const o of ut){let s=t[o];Object.defineProperty(t,o,{get(){return e(),s},enumerable:!0,configurable:!0})}return dt(t),t}function dt(r){Object.defineProperty(r,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}const ht="/__data.json";function mt(r){return r.replace(/\/$/,"")+ht}function gt(r){let e=5381;if(typeof r=="string"){let t=r.length;for(;t;)e=e*33^r.charCodeAt(--t)}else if(ArrayBuffer.isView(r)){const t=new Uint8Array(r.buffer,r.byteOffset,r.byteLength);let o=t.length;for(;o;)e=e*33^t[--o]}else throw new TypeError("value must be a string or TypedArray");return(e>>>0).toString(36)}const he=window.fetch;window.fetch=(r,e)=>{if((r instanceof Request?r.method:(e==null?void 0:e.method)||"GET")!=="GET"){const o=new URL(r instanceof Request?r.url:r.toString(),document.baseURI).href;ue.delete(o)}return he(r,e)};const ue=new Map;function _t(r,e,t){let s=`script[data-sveltekit-fetched][data-url=${JSON.stringify(r instanceof Request?r.url:r)}]`;(t==null?void 0:t.body)&&(typeof t.body=="string"||ArrayBuffer.isView(t.body))&&(s+=`[data-hash="${gt(t.body)}"]`);const d=document.querySelector(s);if(d!=null&&d.textContent){const{body:n,...c}=JSON.parse(d.textContent),m=d.getAttribute("data-ttl");return m&&ue.set(e,{body:n,init:c,ttl:1e3*Number(m)}),Promise.resolve(new Response(n,c))}return he(r,t)}function yt(r,e){const t=ue.get(r);if(t){if(performance.now()<t.ttl)return new Response(t.body,t.init);ue.delete(r)}return he(r,e)}const wt=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function bt(r){const e=[],t=[],o=[];let s=!0;return{pattern:r==="/"?/^\/$/:new RegExp(`^${Et(r).map((n,c,m)=>{const p=decodeURIComponent(n),_=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(p);if(_)return e.push(_[1]),t.push(_[2]),o.push(!1),"(?:/(.*))?";const w=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(p);if(w)return e.push(w[1]),t.push(w[2]),o.push(!0),"(?:/([^/]+))?";const R=c===m.length-1;return p?"/"+p.split(/\[(.+?)\](?!\])/).map((T,D)=>{if(D%2){const C=wt.exec(T);if(!C)throw new Error(`Invalid param: ${T}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,K,ae,x,se]=C;return e.push(x),t.push(se),o.push(!!K),ae?"(.*?)":K?"([^/]*)?":"([^/]+?)"}return R&&T.includes(".")&&(s=!1),T.normalize().replace(/%5[Bb]/g,"[").replace(/%5[Dd]/g,"]").replace(/#/g,"%23").replace(/\?/g,"%3F").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join(""):void 0}).join("")}${s?"/?":""}$`),names:e,types:t,optional:o}}function vt(r){return!/^\([^)]+\)$/.test(r)}function Et(r){return r.slice(1).split("/").filter(vt)}function kt(r,{names:e,types:t,optional:o},s){const d={};for(let n=0;n<e.length;n+=1){const c=e[n],m=t[n];let p=r[n+1];if(p||!o[n]){if(m){const _=s[m];if(!_)throw new Error(`Missing "${m}" param matcher`);if(!_(p))return}d[c]=p!=null?p:""}}return d}function St(r,e,t,o){const s=new Set(e);return Object.entries(t).map(([c,[m,p,_]])=>{const{pattern:w,names:R,types:U,optional:H}=bt(c),T={id:c,exec:D=>{const C=w.exec(D);if(C)return kt(C,{names:R,types:U,optional:H},o)},errors:[1,..._||[]].map(D=>r[D]),layouts:[0,...p||[]].map(n),leaf:d(m)};return T.errors.length=T.layouts.length=Math.max(T.errors.length,T.layouts.length),T});function d(c){const m=c<0;return m&&(c=~c),[m,r[c]]}function n(c){return c===void 0?c:[s.has(c),r[c]]}}function Rt(r){let e,t,o;var s=r[0][0];function d(n){return{props:{data:n[2],form:n[1]}}}return s&&(e=Y(s,d(r))),{c(){e&&X(e.$$.fragment),t=B()},l(n){e&&Le(e.$$.fragment,n),t=B()},m(n,c){e&&Z(e,n,c),M(n,t,c),o=!0},p(n,c){const m={};if(c&4&&(m.data=n[2]),c&2&&(m.form=n[1]),s!==(s=n[0][0])){if(e){pe();const p=e;F(p.$$.fragment,1,0,()=>{Q(p,1)}),de()}s?(e=Y(s,d(n)),X(e.$$.fragment),J(e.$$.fragment,1),Z(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&J(e.$$.fragment,n),o=!0)},o(n){e&&F(e.$$.fragment,n),o=!1},d(n){n&&G(t),e&&Q(e,n)}}}function Ot(r){let e,t,o;var s=r[0][0];function d(n){return{props:{data:n[2],$$slots:{default:[$t]},$$scope:{ctx:n}}}}return s&&(e=Y(s,d(r))),{c(){e&&X(e.$$.fragment),t=B()},l(n){e&&Le(e.$$.fragment,n),t=B()},m(n,c){e&&Z(e,n,c),M(n,t,c),o=!0},p(n,c){const m={};if(c&4&&(m.data=n[2]),c&523&&(m.$$scope={dirty:c,ctx:n}),s!==(s=n[0][0])){if(e){pe();const p=e;F(p.$$.fragment,1,0,()=>{Q(p,1)}),de()}s?(e=Y(s,d(n)),X(e.$$.fragment),J(e.$$.fragment,1),Z(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&J(e.$$.fragment,n),o=!0)},o(n){e&&F(e.$$.fragment,n),o=!1},d(n){n&&G(t),e&&Q(e,n)}}}function $t(r){let e,t,o;var s=r[0][1];function d(n){return{props:{data:n[3],form:n[1]}}}return s&&(e=Y(s,d(r))),{c(){e&&X(e.$$.fragment),t=B()},l(n){e&&Le(e.$$.fragment,n),t=B()},m(n,c){e&&Z(e,n,c),M(n,t,c),o=!0},p(n,c){const m={};if(c&8&&(m.data=n[3]),c&2&&(m.form=n[1]),s!==(s=n[0][1])){if(e){pe();const p=e;F(p.$$.fragment,1,0,()=>{Q(p,1)}),de()}s?(e=Y(s,d(n)),X(e.$$.fragment),J(e.$$.fragment,1),Z(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&J(e.$$.fragment,n),o=!0)},o(n){e&&F(e.$$.fragment,n),o=!1},d(n){n&&G(t),e&&Q(e,n)}}}function Ge(r){let e,t=r[5]&&Ke(r);return{c(){e=tt("div"),t&&t.c(),this.h()},l(o){e=nt(o,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var s=rt(e);t&&t.l(s),s.forEach(G),this.h()},h(){ve(e,"id","svelte-announcer"),ve(e,"aria-live","assertive"),ve(e,"aria-atomic","true"),q(e,"position","absolute"),q(e,"left","0"),q(e,"top","0"),q(e,"clip","rect(0 0 0 0)"),q(e,"clip-path","inset(50%)"),q(e,"overflow","hidden"),q(e,"white-space","nowrap"),q(e,"width","1px"),q(e,"height","1px")},m(o,s){M(o,e,s),t&&t.m(e,null)},p(o,s){o[5]?t?t.p(o,s):(t=Ke(o),t.c(),t.m(e,null)):t&&(t.d(1),t=null)},d(o){o&&G(e),t&&t.d()}}}function Ke(r){let e;return{c(){e=at(r[6])},l(t){e=st(t,r[6])},m(t,o){M(t,e,o)},p(t,o){o&64&&ot(e,t[6])},d(t){t&&G(e)}}}function It(r){let e,t,o,s,d;const n=[Ot,Rt],c=[];function m(_,w){return _[0][1]?0:1}e=m(r),t=c[e]=n[e](r);let p=r[4]&&Ge(r);return{c(){t.c(),o=Qe(),p&&p.c(),s=B()},l(_){t.l(_),o=xe(_),p&&p.l(_),s=B()},m(_,w){c[e].m(_,w),M(_,o,w),p&&p.m(_,w),M(_,s,w),d=!0},p(_,[w]){let R=e;e=m(_),e===R?c[e].p(_,w):(pe(),F(c[R],1,1,()=>{c[R]=null}),de(),t=c[e],t?t.p(_,w):(t=c[e]=n[e](_),t.c()),J(t,1),t.m(o.parentNode,o)),_[4]?p?p.p(_,w):(p=Ge(_),p.c(),p.m(s.parentNode,s)):p&&(p.d(1),p=null)},i(_){d||(J(t),d=!0)},o(_){F(t),d=!1},d(_){c[e].d(_),_&&G(o),p&&p.d(_),_&&G(s)}}}function Lt(r,e,t){let{stores:o}=e,{page:s}=e,{components:d}=e,{form:n}=e,{data_0:c=null}=e,{data_1:m=null}=e;et(o.page.notify);let p=!1,_=!1,w=null;return Se(()=>{const R=o.page.subscribe(()=>{p&&(t(5,_=!0),t(6,w=document.title||"untitled page"))});return t(4,p=!0),R}),r.$$set=R=>{"stores"in R&&t(7,o=R.stores),"page"in R&&t(8,s=R.page),"components"in R&&t(0,d=R.components),"form"in R&&t(1,n=R.form),"data_0"in R&&t(2,c=R.data_0),"data_1"in R&&t(3,m=R.data_1)},r.$$.update=()=>{r.$$.dirty&384&&o.page.set(s)},[d,n,c,m,p,_,w,o,s]}class At extends Ye{constructor(e){super(),Xe(this,e,Lt,It,Ze,{stores:7,page:8,components:0,form:1,data_0:2,data_1:3})}}const jt=function(){const e=document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),Nt=function(r,e){return new URL(r,e).href},ze={},Ee=function(e,t,o){return!t||t.length===0?e():Promise.all(t.map(s=>{if(s=Nt(s,o),s in ze)return;ze[s]=!0;const d=s.endsWith(".css"),n=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${n}`))return;const c=document.createElement("link");if(c.rel=d?"stylesheet":jt,d||(c.as="script",c.crossOrigin=""),c.href=s,document.head.appendChild(c),d)return new Promise((m,p)=>{c.addEventListener("load",m),c.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e())},Pt={},me=[()=>Ee(()=>import("./chunks/0-182a960a.js"),["chunks/0-182a960a.js","components/pages/_layout.svelte-01c23f51.js","assets/_layout-a7751722.css","chunks/index-e8cb9686.js"],import.meta.url),()=>Ee(()=>import("./chunks/1-05b07b58.js"),["chunks/1-05b07b58.js","components/error.svelte-2e07dfc9.js","chunks/index-e8cb9686.js","chunks/singletons-c75b403f.js","chunks/index-2b094520.js"],import.meta.url),()=>Ee(()=>import("./chunks/2-a08dffe0.js"),["chunks/2-a08dffe0.js","components/pages/_page.svelte-1fcdbfad.js","assets/_page-a5b0061f.css","chunks/index-e8cb9686.js","chunks/index-2b094520.js"],import.meta.url)],Ut=[0],Tt={"/":[2]},Dt={handleError:({error:r})=>{console.error(r)}};class Oe{constructor(e,t){this.status=e,typeof t=="string"?this.body={message:t}:t?this.body=t:this.body={message:`Error: ${e}`}}toString(){return JSON.stringify(this.body)}}class Me{constructor(e,t){this.status=e,this.location=t}}async function qt(r){var e;for(const t in r)if(typeof((e=r[t])==null?void 0:e.then)=="function")return Object.fromEntries(await Promise.all(Object.entries(r).map(async([o,s])=>[o,await s])));return r}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");Object.getOwnPropertyNames(Object.prototype).sort().join("\0");const Ct=-1,Vt=-2,Bt=-3,Ft=-4,Jt=-5,Gt=-6;function Kt(r){return zt(JSON.parse(r))}function zt(r){if(typeof r=="number")return o(r,!0);if(!Array.isArray(r)||r.length===0)throw new Error("Invalid input");const e=r,t=Array(e.length);function o(s,d=!1){if(s===Ct)return;if(s===Bt)return NaN;if(s===Ft)return 1/0;if(s===Jt)return-1/0;if(s===Gt)return-0;if(d)throw new Error("Invalid input");if(s in t)return t[s];const n=e[s];if(!n||typeof n!="object")t[s]=n;else if(Array.isArray(n))if(typeof n[0]=="string")switch(n[0]){case"Date":t[s]=new Date(n[1]);break;case"Set":const m=new Set;t[s]=m;for(let w=1;w<n.length;w+=1)m.add(o(n[w]));break;case"Map":const p=new Map;t[s]=p;for(let w=1;w<n.length;w+=2)p.set(o(n[w]),o(n[w+1]));break;case"RegExp":t[s]=new RegExp(n[1],n[2]);break;case"Object":t[s]=Object(n[1]);break;case"BigInt":t[s]=BigInt(n[1]);break;case"null":const _=Object.create(null);t[s]=_;for(let w=1;w<n.length;w+=2)_[n[w]]=o(n[w+1]);break}else{const c=new Array(n.length);t[s]=c;for(let m=0;m<n.length;m+=1){const p=n[m];p!==Vt&&(c[m]=o(p))}}else{const c={};t[s]=c;for(const m in n){const p=n[m];c[m]=o(p)}}return t[s]}return o(0)}const We="sveltekit:scroll",V="sveltekit:index",le=St(me,Ut,Tt,Pt),$e=me[0],Ie=me[1];$e();Ie();let re={};try{re=JSON.parse(sessionStorage[We])}catch{}function ke(r){re[r]=Re()}function Mt({target:r,base:e,trailing_slash:t}){var qe;const o=[];let s=null;const d={before_navigate:[],after_navigate:[]};let n={branch:[],error:null,url:null},c=!1,m=!1,p=!0,_=!1,w=!1,R,U=(qe=history.state)==null?void 0:qe[V];U||(U=Date.now(),history.replaceState({...history.state,[V]:U},"",location.href));const H=re[U];H&&(history.scrollRestoration="manual",scrollTo(H.x,H.y));let T=!1,D,C,K;async function ae(){K=K||Promise.resolve(),await K,K=null;const a=new URL(location.href),f=ye(a,!0);s=null,await Ae(f,a,[])}async function x(a,{noscroll:f=!1,replaceState:u=!1,keepfocus:i=!1,state:l={},invalidateAll:h=!1},g,E){return typeof a=="string"&&(a=new URL(a,Fe(document))),we({url:a,scroll:f?Re():null,keepfocus:i,redirect_chain:g,details:{state:l,replaceState:u},nav_token:E,accepted:()=>{h&&(w=!0)},blocked:()=>{},type:"goto"})}async function se(a){const f=ye(a,!1);if(!f)throw new Error(`Attempted to prefetch a URL that does not belong to this app: ${a}`);return s={id:f.id,promise:Pe(f)},s.promise}async function Ae(a,f,u,i,l={},h){var E,k;C=l;let g=a&&await Pe(a);if(g||(g=await De(f,null,ne(new Error(`Not found: ${f.pathname}`),{url:f,params:{},routeId:null}),404)),f=(a==null?void 0:a.url)||f,C!==l)return!1;if(g.type==="redirect")if(u.length>10||u.includes(f.pathname))g=await oe({status:500,error:ne(new Error("Redirect loop"),{url:f,params:{},routeId:null}),url:f,routeId:null});else return x(new URL(g.location,f).href,{},[...u,f.pathname],l),!1;else((k=(E=g.props)==null?void 0:E.page)==null?void 0:k.status)>=400&&await z.updated.check()&&await ie(f);if(o.length=0,w=!1,_=!0,i&&i.details){const{details:b}=i,v=b.replaceState?0:1;b.state[V]=U+=v,history[b.replaceState?"replaceState":"pushState"](b.state,"",f)}if(s=null,m){n=g.state,g.props.page&&(g.props.page.url=f);const b=fe();R.$set(g.props),b()}else je(g);if(i){const{scroll:b,keepfocus:v}=i;if(!v){const O=document.body,I=O.getAttribute("tabindex");O.tabIndex=-1,O.focus({preventScroll:!0}),setTimeout(()=>{var L;(L=getSelection())==null||L.removeAllRanges()}),I!==null?O.setAttribute("tabindex",I):O.removeAttribute("tabindex")}if(await Be(),p){const O=f.hash&&document.getElementById(f.hash.slice(1));b?scrollTo(b.x,b.y):O?O.scrollIntoView():scrollTo(0,0)}}else await Be();p=!0,g.props.page&&(D=g.props.page),h&&h(),_=!1}function je(a){var l,h;n=a.state;const f=document.querySelector("style[data-sveltekit]");f&&f.remove(),D=a.props.page;const u=fe();R=new At({target:r,props:{...a.props,stores:z},hydrate:!0}),u();const i={from:null,to:ce("to",{params:n.params,routeId:(h=(l=n.route)==null?void 0:l.id)!=null?h:null,url:new URL(location.href)}),type:"load"};d.after_navigate.forEach(g=>g(i)),m=!0}async function ee({url:a,params:f,branch:u,status:i,error:l,route:h,form:g}){var I;const E=u.filter(Boolean),k={type:"loaded",state:{url:a,params:f,branch:u,error:l,route:h},props:{components:E.map(L=>L.node.component)}};g!==void 0&&(k.props.form=g);let b={},v=!D;for(let L=0;L<E.length;L+=1){const N=E[L];b={...b,...N.data},(v||!n.branch.some(P=>P===N))&&(k.props[`data_${L}`]=b,v=v||Object.keys((I=N.data)!=null?I:{}).length>0)}if(v||(v=Object.keys(D.data).length!==Object.keys(b).length),!n.url||a.href!==n.url.href||n.error!==l||g!==void 0||v){k.props.page={error:l,params:f,routeId:h&&h.id,status:i,url:a,form:g,data:v?b:D.data};const L=(N,P)=>{Object.defineProperty(k.props.page,N,{get:()=>{throw new Error(`$page.${N} has been replaced by $page.url.${P}`)}})};L("origin","origin"),L("path","pathname"),L("query","searchParams")}return k}async function ge({loader:a,parent:f,url:u,params:i,routeId:l,server_data_node:h}){var b,v,O,I,L;let g=null;const E={dependencies:new Set,params:new Set,parent:!1,url:!1},k=await a();if((b=k.shared)!=null&&b.load){let N=function(...$){for(const y of $){const{href:S}=new URL(y,u);E.dependencies.add(S)}};const P={routeId:l,params:new Proxy(i,{get:($,y)=>(E.params.add(y),$[y])}),data:(v=h==null?void 0:h.data)!=null?v:null,url:pt(u,()=>{E.url=!0}),async fetch($,y){let S;$ instanceof Request?(S=$.url,y={body:$.method==="GET"||$.method==="HEAD"?void 0:await $.blob(),cache:$.cache,credentials:$.credentials,headers:$.headers,integrity:$.integrity,keepalive:$.keepalive,method:$.method,mode:$.mode,redirect:$.redirect,referrer:$.referrer,referrerPolicy:$.referrerPolicy,signal:$.signal,...y}):S=$;const j=new URL(S,u).href;return N(j),m?yt(j,y):_t(S,j,y)},setHeaders:()=>{},depends:N,parent(){return E.parent=!0,f()}};Object.defineProperties(P,{props:{get(){throw new Error("@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},session:{get(){throw new Error("session is no longer available. See https://github.com/sveltejs/kit/discussions/5883")},enumerable:!1},stuff:{get(){throw new Error("@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1}}),g=(O=await k.shared.load.call(null,P))!=null?O:null,g=g?await qt(g):null}return{node:k,loader:a,server:h,shared:(I=k.shared)!=null&&I.load?{type:"data",data:g,uses:E}:null,data:(L=g!=null?g:h==null?void 0:h.data)!=null?L:null}}function Ne(a,f,u,i){if(w)return!0;if(!u)return!1;if(u.parent&&f||u.url&&a)return!0;for(const l of u.params)if(i[l]!==n.params[l])return!0;for(const l of u.dependencies)if(o.some(h=>h(new URL(l))))return!0;return!1}function _e(a,f){var u,i;return(a==null?void 0:a.type)==="data"?{type:"data",data:a.data,uses:{dependencies:new Set((u=a.uses.dependencies)!=null?u:[]),params:new Set((i=a.uses.params)!=null?i:[]),parent:!!a.uses.parent,url:!!a.uses.url}}:(a==null?void 0:a.type)==="skip"&&f!=null?f:null}async function Pe({id:a,invalidating:f,url:u,params:i,route:l}){var $;if((s==null?void 0:s.id)===a)return s.promise;const{errors:h,layouts:g,leaf:E}=l,k=[...g,E];h.forEach(y=>y==null?void 0:y().catch(()=>{})),k.forEach(y=>y==null?void 0:y[1]().catch(()=>{}));let b=null;const v=n.url?a!==n.url.pathname+n.url.search:!1,O=k.reduce((y,S,j)=>{var te;const A=n.branch[j],W=!!(S!=null&&S[0])&&((A==null?void 0:A.loader)!==S[1]||Ne(v,y.some(Boolean),(te=A.server)==null?void 0:te.uses,i));return y.push(W),y},[]);if(O.some(Boolean)){try{b=await He(u,O)}catch(y){return oe({status:500,error:ne(y,{url:u,params:i,routeId:l.id}),url:u,routeId:l.id})}if(b.type==="redirect")return b}const I=b==null?void 0:b.nodes;let L=!1;const N=k.map(async(y,S)=>{var te;if(!y)return;const j=n.branch[S],A=I==null?void 0:I[S];if((!A||A.type==="skip")&&y[1]===(j==null?void 0:j.loader)&&!Ne(v,L,(te=j.shared)==null?void 0:te.uses,i))return j;if(L=!0,(A==null?void 0:A.type)==="error")throw A;return ge({loader:y[1],url:u,params:i,routeId:l.id,parent:async()=>{var Ve;const Ce={};for(let be=0;be<S;be+=1)Object.assign(Ce,(Ve=await N[be])==null?void 0:Ve.data);return Ce},server_data_node:_e(A===void 0&&y[0]?{type:"skip"}:A!=null?A:null,j==null?void 0:j.server)})});for(const y of N)y.catch(()=>{});const P=[];for(let y=0;y<k.length;y+=1)if(k[y])try{P.push(await N[y])}catch(S){if(S instanceof Me)return{type:"redirect",location:S.location};let j=500,A;I!=null&&I.includes(S)?(j=($=S.status)!=null?$:j,A=S.error):S instanceof Oe?(j=S.status,A=S.body):A=ne(S,{params:i,url:u,routeId:l.id});const W=await Ue(y,P,h);return W?await ee({url:u,params:i,branch:P.slice(0,W.idx).concat(W.node),status:j,error:A,route:l}):await De(u,l.id,A,j)}else P.push(void 0);return await ee({url:u,params:i,branch:P,status:200,error:null,route:l,form:f?void 0:null})}async function Ue(a,f,u){for(;a--;)if(u[a]){let i=a;for(;!f[i];)i-=1;try{return{idx:i+1,node:{node:await u[a](),loader:u[a],data:{},server:null,shared:null}}}catch{continue}}}async function oe({status:a,error:f,url:u,routeId:i}){var b;const l={},h=await $e();let g=null;if(h.server)try{const v=await He(u,[!0]);if(v.type!=="data"||v.nodes[0]&&v.nodes[0].type!=="data")throw 0;g=(b=v.nodes[0])!=null?b:null}catch{(u.origin!==location.origin||u.pathname!==location.pathname||c)&&await ie(u)}const E=await ge({loader:$e,url:u,params:l,routeId:i,parent:()=>Promise.resolve({}),server_data_node:_e(g)}),k={node:await Ie(),loader:Ie,shared:null,server:null,data:null};return await ee({url:u,params:l,branch:[E,k],status:a,error:f,route:null})}function ye(a,f){if(Te(a))return;const u=decodeURI(a.pathname.slice(e.length)||"/");for(const i of le){const l=i.exec(u);if(l){const h=new URL(a.origin+ct(a.pathname,t)+a.search+a.hash);return{id:h.pathname+h.search,invalidating:f,route:i,params:ft(l),url:h}}}}function Te(a){return a.origin!==location.origin||!a.pathname.startsWith(e)}async function we({url:a,scroll:f,keepfocus:u,redirect_chain:i,details:l,type:h,delta:g,nav_token:E,accepted:k,blocked:b}){var N,P,$,y;let v=!1;const O=ye(a,!1),I={from:ce("from",{params:n.params,routeId:(P=(N=n.route)==null?void 0:N.id)!=null?P:null,url:n.url}),to:ce("to",{params:($=O==null?void 0:O.params)!=null?$:null,routeId:(y=O==null?void 0:O.route.id)!=null?y:null,url:a}),type:h};g!==void 0&&(I.delta=g);const L={...I,cancel:()=>{v=!0}};if(d.before_navigate.forEach(S=>S(L)),v){b();return}ke(U),k(),m&&z.navigating.set(I),await Ae(O,a,i,{scroll:f,keepfocus:u,details:l},E,()=>{d.after_navigate.forEach(S=>S(I)),z.navigating.set(null)})}async function De(a,f,u,i){return a.origin===location.origin&&a.pathname===location.pathname&&!c?await oe({status:i,error:u,url:a,routeId:f}):await ie(a)}function ie(a){return location.href=a.href,new Promise(()=>{})}return{after_navigate:a=>{Se(()=>(d.after_navigate.push(a),()=>{const f=d.after_navigate.indexOf(a);d.after_navigate.splice(f,1)}))},before_navigate:a=>{Se(()=>(d.before_navigate.push(a),()=>{const f=d.before_navigate.indexOf(a);d.before_navigate.splice(f,1)}))},disable_scroll_handling:()=>{(_||!m)&&(p=!1)},goto:(a,f={})=>x(a,f,[]),invalidate:a=>{if(a===void 0)throw new Error("`invalidate()` (with no arguments) has been replaced by `invalidateAll()`");if(typeof a=="function")o.push(a);else{const{href:f}=new URL(a,location.href);o.push(u=>u.href===f)}return ae()},invalidateAll:()=>(w=!0,ae()),prefetch:async a=>{const f=new URL(a,Fe(document));await se(f)},prefetch_routes:async a=>{const u=(a?le.filter(i=>a.some(l=>i.exec(l))):le).map(i=>Promise.all([...i.layouts,i.leaf].map(l=>l==null?void 0:l[1]())));await Promise.all(u)},apply_action:async a=>{if(a.type==="error"){const f=new URL(location.href),{branch:u,route:i}=n;if(!i)return;const l=await Ue(n.branch.length,u,i.errors);if(l){const h=await ee({url:f,params:n.params,branch:u.slice(0,l.idx).concat(l.node),status:500,error:a.error,route:i});n=h.state;const g=fe();R.$set(h.props),g()}}else if(a.type==="redirect")x(a.location,{invalidateAll:!0},[]);else{const f={form:a.data,page:{...D,form:a.data,status:a.status}},u=fe();R.$set(f),u()}},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",i=>{var g,E;let l=!1;const h={from:ce("from",{params:n.params,routeId:(E=(g=n.route)==null?void 0:g.id)!=null?E:null,url:n.url}),to:null,type:"unload",cancel:()=>l=!0};d.before_navigate.forEach(k=>k(h)),l?(i.preventDefault(),i.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){ke(U);try{sessionStorage[We]=JSON.stringify(re)}catch{}}});const a=i=>{const{url:l,options:h}=Je(i);if(l&&h.prefetch){if(Te(l))return;se(l)}};let f;const u=i=>{clearTimeout(f),f=setTimeout(()=>{var l;(l=i.target)==null||l.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch",{bubbles:!0}))},20)};addEventListener("touchstart",a),addEventListener("mousemove",u),addEventListener("sveltekit:trigger_prefetch",a),addEventListener("click",i=>{if(i.button||i.which!==1||i.metaKey||i.ctrlKey||i.shiftKey||i.altKey||i.defaultPrevented)return;const{a:l,url:h,options:g}=Je(i);if(!l||!h)return;const E=l instanceof SVGAElement;if(!E&&h.protocol!==location.protocol&&!(h.protocol==="https:"||h.protocol==="http:"))return;const k=(l.getAttribute("rel")||"").split(/\s+/);if(l.hasAttribute("download")||k.includes("external")||g.reload||(E?l.target.baseVal:l.target))return;const[b,v]=h.href.split("#");if(v!==void 0&&b===location.href.split("#")[0]){T=!0,ke(U),n.url=h,z.page.set({...D,url:h}),z.page.notify();return}we({url:h,scroll:g.noscroll?Re():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:h.href===location.href},accepted:()=>i.preventDefault(),blocked:()=>i.preventDefault(),type:"link"})}),addEventListener("popstate",i=>{if(i.state){if(i.state[V]===U)return;const l=i.state[V]-U;we({url:new URL(location.href),scroll:re[i.state[V]],keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{U=i.state[V]},blocked:()=>{history.go(-l)},type:"popstate",delta:l})}}),addEventListener("hashchange",()=>{T&&(T=!1,history.replaceState({...history.state,[V]:++U},"",location.href))});for(const i of document.querySelectorAll("link"))i.rel==="icon"&&(i.href=i.href);addEventListener("pageshow",i=>{i.persisted&&z.navigating.set(null)})},_hydrate:async({status:a,error:f,node_ids:u,params:i,routeId:l,data:h,form:g})=>{var b;c=!0;const E=new URL(location.href);let k;try{const v=u.map(async(O,I)=>{const L=h[I];return ge({loader:me[O],url:E,params:i,routeId:l,parent:async()=>{const N={};for(let P=0;P<I;P+=1)Object.assign(N,(await v[P]).data);return N},server_data_node:_e(L)})});k=await ee({url:E,params:i,branch:await Promise.all(v),status:a,error:f,form:g,route:(b=le.find(O=>O.id===l))!=null?b:null})}catch(v){if(v instanceof Me){await ie(new URL(v.location,location.href));return}k=await oe({status:v instanceof Oe?v.status:500,error:ne(v,{url:E,params:i,routeId:l}),url:E,routeId:l})}je(k)}}}async function He(r,e){const t=new URL(r);t.pathname=mt(r.pathname);const o=await he(t.href,{headers:{"x-sveltekit-invalidated":e.map(d=>d?"1":"").join(",")}}),s=await o.text();if(!o.ok)throw new Error(JSON.parse(s));return Kt(s)}function ne(r,e){var t;return r instanceof Oe?r.body:(t=Dt.handleError({error:r,event:e}))!=null?t:{message:e.routeId!=null?"Internal Error":"Not Found"}}const Ht=["hash","href","host","hostname","origin","pathname","port","protocol","search","searchParams","toString","toJSON"];function ce(r,e){for(const t of Ht)Object.defineProperty(e,t,{get(){throw new Error(`The navigation shape changed - ${r}.${t} should now be ${r}.url.${t}`)},enumerable:!1});return e}function fe(){return()=>{}}async function Xt({env:r,hydrate:e,paths:t,target:o,trailing_slash:s}){it(t);const d=Mt({target:o,base:t.base,trailing_slash:s});lt({client:d}),e?await d._hydrate(e):d.goto(location.href,{replaceState:!0}),d._start_router()}export{Xt as start};
