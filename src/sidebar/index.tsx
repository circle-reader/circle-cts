import cx from 'classnames';
import { Space, Button } from 'antd';
import Draggable from 'react-draggable';
import React, { useEffect } from 'react';
import { useData, isElement } from 'circle-ihk';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './index.css';

interface IProps {
  id?: string;
  title: string;
  width?: number;
  className?: string;
  onClose?: () => void;
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  children?: React.ReactNode;
  defaultPosition?: {
    x: number;
    y: number;
  };
}

export default function Sidebar(props: IProps) {
  const {
    title,
    onClose,
    children,
    className,
    addonAfter,
    addonBefore,
    width = 340,
    id = 'sidebar',
    defaultPosition = { x: 0, y: 0 },
  } = props;
  const { app, value, onChange } = useData({
    id: `${id}_fold`,
    defaultValue: false,
  });
  const { value: position, onChange: setPosition } = useData({
    id: `${id}_position`,
    defaultValue: defaultPosition,
  });
  const handleFold = () => {
    onChange(!value);
  };
  const handleDrag = (
    // @ts-ignore
    event:
      | React.MouseEvent<HTMLElement | SVGElement>
      | React.TouchEvent<HTMLElement | SVGElement>
      | MouseEvent
      | TouchEvent,
    data: {
      node: HTMLElement;
      x: number;
      y: number;
      deltaX: number;
      deltaY: number;
      lastX: number;
      lastY: number;
    }
  ) => {
    setPosition({
      x: data.x,
      y: data.y,
    });
  };

  useEffect(() => {
    let changed = false;
    const limit = window.innerHeight - 70;
    if (position.y > limit) {
      position.y = limit;
      changed = true;
    }
    if (changed) {
      setPosition({ ...position });
    }
  }, [position]);

  useEffect(() => {
    if (app.device.phone) {
      return;
    }
    const container = app.field('container');
    if (!isElement(container)) {
      return;
    }
    const target = container.querySelector('.ant-app');
    if (!isElement(target)) {
      return;
    }
    if (value) {
      target.style.removeProperty('padding-right');
      const toolbar = app.field('toolbar');
      if (isElement(toolbar)) {
        const handle = toolbar.querySelector('.toolbar');
        if (handle) {
          handle.style.removeProperty('right');
        }
      }
    } else {
      target.style.setProperty('padding-right', `${width}px`);
      const toolbar = app.field('toolbar');
      if (isElement(toolbar)) {
        const handle = toolbar.querySelector('.toolbar');
        if (handle) {
          handle.style.setProperty(
            'right',
            `calc((100vw - var(--width)) / 2 + ${width / 2 - 36}px)`
          );
        }
      }
    }
  }, [width, value]);

  return (
    <Draggable
      axis="y"
      disabled={!value}
      onDrag={handleDrag}
      handle=".panel-draggable"
      defaultClassName="panel-draggable"
      defaultClassNameDragged="panel-dragged"
      defaultClassNameDragging="panel-dragging"
      position={value ? position : { x: 0, y: 0 }}
      bounds={{
        left: 0,
        right: 0,
        top: 0,
        bottom: window.innerHeight - 100,
      }}
    >
      <div
        style={{ width: value ? 'auto' : width }}
        className={cx('sidebar-wrapper', { className, 'sidebar-fold': value })}
      >
        <div className={cx('header', { 'sidebar-draggable': value })}>
          <h3 className="title">{title}</h3>
          <Space size={0}>
            {addonBefore}
            <Button
              type="text"
              onClick={handleFold}
              icon={value ? <LeftOutlined /> : <RightOutlined />}
            />
            {!value && (
              <Button type="text" onClick={onClose} icon={<CloseOutlined />} />
            )}
            {addonAfter}
          </Space>
        </div>
        {!value && <div className="body">{children}</div>}
      </div>
    </Draggable>
  );
}
