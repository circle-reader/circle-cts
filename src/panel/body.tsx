import cx from 'classnames';
import React, { useRef, useState, useEffect } from 'react';

interface IProps {
  className?: string;
  height: number | string;
  children?: React.ReactNode | ((height: number) => React.ReactNode);
}

export default function PanelBody(props: IProps) {
  const { height, className, children } = props;
  const heightIsValiable = typeof height === 'number';
  const childrenIsFunction = typeof children === 'function';
  const wrapper = useRef<HTMLDivElement>(null);
  const [autoHeight, setAutoHeight] = useState(heightIsValiable ? height : 600);

  useEffect(() => {
    if (!childrenIsFunction || !wrapper.current) {
      return;
    }
    setAutoHeight(wrapper.current.clientHeight);
  }, [height]);

  return (
    <div
      ref={wrapper}
      className={cx('panel-body', className)}
      style={heightIsValiable ? { height: height } : undefined}
    >
      {childrenIsFunction ? children(autoHeight) : children}
    </div>
  );
}
