interface Options {
    id?: string;
    class?: string[];
    hover_scroll: boolean;
}
declare class Gallery {
    options: Options;
    box: HTMLDivElement;
    big: HTMLDivElement;
    bigPic: HTMLImageElement;
    mini_cover: HTMLDivElement;
    mini: HTMLDivElement;
    images: HTMLImageElement[];
    constructor(images: HTMLImageElement[], options: Options);
    prep_box(): void;
    prep_big(): void;
    prep_mini(): void;
    prep_hover_scroll(): void;
    toBig(nth: number): void;
}
declare var module: any;
