import React, { useState, useEffect } from 'react';
import { isElement, useApp } from 'circle-ihk';
import Popup, { IPopupProps } from './popup';
import './index.css';

export interface IProps extends IPopupProps {
  id: string;
  placement?: 'left' | 'right';
  type?: 'toolbar' | 'modal';
  destoryWithRender?: boolean;
  onVisible?: (open: boolean) => void;
  onChange?: (...args: Array<any>) => any;
}

export default function App(props: IProps) {
  const {
    id,
    type,
    onCancel,
    onChange,
    onVisible,
    children,
    width = 378,
    placement = 'right',
    destoryWithRender = true,
    ...resetProps
  } = props;
  const { app } = useApp();
  const [open, setOpen] = useState(false);
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onVisible && onVisible(false);
    setOpen(false);
    onCancel && onCancel(e);
  };

  useEffect(() => {
    return app.on(id, (...args: Array<string | boolean>) => {
      setOpen((val) => {
        if (onChange) {
          args.unshift(!val);
          const changeValue = onChange.apply(app, args);
          if (changeValue) {
            return val;
          }
        }
        onVisible && onVisible(!val);
        return !val;
      });
    });
  }, []);

  useEffect(() => {
    const container = app.field('container');
    if (!isElement(container)) {
      return;
    }
    const target = container.querySelector('.ant-app');
    if (!isElement(target)) {
      return;
    }
    if (open) {
      if (!app.device.phone && !type) {
        target.style.setProperty(`padding-${placement}`, `${width}px`);
        const toolbar = app.field('toolbar');
        if (isElement(toolbar)) {
          const handle = toolbar.querySelector('.toolbar');
          if (handle) {
            handle.style.setProperty(
              'right',
              placement === 'right'
                ? `calc((100vw - var(--width)) / 2 + ${width / 2 - 36}px)`
                : `calc((100vw - var(--width)) / 2 - ${width / 2 + 36}px)`
            );
          }
        }
      }
    } else {
      if (!app.device.phone && !type) {
        target.style.removeProperty(`padding-${placement}`);
        const toolbar = app.field('toolbar');
        if (isElement(toolbar)) {
          const handle = toolbar.querySelector('.toolbar');
          if (handle) {
            handle.style.removeProperty('right');
          }
        }
      }
    }
    setTimeout(() => {
      app.fire('toolbar_state', id, open ? 'active' : 'inactive');
    }, 0);
  }, [width, open]);

  useEffect(() => {
    return app.on('render_leave', () => {
      if (!destoryWithRender) {
        return;
      }
      onVisible && onVisible(false);
      setOpen(false);
    });
  }, [destoryWithRender]);

  return (
    <Popup
      type={type}
      open={open}
      width={width}
      onCancel={handleCancel}
      placement={placement}
      {...resetProps}
    >
      {children}
    </Popup>
  );
}
