"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[8200],{7522:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var a=n(9901);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=p(n),d=i,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||r;return n?a.createElement(f,o(o({ref:t},c),{},{components:n})):a.createElement(f,o({ref:t},c))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:i,o[1]=l;for(var p=2;p<r;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5623:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>l,toc:()=>p});var a=n(3027),i=(n(9901),n(7522));const r={title:"Translations"},o=void 0,l={unversionedId:"guides/translations",id:"guides/translations",title:"Translations",description:"File",source:"@site/docs/guides/translations.md",sourceDirName:"guides",slug:"/guides/translations",permalink:"/guides/translations",draft:!1,editUrl:"https://github.com/olmokit/olmokit/edit/main/docs/docs/guides/translations.md",tags:[],version:"current",frontMatter:{title:"Translations"},sidebar:"docs",previous:{title:"Time and dates",permalink:"/guides/time"},next:{title:"Working without api",permalink:"/guides/working-without-api"}},s={},p=[{value:"File",id:"file",level:2},{value:"Usage",id:"usage",level:2},{value:"<code>$trans</code> variable",id:"trans-variable",level:3},{value:"<code>t</code> function",id:"t-function",level:3},{value:"CSV Formatting",id:"csv-formatting",level:2},{value:"Conventions",id:"conventions",level:2}],c={toc:p},m="wrapper";function u(e){let{components:t,...n}=e;return(0,i.kt)(m,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"file"},"File"),(0,i.kt)("p",null,"The translation file is in ",(0,i.kt)("inlineCode",{parentName:"p"},".csv")," format and it needs to be placed in ",(0,i.kt)("inlineCode",{parentName:"p"},"src/assets/translations.csv"),"."),(0,i.kt)("p",null,"This file must have the following structure:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-csv"},"code,en,it\nmyroute.mykey, English text, Italian text\n")),(0,i.kt)("p",null,"Where the first line has the local codes (that match the project's localised URLs slugs), the first column has all the keys in ",(0,i.kt)("strong",{parentName:"p"},"alphanumeric symbols"),", only ",(0,i.kt)("strong",{parentName:"p"},"dots"),", ",(0,i.kt)("strong",{parentName:"p"},"dashes")," and ",(0,i.kt)("strong",{parentName:"p"},"underscores")," punctuation are allowed. The ",(0,i.kt)("inlineCode",{parentName:"p"},".")," dot is used to specify the string's location within the website and/or its specific route or component."),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"During development you don't need to fill all translations for each locale, the first is enough and it is used as a fallback if a string in a specific locale is not filled in.")),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("h3",{id:"trans-variable"},(0,i.kt)("inlineCode",{parentName:"h3"},"$trans")," variable"),(0,i.kt)("p",null,"A variable ",(0,i.kt)("inlineCode",{parentName:"p"},"$trans")," is always exposed to ",(0,i.kt)("strong",{parentName:"p"},"all")," views (",(0,i.kt)("inlineCode",{parentName:"p"},"components"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"routes"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"utils"),", ecc.) and you use it as such:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-php"},"<h2>{{ $trans['MyComponent.plaintext'] }}</h2>\n\n<div>{!! $trans['MyComponent.htmltext'] !!}</div>\n")),(0,i.kt)("h3",{id:"t-function"},(0,i.kt)("inlineCode",{parentName:"h3"},"t")," function"),(0,i.kt)("p",null,"To interpolate variables into your strings you can use the global helper function ",(0,i.kt)("inlineCode",{parentName:"p"},"t"),", available in all views and php files."),(0,i.kt)("p",null,"In your ",(0,i.kt)("inlineCode",{parentName:"p"},"src/assets/translations.csv"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-csv"},'Header.profile, "Welcome :name"\n')),(0,i.kt)("p",null,"in your blade template file:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},"<span> {!! t('Header.profile', [ 'name' => '<b>'.$user['name'].'</b>' ]) !!} </span>\n")),(0,i.kt)("h2",{id:"csv-formatting"},"CSV Formatting"),(0,i.kt)("p",null,"The translation file can be edited with any ",(0,i.kt)("inlineCode",{parentName:"p"},"csv")," ready software like ",(0,i.kt)("inlineCode",{parentName:"p"},"LbreOffice Calc"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"Excel")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"Google Sheets")," and the formatting is handled automatically. If you need to edit this file manually from a text editor consider the necessarye escaping:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"If your string contains commas wrap it in double quotes:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-csv"},'MyComponent.plaintext, "My string, with commas"`\n')),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},"If your string contains html escape the html quotes:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-csv"},'MyComponent.htmltext, "<a href=""https://www.example.com"" target=""_blank"" rel=""noopener"">Example.com</a>"`\n')),(0,i.kt)("h2",{id:"conventions"},"Conventions"),(0,i.kt)("p",null,"All string keys are lowercase and their parts, used to target specific section of your template, are divided by a ",(0,i.kt)("inlineCode",{parentName:"p"},"dot"),". By convention (not mandatory) strings are named following simple rules such as:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"If a key is specific of a ",(0,i.kt)("inlineCode",{parentName:"li"},"route")," it has the route ",(0,i.kt)("em",{parentName:"li"},"unique name")," as prefix in ",(0,i.kt)("inlineCode",{parentName:"li"},"lowercase"),"."),(0,i.kt)("li",{parentName:"ol"},"If a key is specific of a ",(0,i.kt)("inlineCode",{parentName:"li"},"component")," it has the component ",(0,i.kt)("em",{parentName:"li"},"unique name")," as prefix in ",(0,i.kt)("inlineCode",{parentName:"li"},"PascalCase"),"."),(0,i.kt)("li",{parentName:"ol"},"If a key is specific of a ",(0,i.kt)("inlineCode",{parentName:"li"},"core")," element it has the component ",(0,i.kt)("em",{parentName:"li"},"unique name")," as prefix in ",(0,i.kt)("inlineCode",{parentName:"li"},"kebab-case"),".")),(0,i.kt)("p",null,"Some examples:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-csv"},"contacts.intro.title\ncontacts.intro.desc\nFormContact.title\nFormContact.feedback.success\nFormContact.feedback.fail\nauth.password-recovery.ok\n")))}u.isMDXComponent=!0}}]);