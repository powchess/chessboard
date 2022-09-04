var He=Object.defineProperty;var We=(r,e,t)=>e in r?He(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var he=(r,e,t)=>(We(r,typeof e!="symbol"?e+"":e,t),t);import{S as xe,i as Me,s as Xe,a as Ye,e as V,c as Qe,b as G,g as se,t as B,d as oe,f as z,h as J,j as Ze,o as ge,k as et,l as tt,m as rt,n as me,p as N,q as nt,r as at,u as st,v as W,w as ve,x,y as M,z as Ne}from"./chunks/index-6e002427.js";import{g as Ce,f as qe,s as F,a as we,b as ot,i as it}from"./chunks/singletons-5a383ffd.js";const lt=function(){const e=document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),ct=function(r,e){return new URL(r,e).href},Ve={},re=function(e,t,l){return!t||t.length===0?e():Promise.all(t.map(s=>{if(s=ct(s,l),s in Ve)return;Ve[s]=!0;const u=s.endsWith(".css"),n=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${n}`))return;const c=document.createElement("link");if(c.rel=u?"stylesheet":lt,u||(c.as="script",c.crossOrigin=""),c.href=s,document.head.appendChild(c),u)return new Promise((_,h)=>{c.addEventListener("load",_),c.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e())};class ne{constructor(e,t){he(this,"name","HttpError");he(this,"stack");this.status=e,this.message=t!=null?t:`Error: ${e}`}toString(){return this.message}}class Be{constructor(e,t){this.status=e,this.location=t}}function ft(r,e){return r==="/"||e==="ignore"?r:e==="never"?r.endsWith("/")?r.slice(0,-1):r:e==="always"&&!r.endsWith("/")?r+"/":r}function ut(r){for(const e in r)r[e]=r[e].replace(/%23/g,"#").replace(/%3[Bb]/g,";").replace(/%2[Cc]/g,",").replace(/%2[Ff]/g,"/").replace(/%3[Ff]/g,"?").replace(/%3[Aa]/g,":").replace(/%40/g,"@").replace(/%26/g,"&").replace(/%3[Dd]/g,"=").replace(/%2[Bb]/g,"+").replace(/%24/g,"$");return r}const dt=["href","pathname","search","searchParams","toString","toJSON"];function pt(r,e){const t=new URL(r);for(const l of dt){let s=t[l];Object.defineProperty(t,l,{get(){return e(),s},enumerable:!0,configurable:!0})}return t[Symbol.for("nodejs.util.inspect.custom")]=(l,s,u)=>u(r,s),ht(t),t}function ht(r){Object.defineProperty(r,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}function mt(r){let e=5381,t=r.length;if(typeof r=="string")for(;t;)e=e*33^r.charCodeAt(--t);else for(;t;)e=e*33^r[--t];return(e>>>0).toString(36)}const ke=window.fetch;window.fetch=(r,e)=>{if((r instanceof Request?r.method:(e==null?void 0:e.method)||"GET")!=="GET"){const l=new URL(r instanceof Request?r.url:r.toString(),document.baseURI).href;ae.delete(l)}return ke(r,e)};const ae=new Map;function _t(r,e,t){let s=`script[data-sveltekit-fetched][data-url=${JSON.stringify(typeof r=="string"?r:r.url)}]`;t&&typeof t.body=="string"&&(s+=`[data-hash="${mt(t.body)}"]`);const u=document.querySelector(s);if(u!=null&&u.textContent){const{body:n,...c}=JSON.parse(u.textContent),_=u.getAttribute("data-ttl");return _&&ae.set(e,{body:n,init:c,ttl:1e3*Number(_)}),Promise.resolve(new Response(n,c))}return ke(r,t)}function gt(r,e){const t=ae.get(r);if(t){if(performance.now()<t.ttl)return new Response(t.body,t.init);ae.delete(r)}return ke(r,e)}const wt=/^(\.\.\.)?(\w+)(?:=(\w+))?$/;function yt(r){const e=[],t=[];let l=!0;if(/\]\[/.test(r))throw new Error(`Invalid route ${r} \u2014 parameters must be separated`);if(ze("[",r)!==ze("]",r))throw new Error(`Invalid route ${r} \u2014 brackets are unbalanced`);return{pattern:r===""?/^\/$/:new RegExp(`^${r.split(/(?:\/|$)/).filter(bt).map((u,n,c)=>{const _=decodeURIComponent(u),h=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(_);if(h)return e.push(h[1]),t.push(h[2]),"(?:/(.*))?";const v=n===c.length-1;return _&&"/"+_.split(/\[(.+?)\]/).map((L,R)=>{if(R%2){const K=wt.exec(L);if(!K)throw new Error(`Invalid param: ${L}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,j,D,C]=K;return e.push(D),t.push(C),j?"(.*?)":"([^/]+?)"}return v&&L.includes(".")&&(l=!1),L.normalize().replace(/%5[Bb]/g,"[").replace(/%5[Dd]/g,"]").replace(/#/g,"%23").replace(/\?/g,"%3F").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("")}).join("")}${l?"/?":""}$`),names:e,types:t}}function bt(r){return!/^\([^)]+\)$/.test(r)}function vt(r,e,t,l){const s={};for(let u=0;u<e.length;u+=1){const n=e[u],c=t[u],_=r[u+1]||"";if(c){const h=l[c];if(!h)throw new Error(`Missing "${c}" param matcher`);if(!h(_))return}s[n]=_}return s}function ze(r,e){let t=0;for(let l=0;l<e.length;l+=1)e[l]===r&&(t+=1);return t}function kt(r,e,t,l){const s=new Set(e);return Object.entries(t).map(([c,[_,h,v]])=>{const{pattern:L,names:R,types:K}=yt(c),j={id:c,exec:D=>{const C=L.exec(D);if(C)return vt(C,R,K,l)},errors:[1,...v||[]].map(D=>r[D]),layouts:[0,...h||[]].map(n),leaf:u(_)};return j.errors.length=j.layouts.length=Math.max(j.errors.length,j.layouts.length),j});function u(c){const _=c<0;return _&&(c=~c),[_,r[c]]}function n(c){return c===void 0?c:[s.has(c),r[c]]}}function Et(r,e){return new ne(r,e)}function St(r){let e,t,l;var s=r[0][0];function u(n){return{props:{data:n[1],errors:n[3]}}}return s&&(e=new s(u(r))),{c(){e&&W(e.$$.fragment),t=V()},l(n){e&&ve(e.$$.fragment,n),t=V()},m(n,c){e&&x(e,n,c),G(n,t,c),l=!0},p(n,c){const _={};if(c&2&&(_.data=n[1]),c&8&&(_.errors=n[3]),s!==(s=n[0][0])){if(e){se();const h=e;B(h.$$.fragment,1,0,()=>{M(h,1)}),oe()}s?(e=new s(u(n)),W(e.$$.fragment),z(e.$$.fragment,1),x(e,t.parentNode,t)):e=null}else s&&e.$set(_)},i(n){l||(e&&z(e.$$.fragment,n),l=!0)},o(n){e&&B(e.$$.fragment,n),l=!1},d(n){n&&J(t),e&&M(e,n)}}}function Rt(r){let e,t,l;var s=r[0][0];function u(n){return{props:{data:n[1],errors:n[3],$$slots:{default:[$t]},$$scope:{ctx:n}}}}return s&&(e=new s(u(r))),{c(){e&&W(e.$$.fragment),t=V()},l(n){e&&ve(e.$$.fragment,n),t=V()},m(n,c){e&&x(e,n,c),G(n,t,c),l=!0},p(n,c){const _={};if(c&2&&(_.data=n[1]),c&8&&(_.errors=n[3]),c&525&&(_.$$scope={dirty:c,ctx:n}),s!==(s=n[0][0])){if(e){se();const h=e;B(h.$$.fragment,1,0,()=>{M(h,1)}),oe()}s?(e=new s(u(n)),W(e.$$.fragment),z(e.$$.fragment,1),x(e,t.parentNode,t)):e=null}else s&&e.$set(_)},i(n){l||(e&&z(e.$$.fragment,n),l=!0)},o(n){e&&B(e.$$.fragment,n),l=!1},d(n){n&&J(t),e&&M(e,n)}}}function $t(r){let e,t,l;var s=r[0][1];function u(n){return{props:{data:n[2],errors:n[3]}}}return s&&(e=new s(u(r))),{c(){e&&W(e.$$.fragment),t=V()},l(n){e&&ve(e.$$.fragment,n),t=V()},m(n,c){e&&x(e,n,c),G(n,t,c),l=!0},p(n,c){const _={};if(c&4&&(_.data=n[2]),c&8&&(_.errors=n[3]),s!==(s=n[0][1])){if(e){se();const h=e;B(h.$$.fragment,1,0,()=>{M(h,1)}),oe()}s?(e=new s(u(n)),W(e.$$.fragment),z(e.$$.fragment,1),x(e,t.parentNode,t)):e=null}else s&&e.$set(_)},i(n){l||(e&&z(e.$$.fragment,n),l=!0)},o(n){e&&B(e.$$.fragment,n),l=!1},d(n){n&&J(t),e&&M(e,n)}}}function Je(r){let e,t=r[5]&&Ke(r);return{c(){e=et("div"),t&&t.c(),this.h()},l(l){e=tt(l,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var s=rt(e);t&&t.l(s),s.forEach(J),this.h()},h(){me(e,"id","svelte-announcer"),me(e,"aria-live","assertive"),me(e,"aria-atomic","true"),N(e,"position","absolute"),N(e,"left","0"),N(e,"top","0"),N(e,"clip","rect(0 0 0 0)"),N(e,"clip-path","inset(50%)"),N(e,"overflow","hidden"),N(e,"white-space","nowrap"),N(e,"width","1px"),N(e,"height","1px")},m(l,s){G(l,e,s),t&&t.m(e,null)},p(l,s){l[5]?t?t.p(l,s):(t=Ke(l),t.c(),t.m(e,null)):t&&(t.d(1),t=null)},d(l){l&&J(e),t&&t.d()}}}function Ke(r){let e;return{c(){e=nt(r[6])},l(t){e=at(t,r[6])},m(t,l){G(t,e,l)},p(t,l){l&64&&st(e,t[6])},d(t){t&&J(e)}}}function Lt(r){let e,t,l,s,u;const n=[Rt,St],c=[];function _(v,L){return v[0][1]?0:1}e=_(r),t=c[e]=n[e](r);let h=r[4]&&Je(r);return{c(){t.c(),l=Ye(),h&&h.c(),s=V()},l(v){t.l(v),l=Qe(v),h&&h.l(v),s=V()},m(v,L){c[e].m(v,L),G(v,l,L),h&&h.m(v,L),G(v,s,L),u=!0},p(v,[L]){let R=e;e=_(v),e===R?c[e].p(v,L):(se(),B(c[R],1,1,()=>{c[R]=null}),oe(),t=c[e],t?t.p(v,L):(t=c[e]=n[e](v),t.c()),z(t,1),t.m(l.parentNode,l)),v[4]?h?h.p(v,L):(h=Je(v),h.c(),h.m(s.parentNode,s)):h&&(h.d(1),h=null)},i(v){u||(z(t),u=!0)},o(v){B(t),u=!1},d(v){c[e].d(v),v&&J(l),h&&h.d(v),v&&J(s)}}}function Pt(r,e,t){let{stores:l}=e,{page:s}=e,{components:u}=e,{data_0:n=null}=e,{data_1:c=null}=e,{errors:_}=e;Ze(l.page.notify);let h=!1,v=!1,L=null;return ge(()=>{const R=l.page.subscribe(()=>{h&&(t(5,v=!0),t(6,L=document.title||"untitled page"))});return t(4,h=!0),R}),r.$$set=R=>{"stores"in R&&t(7,l=R.stores),"page"in R&&t(8,s=R.page),"components"in R&&t(0,u=R.components),"data_0"in R&&t(1,n=R.data_0),"data_1"in R&&t(2,c=R.data_1),"errors"in R&&t(3,_=R.errors)},r.$$.update=()=>{r.$$.dirty&384&&l.page.set(s)},[u,n,c,_,h,v,L,l,s]}class Ot extends xe{constructor(e){super(),Me(this,e,Pt,Lt,Xe,{stores:7,page:8,components:0,data_0:1,data_1:2,errors:3})}}const jt={},ie=[()=>re(()=>import("./chunks/0-595c83bb.js"),["chunks/0-595c83bb.js","components/pages/_layout.svelte-24277b24.js","assets/_layout-ab630dda.css","chunks/index-6e002427.js"],import.meta.url),()=>re(()=>import("./chunks/1-a13e7e55.js"),["chunks/1-a13e7e55.js","components/error.svelte-60c6d99a.js","chunks/index-6e002427.js","chunks/singletons-5a383ffd.js","chunks/index-be90f349.js"],import.meta.url),()=>re(()=>import("./chunks/2-5b9bc4bb.js"),["chunks/2-5b9bc4bb.js","components/pages/_page.svelte-f374ba56.js","assets/_page-ae27a222.css","chunks/index-6e002427.js","chunks/index-be90f349.js"],import.meta.url)],Ut=[0],It={"":[2]},At="/__data.js",Ge="sveltekit:scroll",q="sveltekit:index",ee=kt(ie,Ut,It,jt),ye=ie[0],be=ie[1];ye();be();let Y={};try{Y=JSON.parse(sessionStorage[Ge])}catch{}function _e(r){Y[r]=we()}function Tt({target:r,base:e,trailing_slash:t}){var Ie;const l=[],s={id:null,promise:null},u={before_navigate:[],after_navigate:[]};let n={branch:[],error:null,session_id:0,url:null},c=!1,_=!0,h=!1,v=1,L=null,R=!1,K,j=(Ie=history.state)==null?void 0:Ie[q];j||(j=Date.now(),history.replaceState({...history.state,[q]:j},"",location.href));const D=Y[j];D&&(history.scrollRestoration="manual",scrollTo(D.x,D.y));let C=!1,H,Ee;function Se(){if(!L){const a=new URL(location.href);L=Promise.resolve().then(async()=>{const i=fe(a);await Le(i,a,[]),L=null,R=!1})}return L}async function Re(a,{noscroll:i=!1,replaceState:d=!1,keepfocus:o=!1,state:f={}},w){return typeof a=="string"&&(a=new URL(a,Ce(document))),ue({url:a,scroll:i?we():null,keepfocus:o,redirect_chain:w,details:{state:f,replaceState:d},accepted:()=>{},blocked:()=>{},type:"goto"})}async function $e(a){const i=fe(a);if(!i)throw new Error("Attempted to prefetch a URL that does not belong to this app");return s.promise=je(i),s.id=i.id,s.promise}async function Le(a,i,d,o,f){var S,k;const w=Ee={};let g=a&&await je(a);if(!g&&i.origin===location.origin&&i.pathname===location.pathname&&(g=await Z({status:404,error:new Error(`Not found: ${i.pathname}`),url:i,routeId:null})),!g)return await X(i),!1;if(i=(a==null?void 0:a.url)||i,Ee!==w)return!1;if(l.length=0,g.type==="redirect")if(d.length>10||d.includes(i.pathname))g=await Z({status:500,error:new Error("Redirect loop"),url:i,routeId:null});else return Re(new URL(g.location,i).href,{},[...d,i.pathname]),!1;else((k=(S=g.props)==null?void 0:S.page)==null?void 0:k.status)>=400&&await F.updated.check()&&await X(i);if(h=!0,o&&o.details){const{details:b}=o,y=b.replaceState?0:1;b.state[q]=j+=y,history[b.replaceState?"replaceState":"pushState"](b.state,"",i)}if(c?(n=g.state,g.props.page&&(g.props.page.url=i),K.$set(g.props)):Pe(g),o){const{scroll:b,keepfocus:y}=o;if(!y){const E=document.body,I=E.getAttribute("tabindex");E.tabIndex=-1,E.focus({preventScroll:!0}),setTimeout(()=>{var $;($=getSelection())==null||$.removeAllRanges()}),I!==null?E.setAttribute("tabindex",I):E.removeAttribute("tabindex")}if(await Ne(),_){const E=i.hash&&document.getElementById(i.hash.slice(1));b?scrollTo(b.x,b.y):E?E.scrollIntoView():scrollTo(0,0)}}else await Ne();s.promise=null,s.id=null,_=!0,g.props.page&&(H=g.props.page),f&&f(),h=!1}function Pe(a){var o,f;n=a.state;const i=document.querySelector("style[data-sveltekit]");i&&i.remove(),H=a.props.page,K=new Ot({target:r,props:{...a.props,stores:F},hydrate:!0});const d={from:null,to:te("to",{params:n.params,routeId:(f=(o=n.route)==null?void 0:o.id)!=null?f:null,url:new URL(location.href)}),type:"load"};u.after_navigate.forEach(w=>w(d)),c=!0}async function Q({url:a,params:i,branch:d,status:o,error:f,route:w,validation_errors:g}){var I;const S=d.filter(Boolean),k={type:"loaded",state:{url:a,params:i,branch:d,error:f,route:w,session_id:v},props:{components:S.map($=>$.node.component),errors:g}};let b={},y=!H;for(let $=0;$<S.length;$+=1){const O=S[$];b={...b,...O.data},(y||!n.branch.some(p=>p===O))&&(k.props[`data_${$}`]=b,y=y||Object.keys((I=O.data)!=null?I:{}).length>0)}if(y||(y=Object.keys(H.data).length!==Object.keys(b).length),!n.url||a.href!==n.url.href||n.error!==f||y){k.props.page={error:f,params:i,routeId:w&&w.id,status:o,url:a,data:y?b:H.data};const $=(O,p)=>{Object.defineProperty(k.props.page,O,{get:()=>{throw new Error(`$page.${O} has been replaced by $page.url.${p}`)}})};$("origin","origin"),$("path","pathname"),$("query","searchParams")}return k}async function le({loader:a,parent:i,url:d,params:o,routeId:f,server_data_node:w}){var b,y,E,I,$;let g=null;const S={dependencies:new Set,params:new Set,parent:!1,url:!1},k=await a();if((b=k.shared)!=null&&b.load){let O=function(...m){for(const P of m){const{href:A}=new URL(P,d);S.dependencies.add(A)}};const p={};for(const m in o)Object.defineProperty(p,m,{get(){return S.params.add(m),o[m]},enumerable:!0});const U={routeId:f,params:p,data:(y=w==null?void 0:w.data)!=null?y:null,url:pt(d,()=>{S.url=!0}),async fetch(m,P){let A;typeof m=="string"?A=m:(A=m.url,P={body:m.method==="GET"||m.method==="HEAD"?void 0:await m.blob(),cache:m.cache,credentials:m.credentials,headers:m.headers,integrity:m.integrity,keepalive:m.keepalive,method:m.method,mode:m.mode,redirect:m.redirect,referrer:m.referrer,referrerPolicy:m.referrerPolicy,signal:m.signal,...P});const T=new URL(A,d).href;return O(T),c?gt(T,P):_t(A,T,P)},setHeaders:()=>{},depends:O,parent(){return S.parent=!0,i()}};Object.defineProperties(U,{props:{get(){throw new Error("@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},session:{get(){throw new Error("session is no longer available. See https://github.com/sveltejs/kit/discussions/5883")},enumerable:!1},stuff:{get(){throw new Error("@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1}}),g=(E=await k.shared.load.call(null,U))!=null?E:null}return{node:k,loader:a,server:w,shared:(I=k.shared)!=null&&I.load?{type:"data",data:g,uses:S}:null,data:($=g!=null?g:w==null?void 0:w.data)!=null?$:null}}function Oe(a,i,d){if(R)return!0;if(!d)return!1;if(d.parent&&i||a.url&&d.url)return!0;for(const o of a.params)if(d.params.has(o))return!0;for(const o of d.dependencies)if(l.some(f=>f(new URL(o))))return!0;return!1}function ce(a,i){var d,o;return(a==null?void 0:a.type)==="data"?{type:"data",data:a.data,uses:{dependencies:new Set((d=a.uses.dependencies)!=null?d:[]),params:new Set((o=a.uses.params)!=null?o:[]),parent:!!a.uses.parent,url:!!a.uses.url}}:(a==null?void 0:a.type)==="skip"&&i!=null?i:null}async function je({id:a,url:i,params:d,route:o}){if(s.id===a&&s.promise)return s.promise;const{errors:f,layouts:w,leaf:g}=o,S=n.url&&{url:a!==n.url.pathname+n.url.search,params:Object.keys(d).filter(p=>n.params[p]!==d[p])},k=[...w,g];f.forEach(p=>p==null?void 0:p().catch(()=>{})),k.forEach(p=>p==null?void 0:p[1]().catch(()=>{}));let b=null;const y=k.reduce((p,U,m)=>{var T;const P=n.branch[m],A=!!(U!=null&&U[0])&&((P==null?void 0:P.loader)!==U[1]||Oe(S,p.some(Boolean),(T=P.server)==null?void 0:T.uses));return p.push(A),p},[]);if(y.some(Boolean)){try{b=await Fe(i,y)}catch(p){return Z({status:500,error:p,url:i,routeId:o.id})}if(b.type==="redirect")return b}const E=b==null?void 0:b.nodes;let I=!1;const $=k.map(async(p,U)=>{var de,Ae;if(!p)return;const m=n.branch[U],P=(de=E==null?void 0:E[U])!=null?de:null;if((!P||P.type==="skip")&&p[1]===(m==null?void 0:m.loader)&&!Oe(S,I,(Ae=m.shared)==null?void 0:Ae.uses))return m;if(I=!0,(P==null?void 0:P.type)==="error")throw P.httperror?Et(P.httperror.status,P.httperror.message):P.error;return le({loader:p[1],url:i,params:d,routeId:o.id,parent:async()=>{var De;const Te={};for(let pe=0;pe<U;pe+=1)Object.assign(Te,(De=await $[pe])==null?void 0:De.data);return Te},server_data_node:ce(P,m==null?void 0:m.server)})});for(const p of $)p.catch(()=>{});const O=[];for(let p=0;p<k.length;p+=1)if(k[p])try{O.push(await $[p])}catch(U){const m=U;if(m instanceof Be)return{type:"redirect",location:m.location};const P=U instanceof ne?U.status:500;for(;p--;)if(f[p]){let A,T=p;for(;!O[T];)T-=1;try{return A={node:await f[p](),loader:f[p],data:{},server:null,shared:null},await Q({url:i,params:d,branch:O.slice(0,T+1).concat(A),status:P,error:m,route:o})}catch{continue}}await X(i);return}else O.push(void 0);return await Q({url:i,params:d,branch:O,status:200,error:null,route:o})}async function Z({status:a,error:i,url:d,routeId:o}){var b;const f={},w=await ye();let g=null;if(w.server)try{const y=await Fe(d,[!0]);if(y.type!=="data"||y.nodes[0]&&y.nodes[0].type!=="data")throw 0;g=(b=y.nodes[0])!=null?b:null}catch{await X(d);return}const S=await le({loader:ye,url:d,params:f,routeId:o,parent:()=>Promise.resolve({}),server_data_node:ce(g)}),k={node:await be(),loader:be,shared:null,server:null,data:null};return await Q({url:d,params:f,branch:[S,k],status:a,error:i,route:null})}function fe(a){if(Ue(a))return;const i=decodeURI(a.pathname.slice(e.length)||"/");for(const d of ee){const o=d.exec(i);if(o){const f=new URL(a.origin+ft(a.pathname,t)+a.search+a.hash);return{id:f.pathname+f.search,route:d,params:ut(o),url:f}}}}function Ue(a){return a.origin!==location.origin||!a.pathname.startsWith(e)}async function ue({url:a,scroll:i,keepfocus:d,redirect_chain:o,details:f,type:w,delta:g,accepted:S,blocked:k}){var $,O,p,U;let b=!1;const y=fe(a),E={from:te("from",{params:n.params,routeId:(O=($=n.route)==null?void 0:$.id)!=null?O:null,url:n.url}),to:te("to",{params:(p=y==null?void 0:y.params)!=null?p:null,routeId:(U=y==null?void 0:y.route.id)!=null?U:null,url:a}),type:w};g!==void 0&&(E.delta=g);const I={...E,cancel:()=>{b=!0}};if(u.before_navigate.forEach(m=>m(I)),b){k();return}_e(j),S(),c&&F.navigating.set(E),await Le(y,a,o,{scroll:i,keepfocus:d,details:f},()=>{u.after_navigate.forEach(m=>m(E)),F.navigating.set(null)})}function X(a){return location.href=a.href,new Promise(()=>{})}return{after_navigate:a=>{ge(()=>(u.after_navigate.push(a),()=>{const i=u.after_navigate.indexOf(a);u.after_navigate.splice(i,1)}))},before_navigate:a=>{ge(()=>(u.before_navigate.push(a),()=>{const i=u.before_navigate.indexOf(a);u.before_navigate.splice(i,1)}))},disable_scroll_handling:()=>{(h||!c)&&(_=!1)},goto:(a,i={})=>Re(a,i,[]),invalidate:a=>{if(a===void 0)throw new Error("`invalidate()` (with no arguments) has been replaced by `invalidateAll()`");if(typeof a=="function")l.push(a);else{const{href:i}=new URL(a,location.href);l.push(d=>d.href===i)}return Se()},invalidateAll:()=>(R=!0,Se()),prefetch:async a=>{const i=new URL(a,Ce(document));await $e(i)},prefetch_routes:async a=>{const d=(a?ee.filter(o=>a.some(f=>o.exec(f))):ee).map(o=>Promise.all([...o.layouts,o.leaf].map(f=>f==null?void 0:f[1]())));await Promise.all(d)},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",o=>{var g,S;let f=!1;const w={from:te("from",{params:n.params,routeId:(S=(g=n.route)==null?void 0:g.id)!=null?S:null,url:n.url}),to:null,type:"unload",cancel:()=>f=!0};u.before_navigate.forEach(k=>k(w)),f?(o.preventDefault(),o.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){_e(j);try{sessionStorage[Ge]=JSON.stringify(Y)}catch{}}});const a=o=>{const{url:f,options:w}=qe(o);if(f&&w.prefetch){if(Ue(f))return;$e(f)}};let i;const d=o=>{clearTimeout(i),i=setTimeout(()=>{var f;(f=o.target)==null||f.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch",{bubbles:!0}))},20)};addEventListener("touchstart",a),addEventListener("mousemove",d),addEventListener("sveltekit:trigger_prefetch",a),addEventListener("click",o=>{if(o.button||o.which!==1||o.metaKey||o.ctrlKey||o.shiftKey||o.altKey||o.defaultPrevented)return;const{a:f,url:w,options:g}=qe(o);if(!f||!w)return;const S=f instanceof SVGAElement;if(!S&&!(w.protocol==="https:"||w.protocol==="http:"))return;const k=(f.getAttribute("rel")||"").split(/\s+/);if(f.hasAttribute("download")||k.includes("external")||g.reload||(S?f.target.baseVal:f.target))return;const[b,y]=w.href.split("#");if(y!==void 0&&b===location.href.split("#")[0]){C=!0,_e(j),F.page.set({...H,url:w}),F.page.notify();return}ue({url:w,scroll:g.noscroll?we():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:w.href===location.href},accepted:()=>o.preventDefault(),blocked:()=>o.preventDefault(),type:"link"})}),addEventListener("popstate",o=>{if(o.state){if(o.state[q]===j)return;const f=o.state[q]-j;ue({url:new URL(location.href),scroll:Y[o.state[q]],keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{j=o.state[q]},blocked:()=>{history.go(-f)},type:"popstate",delta:f})}}),addEventListener("hashchange",()=>{C&&(C=!1,history.replaceState({...history.state,[q]:++j},"",location.href))});for(const o of document.querySelectorAll("link"))o.rel==="icon"&&(o.href=o.href);addEventListener("pageshow",o=>{o.persisted&&F.navigating.set(null)})},_hydrate:async({status:a,error:i,node_ids:d,params:o,routeId:f,data:w,errors:g})=>{var b;const S=new URL(location.href);let k;try{const y=d.map(async(E,I)=>{const $=w[I];return le({loader:ie[E],url:S,params:o,routeId:f,parent:async()=>{const O={};for(let p=0;p<I;p+=1)Object.assign(O,(await y[p]).data);return O},server_data_node:ce($)})});k=await Q({url:S,params:o,branch:await Promise.all(y),status:a,error:i!=null&&i.__is_http_error?new ne(i.status,i.message):i,validation_errors:g,route:(b=ee.find(E=>E.id===f))!=null?b:null})}catch(y){const E=y;if(E instanceof Be){await X(new URL(y.location,location.href));return}k=await Z({status:E instanceof ne?E.status:500,error:E,url:S,routeId:f})}Pe(k)}}}let Dt=1;async function Fe(r,e){const t=new URL(r);t.pathname=r.pathname.replace(/\/$/,"")+At,t.searchParams.set("__invalid",e.map(s=>s?"y":"n").join("")),t.searchParams.set("__id",String(Dt++)),await re(()=>import(t.href),[],import.meta.url);const l=window.__sveltekit_data;return delete window.__sveltekit_data,l}const Nt=["hash","href","host","hostname","origin","pathname","port","protocol","search","searchParams","toString","toJSON"];function te(r,e){for(const t of Nt)Object.defineProperty(e,t,{get(){throw new Error(`The navigation shape changed - ${r}.${t} should now be ${r}.url.${t}`)}});return e}async function Bt({env:r,hydrate:e,paths:t,target:l,trailing_slash:s}){ot(t);const u=Tt({target:l,base:t.base,trailing_slash:s});it({client:u}),e?await u._hydrate(e):u.goto(location.href,{replaceState:!0}),u._start_router()}export{Bt as start};
