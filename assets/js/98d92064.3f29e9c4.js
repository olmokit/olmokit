"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[672],{7522:(e,t,o)=>{o.d(t,{Zo:()=>u,kt:()=>d});var n=o(9901);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function s(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function i(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var l=n.createContext({}),c=function(e){var t=n.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):s(s({},t),e)),o},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(o),m=r,d=p["".concat(l,".").concat(m)]||p[m]||f[m]||a;return o?n.createElement(d,s(s({ref:t},u),{},{components:o})):n.createElement(d,s({ref:t},u))}));function d(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=o.length,s=new Array(a);s[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[p]="string"==typeof e?e:r,s[1]=i;for(var c=2;c<a;c++)s[c]=o[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,o)}m.displayName="MDXCreateElement"},4987:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>f,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var n=o(3027),r=(o(9901),o(7522));const a={title:"Using custom fonts"},s=void 0,i={unversionedId:"guides/fonts",id:"guides/fonts",title:"Using custom fonts",description:"With fountsource",source:"@site/docs/guides/fonts.md",sourceDirName:"guides",slug:"/guides/fonts",permalink:"/olmokit/guides/fonts",draft:!1,editUrl:"https://github.com/olmokit/olmokit/edit/main/docs/docs/guides/fonts.md",tags:[],version:"current",frontMatter:{title:"Using custom fonts"},sidebar:"docs",previous:{title:"Download files",permalink:"/olmokit/guides/downloads"},next:{title:"Async behaviours",permalink:"/olmokit/guides/async-behaviours"}},l={},c=[{value:"With <code>fountsource</code>",id:"with-fountsource",level:2},{value:"With custom font files",id:"with-custom-font-files",level:2}],u={toc:c},p="wrapper";function f(e){let{components:t,...o}=e;return(0,r.kt)(p,(0,n.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"with-fountsource"},"With ",(0,r.kt)("inlineCode",{parentName:"h2"},"fountsource")),(0,r.kt)("p",null,"To use a custom a font the best option is to use ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/fontsource/fontsource"},"fountsource"),", so first check that the desired font is available browsing ",(0,r.kt)("a",{parentName:"p",href:"https://fontsource.org/fonts"},"their docs page"),". If it is, including it in your project is a three step process:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Run ",(0,r.kt)("inlineCode",{parentName:"li"},"npm i @fontsource/montserrat")),(0,r.kt)("li",{parentName:"ol"},"Open your ",(0,r.kt)("inlineCode",{parentName:"li"},"src/layouts/main/index.ts")," (if you want to import the fonts on all your project's routes) and import the font and its desired variations, e.g.:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'import "@fontsource/montserrat/latin-400.css";\nimport "@fontsource/montserrat/latin-500.css";\nimport "@fontsource/montserrat/latin-700.css";\n')),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Open your ",(0,r.kt)("inlineCode",{parentName:"li"},"src/config/variables.scss")," and assign the fonts:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scss"},'$Typography-font-sans-custom: "Montserrat";\n')),(0,r.kt)("h2",{id:"with-custom-font-files"},"With custom font files"),(0,r.kt)("p",null,"These are the 4 steps to use custom fonts in your project:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"First put your font files (even just ",(0,r.kt)("inlineCode",{parentName:"li"},".ttf")," format) in ",(0,r.kt)("inlineCode",{parentName:"li"},"src/assets/fonts")),(0,r.kt)("li",{parentName:"ol"},"In file ",(0,r.kt)("inlineCode",{parentName:"li"},"src/utils/fonts.scss")," import your fonts with the ",(0,r.kt)("a",{parentName:"li",href:"https://gitlab.com/olmokit/olmokit/-/tree/main/core/scss/mixins/_fonts.scss"},(0,r.kt)("inlineCode",{parentName:"a"},"Font-face")," sass mixin"),", e.g.:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scss"},'@include Font-face(Barlow, "Barlow-Regular", normal, normal, ttf);\n@include Font-face(Barlow, "Barlow-Italic", normal, italic, ttf);\n@include Font-face(Barlow, "Barlow-SemiBold", 500, normal, ttf);\n@include Font-face(Barlow, "Barlow-Bold", bold, normal, ttf);\n@include Font-face(SourceCodePro, "SourceCodePro-ExtraLight", 100, normal, ttf);\n@include Font-face(SourceCodePro, "SourceCodePro-Regular", normal, normal, ttf);\n@include Font-face(SourceCodePro, "SourceCodePro-Bold", bold, normal, ttf);\n')),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Open your ",(0,r.kt)("inlineCode",{parentName:"li"},"src/layouts/main/index.js")," (if you want to import the fonts on all your project's routes) and import that file:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import "utils/fonts.scss";\n')),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Open your ",(0,r.kt)("inlineCode",{parentName:"li"},"src/config/variables.scss")," and assign the fonts:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scss"},'$Typography-font-sans-custom: "Barlow";\n$Typography-font-serif-custom: "SourceCodePro";\n')))}f.isMDXComponent=!0}}]);