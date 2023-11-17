import Align from './align';
import React, { useState, useEffect } from 'react';

export type TAlignTarget = HTMLElement | Range | null;

export interface IPosition {
  visible: boolean;
  point:
    | (() => HTMLElement)
    | {
        clientX?: number;
        clientY?: number;
        pageX?: number;
        pageY?: number;
      };
}

interface IProps {
  value?: IPosition;
  className?: string;
  children: React.ReactElement;
  targetOffset?: Array<number>;
  onMouseLeave: (event: React.MouseEvent) => void;
  onMouseEnter: (event: React.MouseEvent) => void;
}

export default function Float(props: IProps) {
  const {
    value,
    children,
    className,
    onMouseLeave,
    onMouseEnter,
    targetOffset = [0, 24],
  } = props;
  const [data, setData] = useState<IPosition>({
    visible: false,
    point: {
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
    },
  });

  useEffect(() => {
    if (!value) {
      return;
    }
    setData(value);
  }, [value]);

  return (
    <Align
      target={data.point}
      className={className}
      visible={data.visible}
      targetOffset={targetOffset}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Align>
  );
}
