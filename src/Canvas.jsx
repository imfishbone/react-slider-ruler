import React from 'react';
import drawingUtil from './utils/drawingUtil';
import styles from './data/styles';
import util from './utils/common';

const deviceDpr =
  window.devicePixelRatio ||
  window.webkitDevicePixelRatio ||
  window.mozDevicePixelRatio ||
  1;

export default class Canvas extends React.PureComponent {
  dpr = deviceDpr;

  coordinate = 0;

  isTouching = false;

  touchPoints = [];

  state = { translate: 0 };

  // browserEnv = Boolean(window.ontouchstart);

  canvasRef = React.createRef();

  // eslint-disable-next-line react/destructuring-assignment
  currentValue = this.props.value;

  componentDidMount() {
    this.drawCanvas();
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  get isXAxis() {
    const { axis } = this.props;
    return axis === 'x' || axis === 'x-reverse';
  }

  get isReverseAxis() {
    const { axis } = this.props;
    return axis === 'x-reverse' || axis === 'y-reverse';
  }

  getCoordinate = (e) => {
    const { pageX, pageY } = e.touches?.[0] ?? e;
    return this.isXAxis ? pageX : pageY;
  };

  handleTouchStart = (e) => {
    if (this.isTouching) return;

    this.isTouching = true;
    const coordinate = this.getCoordinate(e);
    this.addTouchPoint(coordinate);
    this.coordinate = coordinate;
  };

  handleTouchMove = (e) => {
    if (!this.isTouching) return;

    const coordinate = this.getCoordinate(e);
    this.addTouchPoint(coordinate);
    const delta = coordinate - this.coordinate;

    const { gap } = this.props;
    if (Math.abs(delta) < gap) return;
    if (this.rebound(delta)) return;

    this.coordinate = coordinate;
    this.moveGradations(delta);
  };

  handleTouchEnd = () => {
    const { isSlowMotion } = this.props;
    if (!this.isTouching) return;
    this.isTouching = false;
    // if (this.browserEnv) {
    //   console.log('touch end3');
    //   this.moveGradations(util.calcInertialShfitInPx(this.touchPoints));
    // }
    // this.moveGradations(util.calcInertialShfitInPx(this.touchPoints));

    if (isSlowMotion) {
      this.moveGradations(util.calcInertialShfitInPx(this.touchPoints));
    }
    this.setState({ translate: 0 });
    this.touchPoints = [];
  };

  addTouchPoint = (shift) =>
    this.touchPoints.push({ time: new Date().getTime(), shift });

  rebound(delta) {
    const { max, min } = this.props;

    if (
      !util.isOverBoundary({
        max,
        min,
        delta: this.isReverseAxis ? -delta : delta,
        value: this.currentValue,
      })
    )
      return false;

    const translate = util.calcReboundTranslate(delta);
    this.setState({ translate });
    return true;
  }

  moveGradations(delta) {
    const diffInPx = this.isReverseAxis ? delta : -delta;
    const { gap, step, moveStep, onChange } = this.props;
    const diff = Math.round(diffInPx / gap);
    const _step = moveStep > 0 ? moveStep : step;
    const increment = Math.sign(diff) * _step;
    let speed = Math.abs(diff); // for sliding

    const draw = () => {
      if (speed < 1) {
        if (step >= 1) return onChange(this.currentValue);
        const decimalPlace = util.countDecimalPlace(step);
        return onChange(Number(this.currentValue.toFixed(decimalPlace)));
      }
      this.currentValue += increment;
      speed -= speed > 8 ? 2 : 1;
      this.drawCanvas();
      return window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
  }

  drawCanvas() {
    const { min, max, step, gap } = this.props;
    this.currentValue = util.adjustValue({
      max,
      min,
      step,
      value: this.currentValue,
    });
    const canvas = this.canvasRef.current;
    const { width, height } = this.props;
    const basis = this.isXAxis ? width : height;

    if (!canvas) return;
    const { from, to, calcMarkCoordinate } = util.calcFromTo({
      step,
      gap,
      basis,
      value: this.currentValue,
      isReverseAxis: this.isReverseAxis,
    });
    const { markStyle, smallerMarkStyle, numberStyle, unit } = this.props;

    drawingUtil.drawCanvas({
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
      isXAxis: this.isXAxis,
    });
  }

  render() {
    const { width, height, value = null } = this.props;
    const { translate } = this.state;
    if (value !== null) this.currentValue = value;

    return (
      <>
        <canvas
          ref={this.canvasRef}
          width={width * this.dpr}
          height={height * this.dpr}
          style={styles.createCanvasStyle(translate, this.isXAxis)}
          onTouchStart={this.handleTouchStart}
          // onMouseDown={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          // onMouseMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          // onMouseUp={this.handleTouchEnd}
          // onMouseLeave={this.handleTouchEnd}
        />
        <input value={this.currentValue} type="hidden" />
      </>
    );
  }
}
