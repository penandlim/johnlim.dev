const DEFAULT_GESTURE_TIMEOUT_MS = 140;
const DEFAULT_DISCRETE_DELTA_THRESHOLD = 80;
const NORMAL_SCROLL_DURATION_MS = 800;
const QUEUED_SCROLL_BASE_MS = 500;
const MIN_SCROLL_DURATION_MS = 100;
const SCROLL_DRAIN_DEBOUNCE_MS = 50;

class WheelGestureInterpreter {
    constructor({
        gestureTimeoutMs = DEFAULT_GESTURE_TIMEOUT_MS,
        discreteDeltaThreshold = DEFAULT_DISCRETE_DELTA_THRESHOLD
    } = {}) {
        this.gestureTimeoutMs = gestureTimeoutMs;
        this.discreteDeltaThreshold = discreteDeltaThreshold;
        this.activeGesture = null;
    }

    reset() {
        this.activeGesture = null;
    }

    input({deltaY, deltaMode = 0, timestamp}) {
        if (!Number.isFinite(deltaY) || deltaY === 0) {
            return 0;
        }

        const now = Number.isFinite(timestamp) ? timestamp : 0;
        const direction = deltaY > 0 ? 1 : -1;
        const isDiscrete = deltaMode !== 0 || Math.abs(deltaY) >= this.discreteDeltaThreshold;
        const activeGesture = this.activeGesture;

        if (!activeGesture || now < activeGesture.lastTimestamp || now - activeGesture.lastTimestamp > this.gestureTimeoutMs) {
            this.activeGesture = {direction, isDiscrete, lastTimestamp: now};
            return direction;
        }

        activeGesture.lastTimestamp = now;

        if (activeGesture.isDiscrete) {
            return direction;
        }

        return 0;
    }
}

class ScrollIntentQueue {
    constructor(maxIndex = 0) {
        this.maxIndex = Math.max(0, maxIndex);
        this.currentIndex = 0;
        this.targetIndex = 0;
    }

    setBounds(maxIndex) {
        this.maxIndex = Math.max(0, maxIndex);
        this.currentIndex = this.clamp(this.currentIndex);
        this.targetIndex = this.clamp(this.targetIndex);
    }

    reset(index = this.currentIndex) {
        const clampedIndex = this.clamp(index);
        this.currentIndex = clampedIndex;
        this.targetIndex = clampedIndex;
    }

    request(direction) {
        if (direction !== 1 && direction !== -1) {
            return false;
        }

        const nextTarget = this.clamp(this.targetIndex + direction);
        if (nextTarget === this.targetIndex) {
            return false;
        }

        this.targetIndex = nextTarget;
        return true;
    }

    nextStep() {
        if (this.currentIndex === this.targetIndex) {
            return null;
        }

        this.currentIndex += this.currentIndex < this.targetIndex ? 1 : -1;
        return this.currentIndex;
    }

    get pendingSteps() {
        return Math.abs(this.targetIndex - this.currentIndex);
    }

    clamp(index) {
        return Math.min(Math.max(index, 0), this.maxIndex);
    }
}

function getScrollStepDuration(pendingSteps) {
    if (!Number.isFinite(pendingSteps) || pendingSteps <= 0) {
        return NORMAL_SCROLL_DURATION_MS;
    }

    return Math.max(
        MIN_SCROLL_DURATION_MS,
        Math.round(QUEUED_SCROLL_BASE_MS / (pendingSteps + 1))
    );
}
function getScrollQueueDuration(stepCount) {
    if (!Number.isFinite(stepCount) || stepCount <= 0) {
        return 0;
    }

    let duration = 0;
    for (let pendingSteps = Math.floor(stepCount) - 1; pendingSteps >= 0; pendingSteps -= 1) {
        duration += getScrollStepDuration(pendingSteps);
    }
    return duration;
}

module.exports = {
    DEFAULT_GESTURE_TIMEOUT_MS,
    DEFAULT_DISCRETE_DELTA_THRESHOLD,
    NORMAL_SCROLL_DURATION_MS,
    QUEUED_SCROLL_BASE_MS,
    MIN_SCROLL_DURATION_MS,
    SCROLL_DRAIN_DEBOUNCE_MS,
    WheelGestureInterpreter,
    ScrollIntentQueue,
    getScrollStepDuration,
    getScrollQueueDuration
};
