"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[3555],{1357:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var n=r(4863);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=p(r),d=a,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return r?n.createElement(f,i(i({ref:t},c),{},{components:r})):n.createElement(f,i({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},996:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var n=r(3027),a=(r(4863),r(1357));const o={title:"Fragments",sidebar_label:"Fragments"},i=void 0,l={unversionedId:"laravel-frontend/Fragments",id:"laravel-frontend/Fragments",title:"Fragments",description:"The idea behind fragments is to allow some simple standards and utilities in order to create within your project custom routes and async behaviours.",source:"@site/docs/laravel-frontend/Fragments.md",sourceDirName:"laravel-frontend",slug:"/laravel-frontend/Fragments",permalink:"/olmokit/laravel-frontend/Fragments",draft:!1,editUrl:"https://github.com/olmokit/olmokit/tree/main/apps/docs/docs/docs/laravel-frontend/Fragments.md",tags:[],version:"current",frontMatter:{title:"Fragments",sidebar_label:"Fragments"},sidebar:"docs",previous:{title:"Forms",permalink:"/olmokit/laravel-frontend/Forms"},next:{title:"Helpers",permalink:"/olmokit/laravel-frontend/Helpers"}},s={},p=[],c={toc:p},m="wrapper";function u(e){let{components:t,...r}=e;return(0,a.kt)(m,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"The idea behind ",(0,a.kt)("strong",{parentName:"p"},"fragments")," is to allow some simple standards and utilities in order to create within your project custom routes and async behaviours."),(0,a.kt)("p",null,"Under the hood an endpoint ",(0,a.kt)("inlineCode",{parentName:"p"},"/_/fragments/_replace/")," is exposed by ",(0,a.kt)("a",{parentName:"p",href:"/olmokit/"},"Laravel Frontend"),", the ",(0,a.kt)("inlineCode",{parentName:"p"},"@olmokit/core/fragments/replace")," utility will send a request to retrieve a view asynchronously. The view can be a ",(0,a.kt)("em",{parentName:"p"},"component"),", a ",(0,a.kt)("em",{parentName:"p"},"util"),", a ",(0,a.kt)("em",{parentName:"p"},"core")," element, another ",(0,a.kt)("em",{parentName:"p"},"fragment")," or even a ",(0,a.kt)("em",{parentName:"p"},"route")," template."),(0,a.kt)("p",null,"You can see some sample usages in the ",(0,a.kt)("a",{parentName:"p",href:"/olmokit/guides/async-behaviours"},"Async behaviours guide")))}u.isMDXComponent=!0}}]);