import { useApp } from 'circle-react-hook';
import { useRef, useState } from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EnhanceTag from './tag';
import './index.css';

interface IProps {
  value?: Array<string>;
  onChange?: (newTags: Array<string>) => void;
}

export default function Tags(props: IProps) {
  const { value = [], onChange } = props;
  const { app } = useApp();
  const input = useRef(null);
  const editInput = useRef(null);
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const handleEditInputConfirm = () => {
    const newTags = [...value];
    newTags[editInputIndex] = editInputValue;
    onChange && onChange(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };
  const handleClose = (removedTag: string) => {
    const tags = value.filter((tag: string) => tag !== removedTag);
    onChange && onChange(tags);
  };
  const handleInputConfirm = () => {
    if (inputValue.length <= 0) {
      return;
    }
    if (inputValue && value.indexOf(inputValue) < 0) {
      value.push(inputValue);
    }
    setInputValue('');
    onChange && onChange([...value]);
    setTimeout(function () {
      // @ts-ignore
      input && input.current && input.current.focus();
    }, 0);
  };
  const handleInputBlur = () => {
    setVisible(false);
    handleInputConfirm();
  };

  return (
    <>
      {value.map((tag: string, index: number) => {
        if (editInputIndex === index) {
          return (
            <Input
              key={tag}
              size="small"
              ref={editInput}
              className="tag-input"
              value={editInputValue}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
              onChange={(e) => setEditInputValue(e.target.value)}
            />
          );
        }
        return (
          <EnhanceTag
            tag={tag}
            closable
            key={tag}
            title="双击编辑"
            className="edit-tag"
            onClose={() => handleClose(tag)}
            onDoubleClick={(e: any) => {
              e.preventDefault();
              setEditInputValue(tag);
              setEditInputIndex(index);
              setTimeout(function () {
                // @ts-ignore
                editInput && editInput.current && editInput.current.focus();
              }, 0);
            }}
          />
        );
      })}
      {visible ? (
        <Input
          ref={input}
          type="text"
          size="small"
          value={inputValue}
          className="tag-input"
          onBlur={handleInputBlur}
          onPressEnter={handleInputConfirm}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : (
        <Tag
          className="tag-plus"
          onClick={() => {
            setVisible(true);
            setTimeout(function () {
              // @ts-ignore
              input && input.current && input.current.focus();
            }, 0);
          }}
        >
          <Tooltip title={app.i18n('add')}>
            <PlusOutlined />
          </Tooltip>
        </Tag>
      )}
    </>
  );
}
