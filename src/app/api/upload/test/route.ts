import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('=== TEST UPLOAD ENDPOINT HIT ===');

    // Log request headers
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('Request headers:', headers);

    // Get form data
    const formData = await req.formData();
    console.log('Form data received');

    // Log form data entries
    const formDataObj: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        formDataObj[key] = {
          name: value.name,
          type: value.type,
          size: value.size,
          lastModified: value.lastModified,
          isFile: true,
          isBlob: value instanceof Blob,
        };
      } else {
        formDataObj[key] = value;
      }
    }

    console.log('Form data entries:', formDataObj);

    // Check if file exists
    const file = formData.get('file');
    if (!file) {
      console.error('No file found in the request');
      return NextResponse.json(
        {
          success: false,
          error: 'No file uploaded',
          formData: formDataObj,
        },
        { status: 400 },
      );
    }

    // If we got here, the file was received
    return NextResponse.json({
      success: true,
      message: 'File received successfully',
      file: formDataObj.file,
      formData: formDataObj,
    });
  } catch (error) {
    console.error('Error in test upload endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
