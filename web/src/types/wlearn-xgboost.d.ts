declare module "@wlearn/xgboost" {
  export function loadXGB(options?: Record<string, unknown>): Promise<unknown>;

  export class DMatrix {
    constructor(
      data: number[][] | Float32Array,
      options?: {
        nrow?: number;
        ncol?: number;
        missing?: number;
        label?: number[] | Float32Array;
      },
    );
    setLabel(labels: number[] | Float32Array): void;
    dispose(): void;
  }

  export class Booster {
    constructor(
      params?: Record<string, string | number>,
      cache?: DMatrix[],
    );
    update(dtrain: DMatrix, iteration: number): void;
    predict(
      dtest: DMatrix,
      options?: { ntreeLimit?: number; type?: number },
    ): Float32Array;
    saveModel(format?: "ubj" | "json"): Uint8Array;
    dispose(): void;
  }
}
