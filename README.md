# Gallery.js

## Installation

Downalod Gallery.js
```bash
npm install gallery.js
```

Import to a website

```html
    ...
    <script src="node_modules/gallery.js/gallery.js"></script>
    <link rel="stylesheet" href="node_modules/gallery.js/gallery.css">
    ...
</head>
<body>
    ...
    <div class="container">
        <img src="...">
        <img src="...">
        <img src="...">
    </div>
    <script>
        var gallery = new Gallery(document.querySelectorAll(".container>img"));
    </script>
    ...
```