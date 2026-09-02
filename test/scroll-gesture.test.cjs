const assert = require("assert");
const {
    MIN_SCROLL_DURATION_MS,
    NORMAL_SCROLL_DURATION_MS,
    ScrollIntentQueue,
    WheelGestureInterpreter,
    getScrollQueueDuration,
    getScrollStepDuration
} = require("../src/scroll-gesture.cjs");

function directionsFor(events, options) {
    const interpreter = new WheelGestureInterpreter(options);
    return events
        .map((event) => interpreter.input(event))
        .filter((direction) => direction !== 0);
}

assert.deepStrictEqual(
    directionsFor([
        {deltaY: 4, timestamp: 0},
        {deltaY: 12, timestamp: 16},
        {deltaY: 20, timestamp: 32},
        {deltaY: 8, timestamp: 48},
        {deltaY: 2, timestamp: 64}
    ]),
    [1],
    "one inertial touchpad burst must become one logical input"
);
assert.deepStrictEqual(
    directionsFor([
        {deltaY: 64, timestamp: 0},
        {deltaY: 48, timestamp: 16},
        {deltaY: 32, timestamp: 32},
        {deltaY: 20, timestamp: 48}
    ]),
    [1],
    "a high-momentum pixel burst must remain one logical input"
);
assert.deepStrictEqual(
    directionsFor(Array.from({length: 9}, (_, index) => ({
        deltaY: 10,
        timestamp: index * 16
    }))),
    [1, 1],
    "sustained touchpad scrolling must produce another queued input"
);

assert.deepStrictEqual(
    directionsFor([
        {deltaY: 10, timestamp: 0},
        ...Array.from({length: 8}, (_, index) => ({
            deltaY: -10,
            timestamp: (index + 1) * 16
        }))
    ]),
    [1, -1],
    "sustained opposite scrolling must queue a reversal"
);

assert.deepStrictEqual(
    directionsFor([
        {deltaY: 6, timestamp: 0},
        {deltaY: 10, timestamp: 16},
        {deltaY: -8, timestamp: 32},
        {deltaY: -4, timestamp: 48}
    ]),
    [1],
    "direction changes inside one touchpad burst must not reverse it"
);

assert.deepStrictEqual(
    directionsFor([
        {deltaY: 8, timestamp: 0},
        {deltaY: 8, timestamp: 16},
        {deltaY: 8, timestamp: 200},
        {deltaY: 8, timestamp: 216},
        {deltaY: 8, timestamp: 400}
    ]),
    [1, 1, 1],
    "distinct touchpad bursts must queue one input each"
);

assert.deepStrictEqual(
    directionsFor([
        {deltaY: 100, timestamp: 0},
        {deltaY: 100, timestamp: 40},
        {deltaY: -100, timestamp: 80}
    ]),
    [1, 1, -1],
    "discrete wheel notches must remain separate inputs"
);

assert.deepStrictEqual(
    directionsFor([
        {deltaY: 1, deltaMode: 1, timestamp: 0},
        {deltaY: 1, deltaMode: 1, timestamp: 40},
        {deltaY: -1, deltaMode: 1, timestamp: 80}
    ]),
    [1, 1, -1],
    "line-mode wheel notches must remain separate inputs"
);
assert.deepStrictEqual(
    directionsFor([
        {deltaY: 1, deltaMode: 2, timestamp: 0},
        {deltaY: 1, deltaMode: 2, timestamp: 40},
        {deltaY: -1, deltaMode: 2, timestamp: 80}
    ]),
    [1, 1, -1],
    "page-mode wheel notches must remain separate inputs"
);

const queue = new ScrollIntentQueue(9);
for (let i = 0; i < 5; i += 1) {
    assert.strictEqual(queue.request(1), true);
}
assert.strictEqual(queue.targetIndex, 5, "same-direction inputs must queue to the intended target");
assert.strictEqual(queue.request(-1), true);
assert.strictEqual(queue.request(-1), true);
assert.strictEqual(queue.targetIndex, 3, "opposite inputs must reverse queued movement");
assert.strictEqual(queue.nextStep(), 1);
assert.strictEqual(queue.pendingSteps, 2);
assert.strictEqual(queue.nextStep(), 2);
assert.strictEqual(queue.nextStep(), 3);
assert.strictEqual(queue.nextStep(), null);

const endpoints = new ScrollIntentQueue(2);
for (let i = 0; i < 10; i += 1) {
    endpoints.request(1);
}
assert.strictEqual(endpoints.targetIndex, 2, "downward queue must clamp at the final card");
for (let i = 0; i < 10; i += 1) {
    endpoints.request(-1);
}
assert.strictEqual(endpoints.targetIndex, 0, "upward queue must clamp at the first card");
const timingQueue = new ScrollIntentQueue(9);
for (let i = 0; i < 10; i += 1) {
    timingQueue.request(1);
}
let queuedStepCount = 0;
while (timingQueue.nextStep() !== null) {
    queuedStepCount += 1;
}
assert.strictEqual(queuedStepCount, 9, "ten inputs at the endpoint must produce nine scroll steps");
assert.ok(
    getScrollQueueDuration(queuedStepCount) <= 2000,
    "the coordinator's ten-input queue must digest within two seconds"
);
assert.strictEqual(getScrollQueueDuration(0), 0);
assert.strictEqual(getScrollStepDuration(0), NORMAL_SCROLL_DURATION_MS);
assert.ok(getScrollStepDuration(9) >= MIN_SCROLL_DURATION_MS);
assert.ok(getScrollStepDuration(9) < getScrollStepDuration(1));

console.log("Validated logical wheel gestures, queue reversal, endpoint clamping, and backlog timing.");
