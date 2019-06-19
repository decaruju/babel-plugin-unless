const expect = require('chai').expect;
const babel = require('babel-core');

const LOG_TEXT = "I'm in.";

describe('babel-plugin-unless', () => {
    context('when using an unless condition', () => {
        context('when the condition is true', () => {
            it('should not execute the code', () => {
                const code = unless('true');

                const logs = buildRun(code);

                expect(logs.length).to.eq(0);
            });
        });

        context('when the condition is false', () => {
            it('should execute the code', () => {
                const code = unless('false');

                const logs = buildRun(code);

                expect(logs.length).to.eq(1);
                expect(logs[0]).to.eq(LOG_TEXT);
            });
        });
    });

    context('when using an unless condition in an unless condition', () => {
        context('when the first one is true', () => {
            context('when the second one is true', () => {
                it('should not execute the code in the first condition', () => {
                    const code = nestedUnless([true, true]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(0);
                });

                it('should not execute the code in the second condition', () => {
                    const code = nestedUnless([true, true]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(0);
                });
            });

            context('when the second one is false', () => {
                it('should not execute the code in the first condition', () => {
                    const code = nestedUnless([true, false]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(0);
                });

                it('should not execute the code in the second condition', () => {
                    const code = nestedUnless([true, false]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(0);
                });
            });
        });

        context('when the first one is false', () => {
            context('when the second one is true', () => {
                it('should execute the code in the first condition', () => {
                    const code = nestedUnless([false, true]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(1);
                    expect(logs[0]).to.eq(LOG_TEXT + 0);
                });

                it('should not execute the code in the second condition', () => {
                    const code = nestedUnless([false, true]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(1);
                });
            });

            context('when the second one is false', () => {
                it('should execute the code in the first condition', () => {
                    const code = nestedUnless([false, false]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(2);
                    expect(logs[0]).to.eq(LOG_TEXT + 0);
                });

                it('should execute the code in the second condition', () => {
                    const code = nestedUnless([false, false]);
                    const logs = buildRun(code);

                    expect(logs.length).to.eq(2);
                    expect(logs[1]).to.eq(LOG_TEXT + 1);
                });
            });
        });
    });
});

function unless(condition) {
    return `
unless (${condition}) {
    console.log("I'm in.");
}`;
}

function nestedUnless(conditions, level = 0) {
    if (conditions.length == 0) return '';
    return `
unless (${conditions[0]}) {
    console.log(${LOG_TEXT}${level}});
    ${nestedUnless(conditions.slice(1), level + 1)}
}`;
}

function buildRun(code) {
    const output = babel.transform(
        code,
        {
            plugins: [
                require.resolve('../src/app.js'),
            ],
        },
    );

    const logs = [];
    const console = {
        log(val) { logs.push(val); },
    };

    eval(output.code);

    return logs;
}
