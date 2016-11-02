var Gallery = (function () {
    function Gallery(images, options) {
        this.options = {
            id: "",
            class: ["gallery"],
            hover_scroll: true
        };
        console.log(images);
        try {
            Object.assign(this.options, options);
        }
        catch (ex) { }
        ;
        this.images = images;
        this.prep_box();
        this.prep_big();
        this.prep_mini();
        this.toBig(0);
    }
    Gallery.prototype.prep_box = function () {
        var _this = this;
        this.box = document.createElement('div');
        this.box.classList.add('gallery-box');
        this.options.class.forEach(function (cl) {
            _this.box.classList.add(cl);
        });
        this.images[0].parentElement.insertBefore(this.box, this.images[0]);
    };
    Gallery.prototype.prep_big = function () {
        if (!this.box)
            throw "Container is not present (this.box)";
        this.big = document.createElement('div');
        this.big.classList.add('gallery-big');
        this.bigPic = document.createElement('img');
        this.big.appendChild(this.bigPic);
        this.box.appendChild(this.big);
    };
    Gallery.prototype.prep_mini = function () {
        var _this = this;
        if (!this.box)
            throw "Container is not present (this.box)";
        this.mini_cover = document.createElement('div');
        this.mini_cover.classList.add('gallery-mini_cover');
        this.mini = document.createElement('div');
        this.mini_cover.appendChild(this.mini);
        this.mini.classList.add('gallery-mini');
        this.box.appendChild(this.mini_cover);
        this.images.forEach(function (img, index) {
            _this.mini.appendChild(img);
            img.addEventListener('click', function (evt) {
                _this.toBig(index);
            });
        });
        this.prep_hover_scroll();
    };
    Gallery.prototype.prep_hover_scroll = function () {
        var _this = this;
        if (!this.options.hover_scroll)
            return;
        var move = function (evt) {
            var offset_mini_cover = _this.mini_cover.getBoundingClientRect().left;
            var offset_mini = _this.mini.getBoundingClientRect().left;
            var mouseX = evt.clientX || evt.pageX || evt.touches[0].clientX || evt.touches[0].pageX;
            var boxMouseX = mouseX - offset_mini_cover;
            var lastimg = _this.images[_this.images.length - 1];
            var innerBoxWidth = _this.mini.scrollWidth || lastimg.offsetLeft + lastimg.clientWidth - offset_mini;
            var left = (boxMouseX * (innerBoxWidth + 50 - _this.mini_cover.clientWidth) / _this.mini_cover.clientWidth);
            _this.mini_cover.scrollLeft = left;
        };
        this.mini_cover.addEventListener('mousemove', move);
        this.mini_cover.addEventListener('touchmove', move);
    };
    Gallery.prototype.toBig = function (nth) {
        this.bigPic.src = this.images[nth].src;
        this.images.forEach(function (img) { img.classList.remove('active'); });
        this.images[nth].classList.add('active');
    };
    return Gallery;
}());
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gallery;
}
//# sourceMappingURL=gallery.js.map