import React from 'react';
import cx from 'classnames';
import VirtualList from 'rc-virtual-list';
import { Avatar, List, ListProps, Empty } from 'antd';
import { ListItemMetaProps } from 'antd/es/list/Item';
import './index.css';

export interface IListData extends Omit<ListItemMetaProps, 'avatar'> {
  id: string;
  avatar?: string;
  [index: string]: any;
}

export interface IPanelProps
  extends Omit<ListProps<IListData>, 'extra' | 'children'> {
  height?: number;
  loading?: boolean;
  className?: string;
  vertical?: boolean;
  virtual?: boolean;
  onLoadMore?: () => void;
  empty?: React.ReactNode;
  header?: React.ReactNode;
  onClick?: (item: IListData) => void;
  extra?: (item: IListData) => React.ReactNode;
  actions?: (item: IListData) => React.ReactNode[];
}

export default function CList(props: IPanelProps) {
  const {
    empty,
    extra,
    height,
    onClick,
    actions,
    virtual,
    className,
    onLoadMore,
    renderItem,
    dataSource = [],
    vertical = true,
    ...prop
  } = props;
  const handleClick = (e: React.MouseEvent, data: IListData) => {
    e.stopPropagation();
    e.preventDefault();
    onClick && onClick(data);
  };
  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (!height) {
      return;
    }
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop + 10 >=
      height
    ) {
      onLoadMore && onLoadMore();
    }
  };

  return (
    <List
      {...prop}
      className={cx('list-wrapper', className)}
      itemLayout={vertical ? 'vertical' : 'horizontal'}
    >
      {dataSource.length > 0 ? (
        <VirtualList
          itemKey="id"
          itemHeight={45}
          virtual={virtual}
          data={dataSource}
          onScroll={handleScroll}
          height={virtual && height ? height : undefined}
        >
          {(item: IListData, index: number) => (
            <List.Item
              key={item.id}
              data-id={item.id}
              extra={extra ? extra(item) : undefined}
              actions={actions ? actions(item) : undefined}
              onClick={(e: React.MouseEvent) => {
                handleClick(e, item);
              }}
              className={cx(item.className, {
                'list-cursor': !!onClick,
              })}
            >
              {item.title && (
                <List.Item.Meta
                  title={item.title}
                  description={item.description || item.desc}
                  avatar={item.avatar ? <Avatar src={item.avatar} /> : null}
                />
              )}
              {renderItem && renderItem(item, index)}
            </List.Item>
          )}
        </VirtualList>
      ) : (
        <Empty description={empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </List>
  );
}
