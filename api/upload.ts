import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read the raw body as a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const body = Buffer.concat(chunks);

    // Parse multipart form data manually (simple single-file parser)
    const contentType = req.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'Missing boundary in multipart data' });
    }

    const boundary = boundaryMatch[1];
    const parts = body.toString('binary').split('--' + boundary);
    
    let fileBuffer: Buffer | null = null;
    let fileName = 'upload.jpg';
    let fileContentType = 'image/jpeg';

    for (const part of parts) {
      if (part.includes('Content-Disposition') && part.includes('filename=')) {
        // Extract filename
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) fileName = filenameMatch[1];

        // Extract content type
        const ctMatch = part.match(/Content-Type:\s*(.+)\r?\n/);
        if (ctMatch) fileContentType = ctMatch[1].trim();

        // Extract file data (after double newline)
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd !== -1) {
          const dataStart = headerEnd + 4;
          const dataEnd = part.lastIndexOf('\r\n');
          const binaryData = part.substring(dataStart, dataEnd > dataStart ? dataEnd : undefined);
          fileBuffer = Buffer.from(binaryData, 'binary');
        }
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No file found in request' });
    }

    // Limit: 4.5MB (Vercel serverless body limit)
    if (fileBuffer.length > 4.5 * 1024 * 1024) {
      return res.status(413).json({ error: 'File too large. Maximum size is 4.5MB.' });
    }

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobPath = `hostkeys/properties/${timestamp}-${safeName}`;

    const blob = await put(blobPath, fileBuffer, {
      access: 'public',
      contentType: fileContentType,
    });

    return res.status(200).json({ 
      url: blob.url, 
      size: fileBuffer.length,
      success: true 
    });
  } catch (err: any) {
    console.error('Upload API error:', err);
    return res.status(500).json({ error: err?.message || 'Upload failed' });
  }
}
