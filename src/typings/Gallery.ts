interface Options {
    id?: string,
    class?: string[],
    hover_scroll: boolean
}
class Gallery {

    public options: Options = {
        id: "",
        class: ["gallery"],
        hover_scroll: true
    };

    public box: HTMLDivElement;
    public big: HTMLDivElement;
    public bigPic: HTMLImageElement;
    public mini_cover: HTMLDivElement;
    public mini: HTMLDivElement;

    public images: HTMLImageElement[];

    constructor(images: HTMLImageElement[], options: Options) {
        console.log(images);
        try{
            (<any>Object).assign(this.options, options);
        }catch(ex){};
        this.images = images;
        this.prep_box();
        this.prep_big();
        this.prep_mini();
        this.toBig(0);
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
        this.big.appendChild(this.bigPic);
        this.box.appendChild(this.big);
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
                this.toBig(index);
            });
        });
        this.prep_hover_scroll();
    }
    prep_hover_scroll() {
        if (!this.options.hover_scroll) return;
        let move = (evt) => {
            let offset_mini_cover = this.mini_cover.getBoundingClientRect().left;
            let offset_mini = this.mini.getBoundingClientRect().left;
            let mouseX = evt.clientX || evt.pageX || evt.touches[0].clientX || evt.touches[0].pageX;
            let boxMouseX = mouseX - offset_mini_cover;
            let lastimg = this.images[this.images.length - 1];
            let innerBoxWidth = this.mini.scrollWidth || lastimg.offsetLeft + lastimg.clientWidth - offset_mini;
            var left = (boxMouseX * (innerBoxWidth + 50 - this.mini_cover.clientWidth) / this.mini_cover.clientWidth)
            this.mini_cover.scrollLeft = left;
        };
        this.mini_cover.addEventListener('mousemove',move);
        this.mini_cover.addEventListener('touchmove',move);
    }

    toBig(nth: number) {
        this.bigPic.src = this.images[nth].src;
        this.images.forEach(img => { img.classList.remove('active'); })
        this.images[nth].classList.add('active');
    }
}

declare var module;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gallery;
}