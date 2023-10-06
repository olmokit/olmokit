"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[1429],{1357:(e,a,t)=>{t.d(a,{Zo:()=>d,kt:()=>k});var o=t(4863);function n(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function l(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);a&&(o=o.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,o)}return t}function r(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?l(Object(t),!0).forEach((function(a){n(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function c(e,a){if(null==e)return{};var t,o,n=function(e,a){if(null==e)return{};var t,o,n={},l=Object.keys(e);for(o=0;o<l.length;o++)t=l[o],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(o=0;o<l.length;o++)t=l[o],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var i=o.createContext({}),s=function(e){var a=o.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):r(r({},a),e)),t},d=function(e){var a=s(e.components);return o.createElement(i.Provider,{value:a},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var a=e.children;return o.createElement(o.Fragment,{},a)}},h=o.forwardRef((function(e,a){var t=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),p=s(t),h=n,k=p["".concat(i,".").concat(h)]||p[h]||m[h]||l;return t?o.createElement(k,r(r({ref:a},d),{},{components:t})):o.createElement(k,r({ref:a},d))}));function k(e,a){var t=arguments,n=a&&a.mdxType;if("string"==typeof e||n){var l=t.length,r=new Array(l);r[0]=h;var c={};for(var i in a)hasOwnProperty.call(a,i)&&(c[i]=a[i]);c.originalType=e,c[p]="string"==typeof e?e:n,r[1]=c;for(var s=2;s<l;s++)r[s]=t[s];return o.createElement.apply(null,r)}return o.createElement.apply(null,t)}h.displayName="MDXCreateElement"},515:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>i,contentTitle:()=>r,default:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>s});var o=t(3027),n=(t(4863),t(1357));const l={title:"Hooks"},r=void 0,c={unversionedId:"laravel-frontend/Hooks",id:"laravel-frontend/Hooks",title:"Hooks",description:"LaravelFrontend exposes automatically a series of hooks whose access is guarded through middlewares for security. These hooks endpoints allow the remote execution of commands for systemic operations like deployment, cache management, composer packaging and maybe others. These endpoints should be called upon data changes from the CMS or the thirdy part services on saving or updating actions.",source:"@site/docs/laravel-frontend/Hooks.md",sourceDirName:"laravel-frontend",slug:"/laravel-frontend/Hooks",permalink:"/olmokit/laravel-frontend/Hooks",draft:!1,editUrl:"https://github.com/olmokit/olmokit/tree/main/apps/docs/docs/docs/laravel-frontend/Hooks.md",tags:[],version:"current",frontMatter:{title:"Hooks"},sidebar:"docs",previous:{title:"Helpers",permalink:"/olmokit/laravel-frontend/Helpers"},next:{title:"I18n",permalink:"/olmokit/laravel-frontend/I18n"}},i={},s=[{value:"Usage and security",id:"usage-and-security",level:2},{value:"Hooks <strong>endpoints</strong>",id:"hooks-endpoints",level:2},{value:"<code>/visit</code>",id:"visit",level:3},{value:"<em>Deploy hooks</em>",id:"deploy-hooks",level:3},{value:"<code>/deploy/end</code>",id:"deployend",level:3},{value:"<em>Cache control hooks</em>",id:"cache-control-hooks",level:3},{value:"<code>/cache/clear</code>",id:"cacheclear",level:3},{value:"<code>/cache/clear-system</code>",id:"cacheclear-system",level:3},{value:"<code>/cache/clear-data</code>",id:"cacheclear-data",level:3},{value:"<code>/cache/clear-structure</code>",id:"cacheclear-structure",level:3},{value:"<code>/cache/clear-custom</code>",id:"cacheclear-custom",level:3},{value:"<code>/cache/clear-models</code>",id:"cacheclear-models",level:3},{value:"<code>/cache/clear-models/{modelName}</code>",id:"cacheclear-modelsmodelname",level:3},{value:"<code>/cache/clear-routes</code>",id:"cacheclear-routes",level:3},{value:"<code>/cache/clear-routes/{routeId}</code>",id:"cacheclear-routesrouteid",level:3},{value:"<code>/cache/clear-forms</code>",id:"cacheclear-forms",level:3},{value:"<code>/cache/clear-forms/{formId}</code>",id:"cacheclear-formsformid",level:3},{value:"<code>/cache/clear-translations</code>",id:"cacheclear-translations",level:3},{value:"<code>/cache/clear-translations/{locale}</code>",id:"cacheclear-translationslocale",level:3},{value:"<code>/cache/clear-img</code>",id:"cacheclear-img",level:3}],d={toc:s},p="wrapper";function m(e){let{components:a,...t}=e;return(0,n.kt)(p,(0,o.Z)({},d,t,{components:a,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"LaravelFrontend exposes automatically a series of ",(0,n.kt)("inlineCode",{parentName:"p"},"hooks")," whose access is guarded through middlewares for security. These ",(0,n.kt)("inlineCode",{parentName:"p"},"hooks")," endpoints allow the remote execution of commands for systemic operations like deployment, cache management, composer packaging and maybe others. These endpoints should be called upon data changes from the CMS or the thirdy part services on saving or updating actions."),(0,n.kt)("h2",{id:"usage-and-security"},"Usage and security"),(0,n.kt)("p",null,"For security purposes these endpoints can only be called from a series of whitelisted domains. By default the already defined and mandatory ",(0,n.kt)("inlineCode",{parentName:"p"},"APP_URL")," and ",(0,n.kt)("inlineCode",{parentName:"p"},"CMS_API_URL")," found in the ",(0,n.kt)("inlineCode",{parentName:"p"},".env"),"\xa0are automatically whitelisted and so it is the IP of the CI runner that operates the deployment. Additional ",(0,n.kt)("strong",{parentName:"p"},"domains"),", ",(0,n.kt)("strong",{parentName:"p"},"ip")," addresses and ",(0,n.kt)("strong",{parentName:"p"},"queryparam")," can be defined in the\xa0",(0,n.kt)("inlineCode",{parentName:"p"},".env")," with:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-env"},"HOOKS_ALLOWED_DOMAINS=adomain.com,another-domain.com\nHOOKS_ALLOWED_IPS=111.11.11.11\nHOOKS_ALLOWED_PARAM=somesecretparam\n")),(0,n.kt)("h2",{id:"hooks-endpoints"},"Hooks ",(0,n.kt)("strong",{parentName:"h2"},"endpoints")),(0,n.kt)("p",null,"Here a summary of all hooks, all prefixed with ",(0,n.kt)("inlineCode",{parentName:"p"},"_/hooks/"),"."),(0,n.kt)("h3",{id:"visit"},(0,n.kt)("inlineCode",{parentName:"h3"},"/visit")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/visit"))),(0,n.kt)("p",null,"This hook visit all the URLs of the website by crawling the ",(0,n.kt)("inlineCode",{parentName:"p"},"APP_URL")," and following all the found links recursively. It is automatically used by the ",(0,n.kt)("a",{parentName:"p",href:"#deploy-end"},(0,n.kt)("inlineCode",{parentName:"a"},"/deploy/end")," one"),". It can also be manually called from a browser with the ",(0,n.kt)("a",{parentName:"p",href:"#usage-and-security"},"above security limitations"),", add a whatever query parameter to get a nicely formatted html response, e.g. go in your browser to ",(0,n.kt)("inlineCode",{parentName:"p"},"https://myproject.com/_/hooks/visit?a"),"."),(0,n.kt)("h3",{id:"deploy-hooks"},(0,n.kt)("em",{parentName:"h3"},"Deploy hooks")),(0,n.kt)("h3",{id:"deployend"},(0,n.kt)("inlineCode",{parentName:"h3"},"/deploy/end")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/deploy/end"))),(0,n.kt)("p",null,"This hook must be called at the end of the CI process, it clears all caches, dumps the composer autoloading mechanism and optimize laravel through ",(0,n.kt)("inlineCode",{parentName:"p"},"artisan")," commands. At the end of its process it calls the ",(0,n.kt)("a",{parentName:"p",href:"#visit"},(0,n.kt)("inlineCode",{parentName:"a"},"/visit")," hook"),"."),(0,n.kt)("h3",{id:"cache-control-hooks"},(0,n.kt)("em",{parentName:"h3"},"Cache control hooks")),(0,n.kt)("p",null,"Data from the remote ",(0,n.kt)("inlineCode",{parentName:"p"},"api")," (the CMS usually) are cached by default to optimise speed. This cache can be cleared programmatically by doing a simple ",(0,n.kt)("inlineCode",{parentName:"p"},"GET")," request without any particular parameter to these automatically exposed endpoints or ",(0,n.kt)("strong",{parentName:"p"},"hooks"),":"),(0,n.kt)("h3",{id:"cacheclear"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear"))),(0,n.kt)("p",null,"Clear all frontend caches (system and ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#data"},(0,n.kt)("inlineCode",{parentName:"a"},"data")," cache"),") except ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#img"},(0,n.kt)("inlineCode",{parentName:"a"},"img")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-system"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-system")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-system"))),(0,n.kt)("p",null,"Manages op cache, laravel's view/config/routes and compiled caches. It first clears and then re-generate and re-cache them."),(0,n.kt)("h3",{id:"cacheclear-data"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-data")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-data"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#data"},(0,n.kt)("inlineCode",{parentName:"a"},"data")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-structure"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-structure")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-structure"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#structure"},(0,n.kt)("inlineCode",{parentName:"a"},"structure")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-custom"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-custom")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-custom"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#custom"},(0,n.kt)("inlineCode",{parentName:"a"},"custom")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-models"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-models")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-models"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#models"},(0,n.kt)("inlineCode",{parentName:"a"},"models")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-modelsmodelname"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-models/{modelName}")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-models/{modelName}"))),(0,n.kt)("p",null,"Clear a single ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#modelsmodelname"},(0,n.kt)("inlineCode",{parentName:"a"},"model")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-routes"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-routes")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-routes"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#routes"},(0,n.kt)("inlineCode",{parentName:"a"},"routes")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-routesrouteid"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-routes/{routeId}")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-routes/{routeId}"))),(0,n.kt)("p",null,"Clear a single ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#routesrouteid"},(0,n.kt)("inlineCode",{parentName:"a"},"route")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-forms"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-forms")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-forms"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#forms"},(0,n.kt)("inlineCode",{parentName:"a"},"forms")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-formsformid"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-forms/{formId}")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-forms/{formId}"))),(0,n.kt)("p",null,"Clear a single ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#formsformid"},(0,n.kt)("inlineCode",{parentName:"a"},"form")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-translations"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-translations")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-translations"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#translations"},(0,n.kt)("inlineCode",{parentName:"a"},"translations")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-translationslocale"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-translations/{locale}")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-translations/{locale}"))),(0,n.kt)("p",null,"Clear a single ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#translationslocale"},(0,n.kt)("inlineCode",{parentName:"a"},"locale"),"'s ",(0,n.kt)("inlineCode",{parentName:"a"},"translations")," cache"),"."),(0,n.kt)("h3",{id:"cacheclear-img"},(0,n.kt)("inlineCode",{parentName:"h3"},"/cache/clear-img")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"URL: ",(0,n.kt)("inlineCode",{parentName:"p"},"{APP_URL}/_/hooks/cache/clear-img"))),(0,n.kt)("p",null,"Clear all the ",(0,n.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Cache#img"},(0,n.kt)("inlineCode",{parentName:"a"},"img")," cache"),"."),(0,n.kt)("admonition",{type:"warning"},(0,n.kt)("p",{parentName:"admonition"},"Depending on the amount of images used and theier variants the regeneration of this cache is probably quite heavy on the server.")))}m.isMDXComponent=!0}}]);