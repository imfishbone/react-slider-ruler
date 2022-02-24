import util from './common';

const dpr =
  window.devicePixelRatio ||
  window.webkitDevicePixelRatio ||
  window.mozDevicePixelRatio ||
  1;
const _drawVerticalLine = (ctx, coordinate, style) => {
  const { width, height, color, top } = style;
  ctx.lineWidth = width * dpr;
  ctx.strokeStyle = color;
  ctx.moveTo(coordinate * dpr, top * dpr);
  ctx.lineTo(coordinate * dpr, top * dpr + height * dpr);
  ctx.stroke();
  ctx.scale(1 / dpr, 1 / dpr);
};

const _drawLine = (ctx, coordinate, style) => {
  const { width, height, color, left } = style;

  ctx.lineWidth = height * dpr;
  ctx.strokeStyle = color;
  ctx.moveTo(left * dpr, coordinate);
  ctx.lineTo((left + width) * dpr, coordinate);
  ctx.stroke();
  ctx.scale(1 / dpr, 1 / dpr);
};

const drawNumber = ({
  ctx,
  text,
  coordinate,
  numberStyle: { top, left, rotate },
  isXAxis,
}) => {
  // console.log(text, '--text---');
  ctx.save();
  if (isXAxis) {
    ctx.translate(coordinate * dpr * dpr, top * dpr);
    // ctx.scale(dpr, dpr);
    // console.log(coordinate * dpr, '----coordinate----');
  } else {
    ctx.translate(left * dpr, coordinate * dpr);
  }

  ctx.rotate((Math.PI / 180) * rotate);
  ctx.fillText(text, 0, 0);
  ctx.restore();
  // ctx.scale(1 / dpr, 1 / dpr);
  // 文字绘制完成以后需要缩放回去
  // ctx.font = ctx.font.replace(/(\d+)(px|em|rem|pt)/g, function (w, m, u) {
  //   return m / dpr + u;
  // });
};

const _applyNumberNumberStyle = (ctx, numberStyle) => {
  const { size, family, color, textAlign, textBaseline } = numberStyle;
  ctx.fillStyle = color;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = `${size} ${family}`;
  // 字体也需要放大
  ctx.font = ctx.font.replace(/(\d+)(px|em|rem|pt)/g, function (w, m, u) {
    return m * dpr + u;
  });
};

const _round = (number, step) => {
  return step >= 0.1
    ? number
    : number.toFixed(util.countDecimalPlace(step) - 1);
};

const _calcNum = (i, step) => _round(i * step, step);

const drawCanvas = ({
  canvas,
  width,
  height,
  step,
  markStyle,
  smallerMarkStyle,
  numberStyle,
  unit,
  min,
  max,
  from,
  to,
  calcMarkCoordinate,
  isXAxis,
}) => {

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const drawLine = isXAxis ? _drawVerticalLine : _drawLine;
  const lower = Math.round(min / step); // use round() in case of decimal place
  const upper = Math.round(max / step);
  const ctx = canvas.getContext('2d');

  _applyNumberNumberStyle(ctx, numberStyle);
  ctx.clearRect(0, 0, canvas.width * dpr, canvas.height * dpr);

  for (let i = from; i <= to; ++i) {
    if (i < lower || i > upper) continue;
    const coordinate = calcMarkCoordinate(i);

    ctx.beginPath();
    if (i % 10 === 0) {
      drawLine(ctx, coordinate, markStyle);
      const text = _calcNum(i, step) + unit;
      drawNumber({ ctx, text, coordinate, numberStyle, isXAxis });
    } else {
      drawLine(ctx, coordinate, smallerMarkStyle);
    }

    ctx.closePath();
    ctx.scale(dpr, dpr);
  }
};

export default { drawCanvas };
