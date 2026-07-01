import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

// Compress an image file to stay under maxSizeMB, resizing if dimension exceeds maxDimension.
// Returns a new File (JPEG) that is safe to upload regardless of PHP's upload_max_filesize.
export function compressImage(file: File, maxSizeMB = 4, maxDimension = 1920): Promise<File> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDimension || height > maxDimension) {
                    if (width >= height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

                const attempt = (quality: number) => {
                    canvas.toBlob((blob) => {
                        if (!blob) { resolve(file); return; }
                        if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.3) {
                            attempt(Math.round((quality - 0.1) * 10) / 10);
                        } else {
                            const name = file.name.replace(/\.[^.]+$/, '.jpg');
                            resolve(new File([blob], name, { type: 'image/jpeg' }));
                        }
                    }, 'image/jpeg', quality);
                };
                attempt(0.85);
            };
            img.src = e.target!.result as string;
        };
        reader.readAsDataURL(file);
    });
}
