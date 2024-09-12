self.onmessage = async function (event) {
    const arraybuffer = event.data;
    const file = new Blob([arraybuffer])

    const image = await createImageBitmap(file)
    const width = image.width;
    const height = image.height;

    const thumbnailWidth = 400;
    const thumbnailHeight = (thumbnailWidth / width) * height;
    const thumbnailCanvas = new OffscreenCanvas(thumbnailWidth, thumbnailHeight);
    thumbnailCanvas.getContext('2d').drawImage(image, 0, 0, thumbnailWidth, thumbnailHeight);

    const thumbnail = await thumbnailCanvas.convertToBlob({type: 'image/png'});
    const thumbnailArrayBuffer = await thumbnail.arrayBuffer();

    postMessage({width: width, height: height, thumbnail: thumbnailArrayBuffer}, [thumbnailArrayBuffer]);
};
