const fs = require("fs");
const jpeg = require("jpeg-js");

const jpegData = fs.readFileSync("./sample.jpg"); // jpg buffer
const rawImageData = jpeg.decode(jpegData); // image data ( width, height, data(buffer) )

// rawImageData 의 0번째 버퍼 b8 === rawImageData.data[0] ( 읽으면 10진수로 바뀜(184) )

const pixels = rawImageData.width * rawImageData.height;

const newImageBuffer = Buffer.alloc(pixels * 4);

for (let i = 0; i < rawImageData.data.length / 4; i++) {
  let idx = 4 * i;
  const r = rawImageData.data[idx];
  const g = rawImageData.data[idx + 1];
  const b = rawImageData.data[idx + 2];
  const a = rawImageData.data[idx + 3];

  // copy
  // newImageBuffer[idx] = r;
  // newImageBuffer[idx + 1] = g;
  // newImageBuffer[idx + 2] = b;
  // newImageBuffer[idx + 3] = 255; // ignore in jpeg

  // invert
  // newImageBuffer[idx] = 255 - r;
  // newImageBuffer[idx + 1] = 255 - g;
  // newImageBuffer[idx + 2] = 255 - b;
  // newImageBuffer[idx + 3] = 255 - a;

  // remove RED(r)
  // newImageBuffer[idx] = 0;
  // newImageBuffer[idx + 1] = 255 - g;
  // newImageBuffer[idx + 2] = 255 - b;
  // newImageBuffer[idx + 3] = 255 - a;

  // warm ( + r )
  // newImageBuffer[idx] = r + 50 > 255 ? 255 : r + 50;
  // newImageBuffer[idx + 1] = g;
  // newImageBuffer[idx + 2] = b;
  // newImageBuffer[idx + 3] = a;

  // warm ( + g )
  // newImageBuffer[idx] = r;
  // newImageBuffer[idx + 1] = g + 50 > 255 ? 255 : g + 50;
  // newImageBuffer[idx + 2] = b;
  // newImageBuffer[idx + 3] = a;

  // to black and white
  const p = (r + g + b) / 3;
  newImageBuffer[idx] = p;
  newImageBuffer[idx + 1] = p;
  newImageBuffer[idx + 2] = p;
  newImageBuffer[idx + 3] = a;
}

const newRawImageData = {
  width: rawImageData.width,
  height: rawImageData.height,
  data: newImageBuffer
};

// 다시 raw image 데이터를 jpeg 데이터로 인코딩
const jpegImageData = jpeg.encode(newRawImageData, 100);

// 인코딩된 데이터(jpg)buffer를 그대로 파일로 씀
fs.writeFile("result.jpg", jpegImageData.data, () => {});
