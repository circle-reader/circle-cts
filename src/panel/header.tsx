import React from 'react';
import cx from 'classnames';

interface IProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Panel(props: IProps) {
  const { title, className, children } = props;

  return (
    <div className={cx('panel-header', className)}>
      <h3 className="panel-title">{title}</h3>
      {children}
    </div>
  );
}
