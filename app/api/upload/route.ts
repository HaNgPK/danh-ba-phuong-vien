import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const imgbbKey = process.env.IMGBB_API_KEY;

    if (!imgbbKey || imgbbKey === "" || imgbbKey === "Điền-API-Key-Của-Bạn-Vào-Đây") {
      console.warn("IMGBB_API_KEY is missing or invalid in .env file.");
      return NextResponse.json({ success: false, error: 'ImgBB API key is not configured.' }, { status: 500 });
    }

    // Prepare FormData for ImgBB by converting the File to a Base64 string.
    // This is much safer for Node.js fetch which can sometimes fail to serialize raw File streams to external APIs.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const formData = new FormData();
    formData.append('key', imgbbKey);
    formData.append('name', file.name || 'image');
    formData.append('image', base64Image);

    // Call ImgBB API
    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error?.message || 'ImgBB API connection error');
    }

    const imgbbData = await res.json();

    if (imgbbData.success) {
      // Return the direct display URL from ImgBB
      return NextResponse.json({ success: true, url: imgbbData.data.url });
    } else {
      throw new Error('ImgBB returned success: false');
    }

  } catch (error: any) {
    console.error('Error uploading file to ImgBB:', error);
    return NextResponse.json({ success: false, error: 'Upload failed', details: error?.message }, { status: 500 });
  }
}
