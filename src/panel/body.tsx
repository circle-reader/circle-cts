import React from 'react';
import cx from 'classnames';

interface IProps {
  className?: string;
  height?: number | string;
  children?: React.ReactNode;
}

export default function PanelBody(props: IProps) {
  const { height, className, children } = props;

  return (
    <div className={cx('panel-body', className)} style={{ height }}>
      {children}
    </div>
  );
}
