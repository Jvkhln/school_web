/**
 * Google Drive API Integration
 * Handles uploading images and attachments to Google Drive using drive.file scope
 */

export async function uploadDataUrlToDrive(
  accessToken: string,
  dataUrl: string,
  fileName = 'school_upload.jpg'
): Promise<string | null> {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl || null;
  }

  try {
    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1) return null;

    const header = dataUrl.slice(0, commaIdx);
    const base64Data = dataUrl.slice(commaIdx + 1);

    const mimeMatch = header.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const boundary = '-------GoogleDriveUploadBoundary' + Math.random().toString(36).substring(2);
    const metadata = {
      name: fileName,
      mimeType,
      description: 'Uploaded by Erdmiin Dalai School App'
    };

    // Convert base64 to binary bytes
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const mediaBlob = new Blob([bytes], { type: mimeType });
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json; charset=UTF-8' });

    const multipartBlob = new Blob(
      [
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`,
        metadataBlob,
        `\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
        mediaBlob,
        `\r\n--${boundary}--`
      ],
      { type: `multipart/related; boundary=${boundary}` }
    );

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: multipartBlob
      }
    );

    if (!uploadRes.ok) {
      console.warn('Google Drive file upload returned status:', uploadRes.status);
      return null;
    }

    const fileData = await uploadRes.json();
    const fileId = fileData.id;

    if (!fileId) return null;

    // Set permission to anyone with link can view (reader)
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });
    } catch (permErr) {
      console.warn('Google Drive permission setting warning:', permErr);
    }

    // Direct embeddable direct link
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } catch (err) {
    console.warn('Failed to upload image to Google Drive:', err);
    return null;
  }
}

/**
 * Extracts Google Drive file ID from various Drive URL formats or returns bare ID
 * Supported:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - Bare Google Drive File IDs (25-50 characters)
 */
export function extractGoogleDriveFileId(url: string | undefined | null): string | null {
  if (!url) return null;
  const clean = String(url).trim();

  // Pattern: drive.google.com/file/d/{id}
  const matchFileD = clean.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern: [?&]id={id}
  const matchId = clean.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (matchId && matchId[1]) return matchId[1];

  // Pattern: /d/{id}
  const matchD = clean.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  if (matchD && matchD[1]) return matchD[1];

  // Pattern: googleusercontent.com/d/{id}
  const matchGuc = clean.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/);
  if (matchGuc && matchGuc[1]) return matchGuc[1];

  // Bare Drive ID
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(clean)) {
    return clean;
  }

  return null;
}

/**
 * Checks whether an image URL originates from Google Drive
 */
export function isGoogleDriveUrl(url: string | undefined | null): boolean {
  return Boolean(extractGoogleDriveFileId(url));
}

/**
 * Converts any Google Drive share/view URL or file ID into a direct, embeddable image URL.
 * Falls back to original URL if not a Google Drive link.
 */
export function formatGoogleDriveImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return String(url);
}

/**
 * Returns a high-res Google Drive thumbnail URL for fallback or preview
 */
export function getGoogleDriveThumbnailUrl(url: string | undefined | null, size = 1200): string {
  if (!url) return '';
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  }
  return String(url);
}

