import React from 'react';
import { Property } from 'csstype';

export interface TouchPoint {
  time: number;
  shift: number;
}

export type Axis = 'x' | 'y' | 'x-reverse' | 'y-reverse';

export interface MarkStyle {
  color?: Property.BackgroundColor;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

export interface NumberStyle {
  size?: Property.FontSize;
  family?: Property.FontFamily;
  color?: Property.Color;
  top?: number;
  bottom?: number;
  left?: number;
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  textBaseline?:
    | 'top'
    | 'hanging'
    | 'middle'
    | 'alphabetic'
    | 'ideographic'
    | 'bottom';
  rotate: number;
}

export interface SlideRuleProps {
  onChange?: (v: number) => void;
  width?: number;
  height?: number;
  markStyle?: MarkStyle;
  smallerMarkStyle?: MarkStyle;
  numberStyle?: NumberStyle;
  unit?: string;
  gap?: number;
  step?: number;
  max?: number;
  min?: number;
  value?: number;
  style?: React.CSSProperties;
  cursor?: React.ReactElement;
  showWarning?: boolean;
  axis?: Axis;
  isSlowMotion?: boolean; // 是否缓动
  moveStep?: number; // 固定每次移动的步长，使中间刻度总是指向 moveStep 的整数倍, isSlowMotion 和 moveStep 最好不要同时使用
}
