import React from 'react';
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
      value={{ visible: option.visible, point: option.point }}
    >
      {children(option)}
    </Float>
  );
}
