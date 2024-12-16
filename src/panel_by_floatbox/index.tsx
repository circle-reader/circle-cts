import React from 'react';
import { Spin } from 'antd';
import Float from '../float';
import useContext, { CProps, IOption } from '../search_by_floatbox/useContext';

interface IProps extends CProps {
  children: (data: IOption) => React.ReactElement;
}

export default function PanelByFloatbox(props: IProps) {
  const { className, children, ...prop } = props;
  const { option } = useContext(prop);

  return (
    <Float
      className={className}
      points={['tc', 'bc']}
      targetOffset={[0, -25]}
      value={{ visible: option.visible, point: option.point }}
    >
      <Spin spinning={option.loading}>{children(option)}</Spin>
    </Float>
  );
}
