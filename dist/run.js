// DOM
/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById('game');
/**
 * @type CanvasRenderingContext2D 
 */
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// WASM
let wasm_memory = null;

// i8
function get_memory() {
    return wasm_memory ? new Int8Array(wasm_memory.buffer) : new Int8Array;
}

function read_string(ptr, size) {
    return new TextDecoder('utf-8').decode(get_memory().subarray(ptr, ptr + size));
}

// i16
function get_memory_i16() {
    return wasm_memory ? new Int16Array(wasm_memory.buffer) : new Int16Array;
}   

function read_memory_i16(ptr, size) {
    return get_memory_i16().subarray(ptr / 4, ptr / 4 + size);
}

function read_array_i16(ptr, size) {
    return [...(read_memory_i16(ptr, size))];
}

// i32
function get_memory_i32() {
    return wasm_memory ? new Int32Array(wasm_memory.buffer) : new Int32Array;
}

function read_memory_i32(ptr, size) {
    return get_memory_i32().subarray(ptr / 4, ptr / 4 + size);
}

function read_array_i32(ptr, size) {
    return [...(read_memory_i32(ptr, size))];
}

function TODO(...args) {
    console.assert(false, args);
}

// Initialize
await WebAssembly.instantiateStreaming(fetch('rust_wasm_bg.wasm'), {
    wbg: {
        __wbg_log_f8567a19025fbe2f: function(ptr, size) {
            console.log(read_string(ptr, size));
        },
        __wbg_DrawRect_00a9636fd3f2ce7c: function(x, y, width, height, cptr, csize) {
            const prevStyle = ctx.fillStyle;
            const color = read_array_i32(cptr, csize);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = prevStyle;
        }, 
        __wbg_GetWidth_8cd03a321ae35183: () => WIDTH,
        __wbg_GetHeight_6ef8007392a4734b: () => HEIGHT
    }
}).then(({ instance: { exports } }) => {
    wasm_memory = exports.memory;
    window.wasm_memory = wasm_memory;
    window.main = exports.main;
    exports.main();
});

// assignments dev
window.get_memory = get_memory;
window.read_string = read_string;

window.get_memory_i16 = get_memory_i16;
window.read_memory_i16 = read_memory_i16;
window.read_array_i16 = read_array_i16;

window.get_memory_i32 = get_memory_i32;
window.read_memory_i32 = read_memory_i32;
window.read_array_i32 = read_array_i32;
