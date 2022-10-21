(()=>{"use strict";const t=new class{constructor(){this.list=[],this.map={}}unique(t){if(this.map.hasOwnProperty(t))throw new Error(`already exists: ${t}`);return this.map[t]=!0,this.list.push(t),t}names(){return this.list}},e=t.unique("url"),r=t.unique("q"),n=t.unique("supported"),i=t.names(),s=new class{unmarshal(t){return t}marshal(t){return t}},o=new class{unmarshal(t){return"1"===t}marshal(t){return!0===t?"1":""}},a=new class{constructor(t,e){!function(t,e){for(let r=0;r<t.length;r++){const n=t[r];if(!e.hasOwnProperty(n))throw new Error(`missing converter for "${n}"`)}}(t,e);const r=new URLSearchParams(window.location.search.substring(1));this.criteriaNameConverterMap=e,this.buildCriteriaMap(function(t,e,r){const n={};for(let i=0;i<e.length;i++){const s=e[i];if(t.has(s)){const e=r[s],i=decodeURIComponent(t.get(s)).trim();if(""!==i){const t=e.unmarshal(i);null!==t&&(n[s]=t)}}}return n}(r,t,e))}getCriteria(t,e){return this.criteriaMap.hasOwnProperty(t)?this.criteriaMap[t]:e}setStringCriteria(t,e){""!==e?this.criteriaMap[t]=e:delete this.criteriaMap[t]}setAnyCriteria(t,e){this.criteriaMap[t]=e}setArrayCriteria(t,e){e.length>0?this.criteriaMap[t]=e:delete this.criteriaMap[t]}setBoolCriteria(t,e){!0===e?this.criteriaMap[t]=e:delete this.criteriaMap[t]}removeAlias(t,e){const r=this.getCriteria(t,[]).filter((t=>t!==e));this.setArrayCriteria(t,r)}remove(t){delete this.criteriaMap[t]}keep(...t){for(let e in this.criteriaMap)-1===t.indexOf(e)&&delete this.criteriaMap[e]}storeCurrentState(){this.buildCriteriaMap(this.criteriaMap),this.update()}update(){window.history.pushState(null,"",window.location.pathname+function(t){if(""===t)return"";const e=[];return""!==t&&e.push(t),"?"+e.join("&")}(this.criteria))}buildCriteriaMap(t){const e=[];for(let r in t)if(t.hasOwnProperty(r)){const n=this.criteriaNameConverterMap[r];e.push(r+"="+encodeURIComponent(n.marshal(t[r])))}this.criteriaMap=t,this.criteria=e.join("&")}}(i,{[e]:s,[r]:s,[n]:o});function c(t){return function(e){"Enter"===e.code&&t()}}class u{constructor(t,e){this.prefix=t,this.ttl=e}get(t){const e=localStorage.getItem(this.toKey(t));return null===e?null:JSON.parse(e).text}set(t,e){localStorage.setItem(this.toKey(t),JSON.stringify(this.toItem(e)))}clear(t){const e=[],r=Date.now();for(let n=0;n<localStorage.length;n++){const i=localStorage.key(n);if(this.isKey(i)){const n=JSON.parse(localStorage.getItem(i));(t||n.expired<r)&&e.push(i)}}for(const t of e)localStorage.removeItem(t)}toItem(t){return{text:t,expired:Date.now()+this.ttl}}toKey(t){return this.prefix+t}isKey(t){return t.startsWith(this.prefix)}}class l{constructor(t){this.value=t}text(){return Promise.resolve(this.value)}}{const f=12,{setInputStateByURL:p,setCheckboxStateByURL:m}=(h=a,{setInputStateByURL:function(t,e){t.value=h.getCriteria(e,"")},setCheckboxesStateByURL:function(t,e){t.setState(h.getCriteria(e,[]))},setCheckboxStateByURL:function(t,e){t.checked=h.getCriteria(e,!1)}}),d=document.getElementById("js-url-form"),g=d.elements.url;let y=[];const C=document.getElementById("js-content-comments"),S=document.getElementById("js-stats"),w=document.getElementById("js-activities-form"),M=w.elements.search,x=w.elements.supported;function v(t,e){t.addEventListener("change",(function(){a.setBoolCriteria(e,t.checked),a.storeCurrentState(),P()}))}function I(t){const e=t.querySelectorAll(".page");if(0===e.length)return 1;const r=e[e.length-1];return parseInt(r.textContent,10)}p(g,e),p(M,r),m(x,n);const L=new u("dou:",3e5);function B(t,e){return new Promise((function(r,n){const i=L.get(t);null===i?setTimeout((function(){fetch(t).then((function(t){return t.text()})).then((function(e){L.set(t,e),r(new l(e))})).catch(n)}),e):r(new l(i))}))}function O(t){const e=g.value;if(""===e)return y=[],void(C.innerHTML="");y=[],B(e,100).then((function(t){return t.text()})).then((function(r){const n=(new DOMParser).parseFromString(r,"text/html");y=[n.querySelector("ul.items")];const i=I(n);if(1===i)return void t();const s=Math.min(f,i),o=[];for(let t=2;t<=s;t++)o.push(B(`${e}/${t}/`,250*t));Promise.all(o).then((function(t){return Promise.all(t.map((t=>t.text())))})).then((function(e){const r=new DOMParser;for(const t of e){const e=r.parseFromString(t,"text/html");y.push(e.querySelector("ul.items"))}t()}))})).catch(console.error)}function P(){const t=[];let e=0;const i=a.getCriteria(r,"").toLowerCase(),s=a.getCriteria(n,!1),o=""===i?function(t){return!0}:function(t){return-1!==t.querySelector(".comment-item .b-typo").textContent.toLowerCase().indexOf(i)},c=!1===s?function(t){return!0}:function(t){return null!==t.querySelector(".sup-users")};for(const r of y)for(const n of r.children)e+=1,c(n)&&o(n)&&t.push(n.cloneNode(!0));S.innerHTML=`${t.length} from ${e}`,C.innerHTML="",C.append(...t)}function b(){a.setStringCriteria(e,g.value),a.storeCurrentState(),O((()=>{}))}function q(){a.setStringCriteria(r,M.value),a.storeCurrentState(),P()}L.clear(!1),g.addEventListener("keyup",c(b)),M.addEventListener("keyup",c(q)),v(x,n),d.onsubmit=b,w.onsubmit=q,O(P)}var h})();