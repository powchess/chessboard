function k(){}const tt=t=>t;function At(t,e){for(const n in e)t[n]=e[n];return t}function dt(t){return t()}function ct(){return Object.create(null)}function N(t){t.forEach(dt)}function H(t){return typeof t=="function"}function Yt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let q;function Zt(t,e){return q||(q=document.createElement("a")),q.href=e,t===q.href}function Mt(t){return Object.keys(t).length===0}function _t(t,...e){if(t==null)return k;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function te(t){let e;return _t(t,n=>e=n)(),e}function ee(t,e,n){t.$$.on_destroy.push(_t(e,n))}function ne(t,e,n,i){if(t){const s=ht(t,e,n,i);return t[0](s)}}function ht(t,e,n,i){return t[1]&&i?At(n.ctx.slice(),t[1](i(e))):n.ctx}function ie(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const o=[],r=Math.max(e.dirty.length,s.length);for(let c=0;c<r;c+=1)o[c]=e.dirty[c]|s[c];return o}return e.dirty|s}return e.dirty}function se(t,e,n,i,s,o){if(s){const r=ht(e,n,i,o);t.p(r,s)}}function re(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function oe(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function ce(t){return t??""}function le(t){return t&&H(t.destroy)?t.destroy:k}function ae(t){const e=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[t,"px"]}const mt=typeof window<"u";let et=mt?()=>window.performance.now():()=>Date.now(),nt=mt?t=>requestAnimationFrame(t):k;const S=new Set;function pt(t){S.forEach(e=>{e.c(t)||(S.delete(e),e.f())}),S.size!==0&&nt(pt)}function it(t){let e;return S.size===0&&nt(pt),{promise:new Promise(n=>{S.add(e={c:t,f:n})}),abort(){S.delete(e)}}}let K=!1;function St(){K=!0}function Ct(){K=!1}function Dt(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Pt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let a=0;a<e.length;a++){const f=e[a];f.claim_order!==void 0&&l.push(f)}e=l}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let l=0;l<e.length;l++){const a=e[l].claim_order,f=(s>0&&e[n[s]].claim_order<=a?s+1:Dt(1,s,h=>e[n[h]].claim_order,a))-1;i[l]=n[f]+1;const d=f+1;n[d]=l,s=Math.max(d,s)}const o=[],r=[];let c=e.length-1;for(let l=n[s]+1;l!=0;l=i[l-1]){for(o.push(e[l-1]);c>=l;c--)r.push(e[c]);c--}for(;c>=0;c--)r.push(e[c]);o.reverse(),r.sort((l,a)=>l.claim_order-a.claim_order);for(let l=0,a=0;l<r.length;l++){for(;a<o.length&&r[l].claim_order>=o[a].claim_order;)a++;const f=a<o.length?o[a]:null;t.insertBefore(r[l],f)}}function yt(t,e){t.appendChild(e)}function gt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Ht(t){const e=Q("style");return Lt(gt(t),e),e.sheet}function Lt(t,e){return yt(t.head||t,e),e.sheet}function jt(t,e){if(K){for(Pt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function zt(t,e,n){t.insertBefore(e,n||null)}function Ot(t,e,n){K&&!n?jt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function D(t){t.parentNode&&t.parentNode.removeChild(t)}function ue(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function Q(t){return document.createElement(t)}function bt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function st(t){return document.createTextNode(t)}function fe(){return st(" ")}function de(){return st("")}function lt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function _e(t){return function(e){return e.preventDefault(),t.call(this,e)}}function he(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function me(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function pe(t){return t===""?null:+t}function Rt(t){return Array.from(t.childNodes)}function wt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function xt(t,e,n,i,s=!1){wt(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const c=t[r];if(e(c)){const l=n(c);return l===void 0?t.splice(r,1):t[r]=l,s||(t.claim_info.last_index=r),c}}for(let r=t.claim_info.last_index-1;r>=0;r--){const c=t[r];if(e(c)){const l=n(c);return l===void 0?t.splice(r,1):t[r]=l,s?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,c}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function $t(t,e,n,i){return xt(t,s=>s.nodeName===e,s=>{const o=[];for(let r=0;r<s.attributes.length;r++){const c=s.attributes[r];n[c.name]||o.push(c.name)}o.forEach(r=>s.removeAttribute(r))},()=>i(e))}function ye(t,e,n){return $t(t,e,n,Q)}function ge(t,e,n){return $t(t,e,n,bt)}function qt(t,e){return xt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>st(e),!0)}function be(t){return qt(t," ")}function at(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function we(t,e){const n=at(t,"HTML_TAG_START",0),i=at(t,"HTML_TAG_END",n);if(n===i)return new ut(void 0,e);wt(t);const s=t.splice(n,i-n+1);D(s[0]),D(s[s.length-1]);const o=s.slice(1,s.length-1);for(const r of o)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new ut(o,e)}function xe(t,e){e=""+e,t.data!==e&&(t.data=e)}function $e(t,e){t.value=e??""}function ve(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Ee(t,e,n){for(let i=0;i<t.options.length;i+=1){const s=t.options[i];if(s.__value===e){s.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function ke(t){const e=t.querySelector(":checked");return e&&e.__value}let B;function Bt(){if(B===void 0){B=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{B=!0}}return B}function Ne(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=Q("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=Bt();let o;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=lt(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{o=lt(i.contentWindow,"resize",e),e()}),yt(t,i),()=>{(s||o&&i.contentWindow)&&o(),D(i)}}function vt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function Te(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const o=s.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(s)):o===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class Wt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=bt(n.nodeName):this.e=Q(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)zt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(D)}}class ut extends Wt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)Ot(this.t,this.n[n],e)}}function Ae(t,e){return new t(e)}const F=new Map;let G=0;function Ft(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Gt(t,e){const n={stylesheet:Ht(e),rules:{}};return F.set(t,n),n}function I(t,e,n,i,s,o,r,c=0){const l=16.666/i;let a=`{
`;for(let m=0;m<=1;m+=l){const g=e+(n-e)*o(m);a+=m*100+`%{${r(g,1-g)}}
`}const f=a+`100% {${r(n,1-n)}}
}`,d=`__svelte_${Ft(f)}_${c}`,h=gt(t),{stylesheet:u,rules:_}=F.get(h)||Gt(h,t);_[d]||(_[d]=!0,u.insertRule(`@keyframes ${d} ${f}`,u.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${d} ${i}ms linear ${s}ms 1 both`,G+=1,d}function J(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),G-=s,G||It())}function It(){nt(()=>{G||(F.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&D(e)}),F.clear())})}let z;function j(t){z=t}function U(){if(!z)throw new Error("Function called outside component initialization");return z}function Me(t){U().$$.on_mount.push(t)}function Se(t){U().$$.after_update.push(t)}function Ce(t){U().$$.on_destroy.push(t)}function De(){const t=U();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const o=vt(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,o)}),!o.defaultPrevented}return!0}}function Pe(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const M=[],ft=[];let C=[];const Y=[],Et=Promise.resolve();let Z=!1;function kt(){Z||(Z=!0,Et.then(Nt))}function He(){return kt(),Et}function P(t){C.push(t)}function Le(t){Y.push(t)}const X=new Set;let A=0;function Nt(){if(A!==0)return;const t=z;do{try{for(;A<M.length;){const e=M[A];A++,j(e),Jt(e.$$)}}catch(e){throw M.length=0,A=0,e}for(j(null),M.length=0,A=0;ft.length;)ft.pop()();for(let e=0;e<C.length;e+=1){const n=C[e];X.has(n)||(X.add(n),n())}C.length=0}while(M.length);for(;Y.length;)Y.pop()();Z=!1,X.clear(),j(t)}function Jt(t){if(t.fragment!==null){t.update(),N(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(P)}}function Kt(t){const e=[],n=[];C.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),C=e}let L;function rt(){return L||(L=Promise.resolve(),L.then(()=>{L=null})),L}function T(t,e,n){t.dispatchEvent(vt(`${e?"intro":"outro"}${n}`))}const W=new Set;let v;function je(){v={r:0,c:[],p:v}}function ze(){v.r||N(v.c),v=v.p}function Tt(t,e){t&&t.i&&(W.delete(t),t.i(e))}function Qt(t,e,n,i){if(t&&t.o){if(W.has(t))return;W.add(t),v.c.push(()=>{W.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const ot={duration:0};function Oe(t,e,n){const i={direction:"in"};let s=e(t,n,i),o=!1,r,c,l=0;function a(){r&&J(t,r)}function f(){const{delay:h=0,duration:u=300,easing:_=tt,tick:p=k,css:m}=s||ot;m&&(r=I(t,0,1,u,h,_,m,l++)),p(0,1);const g=et()+h,E=g+u;c&&c.abort(),o=!0,P(()=>T(t,!0,"start")),c=it(b=>{if(o){if(b>=E)return p(1,0),T(t,!0,"end"),a(),o=!1;if(b>=g){const w=_((b-g)/u);p(w,1-w)}}return o})}let d=!1;return{start(){d||(d=!0,J(t),H(s)?(s=s(i),rt().then(f)):f())},invalidate(){d=!1},end(){o&&(a(),o=!1)}}}function Re(t,e,n){const i={direction:"out"};let s=e(t,n,i),o=!0,r;const c=v;c.r+=1;function l(){const{delay:a=0,duration:f=300,easing:d=tt,tick:h=k,css:u}=s||ot;u&&(r=I(t,1,0,f,a,d,u));const _=et()+a,p=_+f;P(()=>T(t,!1,"start")),it(m=>{if(o){if(m>=p)return h(0,1),T(t,!1,"end"),--c.r||N(c.c),!1;if(m>=_){const g=d((m-_)/f);h(1-g,g)}}return o})}return H(s)?rt().then(()=>{s=s(i),l()}):l(),{end(a){a&&s.tick&&s.tick(1,0),o&&(r&&J(t,r),o=!1)}}}function qe(t,e,n,i){const s={direction:"both"};let o=e(t,n,s),r=i?0:1,c=null,l=null,a=null;function f(){a&&J(t,a)}function d(u,_){const p=u.b-r;return _*=Math.abs(p),{a:r,b:u.b,d:p,duration:_,start:u.start,end:u.start+_,group:u.group}}function h(u){const{delay:_=0,duration:p=300,easing:m=tt,tick:g=k,css:E}=o||ot,b={start:et()+_,b:u};u||(b.group=v,v.r+=1),c||l?l=b:(E&&(f(),a=I(t,r,u,p,_,m,E)),u&&g(0,1),c=d(b,p),P(()=>T(t,u,"start")),it(w=>{if(l&&w>l.start&&(c=d(l,p),l=null,T(t,c.b,"start"),E&&(f(),a=I(t,r,c.b,c.duration,0,m,o.css))),c){if(w>=c.end)g(r=c.b,1-r),T(t,c.b,"end"),l||(c.b?f():--c.group.r||N(c.group.c)),c=null;else if(w>=c.start){const O=w-c.start;r=c.a+c.d*m(O/c.duration),g(r,1-r)}}return!!(c||l)}))}return{run(u){H(o)?rt().then(()=>{o=o(s),h(u)}):h(u)},end(){f(),c=l=null}}}function Be(t,e){Qt(t,1,1,()=>{e.delete(t.key)})}function We(t,e,n,i,s,o,r,c,l,a,f,d){let h=t.length,u=o.length,_=h;const p={};for(;_--;)p[t[_].key]=_;const m=[],g=new Map,E=new Map,b=[];for(_=u;_--;){const y=d(s,o,_),x=n(y);let $=r.get(x);$?i&&b.push(()=>$.p(y,e)):($=a(x,y),$.c()),g.set(x,m[_]=$),x in p&&E.set(x,Math.abs(_-p[x]))}const w=new Set,O=new Set;function V(y){Tt(y,1),y.m(c,f),r.set(y.key,y),f=y.first,u--}for(;h&&u;){const y=m[u-1],x=t[h-1],$=y.key,R=x.key;y===x?(f=y.first,h--,u--):g.has(R)?!r.has($)||w.has($)?V(y):O.has(R)?h--:E.get($)>E.get(R)?(O.add($),V(y)):(w.add(R),h--):(l(x,r),h--)}for(;h--;){const y=t[h];g.has(y.key)||l(y,r)}for(;u;)V(m[u-1]);return N(b),m}function Fe(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Ge(t){t&&t.c()}function Ie(t,e){t&&t.l(e)}function Ut(t,e,n,i){const{fragment:s,after_update:o}=t.$$;s&&s.m(e,n),i||P(()=>{const r=t.$$.on_mount.map(dt).filter(H);t.$$.on_destroy?t.$$.on_destroy.push(...r):N(r),t.$$.on_mount=[]}),o.forEach(P)}function Vt(t,e){const n=t.$$;n.fragment!==null&&(Kt(n.after_update),N(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Xt(t,e){t.$$.dirty[0]===-1&&(M.push(t),kt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Je(t,e,n,i,s,o,r,c=[-1]){const l=z;j(t);const a=t.$$={fragment:null,ctx:[],props:o,update:k,not_equal:s,bound:ct(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:ct(),dirty:c,skip_bound:!1,root:e.target||l.$$.root};r&&r(a.root);let f=!1;if(a.ctx=n?n(t,e.props||{},(d,h,...u)=>{const _=u.length?u[0]:h;return a.ctx&&s(a.ctx[d],a.ctx[d]=_)&&(!a.skip_bound&&a.bound[d]&&a.bound[d](_),f&&Xt(t,d)),h}):[],a.update(),f=!0,N(a.before_update),a.fragment=i?i(a.ctx):!1,e.target){if(e.hydrate){St();const d=Rt(e.target);a.fragment&&a.fragment.l(d),d.forEach(D)}else a.fragment&&a.fragment.c();e.intro&&Tt(t.$$.fragment),Ut(t,e.target,e.anchor,e.customElement),Ct(),Nt()}j(l)}class Ke{$destroy(){Vt(this,1),this.$destroy=k}$on(e,n){if(!H(n))return k;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!Mt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{bt as $,Ut as A,Vt as B,ne as C,se as D,re as E,ie as F,jt as G,k as H,ee as I,At as J,oe as K,ut as L,we as M,P as N,Ne as O,ue as P,tt as Q,et as R,Ke as S,it as T,te as U,le as V,lt as W,H as X,N as Y,De as Z,Pe as _,fe as a,ge as a0,ae as a1,Oe as a2,Re as a3,Fe as a4,Le as a5,Zt as a6,ce as a7,he as a8,_e as a9,Ce as aa,We as ab,Be as ac,qe as ad,Ee as ae,ke as af,pe as ag,$e as ah,Te as ai,Ot as b,be as c,Qt as d,de as e,ze as f,Tt as g,D as h,Je as i,Se as j,Q as k,ye as l,Rt as m,me as n,Me as o,ve as p,st as q,qt as r,Yt as s,He as t,xe as u,je as v,ft as w,Ae as x,Ge as y,Ie as z};