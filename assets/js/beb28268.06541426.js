"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[8824],{7522:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>f});var o=t(9901);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,o,a=function(e,n){if(null==e)return{};var t,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=o.createContext({}),c=function(e){var n=o.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return o.createElement(l.Provider,{value:n},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},u=o.forwardRef((function(e,n){var t=e.components,a=e.mdxType,r=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(t),u=a,f=d["".concat(l,".").concat(u)]||d[u]||m[u]||r;return t?o.createElement(f,i(i({ref:n},p),{},{components:t})):o.createElement(f,i({ref:n},p))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var r=t.length,i=new Array(r);i[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[d]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<r;c++)i[c]=t[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,t)}u.displayName="MDXCreateElement"},3988:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>s,toc:()=>c});var o=t(3027),a=(t(9901),t(7522));const r={id:"code-conventions",title:"Code conventions"},i=void 0,s={unversionedId:"code-conventions",id:"code-conventions",title:"Code conventions",description:"Class names",source:"@site/docs/code-conventions.md",sourceDirName:".",slug:"/code-conventions",permalink:"/olmokit/code-conventions",draft:!1,editUrl:"https://github.com/olmokit/olmokit/edit/main/docs/docs/code-conventions.md",tags:[],version:"current",frontMatter:{id:"code-conventions",title:"Code conventions"},sidebar:"docs",previous:{title:"Git workflow",permalink:"/olmokit/git-workflow"},next:{title:"Authentication",permalink:"/olmokit/guides/authentication"}},l={},c=[{value:"Class names",id:"class-names",level:2},{value:"core",id:"core",level:3},{value:"components",id:"components",level:3},{value:"routes",id:"routes",level:3},{value:"Notes",id:"notes",level:2},{value:"Class names for state and behaviour",id:"class-names-for-state-and-behaviour",level:3},{value:"Regarding the use of colon",id:"regarding-the-use-of-colon",level:3}],p={toc:c},d="wrapper";function m(e){let{components:n,...t}=e;return(0,a.kt)(d,(0,o.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"class-names"},"Class names"),(0,a.kt)("h3",{id:"core"},"core"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Core")," elements are very generic and of common use case. They are usually used repeatedly in the same page and across the same website. Their flexibility should allow to use them even without alteration across different projects. They should be in fact responsible of basic and common elements and UI like ",(0,a.kt)("inlineCode",{parentName:"p"},"forms"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"images"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"buttons"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"typography"),", ecc. Their class naming follows this pattern:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-scss"},".myClass\n.myClassInner\n.myClass--modifier\n")),(0,a.kt)("h3",{id:"components"},"components"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Components")," are quite specific pieces of UI that are usually reused within the same project and can, but not necessarily need, to be reused accross different projects. They should be responsible of specific functionalities and should be configurable from outside enought to allow their reuse in the same project. Usual use cases for components are pieces of UI like the ",(0,a.kt)("inlineCode",{parentName:"p"},"Header"),", the ",(0,a.kt)("inlineCode",{parentName:"p"},"Footer"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"Card"),"s, ",(0,a.kt)("inlineCode",{parentName:"p"},"Slider"),"s, ecc. Their class naming follows this pattern:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-scss"},".Mycomponent:\n.Mycomponent:block\n.Mycomponent:block--modifier\n.Mycomponent:block__element\n.Mycomponent:block__elementInner\n.Mycomponent:block__element--modifier\n")),(0,a.kt)("h3",{id:"routes"},"routes"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Routes")," contain code that is always scoped and outputted only to its specific template. So by default JS and SCSS code written here cannot interfere with other routes/pages. It's often handy to divide a page in sections and namespace them to organize the code. Sections of a page often look like ",(0,a.kt)("inlineCode",{parentName:"p"},".intro:"),", ",(0,a.kt)("inlineCode",{parentName:"p"},".details:"),", ",(0,a.kt)("inlineCode",{parentName:"p"},".products:"),", ",(0,a.kt)("inlineCode",{parentName:"p"},".featured:"),", etc. Their class naming follows this pattern:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-scss"},".pagesection:\n.pagesection:block\n.pagesection:block--modifier\n.pagesection:block__element\n.pagesection:block__elementInner\n.pagesection:block__element--modifier\n")),(0,a.kt)("h2",{id:"notes"},"Notes"),(0,a.kt)("h3",{id:"class-names-for-state-and-behaviour"},"Class names for state and behaviour"),(0,a.kt)("p",null,"Class names that denote states or behaviour are shorter and descriptive like:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-scss"},".is-visible\n.has-link\n.has-img\n.is-doubled\n.is-even\n.when-vertical\netc.\n")),(0,a.kt)("h3",{id:"regarding-the-use-of-colon"},"Regarding the use of colon"),(0,a.kt)("p",null,"In ",(0,a.kt)("strong",{parentName:"p"},"SCSS")," the ",(0,a.kt)("inlineCode",{parentName:"p"},":")," needs to be escaped by a backslash as such ",(0,a.kt)("inlineCode",{parentName:"p"},"Mycomponent\\:"),", while in ",(0,a.kt)("strong",{parentName:"p"},"JS")," using the ",(0,a.kt)("inlineCode",{parentName:"p"},"$")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"$$")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"escape")," functions to deal with DOM selectors the colon ",(0,a.kt)("inlineCode",{parentName:"p"},":")," is automatically escaped. Otherwise it needs to be escaped as such ",(0,a.kt)("inlineCode",{parentName:"p"},'querySelector(".Mycomponent\\\\:")'),"."))}m.isMDXComponent=!0}}]);