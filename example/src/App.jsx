import React from 'react';
import ExampleItem from 'ExampleItem';

export default React.memo(function App() {
  return (
    <main>
      <h1>Demos</h1>
      <h2 id="basic">Basic</h2>
      <ul>
        <ExampleItem id="basic" />
        {/* <ExampleItem id="input-element" />
        <ExampleItem id="vertical" /> */}
      </ul>
      {/* <h2 id="Advanced">Advanced</h2> */}
      {/* <ul>
        <ExampleItem id="custom-styled" />
        <ExampleItem id="rotate-number" />
        <ExampleItem id="custom-cursor" />
        <ExampleItem id="full-width" />
        <ExampleItem id="resize-observer" />
      </ul> */}
    </main>
  );
});
