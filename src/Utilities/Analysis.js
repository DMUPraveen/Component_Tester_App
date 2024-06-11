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

// Example usage: