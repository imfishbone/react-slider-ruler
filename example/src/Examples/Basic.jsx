import React, { useState, useRef, useLayoutEffect } from 'react';
import SlideRule from 'react-slider-ruler';

export default React.memo(function () {
  const [value, setValue] = useState(10000);
  const [ruleBoxWidth, setRuleWidth] = useState(0);
  const boxRef = useRef(null);
  const dpr = window.devicePixelRatio || 1;
  useLayoutEffect(() => {
    console.log('devicePixelRatio', window.devicePixelRatio);
    if (boxRef.current) {
      setRuleWidth(boxRef.current.offsetWidth);
      // console.log(boxRef.current.offsetWidth);
    }
  }, []);
  return (
    <div className="example-basic" ref={boxRef}>
      <p>{value}</p>
      <SlideRule
        gap={7}
        min={0}
        max={100000000}
        step={1000}
        width={ruleBoxWidth}
        value={value}
        height={68}
        markStyle={{ top: 20, height: 12, color: '#AEB1C2', width: 1 }}
        smallerMarkStyle={{ top: 20, height: 6, color: '#DEE0E6', width: 1 }}
        numberStyle={{ color: '#AEB1C2', size: `${parseInt(dpr * 14)}px`, top: `${parseInt(dpr * 40)}` }}
        onChange={setValue}
      />
    </div>
  );
});
