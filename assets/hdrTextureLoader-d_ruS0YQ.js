import { R as p, d as c, __tla as __tla_0 } from "./index-Bx5QOELD.js";
let h;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  h = class {
    constructor() {
      this.supportCascades = false;
    }
    loadCubeData() {
      throw ".hdr not supported in Cube.";
    }
    loadData(o, e, l) {
      const r = new Uint8Array(o.buffer, o.byteOffset, o.byteLength), t = p(r), n = c(r, t), i = t.width * t.height, s = new Float32Array(i * 4);
      for (let a = 0; a < i; a += 1) s[a * 4] = n[a * 3], s[a * 4 + 1] = n[a * 3 + 1], s[a * 4 + 2] = n[a * 3 + 2], s[a * 4 + 3] = 1;
      l(t.width, t.height, e.generateMipMaps, false, () => {
        const a = e.getEngine();
        e.type = 1, e.format = 5, e._gammaSpace = false, a._uploadDataToTextureDirectly(e, s);
      });
    }
  };
});
export {
  h as _HDRTextureLoader,
  __tla
};
