import path from "path"
import { createCanvas, loadImage, registerFont } from 'canvas'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

registerFont(path.resolve(__dirname, '../assets/fonts/Roboto-Regular.ttf'), { family: 'Roboto', weight: 'normal' });
registerFont(path.resolve(__dirname, '../assets/fonts/Roboto-Bold.ttf'), { family: 'Roboto', weight: 'bold' });

function roundRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	ctx.fill();
}

async function getCanva(userDB)
{
	const	canvas = createCanvas(800, 120);
	const	ctx = canvas.getContext('2d');
	const bgPath = path.resolve('src/assets/img/level.png');
	const	bg = await loadImage(bgPath);

	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

	// LEVEL AND XP
	ctx.font = 'bold 32px "Roboto"';
	ctx.fillStyle = '#00d2ff'
	ctx.fillText(`Level ${userDB.stats.level}`, 35, 50);
	ctx.font = '24px "Roboto"';
	ctx.fillText(`XP: ${userDB.stats.xp} / ${userDB.stats.xpMax}`, 35, 90)

	// PROGRESS BAR
	const	barWidth = 550;
	const	barHeight = 42;
	const	barX = 210;
	const	barY = (canvas.height - barHeight) / 2;
	const	percent = Math.min(userDB.stats.xp / userDB.stats.xpMax, 1);
	const	radius = 10;

	ctx.fillStyle = 'rgba(136, 134, 134, 0.62)';
	roundRect(ctx, barX, barY, barWidth, barHeight, radius);

	if (userDB.stats.xp >= 5)
	{
		ctx.fillStyle = '#05cdfb';
		roundRect(ctx, barX, barY, barWidth * percent, barHeight, radius);
	}
	return canvas
}
export default getCanva;
