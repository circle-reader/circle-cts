import React from 'react';
import cx from 'classnames';
import { useApp } from 'circle-react-hook';
import { Drawer, Modal } from 'antd';
import type { DrawerProps } from 'antd';

export interface IPopupProps
  extends Omit<DrawerProps, 'width' | 'getContainer'> {
  width?: number;
  type?: 'toolbar' | 'modal';
  centered?: boolean;
  getContainer?: () => any;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Popup(props: IPopupProps) {
  const {
    type,
    width,
    children,
    placement,
    onCancel,
    className,
    rootClassName,
    ...resetProps
  } = props;
  const { app } = useApp();

  if (type === 'toolbar') {
    return (
      <Drawer
        styles={{ body: { padding: 0 } }}
        {...resetProps}
        mask={false}
        width={width}
        onClose={onCancel}
        className={className}
        rootClassName={cx('popup-toolbar', rootClassName)}
        placement={app.device.phone ? 'bottom' : placement}
      >
        {children}
      </Drawer>
    );
  }

  if (type === 'modal') {
    return (
      <Modal
        {...resetProps}
        onCancel={onCancel}
        rootClassName={rootClassName}
        width={app.device.phone ? '90%' : width}
        className={cx(className, 'popup-modal')}
      >
        {children}
      </Modal>
    );
  }

  return (
    <Drawer
      {...resetProps}
      onClose={onCancel}
      className={className}
      width={app.device.phone ? '100%' : width}
      rootClassName={cx('popup-drawer', rootClassName)}
      placement={app.device.phone ? 'bottom' : placement}
    >
      {children}
    </Drawer>
  );
}
