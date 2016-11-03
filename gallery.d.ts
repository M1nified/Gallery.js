interface Options {
    id?: string;
    class?: string[];
    hover_scroll: boolean;
    click_full_screen: boolean;
    click_change: boolean;
    hover_zoom: boolean;
    hover_zoom_level: number;
    click_borders: number[];
}
declare class Gallery {
    options: Options;
    box: HTMLDivElement;
    box_fs_keeper: HTMLDivElement;
    box_fs: HTMLDivElement;
    big: HTMLDivElement;
    bigPic: HTMLImageElement;
    mini_cover: HTMLDivElement;
    mini: HTMLDivElement;
    images: any[];
    is_full_screen: boolean;
    constructor(images: any[], options: Options);
    prep_box(): void;
    prep_big(): void;
    prep_mini(): void;
    prep_hover_scroll(): void;
    showInBig(nth: number): void;
    showInMini(nth: number): void;
    findActive(): {
        index: number;
        image: any;
    };
    fullScreen(on_off: boolean): void;
}
declare var module: any;
