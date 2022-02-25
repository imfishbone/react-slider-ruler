import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import SlideRule from 'react-slider-ruler';

export default React.memo(function () {
  const [value, setValue] = useState(10000);
  const [ruleBoxWidth, setRuleWidth] = useState(0);
  const boxRef = useRef(null);
  useLayoutEffect(() => {
    if (boxRef.current) {
      setRuleWidth(boxRef.current.offsetWidth);
      console.log(boxRef.current.offsetWidth);
    }
  }, []);
  return (
    <div className="example-basic" ref={boxRef}>
      <p>{value}</p>
      <SlideRule
        gap={7}
        min={0}
        max={9999999}
        step={100}
        width={ruleBoxWidth}
        height={68}
        markStyle={{ top: 12, height: 12, color: '#AEB1C2', width: 1 }}
        smallerMarkStyle={{ top: 12, height: 6, color: '#DEE0E6', width: 1 }}
        numberStyle={{ color: '#AEB1C2', size: '2.5em', top: 300 }}
        value={value}
        onChange={setValue}
      />
    </div>
  );
});
