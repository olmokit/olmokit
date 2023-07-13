---
id: gsap-and-private-packages
title: GSAP and private packages
---

Per usare [GSAP](https://greensock.com/gsap/) premium inanzitutto scaricare lo zip **GSAP with Shockingly Green bonus** dalla [dashboard di greensock.com](https://greensock.com/profile/61067-fabsfabs/content/?do=dashboard)

- scompattare lo zip, trovare e copiare il file `gsap-bonus.tgz` così com'è nel progetto in corso. Copiarlo nel path `src/vendor/gsap-bonus.tgz`
- nel `package.json` del progetto in corso aggiungere questa voce con il path giusto:

```json
"resolutions": {
  "gsap": "file:src/vendor/gsap-bonus.tgz"
}
```

- lanciare `npm i`
- nel file JavaScript dove si intende usarlo fare un normale import e registrare i plugin che si vuole utilizzare per evitare problemi di tree shaking nella futura `build` di production. Ad esempio:

```js
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);
```

- a posto.

Da notare è che il file `src/vendor/gsap-bonus.tgz` deve rimanere nel repository e su git altrimenti la CI non sa dove andarlo a prendere non essendo pubblica questa libreria.
