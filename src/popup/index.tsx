import { useApp, isElement } from 'circle-ihk';
import React, { useRef, useState, useEffect } from 'react';
import Popup, { IPopupProps } from './popup';
import './index.css';

export interface IProps extends IPopupProps {
  id: string;
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
  const cache = useRef('0px');
  const timer = useRef<any>(null);
  const { app, container } = useApp();
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
    return app.on('screenshot_change', (busy: boolean) => {
      if (busy) {
        container.style.display = 'none';
      } else {
        container.style.removeProperty('display');
      }
    });
  }, []);

  useEffect(() => {
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (open) {
        if (!app.device.phone && !type) {
          const root = app.field('container');
          if (isElement(root)) {
            const offsetright = root.style.getPropertyValue('--offsetright');
            if (offsetright) {
              cache.current = offsetright;
            }
          }
          app.fire('display', true, `${width}px`, `offset${placement}`);
        }
      } else {
        if (!app.device.phone && !type) {
          app.fire(
            'display',
            true,
            cache.current || '0px',
            `offset${placement}`
          );
        }
      }
      app.fire('toolbar_state', id, open ? 'active' : 'inactive');
    }, 500);
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
