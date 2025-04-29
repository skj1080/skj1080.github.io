import { G as l, U as t, c as d, __tla as __tla_0 } from "./index-kfT7UMk5.js";
let v;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  v = class {
    constructor() {
      this.supportCascades = false;
    }
    loadCubeData(s, e, c, i, n) {
      if (Array.isArray(s)) return;
      const a = l(s);
      if (a) {
        e.width = a.width, e.height = a.width;
        try {
          t(e, a), d(e, s, a).then(() => {
            e.isReady = true, e.onLoadedObservable.notifyObservers(e), e.onLoadedObservable.clear(), i && i();
          }, (o) => {
            n == null ? void 0 : n("Can not upload environment levels", o);
          });
        } catch (o) {
          n == null ? void 0 : n("Can not upload environment file", o);
        }
      } else n && n("Can not parse the environment file", null);
    }
    loadData() {
      throw ".env not supported in 2d.";
    }
  };
});
export {
  v as _ENVTextureLoader,
  __tla
};
