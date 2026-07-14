		let array = [];
        let delay = 200;
        let isSorting = false;
        let compareCount = 0;
        let swapCount = 0;

        const visualizer = document.getElementById('visualizer');
        const arraySizeInput = document.getElementById('arraySize');
        const sizeValue = document.getElementById('sizeValue');
        const algorithmSelect = document.getElementById('algorithmSelect');
        const speedSelect = document.getElementById('speedSelect');
        const startBtn = document.getElementById('startBtn');
        const generateBtn = document.getElementById('generateBtn');

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        function updateCounters() {
            document.getElementById('compareCount').innerText = compareCount;
            document.getElementById('swapCount').innerText = swapCount;
        }

        function generateArray() {
            if (isSorting) return;
            compareCount = 0;
            swapCount = 0;
            updateCounters();
            
            const size = parseInt(arraySizeInput.value);
            sizeValue.innerText = size;
            array = [];
            visualizer.innerHTML = '';

            for (let i = 0; i < size; i++) {
                const val = Math.floor(Math.random() * 90) + 10;
                array.push(val);

                const bar = document.createElement('div');
                bar.classList.add('bar');
                bar.id = `bar-${i}`;
                bar.style.height = `${val * 2.5}px`;

                if (size <= 20) {
                    const valueSpan = document.createElement('span');
                    valueSpan.classList.add('bar-value');
                    valueSpan.innerText = val;
                    bar.appendChild(valueSpan);
                }

                visualizer.appendChild(bar);
            }
        }

        function colorBar(index, className) {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) bar.className = `bar ${className}`;
        }

        function swapBars(index1, index2) {
            const bar1 = document.getElementById(`bar-${index1}`);
            const bar2 = document.getElementById(`bar-${index2}`);
            
            const tempHeight = bar1.style.height;
            bar1.style.height = bar2.style.height;
            bar2.style.height = tempHeight;

            const span1 = bar1.querySelector('.bar-value');
            const span2 = bar2.querySelector('.bar-value');
            if (span1 && span2) {
                const tempText = span1.innerText;
                span1.innerText = span2.innerText;
                span2.innerText = tempText;
            }
        }

        async function runBubbleSort() {
            let n = array.length;
            for (let i = 0; i < n - 1; i++) {
                let swapped = false;
                for (let j = 0; j < n - 1 - i; j++) {
                    colorBar(j, 'comparing');
                    colorBar(j + 1, 'comparing');
                    compareCount++;
                    updateCounters();
                    await sleep(delay);

                    if (array[j] > array[j + 1]) {
                        colorBar(j, 'swapping');
                        colorBar(j + 1, 'swapping');
                        swapCount++;
                        updateCounters();
                        
                        let temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;

                        swapBars(j, j + 1);
                        await sleep(delay);
                        swapped = true;
                    }
                    colorBar(j, '');
                    colorBar(j + 1, '');
                }
                colorBar(n - 1 - i, 'sorted');
                if (!swapped) break;
            }
            for (let i = 0; i < n; i++) colorBar(i, 'sorted');
        }

        async function runSelectionSort() {
            let n = array.length;
            for (let i = 0; i < n - 1; i++) {
                let minIndex = i;
                colorBar(minIndex, 'swapping');

                for (let j = i + 1; j < n; j++) {
                    colorBar(j, 'comparing');
                    compareCount++;
                    updateCounters();
                    await sleep(delay);

                    if (array[j] < array[minIndex]) {
                        if (minIndex !== i) colorBar(minIndex, ''); 
                        minIndex = j;
                        colorBar(minIndex, 'swapping');
                    } else {
                        colorBar(j, ''); 
                    }
                }

                if (minIndex !== i) {
                    swapCount++;
                    updateCounters();
                    let temp = array[i];
                    array[i] = array[minIndex];
                    array[minIndex] = temp;
                    swapBars(i, minIndex);
                    await sleep(delay);
                }
                
                colorBar(minIndex, '');
                colorBar(i, 'sorted');
            }
            colorBar(n - 1, 'sorted');
        }

        async function runInsertionSort() {
            let n = array.length;
            colorBar(0, 'sorted'); 

            for (let i = 1; i < n; i++) {
                let current = array[i];
                let j = i - 1;

                colorBar(i, 'comparing');
                await sleep(delay);

                while (j >= 0 && array[j] > current) {
                    compareCount++;
                    swapCount++;
                    updateCounters();

                    colorBar(j, 'swapping');
                    colorBar(j + 1, 'swapping');
                    
                    array[j + 1] = array[j];
                    swapBars(j, j + 1);
                    await sleep(delay);

                    colorBar(j, 'sorted');
                    colorBar(j + 1, 'sorted');
                    j--;
                }
                array[j + 1] = current;
                colorBar(j + 1, 'sorted');
            }
        }


        function toggleUI(disabled) {
            isSorting = disabled;
            startBtn.disabled = disabled;
            generateBtn.disabled = disabled;
            arraySizeInput.disabled = disabled;
            algorithmSelect.disabled = disabled;
        }


        generateBtn.addEventListener('click', generateArray);
        arraySizeInput.addEventListener('input', generateArray);
        speedSelect.addEventListener('change', () => {
            delay = parseInt(speedSelect.value);
        });

        startBtn.addEventListener('click', async () => {
            if (isSorting) return;
            toggleUI(true);

            delay = parseInt(speedSelect.value);

            const algo = algorithmSelect.value;
            if (algo === 'bubble') {
                await runBubbleSort();
            } else if (algo === 'selection') {
                await runSelectionSort();
            } else if (algo === 'insertion') {
                await runInsertionSort();
            }

            toggleUI(false);
        });

        generateArray();