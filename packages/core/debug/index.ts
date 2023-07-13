// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
let debug;

if (process.env["NODE_ENV"] !== "production") {
  debug = {
    getEventListenersCount() {
      const output = Array.from(document.querySelectorAll("*")).reduce(
        function (pre, dom) {
          const evtObj = getEventListeners(dom);
          Object.keys(evtObj).forEach(function (evt) {
            if (typeof pre[evt] === "undefined") {
              pre[evt] = 0;
            }
            pre[evt] += evtObj[evt].length;
          });
          return pre;
        },
        {}
      );

      console.log(output);
    },
  };

  window["debug"] = debug;
}

export default debug;
