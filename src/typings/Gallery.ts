enum AdvertiseUntil {
    none = 0,
    first_hover,
    infinite
}
interface GalleryOptions {
    id?: string,
    class?: string[],
    hover_scroll: boolean,
    click_full_screen: boolean,
    click_change: boolean,
    hover_zoom: boolean,
    hover_zoom_level: number,
    click_borders: number[],
    advertise_until: AdvertiseUntil,
    advertise_timeout: number
}
class Gallery {

    public options: GalleryOptions = {
        id: "",
        class: ["gallery"],
        hover_scroll: true,
        click_full_screen: true,
        click_change: true,
        hover_zoom: false,
        hover_zoom_level: 2,
        click_borders: [30, 70],
        advertise_until: AdvertiseUntil.first_hover,
        advertise_timeout: 2000
    };

    public box: HTMLDivElement;
    public big: HTMLDivElement;
    public bigPic: HTMLImageElement;
    public bigPic2: HTMLImageElement;
    public mini_cover: HTMLDivElement;
    public mini: HTMLDivElement;
    public gfs: GalleryFS;

    public images: any[];

    public is_full_screen: boolean = false;

    constructor(images: any[], options: GalleryOptions) {
        // console.log(images);
        try {
            (<any>Object).assign(this.options, options);
        } catch (ex) { };
        this.images = images;
        this.prep_box();
        this.prep_big();
        this.prep_mini();
        this.prep_advertise_until();
        this.showInBig(0);
        this.big_onresize();
    }

    prep_box() {
        this.box = document.createElement('div');
        this.box.classList.add('gallery-box');
        this.options.class.forEach((cl) => {
            this.box.classList.add(cl);
        });
        this.images[0].parentElement.insertBefore(this.box, this.images[0]);
    }
    prep_big() {
        if (!this.box) throw "Container is not present (this.box)";
        this.big = document.createElement('div');
        this.big.classList.add('gallery-big');
        this.bigPic = document.createElement('img');
        this.bigPic2 = document.createElement('img');
        this.big.appendChild(this.bigPic);
        this.big.appendChild(this.bigPic2);
        this.box.appendChild(this.big);

        this.big_onresize();
        window.addEventListener('resize', this.big_onresize);
        this.bigPic.addEventListener('load', this.big_onresize);

        if (this.options.click_change || this.options.click_full_screen) {
            let onclick = (evt) => {
                let width = this.big.clientWidth;
                let offsetLeft = this.big.getBoundingClientRect().left;
                let mouseX = evt.clientX || evt.pageX || evt.touches[0].clientX || evt.touches[0].pageX;
                let inMouseX = evt.offsetX || mouseX - offsetLeft;
                let pos = Math.floor(inMouseX / width * 100);
                let currImg = this.findActive();
                if (this.options.click_change && pos < this.options.click_borders[0]) {
                    currImg.index > 0 && this.showInBig(currImg.index - 1) && this.showInMini(currImg.index - 1);
                } else if (this.options.click_change && pos > this.options.click_borders[1]) {
                    currImg.index < this.images.length - 1 && this.showInBig(currImg.index + 1) && this.showInMini(currImg.index - 1);
                } else if (this.options.click_full_screen) {
                    this.fullScreen(!this.is_full_screen);
                }
            }
            this.big.addEventListener('click', onclick);
        }
        if (this.options.hover_zoom) {
            let onmousemove = (evt) => {
                // console.log(evt);
                let inMouseX = evt.offsetX;
                let inMouseY = evt.offsetX;
                let x = inMouseX / this.big.clientWidth;
                let y = inMouseY / this.big.clientHeight;
                this.big.style.width = this.big.clientWidth + 'px';
                this.big.style.height = this.big.clientHeight + 'px';
                this.bigPic.style.width = this.big.clientWidth * this.options.hover_zoom_level + 'px';
                var top = (inMouseY * (this.big.clientHeight - this.bigPic.clientHeight) / this.bigPic.clientHeight)
                var left = (inMouseX * (this.big.clientWidth - this.bigPic.clientWidth) / this.bigPic.clientWidth)
                this.bigPic.style.marginTop = top + 'px';
                this.bigPic.style.marginLeft = left + 'px';
            }
            let onmouseleave = (evt) => {
                this.bigPic.style.marginTop = '0';
                this.bigPic.style.marginLeft = '0';
                this.bigPic.style.width = '100%';
            }
            this.big.addEventListener('mousemove', onmousemove);
            this.big.addEventListener('mouseleave', onmouseleave);
        }
    }
    prep_mini() {
        if (!this.box) throw "Container is not present (this.box)";
        this.mini_cover = document.createElement('div');
        this.mini_cover.classList.add('gallery-mini_cover');
        this.mini = document.createElement('div');
        this.mini_cover.appendChild(this.mini);
        this.mini.classList.add('gallery-mini')
        this.box.appendChild(this.mini_cover);
        this.images.forEach((img, index) => {
            this.mini.appendChild(img);
            img.addEventListener('click', (evt) => {
                this.showInBig(index);
            });
        });
        this.prep_hover_scroll();
    }
    prep_hover_scroll() {
        if (!this.options.hover_scroll) return;
        let onmove = (evt) => {
            let offset_mini_cover = this.mini_cover.getBoundingClientRect().left;
            let offset_mini = this.mini.getBoundingClientRect().left;
            let mouseX = evt.clientX || evt.pageX || evt.touches[0].clientX || evt.touches[0].pageX;
            let boxMouseX = mouseX - offset_mini_cover;
            let lastimg = this.images[this.images.length - 1];
            let innerBoxWidth = this.mini.scrollWidth || lastimg.offsetLeft + lastimg.clientWidth - offset_mini;
            var left = (boxMouseX * (innerBoxWidth + 50 - this.mini_cover.clientWidth) / this.mini_cover.clientWidth)
            this.mini_cover.scrollLeft = left;
        };
        this.mini_cover.addEventListener('mousemove', onmove);
        this.mini_cover.addEventListener('touchmove', onmove);
    }
    prep_advertise_until() {
        if (!this.options.advertise_until) return;

        if (this.options.advertise_until === AdvertiseUntil.first_hover) {
            let interval = window.setInterval(() => {
                this.showInBig(this.nextIndexLoop());
            }, this.options.advertise_timeout)
            let stopInterval = (evt) => {
                window.clearInterval(interval);
                interval = undefined;
                // evt.stopPropagation();
            }
            this.box.addEventListener('click', stopInterval);
        }
    }

    showInBig(nth: number) {
        if (this.bigPic.classList.contains('transparent')) {
            this.bigPic.src = this.images[nth].src;
            this.bigPic.classList.remove('transparent');
            this.bigPic2.classList.add('transparent');
        } else if (this.bigPic2.classList.contains('transparent')) {
            this.bigPic2.src = this.images[nth].src;
            this.bigPic.classList.add('transparent');
            this.bigPic2.classList.remove('transparent');
        } else {
            this.bigPic.src = this.images[nth].src;
            this.bigPic2.src = this.images[nth].src;
            this.bigPic.classList.remove('transparent');
            this.bigPic2.classList.add('transparent');
        }
        this.images.forEach(img => { img.classList.remove('active'); })
        this.images[nth].classList.add('active');
        this.big_onresize();
    }
    showInMini(nth: number) {

    }
    findActive() {
        let index: number;
        let image = this.images.filter((img, i) => { return img.classList.contains('active') && (index = i); });
        return {
            index,
            image: Array.isArray(image) && image.length > 0 ? image[0] : undefined
        }
    }
    nextIndexLoop(clockwise?: boolean): number {
        let curr = this.findActive();
        let ni = (clockwise === undefined || clockwise === true) ? curr.index + 1 : curr.index - 1;
        if (ni >= this.images.length) {
            ni = 0;
        }
        if (ni < 0) {
            ni = this.images.length - 1;
        }
        return ni;
    }
    fullScreen(on_off: boolean) {
        if (on_off && !this.is_full_screen) {
            this.gfs = new GalleryFS(this.images).on(this.findActive().index);
        } else {

        }
    }
    big_onresize = () => {
        // console.log(this.bigPic.offsetHeight || this.bigPic2.offsetHeight);
        this.big.style.height = (this.bigPic.offsetHeight || this.bigPic2.offsetHeight) + 'px';
    };
}

declare var module;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gallery;
}