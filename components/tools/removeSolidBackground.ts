function toPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG transparan gagal dibuat."));
    }, "image/png");
  });
}

export function removeSolidPixels(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  backgroundOverride?: [number, number, number],
): boolean {
  const samples: [number, number, number][] = [];
  const bins = new Map<number, { count: number; red: number; green: number; blue: number }>();
  const step = Math.max(1, Math.floor((width + height) / 1024));

  function sample(x: number, y: number) {
    const index = (y * width + x) * 4;
    if (data[index + 3] < 240) return;
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    samples.push([red, green, blue]);
    const key = (red >> 4) * 256 + (green >> 4) * 16 + (blue >> 4);
    const bin = bins.get(key) ?? { count: 0, red: 0, green: 0, blue: 0 };
    bin.count++;
    bin.red += red;
    bin.green += green;
    bin.blue += blue;
    bins.set(key, bin);
  }

  for (let x = 0; x < width; x += step) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 0; y < height; y += step) {
    sample(0, y);
    sample(width - 1, y);
  }

  const dominant = [...bins.values()].sort((a, b) => b.count - a.count)[0];
  let background: number[];
  if (backgroundOverride) {
    background = backgroundOverride;
  } else {
    if (!dominant || samples.length < 4) return false;
    background = [
      Math.round(dominant.red / dominant.count),
      Math.round(dominant.green / dominant.count),
      Math.round(dominant.blue / dominant.count),
    ];
  }
  const distance = (index: number) => Math.max(
    Math.abs(data[index] - background[0]),
    Math.abs(data[index + 1] - background[1]),
    Math.abs(data[index + 2] - background[2]),
  );
  const matchingBorder = samples.filter(([red, green, blue]) => Math.max(
    Math.abs(red - background[0]),
    Math.abs(green - background[1]),
    Math.abs(blue - background[2]),
  ) <= 24).length;
  if (!backgroundOverride && matchingBorder / samples.length < 0.8) return false;

  const alpha = new Uint8Array(width * height);
  let transparentPixels = 0;
  for (let pixel = 0; pixel < alpha.length; pixel++) {
    const index = pixel * 4;
    const difference = distance(index);
    const colorAlpha = difference <= 32 ? 0 : difference >= 96 ? 255 : Math.round((difference - 32) * 255 / 64);
    alpha[pixel] = Math.min(data[index + 3], colorAlpha);
    if (alpha[pixel] === 0) transparentPixels++;
  }
  if (transparentPixels / alpha.length < 0.01) return false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = y * width + x;
      const index = pixel * 4;
      const pixelAlpha = alpha[pixel];
      data[index + 3] = pixelAlpha;
      if (pixelAlpha === 0) {
        data[index] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
      } else if (pixelAlpha < 255) {
        let closest = -1;
        let closestDistance = Infinity;
        for (let dy = -3; dy <= 3; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) continue;
          for (let dx = -3; dx <= 3; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= width || alpha[ny * width + nx] < 250) continue;
            const squaredDistance = dx * dx + dy * dy;
            if (squaredDistance < closestDistance) {
              closest = (ny * width + nx) * 4;
              closestDistance = squaredDistance;
            }
          }
        }
        if (closest >= 0) {
          data[index] = data[closest];
          data[index + 1] = data[closest + 1];
          data[index + 2] = data[closest + 2];
        }
      }
    }
  }

  return true;
}

export async function removeSolidBackground(file: File, backgroundOverride?: [number, number, number]): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Canvas tidak tersedia di browser ini.");
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  if (!removeSolidPixels(image.data, canvas.width, canvas.height, backgroundOverride)) return null;
  context.putImageData(image, 0, 0);
  return toPng(canvas);
}
