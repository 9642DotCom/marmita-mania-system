
import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCode = ({ value, size = 200, className = '' }: QRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch((error) => {
        console.error('Erro ao gerar QR Code:', error);
      });
    }
  }, [value, size]);

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas ref={canvasRef} className="border rounded-lg" />
    </div>
  );
};

export default QRCode;
