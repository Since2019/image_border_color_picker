import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ImageWithEdgeColor = ({ src, alt }) => {
  const canvasRef = useRef(null);
  const [bgColor, setBgColor] = useState('transparent');

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      // 提取边缘颜色
      const edgeColor = getEdgeColor(context, img.width, img.height);
      setBgColor(edgeColor);
    };
  }, [src]);

  const getEdgeColor = (ctx, width, height) => {
    // 提取四个角的颜色
    const corners = [
      ctx.getImageData(0, 0, 1, 1).data, // 左上角
      ctx.getImageData(width - 1, 0, 1, 1).data, // 右上角
      ctx.getImageData(0, height - 1, 1, 1).data, // 左下角
      ctx.getImageData(width - 1, height - 1, 1, 1).data // 右下角
    ];

    // 计算平均颜色（可以根据需求选择其他方法）
    const avgColor = corners.reduce((acc, color) => {
      return [
        acc[0] + color[0],
        acc[1] + color[1],
        acc[2] + color[2],
      ];
    }, [0, 0, 0]).map(value => Math.round(value / corners.length));

    return `rgb(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]})`;
  };

  return (
    <div style={{ backgroundColor: bgColor, position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </div>
  );
};

export default ImageWithEdgeColor;
