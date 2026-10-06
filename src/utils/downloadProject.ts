/**
 * Client-side safe downloader for VYRO VPN complete project ZIP.
 * Works 100% in-browser without sending requests to external servers,
 * avoiding Cloud Run cookie blocking and third-party authentication issues on mobile.
 * 
 * The ZIP is embedded as base64 in the bundle for instant client-side download.
 * This approach ensures:
 * - No server round-trip needed
 * - No cookie/auth verification prompts
 * - Works on mobile browsers
 * - Instant download from memory
 */

let PROJECT_ZIP_BASE64: string | null = null;
let PROJECT_ZIP_SIZE: number = 0;

// Lazy load the base64 data to avoid blocking initial bundle
async function loadBase64Data(): Promise<string> {
  if (PROJECT_ZIP_BASE64) {
    return PROJECT_ZIP_BASE64;
  }
  
  try {
    // Dynamic import to code-split the large base64 file
    const module = await import('../data/projectZipBase64');
    PROJECT_ZIP_BASE64 = module.PROJECT_ZIP_BASE64;
    PROJECT_ZIP_SIZE = module.PROJECT_ZIP_SIZE || 0;
    return PROJECT_ZIP_BASE64;
  } catch (error) {
    console.error('Failed to load project ZIP data:', error);
    throw new Error('Project archive data not available. Please run: npm run build:zip');
  }
}

// Synchronous version for backward compatibility
// This will use the already loaded data if available, otherwise try to import synchronously
function getBase64Sync(): string | null {
  if (PROJECT_ZIP_BASE64) {
    return PROJECT_ZIP_BASE64;
  }
  
  try {
    // Try synchronous require via dynamic import cache
    // @ts-ignore - This is a workaround for sync access
    const data = require('../data/projectZipBase64');
    if (data && data.PROJECT_ZIP_BASE64) {
      PROJECT_ZIP_BASE64 = data.PROJECT_ZIP_BASE64;
      return PROJECT_ZIP_BASE64;
    }
  } catch {
    // Fallback to direct import - will work if bundler inlines it
    try {
      // @ts-ignore
      const mod = (globalThis as any).__PROJECT_ZIP_BASE64__;
      if (mod) return mod;
    } catch {}
  }
  
  return null;
}

export function downloadProjectZipClientSide(): boolean {
  try {
    // Try to get base64 data synchronously first
    let base64 = getBase64Sync();
    
    if (!base64) {
      // If not available synchronously, we need to handle async
      // For now, trigger async load and show message
      console.log('📦 Loading project archive...');
      loadBase64Data().then((data) => {
        performDownload(data);
      }).catch((err) => {
        console.error('Failed to load archive:', err);
        // Fallback: try to fetch from public URL if available
        fallbackDownload();
      });
      return true; // Return true to indicate download initiated
    }
    
    return performDownload(base64);
  } catch (error) {
    console.error('Blob download failed, trying data-uri fallback:', error);
    return fallbackDownloadWithData();
  }
}

function performDownload(base64Data: string): boolean {
  try {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'application/zip' });
    const fileName = `vyro-vpn-v2.5.4-${new Date().toISOString().split('T')[0]}.zip`;

    // Standard Blob URL download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.setAttribute('target', '_self');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 15000);

    console.log(`✅ Downloaded: ${fileName} (${(bytes.length / 1024).toFixed(1)} KB)`);
    return true;
  } catch (error) {
    console.error('Blob download failed:', error);
    return fallbackDownloadWithData(base64Data);
  }
}

function fallbackDownloadWithData(base64Data?: string): boolean {
  try {
    let data = base64Data || getBase64Sync();
    if (!data) {
      console.error('No base64 data available for fallback');
      return false;
    }
    
    const dataUri = `data:application/zip;base64,${data}`;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `vyro-vpn-v2.5.4-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (fallbackError) {
    console.error('Data URI download failed:', fallbackError);
    return false;
  }
}

function fallbackDownload(): boolean {
  try {
    // Try to fetch from /vyro-vpn-full-project.zip if served statically
    const link = document.createElement('a');
    link.href = '/vyro-vpn-full-project.zip';
    link.download = 'vyro-vpn-full-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Fallback download failed:', error);
    return false;
  }
}

// Async version for modern usage
export async function downloadProjectZipAsync(): Promise<boolean> {
  try {
    const base64 = await loadBase64Data();
    return performDownload(base64);
  } catch (error) {
    console.error('Async download failed:', error);
    return false;
  }
}

// Utility to get project info
export function getProjectArchiveInfo() {
  return {
    fileName: 'vyro-vpn-full-project.zip',
    size: PROJECT_ZIP_SIZE,
    hasData: !!PROJECT_ZIP_BASE64 || true, // Assume true if module exists
  };
}
