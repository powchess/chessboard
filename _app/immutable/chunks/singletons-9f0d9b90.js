import{w as u}from"./index-2b094520.js";let f="",b="";function m(t){f=t.base,b=t.assets||f}let p="";function _(t){p=t}function v(t){let e=t.baseURI;if(!e){const n=t.getElementsByTagName("base");e=n.length?n[0].href:t.URL}return e}function w(){return{x:pageXOffset,y:pageYOffset}}function k(t){let e,n=null,r=null,s=null;for(const a of t.composedPath())a instanceof Element&&(!e&&a.nodeName.toUpperCase()==="A"&&(e=a),n===null&&(n=i(a,"data-sveltekit-noscroll")),r===null&&(r=i(a,"data-sveltekit-prefetch")),s===null&&(s=i(a,"data-sveltekit-reload")));const o=e&&new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI);return{a:e,url:o,options:{noscroll:n,prefetch:r,reload:s},has:e?{rel_external:(e.getAttribute("rel")||"").split(/\s+/).includes("external"),download:e.hasAttribute("download"),target:!!(e instanceof SVGAElement?e.target.baseVal:e.target)}:{}}}function i(t,e){const n=t.getAttribute(e);return n===null?n:n===""?!0:(n==="off",!1)}function d(t){const e=u(t);let n=!0;function r(){n=!0,e.update(a=>a)}function s(a){n=!1,e.set(a)}function o(a){let l;return e.subscribe(c=>{(l===void 0||n&&c!==l)&&a(l=c)})}return{notify:r,set:s,subscribe:o}}function g(){const{set:t,subscribe:e}=u(!1);let n;async function r(){clearTimeout(n);const s=await fetch(`${b}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(s.ok){const a=(await s.json()).version!==p;return a&&(t(!0),clearTimeout(n)),a}else throw new Error(`Version check failed: ${s.status}`)}return{subscribe:e,check:r}}function A(t){t.client}const U={url:d({}),page:d({}),navigating:u(null),updated:g()};export{w as a,m as b,_ as c,k as f,v as g,A as i,U as s};
