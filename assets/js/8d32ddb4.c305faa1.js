"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[7466],{7522:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>f});var n=a(9901);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var i=n.createContext({}),s=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},m=function(e){var t=s(e.components);return n.createElement(i.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,r=e.originalType,i=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),c=s(a),d=l,f=c["".concat(i,".").concat(d)]||c[d]||u[d]||r;return a?n.createElement(f,o(o({ref:t},m),{},{components:a})):n.createElement(f,o({ref:t},m))}));function f(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=a.length,o=new Array(r);o[0]=d;var p={};for(var i in t)hasOwnProperty.call(t,i)&&(p[i]=t[i]);p.originalType=e,p[c]="string"==typeof e?e:l,o[1]=p;for(var s=2;s<r;s++)o[s]=a[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},1145:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>p,toc:()=>s});var n=a(3027),l=(a(9901),a(7522));const r={id:"custom-templates",title:"Custom Templates"},o=void 0,p={unversionedId:"custom-templates",id:"custom-templates",title:"Custom Templates",description:"Custom Templates enable you to select a template to create your project from, while still retaining all of the features of Create Laravel App.",source:"@site/docs/custom-templates.md",sourceDirName:".",slug:"/custom-templates",permalink:"/olmokit/custom-templates",draft:!1,editUrl:"https://github.com/olmokit/olmokit/edit/main/docs/docs/custom-templates.md",tags:[],version:"current",frontMatter:{id:"custom-templates",title:"Custom Templates"},sidebar:"docs",previous:{title:"Typography",permalink:"/olmokit/laravel-frontend/Typography"}},i={},s=[{value:"Finding custom templates",id:"finding-custom-templates",level:2},{value:"Building a template",id:"building-a-template",level:2},{value:"Testing a template",id:"testing-a-template",level:3},{value:"The <code>template</code> folder",id:"the-template-folder",level:3},{value:"The <code>template.json</code> file",id:"the-templatejson-file",level:3}],m={toc:s},c="wrapper";function u(e){let{components:t,...a}=e;return(0,l.kt)(c,(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Custom Templates enable you to select a template to create your project from, while still retaining all of the features of Create Laravel App."),(0,l.kt)("p",null,"You'll notice that Custom Templates are always named in the format ",(0,l.kt)("inlineCode",{parentName:"p"},"template-laravel-[template-name]"),", however you only need to provide the ",(0,l.kt)("inlineCode",{parentName:"p"},"[template-name]")," to the creation command."),(0,l.kt)("p",null,"Scoped templates are also supported, under the name ",(0,l.kt)("inlineCode",{parentName:"p"},"@[scope-name]/template-laravel")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"@[scope-name]/template-laravel-[template-name]"),", which can be installed via ",(0,l.kt)("inlineCode",{parentName:"p"},"@[scope]")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"@[scope]/[template-name]")," respectively."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"npx @olmokit/create-app myproject --template [template-name]\n")),(0,l.kt)("h2",{id:"finding-custom-templates"},"Finding custom templates"),(0,l.kt)("p",null,"We ship one template by default:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://gitlab.com/olmokit/olmokit/-/tree/main/packages/template-laravel"},(0,l.kt)("inlineCode",{parentName:"a"},"template-laravel")))),(0,l.kt)("p",null,"However, you can find other templates by searching for ",(0,l.kt)("a",{parentName:"p",href:"https://www.npmjs.com/search?q=template-laravel-*"},'"template-laravel-',"*",'"')," on npm."),(0,l.kt)("h2",{id:"building-a-template"},"Building a template"),(0,l.kt)("p",null,"If you're interested in building a custom template, first take a look at how we've built ",(0,l.kt)("a",{parentName:"p",href:"https://gitlab.com/olmokit/olmokit/-/tree/main/packages/template-laravel"},(0,l.kt)("inlineCode",{parentName:"a"},"template-laravel")),"."),(0,l.kt)("p",null,"A template should have the following structure:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"\u251c\u2500\u2500 template-laravel-[template-name]/\n\u251c\u2500\u2500 README.md\n\u251c\u2500\u2500 template.json\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 template/\n  \u251c\u2500\u2500 config/ # (optional)\n  |   \u2514\u2500\u2500 # ...config files\n  \u251c\u2500\u2500 src/\n  |   \u2514\u2500\u2500 # ...all files\n  \u251c\u2500\u2500 composer.json\n  \u251c\u2500\u2500 gitignore # (optional)\n  \u251c\u2500\u2500 README.md # (optional, for projects created from this template)\n")),(0,l.kt)("h3",{id:"testing-a-template"},"Testing a template"),(0,l.kt)("p",null,"To test a template locally, pass the file path to the directory of your template source using the ",(0,l.kt)("inlineCode",{parentName:"p"},"file:")," prefix."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"npx @olmokit/create-app myproject --template file:../path/to/your/template/template-laravel-[template-name]\n")),(0,l.kt)("h3",{id:"the-template-folder"},"The ",(0,l.kt)("inlineCode",{parentName:"h3"},"template")," folder"),(0,l.kt)("p",null,"This folder is copied to the user's app directory as Create Laravel App installs. During this process, the file ",(0,l.kt)("inlineCode",{parentName:"p"},"gitignore")," is renamed to ",(0,l.kt)("inlineCode",{parentName:"p"},".gitignore"),"."),(0,l.kt)("p",null,"You can add whatever files you want in here, but you must have at least the files specified above."),(0,l.kt)("h3",{id:"the-templatejson-file"},"The ",(0,l.kt)("inlineCode",{parentName:"h3"},"template.json")," file"),(0,l.kt)("p",null,"This is the configuration file for your template. As this is a new feature, more options will be added over time. For now, only a ",(0,l.kt)("inlineCode",{parentName:"p"},"package")," key is supported."),(0,l.kt)("p",null,"The ",(0,l.kt)("inlineCode",{parentName:"p"},"package")," key lets you provide any keys/values that you want added to the new project's ",(0,l.kt)("inlineCode",{parentName:"p"},"package.json"),", such as dependencies and any custom scripts that your template relies on."),(0,l.kt)("p",null,"Below is an example ",(0,l.kt)("inlineCode",{parentName:"p"},"template.json")," file:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "package": {\n    "dependencies": {\n      "eslint-plugin-jsx-a11y": "^6.2.3",\n      "serve": "^11.2.0"\n    },\n    "scripts": {\n      "serve": "serve -s build"\n    },\n    "eslintConfig": {\n      "extends": ["plugin:jsx-a11y/recommended"],\n      "plugins": ["jsx-a11y"]\n    }\n  }\n}\n')),(0,l.kt)("p",null,"Any values you add for ",(0,l.kt)("inlineCode",{parentName:"p"},'"dependencies"')," and ",(0,l.kt)("inlineCode",{parentName:"p"},'"scripts"')," will be merged with the Create Laravel App defaults. Values for any other keys will be used as-is, replacing any matching Create Laravel App defaults."))}u.isMDXComponent=!0}}]);