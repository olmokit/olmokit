"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[1169],{7522:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>g});var a=n(9901);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=p(n),d=r,g=u["".concat(l,".").concat(d)]||u[d]||m[d]||o;return n?a.createElement(g,s(s({ref:t},c),{},{components:n})):a.createElement(g,s({ref:t},c))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:r,s[1]=i;for(var p=2;p<o;p++)s[p]=n[p];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},2307:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var a=n(3027),r=(n(9901),n(7522));const o={title:"Async behaviours"},s=void 0,i={unversionedId:"guides/async-behaviours",id:"guides/async-behaviours",title:"Async behaviours",description:"This document aims to explain various techniques and implementations of async behaviours in your frontend application.",source:"@site/docs/guides/async-behaviours.md",sourceDirName:"guides",slug:"/guides/async-behaviours",permalink:"/guides/async-behaviours",draft:!1,editUrl:"https://github.com/olmokit/olmokit/edit/main/docs/docs/guides/async-behaviours.md",tags:[],version:"current",frontMatter:{title:"Async behaviours"},sidebar:"docs",previous:{title:"Using custom fonts",permalink:"/guides/fonts"},next:{title:"Working without api",permalink:"/guides/working-without-api"}},l={},p=[{value:"Basic async fragment replace",id:"basic-async-fragment-replace",level:2},{value:"Altering a component when used as a fragment",id:"altering-a-component-when-used-as-a-fragment",level:3},{value:"Customize fragment loading state",id:"customize-fragment-loading-state",level:3},{value:"Comunicate with your internal frontend endpoints",id:"comunicate-with-your-internal-frontend-endpoints",level:2}],c={toc:p},u="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This document aims to explain various techniques and implementations of async behaviours in your frontend application."),(0,r.kt)("h2",{id:"basic-async-fragment-replace"},"Basic async fragment replace"),(0,r.kt)("video",{src:"../../static/screencasts/fragments-replace.webm",loop:!0,autoplay:!0,playsinline:!0,mute:!0,controls:!0}),(0,r.kt)("p",null,"Let's say you have a component in ",(0,r.kt)("inlineCode",{parentName:"p"},"src/components/ProductDetail/")," that you want to inject asynchronously into a route."),(0,r.kt)("p",null,"In your route template, e.g. in ",(0,r.kt)("inlineCode",{parentName:"p"},"/src/routes/myroute/index.blade.php")," write:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<x-fragments-replace id="product">\n  <p>Loading product...</p>\n</x-fragments-replace>\n')),(0,r.kt)("p",null,"In your route js, e.g. in ",(0,r.kt)("inlineCode",{parentName:"p"},"/src/routes/myroute/index.js"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import ProductDetail from "components/ProductDetail";\nimport { replaceFragment } from "@olmokit/core/fragments";\n\n// basic usage\nreplaceFragment("product", "components.ProductDetail");\n\n// or pass custom data to the component with:\nreplaceFragment("product", "components.ProductDetail", { myData: "this is async" });\n\n// or initialise the component once rendered\nreplaceFragment("product", "components.ProductDetail").then(() => ProductDetail());\n')),(0,r.kt)("p",null,"Done, the component is automatically fetched and placed inside your template."),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"You need to import the js/scss of your component either in the route from where you requested it or asynchronously with ",(0,r.kt)("a",{parentName:"p",href:"https://webpack.js.org/guides/code-splitting/#dynamic-imports"},"dynamic imports"),".")),(0,r.kt)("h3",{id:"altering-a-component-when-used-as-a-fragment"},"Altering a component when used as a fragment"),(0,r.kt)("p",null,"You might find useful to use the same route or component both in a ",(0,r.kt)("em",{parentName:"p"},"fragment way")," (asynchronous) and in ",(0,r.kt)("em",{parentName:"p"},"standard way")," (synchronous). A common use case is a product page whose inner content is also used inside a product dialog component reused across various routes. In this scenario you can differentiate the template and selectively exclude or include parts of it based on whether the template is used in a fragment or not. For this purpose a custom blade directive is made available by the ",(0,r.kt)("a",{parentName:"p",href:"../laravel-frontend/Fragments"},"FragmentsServiceProvider"),"."),(0,r.kt)("p",null,"Continuing from the above example your template in ",(0,r.kt)("inlineCode",{parentName:"p"},"src/components/ProductDetail/index.blade.php")," could look like:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},"<div class=\"ProductDetail:\">\n  @fragment('product') I will appear only when this component is used as a 'product' fragment @elsefragment I will appear only when this component is <b>not</b> used as a 'product' fragment @endfragment\n  <p>I will appear in both cases</p>\n</div>\n")),(0,r.kt)("h3",{id:"customize-fragment-loading-state"},"Customize fragment loading state"),(0,r.kt)("p",null,"Using a ",(0,r.kt)("a",{parentName:"p",href:"../core/progress"},"progress")," core component:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<x-fragments-replace id="product">\n  <x-progress-circular />\n</x-fragments-replace>\n')),(0,r.kt)("p",null,"Using a ",(0,r.kt)("a",{parentName:"p",href:"../core/skeleton"},"skeleton")," core component:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<x-fragments-replace id="product">\n  <p>Loading product...</p>\n  <x-skeleton-list width="400"></x-skeleton-list>\n</x-fragments-replace>\n')),(0,r.kt)("h2",{id:"comunicate-with-your-internal-frontend-endpoints"},"Comunicate with your internal frontend endpoints"),(0,r.kt)("p",null,"Three steps to expose an ajax endpoint"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a route controller in ",(0,r.kt)("inlineCode",{parentName:"li"},"/src/fragments/MyController.php")," and define all the methods you need:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-php"},'<?php\n\nnamespace resources\\fragments;\n\nuse Illuminate\\Http\\Request;\nuse LaravelFrontend\\App\\Controllers\\Fragment;\n\nclass MyController extends Fragment\n{\n  public function get(Request $request)\n  {\n    $data = ["some", "data", "from", "anywhere"];\n\n    return response()->json($data);\n  }\n\n  public function post(Request $request)\n  {\n    $data = $request->all();\n    // do something with that...\n\n    return response()->json();\n  }\n}\n')),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"In ",(0,r.kt)("inlineCode",{parentName:"li"},"/src/fragments/routes.php")," define routes endpoint and assign the controller you just wrote.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-php"},'<?php\n\nuse Illuminate\\Support\\Facades\\Route;\nuse resources\\fragments\\MyController;\n\nRoute::get("myendpoint", [MyController::class, "get"]);\nRoute::post("myendpoint", [MyController::class, "post"]);\n')),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Consume the endpoints in your JavaScripts using the ajax utilities:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { get, post } from "@olmokit/core/fragments/ajax";\n\nget("myendpoint").then(({ data }) => {\n  console.log(data);\n});\n\npost("myendpoint", {\n  data: {\n    someKey: "some value",\n  },\n}).then(({ data }) => {\n  console.log(data);\n});\n')),(0,r.kt)("p",null,"The laravel related ajax calls always sends along the ",(0,r.kt)("inlineCode",{parentName:"p"},"X-CSRF-TOKEN")," in the request header for security reasons."))}m.isMDXComponent=!0}}]);