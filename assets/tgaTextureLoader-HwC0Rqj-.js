import { g as r, h as n, __tla as __tla_0 } from "./index-DhuI_8nE.js";
let d;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  d = class {
    constructor() {
      this.supportCascades = false;
    }
    loadCubeData() {
      throw ".env not supported in Cube.";
    }
    loadData(e, t, o) {
      const s = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), a = r(s);
      o(a.width, a.height, t.generateMipMaps, false, () => {
        n(t, s);
      });
    }
  };
});
export {
  d as _TGATextureLoader,
  __tla
};
