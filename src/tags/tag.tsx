import { Tag, Tooltip } from 'antd';
import { isChinese } from 'circle-utils';

interface IProps {
  tag: string;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  onClick?: (e: any) => void;
  className?: string;
  onDoubleClick?: (e: any) => void;
}

export default function SingleTag(props: IProps) {
  const { tag, title, closable, onClose, onClick, className, onDoubleClick } =
    props;
  const limit = isChinese(tag) ? 8 : 20;
  const isLongTag = tag.length > limit;
  const tagElem = (
    <Tag
      key={tag}
      onClose={onClose}
      onClick={onClick}
      closable={closable}
      className={className}
    >
      <span title={title} onDoubleClick={onDoubleClick}>
        {isLongTag ? `${tag.slice(0, limit)}...` : tag}
      </span>
    </Tag>
  );
  return isLongTag ? (
    <Tooltip key={tag} title={tag}>
      {tagElem}
    </Tooltip>
  ) : (
    tagElem
  );
}
