function E(){}const Z=t=>t;function At(t,e){for(const n in e)t[n]=e[n];return t}function ft(t){return t()}function ot(){return Object.create(null)}function N(t){t.forEach(ft)}function M(t){return typeof t=="function"}function Vt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let L;function Xt(t,e){return L||(L=document.createElement("a")),L.href=e,t===L.href}function Tt(t){return Object.keys(t).length===0}function dt(t,...e){if(t==null)return E;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Yt(t){let e;return dt(t,n=>e=n)(),e}function Zt(t,e,n){t.$$.on_destroy.push(dt(e,n))}function te(t,e,n,i){if(t){const s=_t(t,e,n,i);return t[0](s)}}function _t(t,e,n,i){return t[1]&&i?At(n.ctx.slice(),t[1](i(e))):n.ctx}function ee(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const o=[],r=Math.max(e.dirty.length,s.length);for(let a=0;a<r;a+=1)o[a]=e.dirty[a]|s[a];return o}return e.dirty|s}return e.dirty}function ne(t,e,n,i,s,o){if(s){const r=_t(e,n,i,o);t.p(r,s)}}function ie(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function se(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function re(t){return t==null?"":t}function oe(t){return t&&M(t.destroy)?t.destroy:E}const ht=typeof window<"u";let tt=ht?()=>window.performance.now():()=>Date.now(),et=ht?t=>requestAnimationFrame(t):E;const A=new Set;function mt(t){A.forEach(e=>{e.c(t)||(A.delete(e),e.f())}),A.size!==0&&et(mt)}function nt(t){let e;return A.size===0&&et(mt),{promise:new Promise(n=>{A.add(e={c:t,f:n})}),abort(){A.delete(e)}}}let J=!1;function St(){J=!0}function Mt(){J=!1}function Ct(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Dt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let l=0;l<e.length;l++){const d=e[l];d.claim_order!==void 0&&c.push(d)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const l=e[c].claim_order,d=(s>0&&e[n[s]].claim_order<=l?s+1:Ct(1,s,u=>e[n[u]].claim_order,l))-1;i[c]=n[d]+1;const f=d+1;n[f]=c,s=Math.max(f,s)}const o=[],r=[];let a=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);a>=c;a--)r.push(e[a]);a--}for(;a>=0;a--)r.push(e[a]);o.reverse(),r.sort((c,l)=>c.claim_order-l.claim_order);for(let c=0,l=0;c<r.length;c++){for(;l<o.length&&r[c].claim_order>=o[l].claim_order;)l++;const d=l<o.length?o[l]:null;t.insertBefore(r[c],d)}}function pt(t,e){t.appendChild(e)}function yt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Ht(t){const e=K("style");return jt(yt(t),e),e.sheet}function jt(t,e){return pt(t.head||t,e),e.sheet}function zt(t,e){if(J){for(Dt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Pt(t,e,n){t.insertBefore(e,n||null)}function Lt(t,e,n){J&&!n?zt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function T(t){t.parentNode.removeChild(t)}function ce(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function K(t){return document.createElement(t)}function gt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function it(t){return document.createTextNode(t)}function le(){return it(" ")}function ae(){return it("")}function ct(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function ue(t){return function(e){return e.preventDefault(),t.call(this,e)}}function fe(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function de(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function _e(t){return t===""?null:+t}function Rt(t){return Array.from(t.childNodes)}function bt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function wt(t,e,n,i,s=!1){bt(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const a=t[r];if(e(a)){const c=n(a);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),a}}for(let r=t.claim_info.last_index-1;r>=0;r--){const a=t[r];if(e(a)){const c=n(a);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,a}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function xt(t,e,n,i){return wt(t,s=>s.nodeName===e,s=>{const o=[];for(let r=0;r<s.attributes.length;r++){const a=s.attributes[r];n[a.name]||o.push(a.name)}o.forEach(r=>s.removeAttribute(r))},()=>i(e))}function he(t,e,n){return xt(t,e,n,K)}function me(t,e,n){return xt(t,e,n,gt)}function qt(t,e){return wt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>it(e),!0)}function pe(t){return qt(t," ")}function lt(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function ye(t,e){const n=lt(t,"HTML_TAG_START",0),i=lt(t,"HTML_TAG_END",n);if(n===i)return new at(void 0,e);bt(t);const s=t.splice(n,i-n+1);T(s[0]),T(s[s.length-1]);const o=s.slice(1,s.length-1);for(const r of o)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new at(o,e)}function ge(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function be(t,e){t.value=e==null?"":e}function we(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function xe(t,e){for(let n=0;n<t.options.length;n+=1){const i=t.options[n];if(i.__value===e){i.selected=!0;return}}t.selectedIndex=-1}function $e(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}let R;function Ot(){if(R===void 0){R=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{R=!0}}return R}function ve(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=K("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=Ot();let o;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=ct(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{o=ct(i.contentWindow,"resize",e)}),pt(t,i),()=>{(s||o&&i.contentWindow)&&o(),T(i)}}function $t(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function Ee(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const o=s.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(s)):o===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class Bt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=gt(n.nodeName):this.e=K(n.nodeName),this.t=n,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)Pt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(T)}}class at extends Bt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)Lt(this.t,this.n[n],e)}}function ke(t,e){return new t(e)}const W=new Map;let F=0;function Wt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Ft(t,e){const n={stylesheet:Ht(e),rules:{}};return W.set(t,n),n}function G(t,e,n,i,s,o,r,a=0){const c=16.666/i;let l=`{
`;for(let m=0;m<=1;m+=c){const g=e+(n-e)*o(m);l+=m*100+`%{${r(g,1-g)}}
`}const d=l+`100% {${r(n,1-n)}}
}`,f=`__svelte_${Wt(d)}_${a}`,u=yt(t),{stylesheet:_,rules:h}=W.get(u)||Ft(u,t);h[f]||(h[f]=!0,_.insertRule(`@keyframes ${f} ${d}`,_.cssRules.length));const y=t.style.animation||"";return t.style.animation=`${y?`${y}, `:""}${f} ${i}ms linear ${s}ms 1 both`,F+=1,f}function I(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),F-=s,F||Gt())}function Gt(){et(()=>{F||(W.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&T(e)}),W.clear())})}let j;function H(t){j=t}function Q(){if(!j)throw new Error("Function called outside component initialization");return j}function Ne(t){Q().$$.on_mount.push(t)}function Ae(t){Q().$$.after_update.push(t)}function Te(t){Q().$$.on_destroy.push(t)}function Se(){const t=Q();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const o=$t(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,o)}),!o.defaultPrevented}return!0}}function Me(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const D=[],ut=[],O=[],X=[],vt=Promise.resolve();let Y=!1;function Et(){Y||(Y=!0,vt.then(kt))}function Ce(){return Et(),vt}function S(t){O.push(t)}function De(t){X.push(t)}const V=new Set;let q=0;function kt(){const t=j;do{for(;q<D.length;){const e=D[q];q++,H(e),It(e.$$)}for(H(null),D.length=0,q=0;ut.length;)ut.pop()();for(let e=0;e<O.length;e+=1){const n=O[e];V.has(n)||(V.add(n),n())}O.length=0}while(D.length);for(;X.length;)X.pop()();Y=!1,V.clear(),H(t)}function It(t){if(t.fragment!==null){t.update(),N(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}let C;function st(){return C||(C=Promise.resolve(),C.then(()=>{C=null})),C}function k(t,e,n){t.dispatchEvent($t(`${e?"intro":"outro"}${n}`))}const B=new Set;let v;function He(){v={r:0,c:[],p:v}}function je(){v.r||N(v.c),v=v.p}function Nt(t,e){t&&t.i&&(B.delete(t),t.i(e))}function Jt(t,e,n,i){if(t&&t.o){if(B.has(t))return;B.add(t),v.c.push(()=>{B.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const rt={duration:0};function ze(t,e,n){let i=e(t,n),s=!1,o,r,a=0;function c(){o&&I(t,o)}function l(){const{delay:f=0,duration:u=300,easing:_=Z,tick:h=E,css:y}=i||rt;y&&(o=G(t,0,1,u,f,_,y,a++)),h(0,1);const m=tt()+f,g=m+u;r&&r.abort(),s=!0,S(()=>k(t,!0,"start")),r=nt(b=>{if(s){if(b>=g)return h(1,0),k(t,!0,"end"),c(),s=!1;if(b>=m){const w=_((b-m)/u);h(w,1-w)}}return s})}let d=!1;return{start(){d||(d=!0,I(t),M(i)?(i=i(),st().then(l)):l())},invalidate(){d=!1},end(){s&&(c(),s=!1)}}}function Pe(t,e,n){let i=e(t,n),s=!0,o;const r=v;r.r+=1;function a(){const{delay:c=0,duration:l=300,easing:d=Z,tick:f=E,css:u}=i||rt;u&&(o=G(t,1,0,l,c,d,u));const _=tt()+c,h=_+l;S(()=>k(t,!1,"start")),nt(y=>{if(s){if(y>=h)return f(0,1),k(t,!1,"end"),--r.r||N(r.c),!1;if(y>=_){const m=d((y-_)/l);f(1-m,m)}}return s})}return M(i)?st().then(()=>{i=i(),a()}):a(),{end(c){c&&i.tick&&i.tick(1,0),s&&(o&&I(t,o),s=!1)}}}function Le(t,e,n,i){let s=e(t,n),o=i?0:1,r=null,a=null,c=null;function l(){c&&I(t,c)}function d(u,_){const h=u.b-o;return _*=Math.abs(h),{a:o,b:u.b,d:h,duration:_,start:u.start,end:u.start+_,group:u.group}}function f(u){const{delay:_=0,duration:h=300,easing:y=Z,tick:m=E,css:g}=s||rt,b={start:tt()+_,b:u};u||(b.group=v,v.r+=1),r||a?a=b:(g&&(l(),c=G(t,o,u,h,_,y,g)),u&&m(0,1),r=d(b,h),S(()=>k(t,u,"start")),nt(w=>{if(a&&w>a.start&&(r=d(a,h),a=null,k(t,r.b,"start"),g&&(l(),c=G(t,o,r.b,r.duration,0,y,s.css))),r){if(w>=r.end)m(o=r.b,1-o),k(t,r.b,"end"),a||(r.b?l():--r.group.r||N(r.group.c)),r=null;else if(w>=r.start){const z=w-r.start;o=r.a+r.d*y(z/r.duration),m(o,1-o)}}return!!(r||a)}))}return{run(u){M(s)?st().then(()=>{s=s(),f(u)}):f(u)},end(){l(),r=a=null}}}function Re(t,e){Jt(t,1,1,()=>{e.delete(t.key)})}function qe(t,e,n,i,s,o,r,a,c,l,d,f){let u=t.length,_=o.length,h=u;const y={};for(;h--;)y[t[h].key]=h;const m=[],g=new Map,b=new Map;for(h=_;h--;){const p=f(s,o,h),x=n(p);let $=r.get(x);$?i&&$.p(p,e):($=l(x,p),$.c()),g.set(x,m[h]=$),x in y&&b.set(x,Math.abs(h-y[x]))}const w=new Set,z=new Set;function U(p){Nt(p,1),p.m(a,d),r.set(p.key,p),d=p.first,_--}for(;u&&_;){const p=m[_-1],x=t[u-1],$=p.key,P=x.key;p===x?(d=p.first,u--,_--):g.has(P)?!r.has($)||w.has($)?U(p):z.has(P)?u--:b.get($)>b.get(P)?(z.add($),U(p)):(w.add(P),u--):(c(x,r),u--)}for(;u--;){const p=t[u];g.has(p.key)||c(p,r)}for(;_;)U(m[_-1]);return m}function Oe(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Be(t){t&&t.c()}function We(t,e){t&&t.l(e)}function Kt(t,e,n,i){const{fragment:s,after_update:o}=t.$$;s&&s.m(e,n),i||S(()=>{const r=t.$$.on_mount.map(ft).filter(M);t.$$.on_destroy?t.$$.on_destroy.push(...r):N(r),t.$$.on_mount=[]}),o.forEach(S)}function Qt(t,e){const n=t.$$;n.fragment!==null&&(N(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ut(t,e){t.$$.dirty[0]===-1&&(D.push(t),Et(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Fe(t,e,n,i,s,o,r,a=[-1]){const c=j;H(t);const l=t.$$={fragment:null,ctx:[],props:o,update:E,not_equal:s,bound:ot(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:ot(),dirty:a,skip_bound:!1,root:e.target||c.$$.root};r&&r(l.root);let d=!1;if(l.ctx=n?n(t,e.props||{},(f,u,..._)=>{const h=_.length?_[0]:u;return l.ctx&&s(l.ctx[f],l.ctx[f]=h)&&(!l.skip_bound&&l.bound[f]&&l.bound[f](h),d&&Ut(t,f)),u}):[],l.update(),d=!0,N(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){St();const f=Rt(e.target);l.fragment&&l.fragment.l(f),f.forEach(T)}else l.fragment&&l.fragment.c();e.intro&&Nt(t.$$.fragment),Kt(t,e.target,e.anchor,e.customElement),Mt(),kt()}H(c)}class Ge{$destroy(){Qt(this,1),this.$destroy=E}$on(e,n){if(!M(n))return E;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!Tt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{me as $,Ce as A,E as B,te as C,ne as D,ie as E,ee as F,zt as G,Zt as H,At as I,se as J,ut as K,at as L,ye as M,ce as N,Z as O,tt as P,nt as Q,Yt as R,Ge as S,Xt as T,oe as U,ct as V,M as W,N as X,Se as Y,Me as Z,gt as _,le as a,S as a0,ze as a1,Pe as a2,Oe as a3,De as a4,re as a5,fe as a6,ve as a7,ue as a8,Te as a9,qe as aa,Re as ab,Le as ac,xe as ad,$e as ae,_e as af,be as ag,Ee as ah,Lt as b,pe as c,je as d,ae as e,Nt as f,He as g,T as h,Fe as i,Ae as j,K as k,he as l,Rt as m,de as n,Ne as o,we as p,it as q,qt as r,Vt as s,Jt as t,ge as u,ke as v,Be as w,We as x,Kt as y,Qt as z};
