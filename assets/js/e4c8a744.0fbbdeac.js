"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[4762],{1357:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(4863);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},p=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=u(n),h=o,m=c["".concat(s,".").concat(h)]||c[h]||d[h]||i;return n?a.createElement(m,r(r({ref:t},p),{},{components:n})):a.createElement(m,r({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:o,r[1]=l;for(var u=2;u<i;u++)r[u]=n[u];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},8564:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var a=n(3027),o=(n(4863),n(1357));const i={title:"Authentication",sidebar_label:"Authentication"},r=void 0,l={unversionedId:"guides/authentication",id:"guides/authentication",title:"Authentication",description:"This document describes how to implement an authentication system in your frontend application.",source:"@site/docs/guides/authentication.md",sourceDirName:"guides",slug:"/guides/authentication",permalink:"/olmokit/guides/authentication",draft:!1,editUrl:"https://github.com/olmokit/olmokit/tree/main/apps/docs/docs/docs/guides/authentication.md",tags:[],version:"current",frontMatter:{title:"Authentication",sidebar_label:"Authentication"},sidebar:"docs",previous:{title:"Code conventions",permalink:"/olmokit/code-conventions"},next:{title:"Exchanging data",permalink:"/olmokit/guides/data"}},s={},u=[{value:"Setup",id:"setup",level:2},{value:"Comunication with the API",id:"comunication-with-the-api",level:2},{value:"Authenticated requests",id:"authenticated-requests",level:2},{value:"Frontend configuration",id:"frontend-configuration",level:2},{value:"<code>routesMap</code>",id:"routesmap",level:3},{value:"<code>actionEndpoints</code>",id:"actionendpoints",level:3},{value:"<code>formsEndpoints</code>",id:"formsendpoints",level:3},{value:"Examples",id:"examples",level:3},{value:"Authentication components",id:"authentication-components",level:2},{value:"Translations",id:"translations",level:2},{value:"JavaScript authentication helpers",id:"javascript-authentication-helpers",level:2}],p={toc:u},c="wrapper";function d(e){let{components:t,...n}=e;return(0,o.kt)(c,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"This document describes how to implement an authentication system in your frontend application."),(0,o.kt)("h2",{id:"setup"},"Setup"),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"First be sure to have setup correctly the following two variables in your ",(0,o.kt)("inlineCode",{parentName:"p"},".env")," file:")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-env"},"AUTH_API_URL=https://back.myproject.com/api/auth\nAUTH_API_CACHE=true\n")),(0,o.kt)("h2",{id:"comunication-with-the-api"},"Comunication with the API"),(0,o.kt)("p",null,"All the communication with the remote API is standardised inside ",(0,o.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend"},"Laravel Frontend"),", check the ",(0,o.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/Auth"},"Auth docs")," for all the specifications."),(0,o.kt)("h2",{id:"authenticated-requests"},"Authenticated requests"),(0,o.kt)("p",null,"The frontend use the ",(0,o.kt)("inlineCode",{parentName:"p"},"token")," saved in session at login and always send it along every subsequent request in a standard request's ",(0,o.kt)("inlineCode",{parentName:"p"},"header"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yml"},"X-Token: tokenstringvalue\n")),(0,o.kt)("p",null,"It does it without notion about the backend requires it or not, it is responsibility of the backend to check protected endpoints (usually ",(0,o.kt)("inlineCode",{parentName:"p"},"routes")," endpoints) and in case of invalid token return to the frontend a ",(0,o.kt)("inlineCode",{parentName:"p"},"401")," HTTP status code."),(0,o.kt)("p",null,"In case of a ",(0,o.kt)("inlineCode",{parentName:"p"},"401")," the frontend will:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"store the requested url"),(0,o.kt)("li",{parentName:"ol"},"logout the user"),(0,o.kt)("li",{parentName:"ol"},"redirect the user to the login route"),(0,o.kt)("li",{parentName:"ol"},"Eventually track the 401 event"),(0,o.kt)("li",{parentName:"ol"},"manage the redirection to the prior stored url after successful login")),(0,o.kt)("p",null,"In your frontend application you should anyway protect your routes with the ",(0,o.kt)("inlineCode",{parentName:"p"},"auth")," Middleware, be sure to check out its ",(0,o.kt)("a",{parentName:"p",href:"/olmokit/laravel-frontend/App#auth"},"docs here"),"."),(0,o.kt)("h2",{id:"frontend-configuration"},"Frontend configuration"),(0,o.kt)("p",null,"You can tweak the authentication system configuration from your ",(0,o.kt)("inlineCode",{parentName:"p"},"/config/laravel-frontend.php"),", under the ",(0,o.kt)("inlineCode",{parentName:"p"},"auth")," key, you can see the updated list of defaults directly ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/olmokit/olmokit/-/blob/main/packages/laravel-frontend/config/laravel-frontend.php#L4"},"from the source code here"),"."),(0,o.kt)("h3",{id:"routesmap"},(0,o.kt)("inlineCode",{parentName:"h3"},"routesMap")),(0,o.kt)("p",null,"Defines the route id (the ",(0,o.kt)("inlineCode",{parentName:"p"},"value"),") to use for each authentication feature (the ",(0,o.kt)("inlineCode",{parentName:"p"},"key"),")."),(0,o.kt)("h3",{id:"actionendpoints"},(0,o.kt)("inlineCode",{parentName:"h3"},"actionEndpoints")),(0,o.kt)("p",null,"Defines the Auth API action endpoints (the ",(0,o.kt)("inlineCode",{parentName:"p"},"value"),") to use for each authentication feature (the ",(0,o.kt)("inlineCode",{parentName:"p"},"key"),"), in other words where each frontend auth action should make a ",(0,o.kt)("inlineCode",{parentName:"p"},"POST")," to the AUth API ",(0,o.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/{actionEndpoint}"),"."),(0,o.kt)("h3",{id:"formsendpoints"},(0,o.kt)("inlineCode",{parentName:"h3"},"formsEndpoints")),(0,o.kt)("p",null,"Defines the Auth API form construction endpoints (the ",(0,o.kt)("inlineCode",{parentName:"p"},"value"),") to use for each authentication feature (the ",(0,o.kt)("inlineCode",{parentName:"p"},"key"),"), in other words where the frontend gathers the form data for each auth feature ",(0,o.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/forms/{locale}/{formEndpoint}"),"."),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("p",null,"A typical customisation might be for instance a project where the ",(0,o.kt)("inlineCode",{parentName:"p"},"register")," route is actually called ",(0,o.kt)("inlineCode",{parentName:"p"},"signup"),", in that case you might just want to override that in your config file with:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-php"},"    'auth' => [\n        'routesMap' => [\n            'register' => 'signup',\n        ],\n    ],\n")),(0,o.kt)("h2",{id:"authentication-components"},"Authentication components"),(0,o.kt)("p",null,"All the authentication related forms are already provided by the ",(0,o.kt)("inlineCode",{parentName:"p"},"@olmokit/core/auth")," components."),(0,o.kt)("h2",{id:"translations"},"Translations"),(0,o.kt)("p",null,"Most of the translations happen on the CMS. Some default status messages and system forms fields are instead ",(0,o.kt)("a",{parentName:"p",href:"/olmokit/guides/translations"},"defined as strings"),". You can find in the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/olmokit/olmokit/-/blob/main/packages/template-laravel/template/src/assets/translations.csv#L8"},"source code of the standard laravel template")," the updated list of string required strings for a complete authentication flow, they are all prefixed with ",(0,o.kt)("inlineCode",{parentName:"p"},"auth."),"."),(0,o.kt)("h2",{id:"javascript-authentication-helpers"},"JavaScript authentication helpers"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import { getUser, isUserOrGuest, on as authOn } from "@olmokit/core/auth";\nimport { getUser, isUserOrGuest, on as authOn } from "@olmokit/core/auth";\n\ngetUser();\n\nauthOn("user:ok", ({ data }) => alert(data ? `Hi ${data.id}` : "Log in now"));\n\n// getUser(true); // force async refetch\n\nconst canDoThat = isUserOrGuest(); // synchronous, won\'t work with `page-cache` middleware\nisUserOrGuest(true).then((result) => {\n  alert(result ? "do what they can" : "Wait ...");\n});\n')))}d.isMDXComponent=!0}}]);