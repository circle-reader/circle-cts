import cx from 'classnames';
import { Space, Button } from 'antd';
import Draggable from 'react-draggable';
import React, { useEffect } from 'react';
import { useData, isUndefined } from 'circle-ihk';
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

export default function Panel(props: IProps) {
  const {
    title,
    onClose,
    children,
    className,
    addonAfter,
    addonBefore,
    width = 340,
    id = 'panel',
    defaultPosition,
  } = props;
  const { value, onChange } = useData({
    id: `${id}_fold`,
    defaultValue: false,
  });
  const { value: position, onChange: setPosition } = useData({
    id: `${id}_position`,
    defaultValue: isUndefined(defaultPosition)
      ? { x: window.innerWidth - width - 20, y: 20 }
      : defaultPosition,
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
    const limit = {
      x: window.innerWidth - 70,
      y: window.innerHeight - 70,
    };
    if (position.x > limit.x) {
      position.x = limit.x;
      if (!changed) {
        changed = true;
      }
    }
    if (position.y > limit.y) {
      position.y = limit.y;
      if (!changed) {
        changed = true;
      }
    }
    if (changed) {
      setPosition({ ...position });
    }
  }, [position]);

  return (
    <Draggable
      onDrag={handleDrag}
      handle=".panel-draggable"
      axis={value ? 'y' : 'both'}
      defaultClassName="panel-draggable"
      defaultClassNameDragged="panel-dragged"
      defaultClassNameDragging="panel-dragging"
      position={value ? { x: 0, y: position.y } : position}
      bounds={{
        left: 0,
        right: window.innerWidth - width,
        top: 0,
        bottom: window.innerHeight - 100,
      }}
    >
      <div
        style={{ width: value ? 'auto' : width }}
        className={cx('panel-wrapper', { className, 'panel-fold': value })}
      >
        <div className="header panel-draggable">
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
