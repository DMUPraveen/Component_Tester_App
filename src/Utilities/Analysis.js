function movingAverage(arr, windowSize) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        let start = Math.max(0, i - Math.floor(windowSize / 2));
        let end = Math.min(arr.length, i + Math.floor(windowSize / 2) + 1);
        let window = arr.slice(start, end);
        let average = window.reduce((sum, val) => sum + val, 0) / window.length;
        result.push(average);
    }
    return result;
}
export function findEdgeAndShift(arr, triggerValue, edgeType = 'rising') {
    let edgeIndex = -1;

    if (edgeType === 'rising') {
        // Find the rising edge
        for (let i = 1; i < arr.length; i++) {
            if (arr[i - 1] < triggerValue && arr[i] >= triggerValue) {
                edgeIndex = i;
                break;
            }
        }
    } else if (edgeType === 'falling') {
        // Find the falling edge
        for (let i = 1; i < arr.length; i++) {
            if (arr[i - 1] > triggerValue && arr[i] <= triggerValue) {
                edgeIndex = i;
                break;
            }
        }
    } else {
        throw new Error("Invalid edgeType. Use 'rising' or 'falling'.");
    }

    if (edgeIndex === -1) {
        console.log("Edge not found in the array.");
        return arr;
    }

    // Circularly shift the array so that the edge index is at the front
    const shiftedArray = arr.slice(edgeIndex).concat(arr.slice(0, edgeIndex));

    return shiftedArray;
}
export function findEdgeAndShiftLinear(arr, triggerValue, edgeType) {
    arr = movingAverage(arr, 3);
    console.log(edgeType);
    let startLimit = Math.floor(arr.length / 2);
    if (edgeType == 'rising') {
        for (let index = 0; index <= startLimit; index++) {
            if (arr[index] < triggerValue && arr[index + 1] >= triggerValue) {
                return arr.slice(index, index + startLimit);
            }
            // console.log(arr[index], arr[index + 1], triggerValue);

        }
        // throw new Error("Hooray")
        // console.log("not found", arr[0], triggerValue);
    }
    else {
        for (let index = 0; index <= startLimit; index++) {
            if (arr[index] > triggerValue && arr[index + 1] <= triggerValue) {
                return arr.slice(index, index + startLimit);
            }
        }
    }
    // console.log("I am running");
    return arr.slice(startLimit, arr.length);
}


// Example usage: