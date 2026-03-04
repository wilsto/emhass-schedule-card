const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(s,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:r,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!r(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);a?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),a=t.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const o=a.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const o=this.constructor;if(!1===s&&(a=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??y)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==a||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[g("elementProperties")]=new Map,x[g("finalized")]=new Map,_?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,b=t=>t,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+P,E=`<${C}>`,M=document,D=()=>M.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,O="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,L=/>/g,N=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,F=/"/g,W=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),j=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),V=new WeakMap,q=M.createTreeWalker(M,129);function G(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let a,o=2===e?"<svg>":3===e?"<math>":"",n=z;for(let e=0;e<i;e++){const i=t[e];let r,l,h=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===z?"!--"===l[1]?n=R:void 0!==l[1]?n=L:void 0!==l[2]?(W.test(l[2])&&(a=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=a??z,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?N:'"'===l[3]?F:U):n===F||n===U?n=N:n===R||n===L?n=z:(n=N,a=void 0);const d=n===N&&t[e+1].startsWith("/>")?" ":"";o+=n===z?i+E:h>=0?(s.push(r),i.slice(0,h)+k+i.slice(h)+P+d):i+P+(-2===h?e:d)}return[G(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,o=0;const n=t.length-1,r=this.parts,[l,h]=Y(t,e);if(this.el=J.createElement(l,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=q.nextNode())&&r.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(k)){const e=h[o++],i=s.getAttribute(t).split(P),n=/([.?@])?(.*)/.exec(e);r.push({type:1,index:a,name:n[2],strings:i,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(P)&&(r.push({type:6,index:a}),s.removeAttribute(t));if(W.test(s.tagName)){const t=s.textContent.split(P),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],D()),q.nextNode(),r.push({type:2,index:++a});s.append(t[e],D())}}}else if(8===s.nodeType)if(s.data===C)r.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(P,t+1));)r.push({type:7,index:a}),t+=P.length-1}a++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===j)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const o=T(e)?void 0:e._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=K(t,a._$AS(t,e.values),a,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);q.currentNode=s;let a=q.nextNode(),o=0,n=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new Z(a,a.nextSibling,this,t):1===r.type?e=new r.ctor(a,r.name,r.strings,this,t):6===r.type&&(e=new st(a,this,t)),this._$AV.push(e),r=i[++n]}o!==r?.index&&(a=q.nextNode(),o++)}return q.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),T(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new J(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const a of t)s===e.length?e.push(i=new Z(this.O(D()),this.O(D()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=b(t).nextSibling;b(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const a=this.strings;let o=!1;if(void 0===a)t=K(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==j,o&&(this._$AH=t);else{const s=t;let n,r;for(t=a[0],n=0;n<a.length-1;n++)r=K(this,s[i+n],e,n),r===j&&(r=this._$AH[n]),o||=!T(r)||r!==this._$AH[n],r===B?t=B:t!==B&&(t+=(r??"")+a[n+1]),this._$AH[n]=r}o&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends Q{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??B)===j)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(J,Z),(w.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;class nt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new Z(e.insertBefore(D(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const rt=ot.litElementPolyfillSupport;function lt(t,e="pv_estimate",i="period_start",s=1e3){return t&&Array.isArray(t)&&0!==t.length?t.map(t=>({timestamp:new Date(t[i]).getTime(),power:Math.round((parseFloat(t[e])||0)*s)})):[]}rt?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.2");const ht=48,ct=4,dt=50,pt=24,ut=8,ft="rgba(255, 193, 7, 0.6)",mt="rgba(244, 67, 54, 0.8)";class _t extends nt{static properties={loads:{type:Array},pvData:{type:Array},pvMax:{type:Number},pvMpcData:{type:Array},pvActualData:{type:Array},showPv:{type:Boolean},isDark:{type:Boolean}};static styles=o`
    :host {
      display: block;
      position: relative;
    }
    .gantt-container {
      position: relative;
      width: 100%;
    }
    canvas {
      display: block;
      width: 100%;
      cursor: pointer;
    }
    .tooltip {
      position: absolute;
      background: var(--card-background-color, #1e1e1e);
      border: 1px solid var(--divider-color, #333);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 10;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    .tooltip.visible {
      opacity: 1;
    }
    .tooltip-name {
      font-weight: 600;
      color: var(--primary-text-color, #fff);
    }
    .tooltip-time {
      color: var(--secondary-text-color, #aaa);
      margin-top: 2px;
    }
    .tooltip-power {
      color: var(--primary-text-color, #fff);
      margin-top: 2px;
    }
  `;constructor(){super(),this.loads=[],this.pvData=[],this.pvMax=0,this.pvMpcData=[],this.pvActualData=[],this.showPv=!0,this.isDark=!0,this._resizeObserver=null,this._tooltipData=null}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(()=>this._draw()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(){this._draw()}get _timeRange(){let t=1/0,e=-1/0;for(const i of this.loads)for(const s of i.slots)s.timestamp<t&&(t=s.timestamp),s.timestamp>e&&(e=s.timestamp);if(this.pvData?.length)for(const i of this.pvData)i.timestamp<t&&(t=i.timestamp),i.timestamp>e&&(e=i.timestamp);if(t===1/0){const t=Date.now();return{min:t,max:t+216e5}}return{min:t,max:e+6e4*(this.loads[0]?.slotDuration||30)}}_xPos(t,e,i,s){return e+(t-s.min)/(s.max-s.min)*i}_draw(){const t=this.renderRoot?.querySelector("canvas");if(!t||!this.loads.length)return;const e=this.renderRoot.querySelector(".gantt-container"),i=e?.offsetWidth||400,s=window.devicePixelRatio||1,a=this.loads.length,o=ct+20+a*ht+pt;t.width=i*s,t.height=o*s,t.style.height=`${o}px`;const n=t.getContext("2d");n.scale(s,s),n.clearRect(0,0,i,o);const r=ut+90,l=i-dt,h=l-r,c=ct+20,d=this._timeRange,p=this.isDark?"rgba(255, 255, 255, 0.7)":"rgba(0, 0, 0, 0.6)",u=this.isDark?"rgba(255, 255, 255, 0.08)":"rgba(0, 0, 0, 0.08)";this.showPv&&this.pvData?.length>1&&this.pvMax>0&&this._drawPvOverlay(n,r,h,c,a,d),this.showPv&&this.pvMpcData?.length>0&&this.pvMax>0&&this._drawPvLine(n,this.pvMpcData,"#FFA000",1.5,[4,3],r,h,c,a,d,!1),this.showPv&&this.pvActualData?.length>0&&this.pvMax>0&&this._drawPvLine(n,this.pvActualData,"rgba(255,255,255,0.85)",2,[],r,h,c,a,d,!0),this._drawGrid(n,r,h,c,a,d,p,u),this.loads.forEach((t,e)=>{const i=c+e*ht;this._drawLane(n,t,e,i,r,h,d,p)}),this._drawNowMarker(n,r,h,c,a,d),this.showPv&&this.pvMax>0&&this._drawPvAxis(n,l,c,a,p)}_drawPvOverlay(t,e,i,s,a,o){const n=a*ht,r=s+n;t.save(),t.beginPath(),t.moveTo(this._xPos(this.pvData[0].timestamp,e,i,o),r);for(const s of this.pvData){const a=this._xPos(s.timestamp,e,i,o),l=r-s.power/this.pvMax*n;t.lineTo(a,l)}const l=this.pvData[this.pvData.length-1];t.lineTo(this._xPos(l.timestamp,e,i,o),r),t.closePath(),t.fillStyle="rgba(255, 193, 7, 0.25)",t.fill(),t.beginPath();for(let s=0;s<this.pvData.length;s++){const a=this.pvData[s],l=this._xPos(a.timestamp,e,i,o),h=r-a.power/this.pvMax*n;0===s?t.moveTo(l,h):t.lineTo(l,h)}t.strokeStyle=ft,t.lineWidth=1.5,t.stroke(),t.restore()}_drawPvLine(t,e,i,s,a,o,n,r,l,h,c){const d=l*ht,p=r+d,u=Date.now();t.save(),t.strokeStyle=i,t.lineWidth=s,t.setLineDash(a),t.beginPath();let f=!1;for(const i of e){if(c&&i.timestamp>u)continue;if(!c&&i.timestamp<u-18e5)continue;const e=this._xPos(i.timestamp,o,n,h),s=p-(this.pvMax>0?i.power/this.pvMax:0)*d;f?t.lineTo(e,s):(t.moveTo(e,s),f=!0)}f&&t.stroke(),t.setLineDash([]),t.restore()}_drawGrid(t,e,i,s,a,o,n,r){const{min:l,max:h}=o,c=new Date(l);c.setMinutes(0,0,0),t.save(),t.strokeStyle=r,t.lineWidth=1,t.fillStyle=n,t.font="11px system-ui, sans-serif",t.textAlign="center";const d=s+a*ht;let p=c.getTime();for(;p<=h;){if(p>=l){const a=this._xPos(p,e,i,o);t.beginPath(),t.moveTo(a,s),t.lineTo(a,d),t.stroke();const n=new Date(p),r=`${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`;t.fillText(r,a,d+14)}p+=36e5}t.restore()}_drawLane(t,e,i,s,a,o,n,r){const l=6e4*(e.slotDuration||30);t.save(),t.fillStyle=r,t.font="12px system-ui, sans-serif",t.textAlign="right",t.textBaseline="middle";const h=s+24,c=e.name||`Load ${i}`;let d=c;for(;t.measureText(d).width>78&&d.length>3;)d=d.slice(0,-1);d!==c&&(d+="…"),t.fillText(d,ut+90-6,h),t.restore(),i>0&&(t.save(),t.strokeStyle=this.isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)",t.lineWidth=1,t.beginPath(),t.moveTo(a,s),t.lineTo(a+o,s),t.stroke(),t.restore()),t.save();const p=s+4,u=e.color||"#4CAF50",f=Date.now();for(const i of e.slots){if(!i.active)continue;const e=i.timestamp+l,s=e<f,r=this._xPos(i.timestamp,a,o,n),h=this._xPos(e,a,o,n),c=Math.max(h-r-1,2);t.globalAlpha=s?.35:1,t.fillStyle=u,t.beginPath(),this._roundRect(t,r,p,c,40,4),t.fill(),c>40&&(t.globalAlpha=s?.5:1,t.fillStyle="#fff",t.font="bold 11px system-ui, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(`${Math.round(i.power)}W`,r+c/2,p+20))}if(e.actualSlots?.length){const i=s+ht-10,r=6;t.globalAlpha=.9,t.fillStyle=u;for(const s of e.actualSlots){if(!s.active)continue;const e=this._xPos(s.timestamp,a,o,n),h=this._xPos(s.timestamp+l,a,o,n),c=Math.max(h-e-1,2);t.fillRect(e,i,c,r)}}t.globalAlpha=1,t.restore()}_drawNowMarker(t,e,i,s,a,o){const n=Date.now();if(n<o.min||n>o.max)return;const r=this._xPos(n,e,i,o),l=s+a*ht;t.save(),t.strokeStyle=mt,t.lineWidth=2,t.setLineDash([4,3]),t.beginPath(),t.moveTo(r,s-4),t.lineTo(r,l),t.stroke(),t.setLineDash([]),t.fillStyle=mt,t.beginPath(),t.moveTo(r-5,s-4),t.lineTo(r+5,s-4),t.lineTo(r,s+2),t.closePath(),t.fill(),t.restore()}_drawPvAxis(t,e,i,s,a){const o=s*ht;t.save(),t.fillStyle=ft,t.font="10px system-ui, sans-serif",t.textAlign="left",t.textBaseline="middle";for(let s=0;s<=3;s++){const a=s/3,n=i+o-a*o,r=100*Math.round(a*this.pvMax/100);r>0&&t.fillText(`${r}W`,e+4,n)}t.restore()}_roundRect(t,e,i,s,a,o){o=Math.min(o,s/2,a/2),t.moveTo(e+o,i),t.lineTo(e+s-o,i),t.quadraticCurveTo(e+s,i,e+s,i+o),t.lineTo(e+s,i+a-o),t.quadraticCurveTo(e+s,i+a,e+s-o,i+a),t.lineTo(e+o,i+a),t.quadraticCurveTo(e,i+a,e,i+a-o),t.lineTo(e,i+o),t.quadraticCurveTo(e,i,e+o,i)}_handleMouseMove(t){const e=this.renderRoot.querySelector("canvas"),i=this.renderRoot.querySelector(".tooltip");if(!e||!i)return;const s=e.getBoundingClientRect(),a=t.clientX-s.left,o=t.clientY-s.top,n=ut+90,r=ct+20,l=this._timeRange,h=s.width-n-dt,c=Math.floor((o-r)/ht);if(c<0||c>=this.loads.length||a<n)return void i.classList.remove("visible");const d=(a-n)/h,p=l.min+d*(l.max-l.min),u=this.loads[c],f=6e4*(u.slotDuration||30),m=u.slots.find(t=>p>=t.timestamp&&p<t.timestamp+f&&t.active);if(!m)return void i.classList.remove("visible");const _=new Date(m.timestamp),g=new Date(m.timestamp+f),v=t=>`${t.getHours().toString().padStart(2,"0")}:${t.getMinutes().toString().padStart(2,"0")}`;i.querySelector(".tooltip-name").textContent=u.name,i.querySelector(".tooltip-time").textContent=`${v(_)} – ${v(g)}`,i.querySelector(".tooltip-power").textContent=`${Math.round(m.power)} W`,i.style.left=`${Math.min(t.clientX-s.left+12,s.width-150)}px`,i.style.top=t.clientY-s.top-60+"px",i.classList.add("visible")}_handleMouseLeave(){const t=this.renderRoot.querySelector(".tooltip");t&&t.classList.remove("visible")}_handleClick(t){const e=this.renderRoot.querySelector("canvas");if(!e)return;const i=e.getBoundingClientRect(),s=t.clientY-i.top,a=ct+20,o=Math.floor((s-a)/ht);if(o>=0&&o<this.loads.length){const t=this.loads[o];if(t.entityId){const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t.entityId}});this.dispatchEvent(e)}}}render(){return I`
      <div class="gantt-container">
        <canvas
          @mousemove=${this._handleMouseMove}
          @mouseleave=${this._handleMouseLeave}
          @click=${this._handleClick}
        ></canvas>
        <div class="tooltip">
          <div class="tooltip-name"></div>
          <div class="tooltip-time"></div>
          <div class="tooltip-power"></div>
        </div>
      </div>
    `}}customElements.define("gantt-canvas",_t);class gt extends nt{static properties={loads:{type:Array},localize:{type:Object}};static styles=o`
    :host {
      display: block;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
      margin-top: 12px;
    }
    .load-summary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
    }
    .load-indicator {
      width: 4px;
      height: 28px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    .load-info {
      flex: 1;
      min-width: 0;
    }
    .load-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .load-details {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      display: flex;
      gap: 8px;
    }
    .load-status {
      font-weight: 600;
    }
    .load-status.on {
      color: #4caf50;
    }
    .load-status.off {
      color: var(--secondary-text-color, #666);
    }
    .load-cost {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .cost-savings {
      color: #4caf50;
      font-weight: 600;
    }
    .load-actual {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .compliance-high {
      color: #4caf50;
      font-weight: 600;
    }
    .compliance-mid {
      color: #ff9800;
      font-weight: 600;
    }
    .compliance-low {
      color: #f44336;
      font-weight: 600;
    }
  `;constructor(){super(),this.loads=[],this.localize=()=>""}render(){return this.loads?.length?I`
      <div class="summary-grid">${this.loads.map(t=>this._renderLoadSummary(t))}</div>
    `:I``}_renderLoadSummary(t){const e=t.currentPower>.1,i=e?this.localize("summary.on"):this.localize("summary.off"),s=e?"on":"off",a=`${t.summary.hoursPlanned}h ${this.localize("summary.planned")}`,o=e?`${Math.round(t.currentPower)}W`:"",n=t.cost,r=n?I`
          <div class="load-cost">
            <span>${n.kWh.toFixed(2)} ${this.localize("summary.kwh")}</span>
            <span>·</span>
            <span>${n.costOptimized.toFixed(2)}€</span>
            ${n.savings>.005?I`<span>·</span><span class="cost-savings">+${n.savings.toFixed(2)}€</span>`:""}
          </div>
        `:"",l=t.actualSlots,h=t.summary.hoursPlanned;let c="";if(null!==l&&h>0){const e=l.filter(t=>t.active).length*(t.slotDuration||30)/60,i=Math.round(e/h*100),s=i>=90?"compliance-high":i>=50?"compliance-mid":"compliance-low";c=I`
        <div class="load-actual">
          <span>${this.localize("summary.actual")}: ${e.toFixed(1)}h</span>
          <span>${this.localize("summary.of")}</span>
          <span>${h.toFixed(1)}h</span>
          <span class="${s}">(${i}%)</span>
        </div>
      `}return I`
      <div class="load-summary">
        <div class="load-indicator" style="background: ${t.color}"></div>
        <div class="load-info">
          <div class="load-name">${t.name}</div>
          <div class="load-details">
            <span class="load-status ${s}">${i}</span>
            <span>${a}</span>
            ${o?I`<span>${o}</span>`:""}
          </div>
          ${r} ${c}
        </div>
      </div>
    `}}customElements.define("summary-row",gt);const vt=["#2196F3","#00BCD4","#4CAF50","#FF9800","#9C27B0","#F44336"];class yt extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=o`
    :host {
      display: block;
    }
    .editor-section {
      margin-bottom: 16px;
    }
    .editor-section h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
      margin: 0 0 8px 0;
    }
    .load-item {
      background: rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .load-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .load-header span {
      font-weight: 600;
      font-size: 13px;
      color: var(--primary-text-color, #fff);
    }
    .remove-btn {
      cursor: pointer;
      color: var(--error-color, #f44336);
      background: none;
      border: none;
      font-size: 18px;
      padding: 4px;
    }
    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }
    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 100%;
      padding: 8px;
      border: 1px dashed var(--divider-color, #444);
      border-radius: 8px;
      background: none;
      color: var(--primary-color, #3b82f6);
      cursor: pointer;
      font-size: 13px;
    }
    .add-btn:hover {
      background: rgba(255, 255, 255, 0.04);
    }
    ha-textfield,
    ha-entity-picker {
      display: block;
      width: 100%;
    }
    .color-picker {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-swatch {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #444);
      cursor: pointer;
    }
    input[type='color'] {
      width: 0;
      height: 0;
      opacity: 0;
      position: absolute;
    }
  `;setConfig(t){this._config={...t}}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}_updateConfig(t,e){this._config={...this._config,[t]:e},this._fireConfigChanged()}_updateLoad(t,e,i){const s=[...this._config.loads||[]];s[t]={...s[t],[e]:i},this._config={...this._config,loads:s},this._fireConfigChanged()}_addLoad(){const t=[...this._config.loads||[]],e=t.length;t.push({entity:"",name:`Load ${e}`,icon:"mdi:flash",color:vt[e%vt.length],nominal_power:0}),this._config={...this._config,loads:t},this._fireConfigChanged()}_updateTariff(t,e){const i={...this._config.tariff||{}};void 0===e||""===e?delete i[t]:i[t]=e,this._config={...this._config,tariff:Object.keys(i).length?i:void 0},this._fireConfigChanged()}_updatePeakHours(t,e){const i=[...this._config.tariff?.peak_hours??[6,22]];i[t]=e,this._updateTariff("peak_hours",i)}_removeLoad(t){const e=[...this._config.loads||[]];e.splice(t,1),this._config={...this._config,loads:e},this._fireConfigChanged()}render(){return this._config?I`
      <div class="editor-section">
        <ha-textfield
          label="Title"
          .value=${this._config.title||""}
          @input=${t=>this._updateConfig("title",t.target.value)}
        ></ha-textfield>
      </div>

      <div class="editor-section">
        <div class="field-row">
          <ha-textfield
            label="Time horizon (hours)"
            type="number"
            .value=${String(this._config.hours||24)}
            @input=${t=>this._updateConfig("hours",parseInt(t.target.value)||24)}
          ></ha-textfield>
        </div>
        <ha-switch
          .checked=${!1!==this._config.show_pv}
          @change=${t=>this._updateConfig("show_pv",t.target.checked)}
          >Show PV forecast</ha-switch
        >
        <ha-switch
          .checked=${!1!==this._config.show_summary}
          @change=${t=>this._updateConfig("show_summary",t.target.checked)}
          >Show load summary</ha-switch
        >
      </div>

      <div class="editor-section">
        <h3>PV Forecast</h3>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.pv_entity||""}
          label="PV entity"
          @value-changed=${t=>this._updateConfig("pv_entity",t.detail.value)}
        ></ha-entity-picker>
        <div class="field-row" style="margin-top: 8px">
          <ha-textfield
            label="Attribute"
            .value=${this._config.pv_attribute||"detailedForecast"}
            @input=${t=>this._updateConfig("pv_attribute",t.target.value)}
          ></ha-textfield>
          <ha-textfield
            label="Field"
            .value=${this._config.pv_field||"pv_estimate"}
            @input=${t=>this._updateConfig("pv_field",t.target.value)}
          ></ha-textfield>
        </div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.pv_mpc_entity||""}
          label="MPC EMHASS forecast entity (optional)"
          style="display:block;margin-top:8px"
          @value-changed=${t=>this._updateConfig("pv_mpc_entity",t.detail.value)}
        ></ha-entity-picker>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.pv_actual_entity||""}
          label="Actual PV production entity (optional)"
          style="display:block;margin-top:8px"
          @value-changed=${t=>this._updateConfig("pv_actual_entity",t.detail.value)}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">
        <h3>Tariff (optional)</h3>
        <div class="field-row">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.tariff?.peak_entity||""}
            label="Peak rate entity (€/kWh)"
            @value-changed=${t=>this._updateTariff("peak_entity",t.detail.value)}
          ></ha-entity-picker>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.tariff?.offpeak_entity||""}
            label="Off-peak rate entity (€/kWh)"
            @value-changed=${t=>this._updateTariff("offpeak_entity",t.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="field-row">
          <ha-textfield
            label="Peak rate €/kWh (fallback)"
            type="number"
            .value=${String(this._config.tariff?.peak||"")}
            @input=${t=>this._updateTariff("peak",parseFloat(t.target.value)||void 0)}
          ></ha-textfield>
          <ha-textfield
            label="Off-peak rate €/kWh (fallback)"
            type="number"
            .value=${String(this._config.tariff?.offpeak||"")}
            @input=${t=>this._updateTariff("offpeak",parseFloat(t.target.value)||void 0)}
          ></ha-textfield>
        </div>
        <ha-textfield
          label="Peak hours start (default 6)"
          type="number"
          .value=${String(this._config.tariff?.peak_hours?.[0]??6)}
          @input=${t=>this._updatePeakHours(0,parseInt(t.target.value)||6)}
        ></ha-textfield>
        <ha-textfield
          label="Peak hours end (default 22)"
          type="number"
          .value=${String(this._config.tariff?.peak_hours?.[1]??22)}
          @input=${t=>this._updatePeakHours(1,parseInt(t.target.value)||22)}
          style="margin-top: 8px"
        ></ha-textfield>
      </div>

      <div class="editor-section">
        <h3>Loads</h3>
        ${(this._config.loads||[]).map((t,e)=>this._renderLoadEditor(t,e))}
        <button class="add-btn" @click=${this._addLoad}>+ Add load</button>
      </div>
    `:I``}_renderLoadEditor(t,e){return I`
      <div class="load-item">
        <div class="load-header">
          <span>${t.name||`Load ${e}`}</span>
          <button class="remove-btn" @click=${()=>this._removeLoad(e)}>×</button>
        </div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${t.entity||""}
          label="Entity"
          @value-changed=${t=>this._updateLoad(e,"entity",t.detail.value)}
        ></ha-entity-picker>
        <div class="field-row" style="margin-top: 8px">
          <ha-textfield
            label="Name"
            .value=${t.name||""}
            @input=${t=>this._updateLoad(e,"name",t.target.value)}
          ></ha-textfield>
          <ha-textfield
            label="Nominal power (W)"
            type="number"
            .value=${String(t.nominal_power||0)}
            @input=${t=>this._updateLoad(e,"nominal_power",parseInt(t.target.value)||0)}
          ></ha-textfield>
        </div>
        <div class="field-row">
          <ha-textfield
            label="Icon"
            .value=${t.icon||"mdi:flash"}
            @input=${t=>this._updateLoad(e,"icon",t.target.value)}
          ></ha-textfield>
          <div class="color-picker">
            <div
              class="color-swatch"
              style="background: ${t.color||"#4CAF50"}"
              @click=${()=>this.renderRoot.querySelector(`#color-${e}`)?.click()}
            ></div>
            <input
              type="color"
              id="color-${e}"
              .value=${t.color||"#4CAF50"}
              @input=${t=>this._updateLoad(e,"color",t.target.value)}
            />
            <span style="font-size: 12px; color: var(--secondary-text-color)"
              >${t.color||"#4CAF50"}</span
            >
          </div>
        </div>
      </div>
    `}}customElements.define("emhass-schedule-card-editor",yt);const $t={en:{card:{title:"EMHASS Schedule",no_data:"No schedule data available",now:"Now"},summary:{load:"Load",status:"Status",hours:"Hours",power:"Power",on:"ON",off:"OFF",planned:"planned",kwh:"kWh",cost:"cost",savings:"saved",actual:"Actual",of:"of",compliance:"compliance"},pv:{label:"PV Forecast",peak:"Peak",unit:"W"},editor:{title:"EMHASS Schedule Card",card_title:"Card title",hours:"Time horizon (hours)",show_pv:"Show PV forecast",show_summary:"Show load summary",pv_entity:"PV forecast entity",pv_attribute:"PV attribute",pv_field:"PV field name",loads:"Loads",add_load:"Add load",load_entity:"Entity",load_name:"Name",load_icon:"Icon",load_color:"Color",load_power:"Nominal power (W)"}},fr:{card:{title:"Planning EMHASS",no_data:"Aucune donnee de planning disponible",now:"Maint."},summary:{load:"Charge",status:"Etat",hours:"Heures",power:"Puissance",on:"ON",off:"OFF",planned:"planifie",kwh:"kWh",cost:"cout",savings:"economise",actual:"Realise",of:"sur",compliance:"conformite"},pv:{label:"Prevision PV",peak:"Pic",unit:"W"},editor:{title:"Carte Planning EMHASS",card_title:"Titre de la carte",hours:"Horizon temporel (heures)",show_pv:"Afficher prevision PV",show_summary:"Afficher resume des charges",pv_entity:"Entite prevision PV",pv_attribute:"Attribut PV",pv_field:"Nom du champ PV",loads:"Charges",add_load:"Ajouter une charge",load_entity:"Entite",load_name:"Nom",load_icon:"Icone",load_color:"Couleur",load_power:"Puissance nominale (W)"}}};console.info("%c emhass-schedule-card %c v0.1.0 ","color: #fff; background: #4CAF50; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #4CAF50; background: #e8f5e9; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;");class xt extends nt{static properties={hass:{type:Object},_config:{state:!0},_historyCache:{state:!0},_pvActualData:{state:!0}};static styles=o`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
      overflow: hidden;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
    }
    .card-subtitle {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
    }
    .no-data {
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color, #aaa);
      font-size: 14px;
    }
    .no-data ha-icon {
      display: block;
      margin: 0 auto 8px;
      --mdc-icon-size: 40px;
      opacity: 0.4;
    }
  `;static getConfigElement(){return document.createElement("emhass-schedule-card-editor")}static getStubConfig(){return{title:"EMHASS Schedule",show_pv:!0,show_summary:!0,hours:24,pv_entity:"sensor.solcast_pv_forecast_forecast_today",pv_attribute:"detailedForecast",pv_field:"pv_estimate",loads:[{entity:"sensor.p_deferrable0",name:"Load 0",icon:"mdi:flash",color:"#2196F3",nominal_power:0}]}}setConfig(t){if(!t.loads||!Array.isArray(t.loads)||0===t.loads.length)throw new Error("Please define at least one load");this._config={title:"EMHASS Schedule",show_pv:!0,show_summary:!0,hours:24,pv_entity:"",pv_attribute:"detailedForecast",pv_field:"pv_estimate",language:"auto",...t}}getCardSize(){const t=3+(this._config?.loads?.length||1);return this._config?.show_summary?t+2:t}get _lang(){const t=this._config?.language;if(t&&"auto"!==t)return t;const e=this.hass?.language||"en";return $t[e]?e:"en"}_localize(t){const e=t.split(".");let i=$t[this._lang]||$t.en;for(const t of e)i=i?.[t];return i||t}updated(t){if(t.has("hass")&&this.hass&&this._config){const t=(new Date).toDateString();t!==this._historyDay&&(this._historyDay=t,this._historyCache=null,this._fetchHistory())}}async _fetchHistory(){if(!this._config?.loads)return;const t=new Date;t.setHours(0,0,0,0);const e=t.toISOString(),i=new Map,s=this._config.loads.map(async t=>{try{const s=await this.hass.callApi("GET",`history/period/${e}?filter_entity_id=${t.entity}&minimal_response=true&no_attributes=true`);i.set(t.entity,this._parseHistory(s?.[0]||[]))}catch(t){}});this._config.pv_actual_entity&&s.push((async()=>{try{const t=await this.hass.callApi("GET",`history/period/${e}?filter_entity_id=${this._config.pv_actual_entity}&minimal_response=true&no_attributes=true`);this._pvActualData=this._parsePvHistory(t?.[0]||[])}catch(t){}})()),await Promise.all(s),this._historyCache=i}_parsePvHistory(t){return t?.length?t.map(t=>({timestamp:new Date(t.last_changed).getTime(),power:parseFloat(t.state)||0})).sort((t,e)=>t.timestamp-e.timestamp):[]}_parseHistory(t){if(!t||0===t.length)return[];const e=18e5,i=new Map;for(let s=0;s<t.length;s++){if((parseFloat(t[s].state)||0)<=50)continue;const a=new Date(t[s].last_changed).getTime(),o=s<t.length-1?new Date(t[s+1].last_changed).getTime():Date.now();let n=Math.floor(a/e)*e;for(;n<o;)i.set(n,!0),n+=e}return Array.from(i.entries()).map(([t,e])=>({timestamp:t,active:e})).sort((t,e)=>t.timestamp-e.timestamp)}get _isDark(){return!1!==this.hass?.themes?.darkMode}_getTariffRate(t){const e=this._config?.tariff;if(!e)return null;const i="peak"===t?"peak_entity":"offpeak_entity",s="peak"===t?"peak":"offpeak";return e[i]?parseFloat(this.hass?.states?.[e[i]]?.state)||null:e[s]??null}_computeCost(t,e,i){const s=this._config?.tariff;if(!s)return null;const a=this._getTariffRate("peak"),o=this._getTariffRate("offpeak");if(null===a)return null;const n=s.peak_hours??[6,22],r=e/60;let l=0,h=0;for(const e of t){if(e.power<=.1)continue;const t=e.power/1e3*r;l+=t;const i=new Date(e.timestamp).getHours();h+=t*(i>=n[0]&&i<n[1]?a:o??a)}const c=i/1e3,d=l/(c||1)*c*a;return{kWh:l,costOptimized:h,costBaseline:d,savings:d-h}}get _loadsData(){return this.hass&&this._config?.loads?this._config.loads.map(t=>{const e=this.hass.states[t.entity];if(!e)return{...t,entityId:t.entity,slots:[],slotDuration:30,summary:{hoursPlanned:0,activeSlots:0,totalSlots:0,maxPower:0},currentPower:0,cost:null,actualSlots:null};const i=e.attributes?.deferrables_schedule,s=function(t,e,i=.1){if(!t||!Array.isArray(t)||0===t.length)return[];const s=e.replace(/^sensor\./,"");return t.map(t=>{const e=parseFloat(t[s])||0;return{timestamp:new Date(t.date).getTime(),power:e,active:e>i}})}(i,t.entity),a=function(t){if(!t||t.length<2)return 30;const e=t[1].timestamp-t[0].timestamp;return Math.round(e/6e4)}(s),o=function(t,e){if(!t||0===t.length)return{hoursPlanned:0,activeSlots:0,totalSlots:0,maxPower:0};const i=t.filter(t=>t.active).length,s=Math.max(0,...t.map(t=>t.power));return{hoursPlanned:i*e/60,activeSlots:i,totalSlots:t.length,maxPower:s}}(s,a),n=parseFloat(e.state)||0,r=this._computeCost(s,a,t.nominal_power||0),l=this._historyCache?.get(t.entity)??null;return{...t,entityId:t.entity,slots:s,slotDuration:a,summary:o,currentPower:n,cost:r,actualSlots:l}}):[]}get _pvMpcData(){const t=this._config?.pv_mpc_entity;if(!t)return[];const e=this.hass?.states?.[t]?.attributes?.forecasts;return lt(e||[],"p_pv_forecast","date",1)}get _pvData(){if(!this._config?.show_pv||!this._config?.pv_entity)return{data:[],max:0};const t=this.hass?.states?.[this._config.pv_entity];if(!t)return{data:[],max:0};const e=t.attributes?.[this._config.pv_attribute||"detailedForecast"],i=lt(e,this._config.pv_field||"pv_estimate"),s=i.reduce((t,e)=>Math.max(t,e.power),0),a=this._pvMpcData.reduce((t,e)=>Math.max(t,e.power),0),o=(this._pvActualData||[]).reduce((t,e)=>Math.max(t,e.power),0);return{data:i,max:Math.max(s,a,o)}}render(){if(!this._config)return I``;const t=this._loadsData,e=t.some(t=>t.slots.length>0),i=this._pvData,s=this._config.title||this._localize("card.title");return I`
      <ha-card>
        <div class="card-header">
          <div>
            <div class="card-title">${s}</div>
          </div>
        </div>

        ${e?I`
              <gantt-canvas
                .loads=${t}
                .pvData=${i.data}
                .pvMax=${i.max}
                .pvMpcData=${this._pvMpcData}
                .pvActualData=${this._pvActualData||[]}
                .showPv=${!1!==this._config.show_pv}
                .isDark=${this._isDark}
              ></gantt-canvas>

              ${!1!==this._config.show_summary?I`
                    <summary-row
                      .loads=${t}
                      .localize=${t=>this._localize(t)}
                    ></summary-row>
                  `:""}
            `:I`
              <div class="no-data">
                <ha-icon icon="mdi:calendar-blank-outline"></ha-icon>
                ${this._localize("card.no_data")}
              </div>
            `}
      </ha-card>
    `}}customElements.define("emhass-schedule-card",xt),window.customCards=window.customCards||[],window.customCards.push({type:"emhass-schedule-card",name:"EMHASS Schedule Card",description:"Gantt-style timeline for EMHASS deferrable load schedules with PV forecast overlay",preview:!0,documentationURL:"https://github.com/wilsto/emhass-schedule-card"});
