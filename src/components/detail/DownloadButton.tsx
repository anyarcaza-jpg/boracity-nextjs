// src/components/detail/DownloadButton.tsx
'use client';

import { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  fileName: string;
  fileSize: string;
  downloadUrl: string;
  className?: string;
  onDownload?: () => void;
}

export function DownloadButton({
  fileName,
  fileSize,
  downloadUrl,
  className,
  onDownload,
}: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'success'>('idle');

  const handleDownload = async () => {
    setStatus('downloading');
    
    try {
      if (onDownload) {
        onDownload();
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Download error:', error);
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status === 'downloading'}
      className={cn(
        'group relative w-full overflow-hidden rounded-full font-semibold transition-all duration-300 py-4 text-base shadow-lg',
        'focus:outline-none focus:ring-4 focus:ring-primary/20',
        status === 'idle' && 'bg-gradient-to-r from-primary to-orange-500 text-white hover:from-primary-dark hover:to-orange-600 hover:scale-[1.02] hover:shadow-xl active:scale-95',
        status === 'downloading' && 'bg-primary/80 text-white cursor-not-allowed',
        status === 'success' && 'bg-green-500 text-white',
        className
      )}
    >
      <div className="relative flex items-center justify-center gap-2">
        {status === 'idle' && (
          <>
            <Download className="w-5 h-5" />
            <span>Download Family</span>
            <span className="text-sm opacity-80">· {fileSize}</span>
          </>
        )}

        {status === 'downloading' && (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Downloading...</span>
          </>
        )}

        {status === 'success' && (
          <>
            <Check className="w-5 h-5" />
            <span>Downloaded!</span>
          </>
        )}
      </div>
    </button>
  );
}