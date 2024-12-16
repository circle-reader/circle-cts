import cx from 'classnames';
import List from '../list';
import Float from '../float';
import { Spin, Button } from 'antd';
import useContext, { CProps } from './useContext';
import './index.css';

export default function SearchByFloatbox(props: CProps) {
  const { className, moreText = 'more', ...prop } = props;
  const { option, onClick } = useContext(prop);

  return (
    <Float
      points={['tc', 'bc']}
      targetOffset={[0, -25]}
      className={cx('wrapper', className)}
      value={{ visible: option.visible, point: option.point }}
    >
      <Spin spinning={option.loading}>
        <List
          virtual={false}
          onClick={onClick}
          className="search-list"
          loading={option.loading}
          dataSource={option.items.map((item) => ({
            url: item.url,
            id: `${item.id}`,
            title: item.title,
            description: item.description ? (
              <p dangerouslySetInnerHTML={{ __html: item.description }} />
            ) : undefined,
          }))}
          footer={
            option.items.length > 0 && option.more ? (
              <div className="footer">
                <Button
                  size="small"
                  type="text"
                  target="_blank"
                  href={option.more}
                >
                  {moreText}
                </Button>
              </div>
            ) : undefined
          }
        />
      </Spin>
    </Float>
  );
}
