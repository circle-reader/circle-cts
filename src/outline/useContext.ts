import { isElement } from 'circle-utils';
import { useApp } from 'circle-react-hook';
import { useRef, useState, useEffect } from 'react';

export default function useContext() {
  const timer = useRef<any>(null);
  const floatTimer = useRef<any>(null);
  const [float, setFloat] = useState(false);
  const [shadow, setShadow] = useState(false);
  const { app, container } = useApp();
  const [collapse, setCollapse] = useState<boolean>(
    app.device.phone || window.innerWidth < 1100
  );
  const handleFloat = () => {
    floatTimer.current && clearTimeout(floatTimer.current);
    floatTimer.current = setTimeout(() => {
      const root = app.field('container');
      if (!root || !isElement(root)) {
        setFloat(false);
        return;
      }
      const pages = root.querySelector('.pages');
      if (!pages || !isElement(pages)) {
        setFloat(false);
        return;
      }
      setFloat((window.innerWidth - pages.clientWidth) / 2 < 180);
    }, 1000);
  };
  const handleShadow = () => {
    const container = app.field('container');
    setShadow(isElement(container) && !container.classList.contains('paper'));
  };

  useEffect(() => {
    const hooks: Array<() => void> = [];
    hooks.push(
      app.on(
        `render_display_${
          app.colorScheme.value ? app.colorScheme.value + '_' : ''
        }option`,
        (val: boolean, key: string) => {
          if (key !== 'paper') {
            return;
          }
          setShadow(!val);
        }
      )
    );
    hooks.push(
      app.on('screenshot_change', (busy: boolean) => {
        if (busy) {
          container.style.display = 'none';
        } else {
          container.style.removeProperty('display');
        }
      })
    );
    return () => {
      hooks.forEach((hook) => {
        hook();
      });
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (app.device.phone) {
          return;
        }
        setCollapse(window.innerWidth < 1100);
        handleFloat();
      }, 1000);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!app.field('running')) {
      return;
    }
    const container = app.field('container');
    if (!isElement(container)) {
      return;
    }
    const pages = container.querySelector('.pages');
    if (!isElement(pages)) {
      return;
    }
    const resize = new ResizeObserver(handleFloat);
    resize.observe(pages);
    return () => {
      resize.unobserve(pages);
    };
  }, []);

  useEffect(() => {
    handleShadow();
    handleFloat();
    app.fire('display');
  }, []);

  return {
    app,
    float,
    collapse,
    shadow: !app.device.phone && shadow,
    onCollapse: () => setCollapse(!collapse),
  };
}
