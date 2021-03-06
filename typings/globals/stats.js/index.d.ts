// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/ed0ef6e409b56c6b01a8a1ebcece5d6c5b2d681f/stats.js/index.d.ts
declare class Stats {
    REVISION: number;
    dom: HTMLDivElement;

    /**
     * @param value 0:fps, 1: ms, 2: mb, 3+: custom
     */
    showPanel(value: number): void;
    begin(): void;
    end(): number;
    update(): void;
}

declare module "stats.js" {
    export = Stats;
}
