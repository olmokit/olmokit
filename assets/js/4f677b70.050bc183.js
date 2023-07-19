"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[353],{7522:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>k});var n=a(9901);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},c=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=s(a),m=r,k=d["".concat(p,".").concat(m)]||d[m]||u[m]||o;return a?n.createElement(k,l(l({ref:t},c),{},{components:a})):n.createElement(k,l({ref:t},c))}));function k(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,l=new Array(o);l[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[d]="string"==typeof e?e:r,l[1]=i;for(var s=2;s<o;s++)l[s]=a[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},2075:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var n=a(3027),r=(a(9901),a(7522));const o={title:"Exchanging data between php and js",sidebar_label:"Exchanging data"},l=void 0,i={unversionedId:"guides/data",id:"guides/data",title:"Exchanging data between php and js",description:"The purpose is to standardise the exchange of data between the php server side and js client side of your frontend application. There are two types of data exchange:",source:"@site/docs/guides/data.md",sourceDirName:"guides",slug:"/guides/data",permalink:"/olmokit/guides/data",draft:!1,editUrl:"https://github.com/olmokit/olmokit/tree/main/apps/docs/docs/docs/guides/data.md",tags:[],version:"current",frontMatter:{title:"Exchanging data between php and js",sidebar_label:"Exchanging data"},sidebar:"docs",previous:{title:"Authentication",permalink:"/olmokit/guides/authentication"},next:{title:"Deploy through CI",permalink:"/olmokit/guides/deploy"}},p={},s=[{value:"Global configuration data",id:"global-configuration-data",level:2},{value:"Global custom data",id:"global-custom-data",level:2},{value:"Examples",id:"examples",level:2},{value:"Using a custom <code>.env</code> variable",id:"using-a-custom-env-variable",level:3},{value:"Accessing the currently authenticated user",id:"accessing-the-currently-authenticated-user",level:3}],c={toc:s},d="wrapper";function u(e){let{components:t,...a}=e;return(0,r.kt)(d,(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"The purpose is to standardise the exchange of data between the ",(0,r.kt)("inlineCode",{parentName:"p"},"php")," ",(0,r.kt)("em",{parentName:"p"},"server side")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"js")," ",(0,r.kt)("em",{parentName:"p"},"client side")," of your ",(0,r.kt)("strong",{parentName:"p"},"frontend")," application. There are two types of data exchange:"),(0,r.kt)("h2",{id:"global-configuration-data"},"Global configuration data"),(0,r.kt)("p",null,"Usage, from any of your project JavaScript files:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { globalConf } from "@olmokit/core/data";\n\nconsole.log(globalConf);\n')),(0,r.kt)("p",null,"The object ",(0,r.kt)("inlineCode",{parentName:"p"},"globalConf")," has following keys:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"baseUrl"),": your project's base URL (environment aware), e.g.: ",(0,r.kt)("inlineCode",{parentName:"li"},"http:/myproject.test")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"cmsApiUrl"),": the CMS API base URL, e.g. ",(0,r.kt)("inlineCode",{parentName:"li"},"https:/myproject.back.company.net/api"),","),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"mediaUrl"),": the Media remote base URL, e.g. ",(0,r.kt)("inlineCode",{parentName:"li"},"https:/myproject.back.company.net/storage/app/media")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"locale"),": the current locale (return value of ",(0,r.kt)("inlineCode",{parentName:"li"},"App::getLocale()"),")"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"authenticated"),": a boolean to indicate whether the user is authenticated or not (return value of ",(0,r.kt)("inlineCode",{parentName:"li"},"AuthApi::check()"),")")),(0,r.kt)("p",null,"This data is automatically injected from the core component ",(0,r.kt)("inlineCode",{parentName:"p"},"<x-assets-head />")," that should be included in your ",(0,r.kt)("inlineCode",{parentName:"p"},"src/layout/main/index.blade.php")),(0,r.kt)("h2",{id:"global-custom-data"},"Global custom data"),(0,r.kt)("p",null,"Usage, from any of your project JavaScript files:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { globalData } from "@olmokit/core/data";\n\nconsole.log(globalData);\n')),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"globalData")," is an object with the keys and data that you add from the core component ",(0,r.kt)("inlineCode",{parentName:"p"},'<x-data key="mykey" :data="$data" />')," where ",(0,r.kt)("inlineCode",{parentName:"p"},"mykey")," can be any string and ",(0,r.kt)("inlineCode",{parentName:"p"},"$data")," can be any php value (is automatically encoded with ",(0,r.kt)("inlineCode",{parentName:"p"},"json_encode"),").\nYou can use ",(0,r.kt)("inlineCode",{parentName:"p"},"<x-data />")," component from any route, component or any blade template file. Note that if the same key is given from mulitple points the data will be overriden."),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)("h3",{id:"using-a-custom-env-variable"},"Using a custom ",(0,r.kt)("inlineCode",{parentName:"h3"},".env")," variable"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"olmo.ts"),":")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'// ...config\nenv: {\n  extraVars: {\n    MY_KEY: "myvalue";\n  }\n}\n')),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"config/env.php")," and .",(0,r.kt)("inlineCode",{parentName:"p"},"env")," are automatically updated")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"src/routes/myroute.blade.php"),":"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<x-data key="myKey" :value="config(\'env.MY_KEY\')" />\n')),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"src/routes/index.js")," (or any other js file):")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { globalData } from "@olmokit/core/data";\n\nconsole.log(globalData.myKey);\n')),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"It should not happen but in case the env variable value is not updated on change run from the terminal")," ",(0,r.kt)("inlineCode",{parentName:"p"},"npm run clear"),"."),(0,r.kt)("h3",{id:"accessing-the-currently-authenticated-user"},"Accessing the currently authenticated user"),(0,r.kt)("p",null,"This will expose the user without its ",(0,r.kt)("inlineCode",{parentName:"p"},"token")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"token_active")," on the client side to prevent security risks."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"src/layouts/main.blade.php"),":")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<x-data key="user" :value="$userJs" />\n')),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"src/routes/index.js")," (or any other js file):")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { globalData } from "@olmokit/core/data";\n\nconsole.log(globalData.user);\n')))}u.isMDXComponent=!0}}]);