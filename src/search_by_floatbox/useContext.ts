import { IListData } from '../list';
import { useApp } from 'circle-react-hook';
import { isElement, isString } from 'circle-utils';
import { useRef, useState, useEffect } from 'react';

interface IData {
  id: number;
  url?: string;
  title: string;
  description?: string;
}

export interface IOption {
  more: string;
  loading: boolean;
  visible: boolean;
  items: Array<IData>;
  point: {
    clientX?: number;
    clientY?: number;
    pageX?: number;
    pageY?: number;
  };
}

export interface CProps {
  url: string;
  className?: string;
  format?: 'json' | 'text' | 'blob';
  moreText?: string;
  parse?: (data: any) => Array<IData>;
  getMoreUrl?: (text: string) => string;
  getQuery?: (text: string) => {
    [index: string]: string;
  };
  getData?: (text: string) => {
    [index: string]: string;
  };
}

export default function useContext(props: CProps) {
  const { url, parse, format, getData, getQuery, getMoreUrl } = props;
  const timer = useRef<any>(null);
  const { me, app } = useApp();
  const [option, setOption] = useState<IOption>({
    more: '',
    loading: false,
    visible: false,
    items: [],
    point: {
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
    },
  });
  const destory = () => {
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOption((opt) => ({
        ...opt,
        visible: false,
      }));
    }, 100);
  };

  useEffect(() => {
    const hooks: Array<() => void> = [];
    hooks.push(app.on('floatbox_closed', destory));
    hooks.push(
      app.on('destory_floatbox_panel', (action: string) => {
        if (action === me.id) {
          return;
        }
        destory();
      })
    );
    hooks.push(
      app.on(me.id, (text: string, _range: Range, target: HTMLElement) => {
        if (!isElement(target) || !isString(text)) {
          return;
        }
        const rect = target.getBoundingClientRect();
        const topValue = rect.top + 8;
        const leftValue = rect.left + 12;
        const point = {
          clientX: leftValue,
          clientY: topValue,
          pageX: leftValue,
          pageY: topValue,
        };
        setOption((opt) => ({
          ...opt,
          point,
          items: [],
          visible: true,
          loading: true,
        }));
        const payload: {
          format?: 'json' | 'text' | 'blob';
          query?: {
            [index: string]: string;
          };
          data?: {
            [index: string]: string;
          };
        } = { format };
        if (getQuery) {
          payload.query = getQuery(text);
        } else if (getData) {
          payload.data = getData(text);
        }
        app
          .fetch(url, payload)
          .then((data: any) => {
            setOption((opt) => ({
              ...opt,
              loading: false,
              items: parse ? parse(data) : data,
              more: getMoreUrl ? getMoreUrl(text) : '',
            }));
            setOption((opt) => ({
              ...opt,
              point,
            }));
          })
          .catch((err: any) => {
            setOption((opt) => ({
              ...opt,
              visible: true,
              loading: false,
              items: [
                {
                  url: '',
                  id: 10,
                  title: 'ERROR',
                  description: err && err.message ? err.message : err,
                },
              ],
            }));
            setOption((opt) => ({
              ...opt,
              point,
            }));
          });
      })
    );
    return () => {
      hooks.forEach((hook) => {
        hook();
      });
    };
  }, []);

  useEffect(() => {
    app.fire('floatbox_state', me.id, 'loading', option.loading);
  }, [option.loading]);

  useEffect(() => {
    if (option.visible) {
      app.field('floatbox_visible', true);
      app.fire('destory_floatbox_panel', me.id);
    } else {
      app.field('floatbox_visible', false);
    }
  }, [option.visible]);

  useEffect(() => {
    app.fire('display');
  }, []);

  return {
    option,
    destory,
    onClick(item: IListData) {
      item.url && app.tabs('create', { url: item.url });
      app.fire('floatbox_destory');
    },
  };
}
