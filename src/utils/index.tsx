type ResizeOptions = {
   maxSize: number;
   outputType?: 'blob' | 'dataUrl';
   mimeType?: string;
   quality?: number;
};

export function resize(imageSrc: string, options: ResizeOptions) {
   const {
      maxSize,
      outputType = 'blob',
      mimeType = 'image/jpeg',
      quality = 0.92,
   } = options;

   const callbacks = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onload: (result: Blob | string) => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onerror: (err: Error) => {},
   };

   const img = new Image();
   img.crossOrigin = 'anonymous';

   img.onload = () => {
      const { width: origW, height: origH } = img;

      const ratio = origW / origH;
      let newW = origW;
      let newH = origH;

      if (origW > origH) {
         if (origW > maxSize) {
            newW = maxSize;
            newH = Math.round(maxSize / ratio);
         }
      } else {
         if (origH > maxSize) {
            newH = maxSize;
            newW = Math.round(maxSize * ratio);
         }
      }

      const canvas = document.createElement('canvas');
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext('2d');
      if (!ctx)
         return callbacks.onerror(new Error('Canvas context unavailable'));

      ctx.drawImage(img, 0, 0, newW, newH);

      if (outputType === 'dataUrl') {
         const dataUrl = canvas.toDataURL(mimeType, quality);
         callbacks.onload(dataUrl);
      } else {
         canvas.toBlob(
            (blob) => {
               if (!blob)
                  return callbacks.onerror(new Error('Failed to create blob'));
               callbacks.onload(blob);
            },
            mimeType,
            quality,
         );
      }
   };

   img.onerror = () => callbacks.onerror(new Error('Failed to load image'));

   img.src = imageSrc;

   return {
      onload(cb: (result: Blob | string) => void) {
         callbacks.onload = cb;
         return this;
      },
      onerror(cb: (err: Error) => void) {
         callbacks.onerror = cb;
         return this;
      },
   };
}
