const babylon = require('babylon');

export default function({types}) {
  return {
    visitor: {
      Program(path) {
        path.traverse({});
      },
    },
  };
};
