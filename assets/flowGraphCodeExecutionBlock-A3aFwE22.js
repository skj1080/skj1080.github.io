import { w as i, x as e, __tla as __tla_0 } from "./index-BOsmry1D.js";
let o;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  o = class extends i {
    constructor(t) {
      super(t), this.config = t, this.executionFunction = this.registerDataInput("function", e), this.value = this.registerDataInput("value", e), this.result = this.registerDataOutput("result", e);
    }
    _updateOutputs(t) {
      const s = this.executionFunction.getValue(t), u = this.value.getValue(t);
      s && this.result.setValue(s(u, t), t);
    }
    getClassName() {
      return "FlowGraphCodeExecutionBlock";
    }
  };
});
export {
  o as FlowGraphCodeExecutionBlock,
  __tla
};
