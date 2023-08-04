import cx from 'classnames';
import { Button, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { isElement, useData } from 'circle-ihk';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Popup, { IProps } from '../popup';
import './index.less';

type Item = {
  width: number;
  tooltip: string;
  icon: React.ReactNode;
};

interface ISidebar extends IProps {
  id: string;
  title?: string;
  noStyle?: boolean;
  fold?: Item;
  unfold?: Item;
  className?: string;
}

export default function Sidebar(props: ISidebar) {
  const {
    id,
    title,
    noStyle,
    className,
    children,
    fold = {
      width: 0,
      tooltip: '展开',
      icon: <PlusCircleOutlined />,
    },
    unfold = {
      width: 280,
      tooltip: '折叠',
      icon: <MinusCircleOutlined />,
    },
    ...prop
  } = props;
  const foldWidth = fold.width;
  const unfoldWidth = unfold.width;
  const { value, onChange } = useData({
    id: `${id}_fold`,
    defaultValue: false,
  });
  const {
    app,
    container,
    value: placement,
  } = useData({
    id: `${id}_placement`,
    defaultValue: 'right',
  });
  const toggle = () => {
    onChange(!value);
  };
  const resize = () => {
    if (
      value ||
      !['left', 'right'].includes(placement) ||
      app.device.phone ||
      unfoldWidth < 50
    ) {
      return;
    }
    if (!isElement(app.field('container'))) {
      return;
    }
    const root = container.querySelector('.ant-drawer-content-wrapper');
    if (!isElement(root)) {
      return;
    }
    let widthValue = unfoldWidth;
    const rect = container.getBoundingClientRect();
    if (placement === 'left') {
      widthValue = rect.left;
    } else {
      widthValue = window.innerWidth - rect.right;
    }
    if (widthValue > unfoldWidth) {
      widthValue = unfoldWidth;
    } else if (widthValue < 160) {
      widthValue = 160;
    }
    // @ts-ignore
    root.style.width = `${widthValue}px`;
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [value, placement, unfoldWidth]);

  return (
    <Popup
      {...prop}
      id={id}
      mask={false}
      title={title}
      closable={false}
      placement={placement}
      width={value ? foldWidth : unfoldWidth}
      rootClassName={cx(`sidebar-${value ? 'close' : 'open'}`, className, {
        sidebar: !noStyle,
      })}
    >
      <Tooltip
        placement="bottomRight"
        title={value ? fold.tooltip : unfold.tooltip}
      >
        <Button
          onClick={toggle}
          className="sidebar-btn"
          type={value ? 'default' : 'text'}
          icon={value ? fold.icon : unfold.icon}
        />
      </Tooltip>
      {!value && children}
    </Popup>
  );
}
