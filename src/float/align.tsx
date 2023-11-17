import React from 'react';
import cx from 'classnames';
import Align from 'rc-align';
import { AlignProps } from 'rc-align/es/Align';
import './index.css';

export interface IProps extends Omit<AlignProps, 'align'> {
  visible: boolean;
  className?: string;
  targetOffset?: Array<number>;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

export default function CAlign(props: IProps) {
  const {
    visible,
    children,
    className,
    onMouseEnter,
    onMouseLeave,
    targetOffset = [0, 0],
    ...resetProps
  } = props;

  return (
    <Align
      monitorWindowResize
      align={{
        points: ['bc', 'cc'],
        targetOffset: targetOffset,
        // @ts-ignore
        overflow: { adjustX: true, adjustY: true, alwaysByViewport: true },
      }}
      {...resetProps}
    >
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cx('dom-align', className)}
        style={{
          position: 'absolute',
          display: visible ? 'inline-block' : 'none',
        }}
      >
        {children}
      </div>
    </Align>
  );
}
