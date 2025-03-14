import { w as i, x as t, __tla as __tla_0 } from "./index-BtGSuoN0.js";
let m;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  m = class extends i {
    constructor(s) {
      var _a, _b;
      super();
      const a = s.glTF, r = ((_a = a.animations) == null ? void 0 : _a.map((o) => o._babylonAnimationGroup)) || [];
      this.animationGroups = this.registerDataOutput("animationGroups", t, r);
      const n = ((_b = a.nodes) == null ? void 0 : _b.map((o) => o._babylonTransformNode)) || [];
      this.nodes = this.registerDataOutput("nodes", t, n);
    }
    getClassName() {
      return "FlowGraphGLTFDataProvider";
    }
  };
});
export {
  m as FlowGraphGLTFDataProvider,
  __tla
};
