import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('=== TEST UPLOAD ENDPOINT HIT ===');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    console.log(
      'Received file:',
      file
        ? {
            name: file.name,
            type: file.type,
            size: file.size,
          }
        : 'No file received',
    );

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Just return some basic info about the file
    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: 'File received successfully',
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
