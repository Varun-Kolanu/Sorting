let stop = false;

async function visualize() {

    let canvas = document.querySelector("canvas");
    let c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 40;

    function generateRandomArray(length, min, max) {
        return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    }

    const numOfElements = document.getElementById("num").value
    const startingPoletX = 100
    const startingPoletY = 20
    const barWidth = ((canvas.width - 2 * startingPoletX) / numOfElements) * 0.8
    const barSpacing = ((canvas.width - 2 * startingPoletX) / numOfElements) * 0.2
    const sort = document.getElementById("sort").value
    const speed = Math.ceil(1000 / document.getElementById("speed").value)

    function rangeArray(start, end) {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    function drawHist(arr, highlightIndex) {
        if (stop) return

        const maxElem = Math.max(...arr)
        c.clearRect(0, 0, canvas.width, canvas.height);

        arr.forEach((elm, index) => {
            let barHeight = (elm / maxElem) * (canvas.height - startingPoletY - 20)
            if (Array.isArray(highlightIndex) && highlightIndex.includes(index)) {
                c.fillStyle = "green";
            }
            else if (index === highlightIndex) {
                c.fillStyle = "green";
            }
            else {
                c.fillStyle = "#757575";
            }
            c.fillRect(startingPoletX + index * (barWidth + barSpacing), canvas.height - startingPoletY, -barWidth, -(barHeight));

            c.fillStyle = '#000';
            c.fillText(elm, startingPoletX + ((index - 1) * (barWidth + barSpacing)) + barWidth / 2, canvas.height - barHeight);
        })
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function insertionSort(v, ms) {
        for (let i = 1; i < v.length; ++i) {
            if (stop) return
            let key = v[i];
            let j = i - 1;
            while (j >= 0 && v[j] > key) {
                if (stop) return
                v[j + 1] = v[j]
                drawHist(v, i)
                await sleep(ms)
                --j;
            }
            v[j + 1] = key
            drawHist(v, j + 1)
            await sleep(ms * 4)
        }
        drawHist(v, -1)
    }

    async function bubble_sort(v, ms) {

        let isSwapped = false;
        for (let i = v.length - 1; i > 0; --i) {
            if (stop) return
            for (let j = 0; j < i; ++j) {
                if (stop) return
                if (v[j] > v[j + 1]) {
                    let temp = v[j]
                    v[j] = v[j + 1];
                    v[j + 1] = temp
                    isSwapped = true;
                    drawHist(v, j + 1)
                    await sleep(ms)
                }
                else {
                    drawHist(v, j)
                    await sleep(ms)
                }
            }
            if (!isSwapped) {
                break;
            }
        }
        drawHist(v, -1)
    }

    async function merge(arr, s, m, e, ms) {
        if (stop) return
        let lsize = m - s + 1;
        let rsize = e - m;
        let total = lsize + rsize;
        let larr = new Array(lsize + 1)
        let rarr = new Array(rsize + 1)
        larr[lsize] = Number.MAX_SAFE_INTEGER;
        rarr[rsize] = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < lsize; i++) {
            if (stop) return
            larr[i] = arr[s + i];
        }
        for (let i = 0; i < rsize; i++) {
            if (stop) return
            rarr[i] = arr[m + i + 1];
        }
        let merged = new Array(lsize + rsize);
        let j = 0, k = 0;
        for (let i = 0; i < total; i++) {
            if (stop) return
            if (larr[j] < rarr[k]) {
                merged[i] = larr[j];
                j++;
            }
            else {
                merged[i] = rarr[k];
                k++;
            }
        }
        for (let i = 0; i < total; i++) {
            if (stop) return
            arr[s + i] = merged[i];
            drawHist(arr, rangeArray(s, e))
            await sleep(ms)
        }
    }

    async function mergeSort(arr, s, e, ms) {
        if (stop) return
        if (s >= e) {
            return;
        }
        let m = Math.floor((s + e) / 2);
        await mergeSort(arr, s, m, ms);
        await mergeSort(arr, m + 1, e, ms);
        await merge(arr, s, m, e, ms);
        drawHist(arr, -1)
        await sleep(ms)
    }

    let arr = generateRandomArray(numOfElements, 1, numOfElements);
    drawHist(arr, -1)
    if (sort === "bubble") {
        bubble_sort(arr, speed)
    }
    else if (sort === "insertion") {
        insertionSort(arr, speed)
    }
    else if (sort === "merge") {
        mergeSort(arr, 0, arr.length - 1, speed)
    }
}

document.getElementById("visualize").addEventListener("click", async (e) => {
    // e.preventDefault()
    stop = true
    setTimeout(() => {
        stop = false
        visualize()
    }, 1000)
})
