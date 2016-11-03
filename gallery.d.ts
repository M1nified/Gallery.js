declare enum AdvertiseUntil {
    none = 0,
    first_hover = 1,
    infinite = 2,
}
interface GalleryOptions {
    id?: string;
    class?: string[];
    hover_scroll: boolean;
    click_full_screen: boolean;
    click_change: boolean;
    hover_zoom: boolean;
    hover_zoom_level: number;
    click_borders: number[];
    advertise_until: AdvertiseUntil;
    advertise_timeout: number;
}
declare class Gallery {
    options: GalleryOptions;
    box: HTMLDivElement;
    big: HTMLDivElement;
    bigPic: HTMLImageElement;
    bigPic2: HTMLImageElement;
    mini_cover: HTMLDivElement;
    mini: HTMLDivElement;
    gfs: GalleryFS;
    images: any[];
    is_full_screen: boolean;
    constructor(images: any[], options: GalleryOptions);
    prep_box(): void;
    prep_big(): void;
    prep_mini(): void;
    prep_hover_scroll(): void;
    prep_advertise_until(): void;
    showInBig(nth: number): void;
    showInMini(nth: number): void;
    findActive(): {
        index: number;
        image: any;
    };
    nextIndexLoop(clockwise?: boolean): number;
    fullScreen(on_off: boolean): void;
    big_onresize: () => void;
}
declare var module: any;
interface GalleryFSOptions {
    id?: string;
    class?: string[];
    hover_scroll?: boolean;
    click_full_screen?: boolean;
    click_change?: boolean;
    hover_zoom?: boolean;
    hover_zoom_level?: number;
    click_borders?: number[];
    advertise_until?: AdvertiseUntil;
    advertise_timeout?: number;
}
declare class GalleryFS {
    options: GalleryFSOptions;
    box_fs_dimmer: HTMLDivElement;
    box_fs: HTMLDivElement;
    box_fs_inner: HTMLDivElement;
    pic1: HTMLImageElement;
    pic2: HTMLImageElement;
    currentIndex: number;
    images: HTMLImageElement[];
    constructor(images: any[], options?: GalleryFSOptions);
    prep_fullScreen(): void;
    on(nth: number): this;
}
