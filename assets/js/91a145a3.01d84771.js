"use strict";(self.webpackChunk_olmokit_docs=self.webpackChunk_olmokit_docs||[]).push([[8129],{7522:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(9901);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),d=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(s.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=d(n),k=r,m=u["".concat(s,".").concat(k)]||u[k]||c[k]||o;return n?a.createElement(m,i(i({ref:t},p),{},{components:n})):a.createElement(m,i({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=k;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:r,i[1]=l;for(var d=2;d<o;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},5153:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var a=n(3027),r=(n(9901),n(7522));const o={title:"Auth"},i=void 0,l={unversionedId:"laravel-frontend/Auth",id:"laravel-frontend/Auth",title:"Auth",description:"This document aims to standardise the comunication between backend and frontend in regards to authentication.",source:"@site/docs/laravel-frontend/Auth.md",sourceDirName:"laravel-frontend",slug:"/laravel-frontend/Auth",permalink:"/laravel-frontend/Auth",draft:!1,editUrl:"https://github.com/olmokit/olmokit/edit/main/docs/docs/laravel-frontend/Auth.md",tags:[],version:"current",frontMatter:{title:"Auth"},sidebar:"docs",previous:{title:"App",permalink:"/laravel-frontend/App"},next:{title:"Cache",permalink:"/laravel-frontend/Cache"}},s={},d=[{value:"Forms construction",id:"forms-construction",level:2},{value:"Login form",id:"login-form",level:3},{value:"Profile form",id:"profile-form",level:3},{value:"Registration form",id:"registration-form",level:3},{value:"Sending data",id:"sending-data",level:2},{value:"Activation",id:"activation",level:3},{value:"Flow (activation)",id:"flow-activation",level:4},{value:"Frontend request (activation)",id:"frontend-request-activation",level:4},{value:"Backend response (activation)",id:"backend-response-activation",level:4},{value:"Login",id:"login",level:3},{value:"Flow (login)",id:"flow-login",level:4},{value:"Frontend request (login)",id:"frontend-request-login",level:4},{value:"Frontend middleware response (login)",id:"frontend-middleware-response-login",level:4},{value:"Backend response (login)",id:"backend-response-login",level:4},{value:"Password change",id:"password-change",level:3},{value:"Flow (password change)",id:"flow-password-change",level:4},{value:"Frontend request (password change)",id:"frontend-request-password-change",level:4},{value:"Backend response (password change)",id:"backend-response-password-change",level:4},{value:"Password recovery",id:"password-recovery",level:3},{value:"Flow (password recovery)",id:"flow-password-recovery",level:4},{value:"Frontend request (password recovery)",id:"frontend-request-password-recovery",level:4},{value:"Backend response (password recovery)",id:"backend-response-password-recovery",level:4},{value:"Password reset",id:"password-reset",level:3},{value:"Flow (password reset)",id:"flow-password-reset",level:4},{value:"Frontend request (password reset)",id:"frontend-request-password-reset",level:4},{value:"Backend response (password reset)",id:"backend-response-password-reset",level:4},{value:"Profile update",id:"profile-update",level:3},{value:"Flow (profile update)",id:"flow-profile-update",level:4},{value:"Frontend request (profile update)",id:"frontend-request-profile-update",level:4},{value:"Backend response (profile update)",id:"backend-response-profile-update",level:4},{value:"Registration",id:"registration",level:3},{value:"Flow (registration)",id:"flow-registration",level:4},{value:"Frontend request (registration)",id:"frontend-request-registration",level:4},{value:"Backend response (registration)",id:"backend-response-registration",level:4}],p={toc:d},u="wrapper";function c(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This document aims to standardise the comunication between backend and frontend in regards to authentication."),(0,r.kt)("h2",{id:"forms-construction"},"Forms construction"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Backend Auth service ",(0,r.kt)("inlineCode",{parentName:"strong"},"GET")," endpoints")),(0,r.kt)("p",null,"The backend Auth service expose some ",(0,r.kt)("strong",{parentName:"p"},"localised")," ",(0,r.kt)("inlineCode",{parentName:"p"},"GET"),' endpoints that the frontend use to construct the forms, the ones related to "system" forms are optional (',(0,r.kt)("inlineCode",{parentName:"p"},"login"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"password-change"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"password-recovery"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"password-reset"),").\nThe frontend use these endpoints to construct the forms, the response of the Backend Auth service share the same structure for all these endpoints:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "olmoformsToken": "xyzsadasda", // optional\n  "olmoformsId": 102, // optional\n  "fields": [\n    // ...fields from a olmoforms form\n    // additional fields hardcoded in the backend (if necessary)\n    "blocked": {\n      "required": false,\n      // same structure that olmoforms uses for a field\n    },\n  ]\n}\n')),(0,r.kt)("h3",{id:"login-form"},"Login form"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/forms/{LOCALE}/login"))),(0,r.kt)("p",null,"This is ",(0,r.kt)("strong",{parentName:"p"},"optional"),", by default a form in the frontend is autogenerated and sends the following body:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "email": "somevalid@email.com",\n  "password": "an md5 encrypted non-empty password"\n}\n')),(0,r.kt)("h3",{id:"profile-form"},"Profile form"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/forms/{LOCALE}/profile"))),(0,r.kt)("p",null,"This is required."),(0,r.kt)("h3",{id:"registration-form"},"Registration form"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/forms/{LOCALE}/register"))),(0,r.kt)("p",null,"This is required."),(0,r.kt)("h2",{id:"sending-data"},"Sending data"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Backend Auth service ",(0,r.kt)("inlineCode",{parentName:"strong"},"POST")," endpoints")),(0,r.kt)("p",null,"The frontend send each form data as ",(0,r.kt)("inlineCode",{parentName:"p"},"JSON")," with a ",(0,r.kt)("inlineCode",{parentName:"p"},"POST")," request to the endpoint defined the the above response. A sample ",(0,r.kt)("inlineCode",{parentName:"p"},"request body")," sent by the frontend look like a simple dictionary where the keys always match the ones dictated by the backend in the Form construction ",(0,r.kt)("inlineCode",{parentName:"p"},"GET")," endpoint (see above):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "first_name": "My name",\n  "last_name": "My surname",\n  // ...etc.\n  "current_locale": "en",\n  "current_timezone": "Europe/Paris" // or null\n}\n')),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"The frontend always add to the data sent to the ",(0,r.kt)("inlineCode",{parentName:"p"},"login"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"register")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"profile")," endpoints these values:"),(0,r.kt)("ul",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},'"current_locale"'),": the backend can decide whether to use it, store it or ignore it"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},'"current_timezone"'),": grabbed from the user browser in JavaScript, it can be ",(0,r.kt)("inlineCode",{parentName:"li"},"null")," if we could not determine it client side (this is done through the timezone core component ",(0,r.kt)("inlineCode",{parentName:"li"},'import { ... } from "@olmokit/core/auth/timezone"'),")."))),(0,r.kt)("p",null,"Here the list of the standard authentication endpoints the Auth API should provide."),(0,r.kt)("h3",{id:"activation"},"Activation"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/activate"))),(0,r.kt)("h4",{id:"flow-activation"},"Flow (activation)"),(0,r.kt)("p",null,"After registration a standard auth flow requries a user to be activated, confirming its email address by clicking a link with a generated token. The click brings on a frontend route, once there the frontend sends a token and the backend simply check its validity."),(0,r.kt)("h4",{id:"frontend-request-activation"},"Frontend request (activation)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "token": "a-long-token-from-the-query-param-token="\n}\n')),(0,r.kt)("h4",{id:"backend-response-activation"},"Backend response (activation)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"201")," successful activation"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"401")," invalid token"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"500")," generic error")),(0,r.kt)("h3",{id:"login"},"Login"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/login"))),(0,r.kt)("h4",{id:"flow-login"},"Flow (login)"),(0,r.kt)("p",null,"The frontend ",(0,r.kt)("inlineCode",{parentName:"p"},"POST")," this endpoint encrypting the password with ",(0,r.kt)("inlineCode",{parentName:"p"},"md5")," along the other fields.\nThe backend, on successful request return the whole user with a token that the frontend put into the current ",(0,r.kt)("inlineCode",{parentName:"p"},"session")," until a ",(0,r.kt)("strong",{parentName:"p"},"logout")," action."),(0,r.kt)("h4",{id:"frontend-request-login"},"Frontend request (login)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{\n  ...form fields (usually email and password)\n}\n")),(0,r.kt)("h4",{id:"frontend-middleware-response-login"},"Frontend middleware response (login)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"400")," invalid post data (missing required fields)")),(0,r.kt)("h4",{id:"backend-response-login"},"Backend response (login)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "user": {\n    "token": "some-generated-token"\n    // ...all other custom user fields\n  }\n}\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"200")," successful login"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"400")," wrong password ",(0,r.kt)("em",{parentName:"li"},"(this might be not implemented based on the project security's concerns)")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"401")," user inactive, the email has not been verified"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"404")," user with this username/email does not exists"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"500")," generic error")),(0,r.kt)("h3",{id:"password-change"},"Password change"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/password-change"))),(0,r.kt)("h4",{id:"flow-password-change"},"Flow (password change)"),(0,r.kt)("p",null,"The frontend send the old and the new password in ",(0,r.kt)("inlineCode",{parentName:"p"},"md5"),", the backend check that the old password is correct and thn update it."),(0,r.kt)("h4",{id:"frontend-request-password-change"},"Frontend request (password change)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'// X-Token: <token> (user token in the header)\n{\n  "password": "string-md5",\n  "newpassword": "string-md5"\n}\n')),(0,r.kt)("h4",{id:"backend-response-password-change"},"Backend response (password change)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"200")," successful password change"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"400")," invalid post data"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"401")," invalid X-Token"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"500")," generic error")),(0,r.kt)("h3",{id:"password-recovery"},"Password recovery"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/password-recovery"))),(0,r.kt)("h4",{id:"flow-password-recovery"},"Flow (password recovery)"),(0,r.kt)("p",null,"The frontend send an email and a reset URL, if the backend finds the email in the database it sends an email with that URL."),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"Frontend: the ",(0,r.kt)("inlineCode",{parentName:"p"},"reset_url")," must be an absolute URL including a query parameter for the token to read, e.g. ",(0,r.kt)("inlineCode",{parentName:"p"},"https://myproject.com/password-reset/?token="),". The backend will just add the ",(0,r.kt)("inlineCode",{parentName:"p"},"token")," value so the URL must have the query parameter set up. The ",(0,r.kt)("inlineCode",{parentName:"p"},"reset_url")," defaults to the same route used for ",(0,r.kt)("inlineCode",{parentName:"p"},"password-reset")," but it ",(0,r.kt)("a",{parentName:"p",href:"#frontend-configuration"},"can be customised"),".")),(0,r.kt)("h4",{id:"frontend-request-password-recovery"},"Frontend request (password recovery)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "email": "some@email.com",\n  "reset_url": "https://myproject.com/?token="\n}\n')),(0,r.kt)("h4",{id:"backend-response-password-recovery"},"Backend response (password recovery)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"200")," successful password reset"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"400")," invalid post data"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"403")," user with email does not exist"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"500")," generic error")),(0,r.kt)("h3",{id:"password-reset"},"Password reset"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/password-reset"))),(0,r.kt)("h4",{id:"flow-password-reset"},"Flow (password reset)"),(0,r.kt)("p",null,"After the user has requested a password reset through the password receovery and clicked the link recevied by email it lands on a password reset page url with a token in the query param, that will be sent alongside the new password to the backend. The backend check the token validity and save the new password."),(0,r.kt)("h4",{id:"frontend-request-password-reset"},"Frontend request (password reset)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "token": "the-token-sent-by-email",\n  "password": "new-md5-password"\n}\n')),(0,r.kt)("h4",{id:"backend-response-password-reset"},"Backend response (password reset)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"200")," successful password reset"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"400")," invalid post data"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"401")," invalid token"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"500")," generic error")),(0,r.kt)("h3",{id:"profile-update"},"Profile update"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/profile"))),(0,r.kt)("h4",{id:"flow-profile-update"},"Flow (profile update)"),(0,r.kt)("p",null,"The frontend ",(0,r.kt)("inlineCode",{parentName:"p"},"POST")," this endpoint with all the users editable fields (regardless they have been modified or not) and the ",(0,r.kt)("inlineCode",{parentName:"p"},"X-Token")," in the header.\nThe backend should return the whole updated user object and the frontend update its ",(0,r.kt)("inlineCode",{parentName:"p"},"session"),"."),(0,r.kt)("h4",{id:"frontend-request-profile-update"},"Frontend request (profile update)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"// X-Token: <token> (user token in the header)\n{\n  // all form fields\n}\n")),(0,r.kt)("h4",{id:"backend-response-profile-update"},"Backend response (profile update)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "user": {\n    "token": "some-generated-token"\n    // ...all other custom user fields\n  }\n}\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"200")," successful profile update"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"400")," invalid post data"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"401")," invalid X-Token"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"500")," generic error")),(0,r.kt)("h3",{id:"registration"},"Registration"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("inlineCode",{parentName:"p"},"{AUTH_API_URL}/register"))),(0,r.kt)("h4",{id:"flow-registration"},"Flow (registration)"),(0,r.kt)("p",null,"If the athentication flow does not allow a user to be logged in before email verification the backend response can be empty, otherwise, on successful request it returns the whole ",(0,r.kt)("inlineCode",{parentName:"p"},"user")," object with the ",(0,r.kt)("inlineCode",{parentName:"p"},"verified")," flag set to ",(0,r.kt)("inlineCode",{parentName:"p"},"false"),", plus the ",(0,r.kt)("inlineCode",{parentName:"p"},"token"),", the frontend put everything into the current ",(0,r.kt)("inlineCode",{parentName:"p"},"session")," until a ",(0,r.kt)("strong",{parentName:"p"},"logout")," action. The backend use the ",(0,r.kt)("inlineCode",{parentName:"p"},"activate_url")," in the email it send to the user to activate its account adding a ",(0,r.kt)("inlineCode",{parentName:"p"},"token")," query parameter."),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"The ",(0,r.kt)("inlineCode",{parentName:"p"},"activate_url")," must be an absolute URL including a query parameter for the token to read, e.g. ",(0,r.kt)("inlineCode",{parentName:"p"},"https://myproject.com/login/?token="),". The backend just adds the ",(0,r.kt)("inlineCode",{parentName:"p"},"token")," value so the URL must have the query parameter set up. The ",(0,r.kt)("inlineCode",{parentName:"p"},"activate_url")," defaults to the same route used for ",(0,r.kt)("inlineCode",{parentName:"p"},"login")," but it ",(0,r.kt)("a",{parentName:"p",href:"#frontend-configuration"},"can be customised"),".")),(0,r.kt)("h4",{id:"frontend-request-registration"},"Frontend request (registration)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  ...form fields\n  "activate_url": "https://some-absolute.url/?token="\n}\n')),(0,r.kt)("h4",{id:"backend-response-registration"},"Backend response (registration)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"200")," successful registration"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"400")," invalid post data"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"403")," user is blacklisted"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"409")," user with this email is already registered"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"500")," generic error")))}c.isMDXComponent=!0}}]);