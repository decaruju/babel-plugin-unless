const babylon = require('babylon');

export default function({types}) {
    const nodes = {
        

    };
    return {
        visitor: {
            Program(path) {
                path.traverse({});
            },
        },
    };
};
