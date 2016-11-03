if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }
        return res;
    };
}
NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.filter = Array.prototype.filter;
var AdvertiseUntil;
(function (AdvertiseUntil) {
    AdvertiseUntil[AdvertiseUntil["none"] = 0] = "none";
    AdvertiseUntil[AdvertiseUntil["first_hover"] = 1] = "first_hover";
    AdvertiseUntil[AdvertiseUntil["infinite"] = 2] = "infinite";
})(AdvertiseUntil || (AdvertiseUntil = {}));
var Gallery = (function () {
    function Gallery(images, options) {
        var _this = this;
        this.options = {
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
        this.is_full_screen = false;
        this.big_onresize = function () {
            console.log(_this.bigPic.offsetHeight || _this.bigPic2.offsetHeight);
            _this.big.style.height = (_this.bigPic.offsetHeight || _this.bigPic2.offsetHeight) + 'px';
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
        this.prep_advertise_until();
        this.showInBig(0);
        this.big_onresize();
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
        var _this = this;
        if (!this.box)
            throw "Container is not present (this.box)";
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
            var onclick_1 = function (evt) {
                var width = _this.big.clientWidth;
                var offsetLeft = _this.big.getBoundingClientRect().left;
                var mouseX = evt.clientX || evt.pageX || evt.touches[0].clientX || evt.touches[0].pageX;
                var inMouseX = evt.offsetX || mouseX - offsetLeft;
                var pos = Math.floor(inMouseX / width * 100);
                var currImg = _this.findActive();
                if (_this.options.click_change && pos < _this.options.click_borders[0]) {
                    currImg.index > 0 && _this.showInBig(currImg.index - 1) && _this.showInMini(currImg.index - 1);
                }
                else if (_this.options.click_change && pos > _this.options.click_borders[1]) {
                    currImg.index < _this.images.length - 1 && _this.showInBig(currImg.index + 1) && _this.showInMini(currImg.index - 1);
                }
                else if (_this.options.click_full_screen) {
                    _this.fullScreen(!_this.is_full_screen);
                }
            };
            this.big.addEventListener('click', onclick_1);
        }
        if (this.options.hover_zoom) {
            var onmousemove_1 = function (evt) {
                console.log(evt);
                var inMouseX = evt.offsetX;
                var inMouseY = evt.offsetX;
                var x = inMouseX / _this.big.clientWidth;
                var y = inMouseY / _this.big.clientHeight;
                _this.big.style.width = _this.big.clientWidth + 'px';
                _this.big.style.height = _this.big.clientHeight + 'px';
                _this.bigPic.style.width = _this.big.clientWidth * _this.options.hover_zoom_level + 'px';
                var top = (inMouseY * (_this.big.clientHeight - _this.bigPic.clientHeight) / _this.bigPic.clientHeight);
                var left = (inMouseX * (_this.big.clientWidth - _this.bigPic.clientWidth) / _this.bigPic.clientWidth);
                _this.bigPic.style.marginTop = top + 'px';
                _this.bigPic.style.marginLeft = left + 'px';
            };
            var onmouseleave_1 = function (evt) {
                _this.bigPic.style.marginTop = '0';
                _this.bigPic.style.marginLeft = '0';
                _this.bigPic.style.width = '100%';
            };
            this.big.addEventListener('mousemove', onmousemove_1);
            this.big.addEventListener('mouseleave', onmouseleave_1);
        }
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
                _this.showInBig(index);
            });
        });
        this.prep_hover_scroll();
    };
    Gallery.prototype.prep_hover_scroll = function () {
        var _this = this;
        if (!this.options.hover_scroll)
            return;
        var onmove = function (evt) {
            var offset_mini_cover = _this.mini_cover.getBoundingClientRect().left;
            var offset_mini = _this.mini.getBoundingClientRect().left;
            var mouseX = evt.clientX || evt.pageX || evt.touches[0].clientX || evt.touches[0].pageX;
            var boxMouseX = mouseX - offset_mini_cover;
            var lastimg = _this.images[_this.images.length - 1];
            var innerBoxWidth = _this.mini.scrollWidth || lastimg.offsetLeft + lastimg.clientWidth - offset_mini;
            var left = (boxMouseX * (innerBoxWidth + 50 - _this.mini_cover.clientWidth) / _this.mini_cover.clientWidth);
            _this.mini_cover.scrollLeft = left;
        };
        this.mini_cover.addEventListener('mousemove', onmove);
        this.mini_cover.addEventListener('touchmove', onmove);
    };
    Gallery.prototype.prep_advertise_until = function () {
        var _this = this;
        if (!this.options.advertise_until)
            return;
        if (this.options.advertise_until === AdvertiseUntil.first_hover) {
            var interval_1 = window.setInterval(function () {
                _this.showInBig(_this.nextIndexLoop());
            }, this.options.advertise_timeout);
            var stopInterval = function (evt) {
                window.clearInterval(interval_1);
                interval_1 = undefined;
                // evt.stopPropagation();
            };
            this.box.addEventListener('click', stopInterval);
        }
    };
    Gallery.prototype.showInBig = function (nth) {
        if (this.bigPic.classList.contains('transparent')) {
            this.bigPic.src = this.images[nth].src;
            this.bigPic.classList.remove('transparent');
            this.bigPic2.classList.add('transparent');
        }
        else if (this.bigPic2.classList.contains('transparent')) {
            this.bigPic2.src = this.images[nth].src;
            this.bigPic.classList.add('transparent');
            this.bigPic2.classList.remove('transparent');
        }
        else {
            this.bigPic.src = this.images[nth].src;
            this.bigPic2.src = this.images[nth].src;
            this.bigPic.classList.remove('transparent');
            this.bigPic2.classList.add('transparent');
        }
        this.images.forEach(function (img) { img.classList.remove('active'); });
        this.images[nth].classList.add('active');
        this.big_onresize();
    };
    Gallery.prototype.showInMini = function (nth) {
    };
    Gallery.prototype.findActive = function () {
        var index;
        var image = this.images.filter(function (img, i) { return img.classList.contains('active') && (index = i); });
        return {
            index: index,
            image: Array.isArray(image) && image.length > 0 ? image[0] : undefined
        };
    };
    Gallery.prototype.nextIndexLoop = function (clockwise) {
        var curr = this.findActive();
        var ni = (clockwise === undefined || clockwise === true) ? curr.index + 1 : curr.index - 1;
        if (ni >= this.images.length) {
            ni = 0;
        }
        if (ni < 0) {
            ni = this.images.length - 1;
        }
        return ni;
    };
    Gallery.prototype.fullScreen = function (on_off) {
        if (on_off && !this.is_full_screen) {
        }
        else {
        }
    };
    return Gallery;
}());
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gallery;
}
//# sourceMappingURL=gallery.js.map