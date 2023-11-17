import cx from 'classnames';
import { Space, Button } from 'antd';
import Draggable from 'react-draggable';
import React, { useEffect } from 'react';
import { useData, isElement, isUndefined } from 'circle-ihk';
import {
  LeftOutlined,
  PushpinOutlined,
  FullscreenOutlined,
  VerticalLeftOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import PanelBody from './body';
import PanelHeader from './header';
import './index.css';

interface IProps {
  title: string;
  width?: number;
  height?: number;
  pinText?: string;
  adsorbText?: string;
  expandText?: string;
  collapseText?: string;
  className?: string;
  collapsable?: boolean;
  rootClassName?: string;
  extra?: React.ReactNode;
  children?: React.ReactNode | ((height: number) => React.ReactNode);
  defaultValue?: {
    pin: boolean;
    adsorb: boolean;
    collapse: boolean;
  };
  defaultPosition?: {
    x: number;
    y: number;
  };
}

export default function Panel(props: IProps) {
  const {
    title,
    extra,
    pinText,
    children,
    className,
    adsorbText,
    expandText,
    collapseText,
    width = 340,
    height = 600,
    rootClassName,
    defaultValue,
    defaultPosition,
    collapsable = true,
  } = props;
  const { app, value, onChange } = useData({
    id: 'panel',
    defaultValue: isUndefined(defaultValue)
      ? {
          pin: false,
          adsorb: false,
          collapse: false,
        }
      : defaultValue,
  });
  const { value: position, onChange: setPosition } = useData({
    id: 'position',
    defaultValue: isUndefined(defaultPosition)
      ? { x: window.innerWidth - width - 20, y: 20 }
      : defaultPosition,
  });
  const handleAdsorb = () => {
    const nextAdsorb = !value.adsorb;
    if (!nextAdsorb) {
      setPosition({
        x: window.innerWidth - width - 20,
        y: (window.innerHeight - height) / 2,
      });
    }
    onChange({
      ...value,
      adsorb: nextAdsorb,
    });
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
  const handlePin = () => {
    onChange({
      ...value,
      pin: !value.pin,
    });
  };
  const handleCollapse = () => {
    onChange({
      ...value,
      collapse: !value.collapse,
    });
  };
  const autoResize = () => {
    let changed = false;
    const limit = {
      x: window.innerWidth - width,
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
  };

  useEffect(() => {
    document.addEventListener('resize', autoResize);
    autoResize();
    return () => {
      document.removeEventListener('resize', autoResize);
    };
  }, [position, width]);

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
    if (value.adsorb && value.collapse) {
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
    } else {
      target.style.removeProperty('padding-right');
      const toolbar = app.field('toolbar');
      if (isElement(toolbar)) {
        const handle = toolbar.querySelector('.toolbar');
        if (handle) {
          handle.style.removeProperty('right');
        }
      }
    }
  }, [value, width]);

  return (
    <Draggable
      onDrag={handleDrag}
      cancel=".panel-cancel"
      handle=".panel-draggable"
      axis={value.adsorb ? 'y' : 'both'}
      defaultClassName="panel-drag"
      defaultClassNameDragged="panel-dragged"
      defaultClassNameDragging="panel-dragging"
      disabled={(value.adsorb && value.collapse) || value.pin}
      position={
        value.adsorb ? { x: 0, y: value.collapse ? 0 : position.y } : position
      }
      bounds={{
        left: 0,
        right: window.innerWidth - width,
        top: 0,
        bottom: window.innerHeight - 100,
      }}
    >
      <div
        style={{ width: !value.collapse && value.adsorb ? 'auto' : width }}
        className={cx('panel-wrapper', rootClassName, {
          'panel-adsorb': value.adsorb && !value.collapse,
          'pabel-render': value.adsorb && value.collapse,
        })}
      >
        <PanelHeader
          title={title}
          className={cx({
            'panel-draggable':
              (!value.adsorb || (value.adsorb && !value.collapse)) &&
              !value.pin,
          })}
        >
          <Space size={4} className="panel-action panel-cancel">
            {extra}
            <Button
              type="text"
              onClick={handlePin}
              icon={<PushpinOutlined />}
              title={pinText || app.i18n('pin')}
              className={cx({ 'panel-pin': value.pin })}
            />
            {collapsable && !value.pin && value.adsorb && (
              <Button
                type="text"
                onClick={handleCollapse}
                title={
                  value.collapse
                    ? expandText || app.i18n('expand')
                    : collapseText || app.i18n('collapse')
                }
                icon={
                  value.collapse ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
              />
            )}
            {!value.pin && (
              <Button
                type="text"
                onClick={handleAdsorb}
                title={adsorbText || app.i18n('adsorb')}
                icon={
                  value.adsorb ? <LeftOutlined /> : <VerticalLeftOutlined />
                }
              />
            )}
          </Space>
        </PanelHeader>
        {(value.collapse || !value.adsorb) && (
          <PanelBody
            className={className}
            height={value.adsorb ? 'auto' : height}
          >
            {children}
          </PanelBody>
        )}
      </div>
    </Draggable>
  );
}
