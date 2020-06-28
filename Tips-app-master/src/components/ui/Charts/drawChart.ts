import { RefObject } from 'react';

export const drawChart = (data:any,
    canvasRef:RefObject<HTMLCanvasElement>,
    styles?:{chartColor:string},
    chartType:string='funcChart',
    width?:number
    ) => {
    const funcChart = (arrayX:any) => {
        arrayX.sort((a:any,b:any) => a.x - b.x); // sort x coords
        if(canvasRef.current) {
            const canvas:HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');
            context?.clearRect(0,0,350, 80)
            if(context) {
                // Max and min y coords
                const sortedY = [...arrayX].sort((a,b) => a.y - b.y);
                let minY = 0;
                let maxY = 0;
                if(sortedY[0].y === sortedY[sortedY.length - 1].y) {
                    minY = sortedY[0].y - (sortedY[0].y / 2)
                    maxY = sortedY[0].y + (sortedY[0].y / 2)
                } else {
                    minY = sortedY[0].y
                    maxY = sortedY[sortedY.length - 1].y
                }

                // unit coords
                const unitCoordX = !width ? 323 / (arrayX[arrayX.length - 1].x - arrayX[0].x) : (width - 10) / (arrayX[arrayX.length - 1].x - arrayX[0].x);
                const unitCoordY = 60 / (maxY - minY);
                // Points
                const coordsX = arrayX.map((item:any) => unitCoordX * (item.x - arrayX[0].x) + 13.5);
                const coordsY = arrayX.map((item:any) => {
                    const value = 60 - unitCoordY * (item.y - minY) + 10;
                    return value < 0 ? -value : value;
                });

                // Styles
                // Gradient
                let gradient=context.createLinearGradient(0,60,246,0);
                gradient.addColorStop(0,"#2E68E4");
                gradient.addColorStop(1.0,"#2EEFC1");

                context.strokeStyle = styles?.chartColor || gradient;
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.lineWidth = 2;

                // Shadow
                // context.shadowOffsetX = 5;
                // context.shadowOffsetY = 5;
                // context.shadowBlur = 5;
                // context.shadowColor = 'rgba(0, 0, 0, 0.3)';

                // Build chart
                context.beginPath();
                context.moveTo(coordsX[0], coordsY[0]);
                coordsX.forEach((c:any, i:number) => {
                    i !== coordsX.length - 1 ? context.lineTo(coordsX[i+1], coordsY[i+1]) : null;
                    context.moveTo(coordsX[i+1], coordsY[i+1])
                });

                context.closePath();
                context.stroke();
            }
        }
    }

    const pieChart = (data:any) => {
        if(canvasRef.current) {
            const canvas:HTMLCanvasElement = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const context = canvas.getContext('2d');
            context?.clearRect(0,0,140, 140)
            if(context && ctx) {
                ctx.strokeStyle = '#F5F5F5';
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 12;
                ctx.beginPath();
                ctx.arc(width && width < 276 ? 85 : 70, width && width < 276 ? 85 : 70, width && width < 276 ? 40 : 52, 0, Math.PI * 2, false);
                ctx.fillStyle = '#0F0F0F';
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${Math.round(data[1]/data[0] * 100)}%`, width && width < 276 ? 85 : 70,  width && width < 276 ? 85 : 70)
                ctx.stroke();
                ctx.closePath();

                const percent = 360 / data[0] * 0.0174533;
                context.strokeStyle = '#81FEC6';
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.lineWidth = 12;
                context.beginPath();
                context.arc(width && width < 276 ? 85 : 70, width && width < 276 ? 85 : 70, width && width < 276 ? 40 : 52, -Math.PI / 2, data[1] * percent - Math.PI / 2, false);
                context.stroke();
                context.closePath();
            }
        }
    }

    chartType === 'funcChart' ? funcChart(data) : pieChart(data);
}