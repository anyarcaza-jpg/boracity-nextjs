// Cliente para ImageKit
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadToImageKit(file: File, folder: string = 'families'): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const result = await imagekit.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
      folder: folder,
    });

    return result.url;
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error('Failed to upload image to ImageKit');
  }
}

export { imagekit };