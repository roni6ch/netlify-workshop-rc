import React, { useRef, useEffect } from 'react';

function SineWaveAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const unit = 50;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const height = canvas.height;
    const width = canvas.width;
    const xAxis = Math.floor(height / 2);
    const yAxis = Math.floor(width / 4);

    const img = new Image();
    img.src = 'https://i.imgur.com/LsYmdkL.png';

    const draw = {
      seconds: 0,
      t: 0,
    };

    img.onload = () => {
      drawAnimation();
    };

    function drawSine(t: number, unitval: number, offset: number, direction: number) {
      if (!context) return;
      context.beginPath();
      for (let i = yAxis; i <= width; i += 10) {
        const x = t + (-yAxis + i) / unitval;
        const y = Math.sin(x) * direction;
        context.lineTo(i + offset, (unitval / 3) * y + xAxis);
      }
      context.stroke();
    }

    function drawPlane(t: number, unitVal: number, offset: number, direction: number) {
      const y = xAxis + (unitVal / 3) * Math.sin(t) * direction;
      if (context) {
        context.drawImage(img, yAxis - 29 + offset, y - 16);
      }
    }

    function drawAnimation() {
      if (context) {
        context.clearRect(0, 0, width, height);
      }

      // BLUE gradient
      if (!context) return;

      let grd = context.createLinearGradient(0, 0, 800, 0);
      grd.addColorStop(0, 'rgba(189, 106, 155, 1)');
      grd.addColorStop(1, 'rgba(189, 106, 155, 0)');
      context.strokeStyle = grd;
      context.lineWidth = 2;
      drawSine(draw.t, unit, 0, 1);
      drawPlane(draw.t, unit, 0, 1);

      // GREEN gradient
      grd = context.createLinearGradient(0, 0, 800, 0);
      grd.addColorStop(0, 'rgba(151, 204, 18, 1)');
      grd.addColorStop(1, 'rgba(151, 204, 18, 0)');
      context.strokeStyle = grd;
      drawSine(draw.t, unit * 2, 50, -1);
      drawPlane(draw.t, unit * 2, 50, -1);

      // YELLOW gradient
      grd = context.createLinearGradient(0, 0, 800, 0);
      grd.addColorStop(0, 'rgba(245, 223, 22, 1)');
      grd.addColorStop(1, 'rgba(245, 223, 22, 0)');
      context.strokeStyle = grd;
      drawSine(draw.t, unit * 2, 100, 1);
      drawPlane(draw.t, unit * 2, 100, 1);

      // RED gradient
      grd = context.createLinearGradient(0, 0, 800, 0);
      grd.addColorStop(0, 'rgba(204, 63, 24, 1)');
      grd.addColorStop(1, 'rgba(204, 63, 24, 0)');
      context.strokeStyle = grd;
      drawSine(draw.t, unit / 150, 150, -1);
      drawPlane(draw.t, unit / 150, 150, -1);

      draw.seconds -= 0.007;
      draw.t = draw.seconds * Math.PI;

      animationFrameId = requestAnimationFrame(drawAnimation);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} width={343} height={200} />;
}

export default SineWaveAnimation;