interface GalleryFSOptions {
    id?: string,
    class?: string[],
    hover_scroll?: boolean,
    click_full_screen?: boolean,
    click_change?: boolean,
    hover_zoom?: boolean,
    hover_zoom_level?: number,
    click_borders?: number[],
    advertise_until?: AdvertiseUntil,
    advertise_timeout?: number
}
class GalleryFS {

    public options: GalleryFSOptions = {

    }

    public box_fs_dimmer: HTMLDivElement;
    public box_fs: HTMLDivElement;
    public box_fs_inner: HTMLDivElement;
    public pic1: HTMLImageElement;
    public pic2: HTMLImageElement;

    public currentIndex: number;

    public images: HTMLImageElement[] = [];

    constructor(images: any[], options?: GalleryFSOptions) {
        try {
            (<any>Object).assign(this.options, options);
        } catch (ex) { };
        images.forEach((elem) => {
            let img = document.createElement('img');
            img.src = elem.src;
            this.images.push(img);
        });
    }

    prep_fullScreen() {
        if (!this.box_fs_dimmer) {
            this.box_fs_dimmer = document.createElement('div');
            this.box_fs_dimmer.classList.add('gallery-box-fullscreen-dimmer');
            document.body.appendChild(this.box_fs_dimmer);
        }
        if (!this.box_fs) {
            this.box_fs = document.createElement('div');
            this.box_fs.classList.add('gallery-box-fullscreen');
            this.box_fs_inner = document.createElement('div');
            document.body.appendChild(this.box_fs);
            this.box_fs.appendChild(this.box_fs_inner);
        }
        if (!this.pic1) {
            this.pic1 = document.createElement('img');
            this.box_fs_inner.appendChild(this.pic1);
        }
        if (!this.pic2) {
            this.pic2 = document.createElement('img');
            this.box_fs_inner.appendChild(this.pic2);
        }
        // this.images.forEach((img)=>{
        //     this.box_fs.appendChild(img);
        // })
    }
    on(nth: number) {
        this.prep_fullScreen();
        if (this.pic1.classList.contains('transparent')) {
            this.pic1.src = this.images[nth].src;
            this.pic1.classList.remove('transparent');
            this.pic2.classList.add('transparent');
        } else if (this.pic2.classList.contains('transparent')) {
            this.pic2.src = this.images[nth].src;
            this.pic1.classList.add('transparent');
            this.pic2.classList.remove('transparent');
        } else {
            this.pic1.src = this.images[nth].src;
            this.pic2.src = this.images[nth].src;
            this.pic1.classList.remove('transparent');
            this.pic2.classList.add('transparent');
        }
        return this;
    }
}