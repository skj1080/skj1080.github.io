import { K as o, e as p, f as t, __tla as __tla_0 } from "./index-BznsqQhg.js";
let d;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function f(l) {
    switch (l) {
      case 35916:
        return 33776;
      case 35918:
        return 33778;
      case 35919:
        return 33779;
      case 37493:
        return 37492;
      case 37497:
        return 37496;
      case 37495:
        return 37494;
      case 37840:
        return 37808;
      case 36493:
        return 36492;
    }
    return null;
  }
  d = class {
    constructor() {
      this.supportCascades = false;
    }
    loadCubeData(n, e, r, i) {
      if (Array.isArray(n)) return;
      e._invertVScale = !e.invertY;
      const a = e.getEngine(), s = new o(n, 6), g = s.numberOfMipmapLevels > 1 && e.generateMipMaps;
      a._unpackFlipY(true), s.uploadLevels(e, e.generateMipMaps), e.width = s.pixelWidth, e.height = s.pixelHeight, a._setCubeMapTextureParams(e, g, s.numberOfMipmapLevels - 1), e.isReady = true, e.onLoadedObservable.notifyObservers(e), e.onLoadedObservable.clear(), i && i();
    }
    loadData(n, e, r, i) {
      if (o.IsValid(n)) {
        e._invertVScale = !e.invertY;
        const a = new o(n, 1), s = f(a.glInternalFormat);
        s ? (e.format = s, e._useSRGBBuffer = e.getEngine()._getUseSRGBBuffer(true, e.generateMipMaps), e._gammaSpace = true) : e.format = a.glInternalFormat, r(a.pixelWidth, a.pixelHeight, e.generateMipMaps, true, () => {
          a.uploadLevels(e, e.generateMipMaps);
        }, a.isInvalid);
      } else p.IsValid(n) ? new p(e.getEngine())._uploadAsync(n, e, i).then(() => {
        r(e.width, e.height, e.generateMipMaps, true, () => {
        }, false);
      }, (s) => {
        t.Warn(`Failed to load KTX2 texture data: ${s.message}`), r(0, 0, false, false, () => {
        }, true);
      }) : (t.Error("texture missing KTX identifier"), r(0, 0, false, false, () => {
      }, true));
    }
  };
});
export {
  d as _KTXTextureLoader,
  __tla
};
