/**
 * Ken Burns effect (zoom + pan) for React web applications.
 * Lightweight: CSS transforms + requestAnimationFrame, no animation library.
 */

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_DURATION = 20000;
const FILL_SCALE = 1.15;

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function interpolate(progress, from, to) {
  return from + progress * (to - from);
}

function getRandomCycle(zoomStart, zoomEnd, panXAmount, panYAmount) {
  return {
    scaleFrom: zoomStart + Math.random() * (zoomEnd - zoomStart),
    scaleTo: zoomStart + Math.random() * (zoomEnd - zoomStart),
    txFrom: -panXAmount + Math.random() * 2 * panXAmount,
    txTo: -panXAmount + Math.random() * 2 * panXAmount,
    tyFrom: -panYAmount + Math.random() * 2 * panYAmount,
    tyTo: -panYAmount + Math.random() * 2 * panYAmount,
  };
}

const KenBurnsView = forwardRef((props, ref) => {
  const {
    width,
    height,
    src,
    alt = '',
    placeholder,
    autoStart = true,
    duration = DEFAULT_DURATION,
    zoomStart = 1,
    zoomEnd = 1.3,
    panX = 0.1,
    panY = 0.1,
    children,
    className,
    style,
    ...rest
  } = props;

  const w = width || 0;
  const h = height || 0;
  const panXAmount = w * panX;
  const panYAmount = h * panY;

  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(() =>
    getRandomCycle(zoomStart, zoomEnd, panXAmount, panYAmount),
  );
  const cycleRef = useRef(cycle);
  cycleRef.current = cycle;
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0);

  const randomRef = useRef({
    durationFactor: 0.7 + Math.random() * 0.6,
  }).current;

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    const d = Math.round(duration * randomRef.durationFactor);
    startTimeRef.current = null;
    elapsedRef.current = 0;
    setCycle(getRandomCycle(zoomStart, zoomEnd, panXAmount, panYAmount));
    setProgress(0);

    const tick = (timestamp) => {
      if (startTimeRef.current == null) startTimeRef.current = timestamp;
      const delta = timestamp - startTimeRef.current;
      startTimeRef.current = timestamp;
      elapsedRef.current += delta;

      if (elapsedRef.current >= d) {
        elapsedRef.current = 0;
        startTimeRef.current = timestamp;
        const prev = cycleRef.current;
        const nextTo = getRandomCycle(zoomStart, zoomEnd, panXAmount, panYAmount);
        setCycle({
          scaleFrom: prev.scaleTo,
          scaleTo: nextTo.scaleTo,
          txFrom: prev.txTo,
          txTo: nextTo.txTo,
          tyFrom: prev.tyTo,
          tyTo: nextTo.tyTo,
        });
        setProgress(0);
      } else {
        const progressValue = easeInOutQuad(elapsedRef.current / d);
        setProgress(progressValue);
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
  }, [duration, zoomStart, zoomEnd, panXAmount, panYAmount, stop, randomRef]);

  useImperativeHandle(
    ref,
    () => ({
      start,
      stop,
      reset: () => {
        stop();
        setProgress(0);
      },
    }),
    [start, stop],
  );

  useEffect(() => {
    if (autoStart) start();
    return () => stop();
  }, [autoStart, start, stop]);

  const scale = interpolate(progress, cycle.scaleFrom, cycle.scaleTo);
  const translateX = interpolate(progress, cycle.txFrom, cycle.txTo);
  const translateY = interpolate(progress, cycle.tyFrom, cycle.tyTo);

  const innerWidth = w * FILL_SCALE;
  const innerHeight = h * FILL_SCALE;
  const innerLeft = -w * (FILL_SCALE - 1) / 2;
  const innerTop = -h * (FILL_SCALE - 1) / 2;

  const outerStyle = {
    overflow: 'hidden',
    position: 'relative',
    width: w,
    height: h,
    ...style,
  };

  const innerStyle = {
    position: 'absolute',
    left: innerLeft,
    top: innerTop,
    width: innerWidth,
    height: innerHeight,
    transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
    willChange: 'transform',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  return (
    <div ref={ref} className={className} style={outerStyle} {...rest}>
      <div style={innerStyle}>
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          loading="lazy"
          {...(placeholder ? { 'data-placeholder': placeholder } : {})}
        />
        {children}
      </div>
    </div>
  );
});

KenBurnsView.displayName = 'KenBurnsView';

KenBurnsView.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  placeholder: PropTypes.string,
  autoStart: PropTypes.bool,
  duration: PropTypes.number,
  zoomStart: PropTypes.number,
  zoomEnd: PropTypes.number,
  panX: PropTypes.number,
  panY: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

KenBurnsView.defaultProps = {
  autoStart: true,
  duration: DEFAULT_DURATION,
  zoomStart: 1,
  zoomEnd: 1.3,
  panX: 0.1,
  panY: 0.1,
};

export default KenBurnsView;
