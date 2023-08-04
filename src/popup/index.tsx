import React, { useState, useEffect } from 'react';
import { isElement, useApp } from 'circle-ihk';
import Popup, { IPopupProps } from './popup';
import './index.less';

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
          args.unshift(val);
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
    const target = container.querySelector('.app');
    if (!isElement(target)) {
      return;
    }
    if (open) {
      !app.device.phone &&
        target.style.setProperty('padding-right', !type ? `${width}px` : '1px');
      setTimeout(() => {
        app.fire('toolbar_state', id, 'active');
      }, 0);
    } else {
      !app.device.phone && target.style.removeProperty('padding-right');
      setTimeout(() => {
        app.fire('toolbar_state', id, 'inactive');
      }, 0);
    }
  }, [open]);

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
      {...resetProps}
    >
      {children}
    </Popup>
  );
}
