import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
function loadStories() {
  require("../stories/index.tsx");
}

configure(loadStories, module);
