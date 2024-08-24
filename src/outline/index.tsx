import React from 'react';
import cx from 'classnames';
import { Button } from 'antd';
import useContext from './useContext';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import './index.css';

interface IProps {
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export default function Outline(props: IProps) {
  const { extra, children } = props;
  const { app, float, shadow, collapse, onCollapse } = useContext();

  return (
    <div className={cx('outline', { float, shadow: shadow && !collapse })}>
      <Button
        onClick={onCollapse}
        className="outline-btn"
        type={app.device.phone || collapse ? 'default' : 'text'}
        icon={collapse ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
      />
      {!collapse && <div className="outline-inner">{children}</div>}
      {extra}
    </div>
  );
}
