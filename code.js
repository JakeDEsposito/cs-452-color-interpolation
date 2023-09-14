let canvas
/** @type {WebGLRenderingContext} */
let gl

function init() {
    canvas = document.getElementById("gl-canvas")

    gl = WebGLUtils.setupWebGL(canvas)

    if (!gl)
        alert("WebGL is not available!")

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)

    gl.clearColor(1, 1, 1, 1)

    allocate()

    document.getElementById("input-range").addEventListener("input", () => {
        draw()
        showRangeValue()
    })

    draw()
    showRangeValue()
}

/**
 * Creates and populates a WebGL buffer with data.
 * @param {any[]} data Data that will be put into the buffer.
 * @param {WebGLBuffer | null} bufferId What buffer to put the data into. Creates a new one if none is provided.
 * @returns {WebGLBuffer} Id of the buffer that the data was put into.
 */
function bindBufferData(data, bufferId) {
    const _bufferId = bufferId || gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, _bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW)
    return _bufferId
}

function getValueFromRange() {
    const { value } = document.getElementById("input-range")

    return parseFloat(value)
}

function colorDataArray() {
    const x = getValueFromRange()

    const light = vec3(x, x, x)
    const dark = vec3(0, 0, 0)

    return [light, dark, dark, light]
}

const showRangeValue = () => document.getElementById("input-range-value").textContent = getValueFromRange()

function allocate() {
    gl.clear(gl.COLOR_BUFFER_BIT)

    const points = [vec2(-1, 1), vec2(-1, -1), vec2(1, -1), vec2(1, 1)]

    const myShaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(myShaderProgram)

    bindBufferData(points)

    const myPosition = gl.getAttribLocation(myShaderProgram, "myPosition")
    gl.vertexAttribPointer(myPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(myPosition)

    colorBufferId = bindBufferData(colorDataArray())

    const myColor = gl.getAttribLocation(myShaderProgram, "myColor")
    gl.vertexAttribPointer(myColor, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(myColor)

    pointsLength = points.length
}

function draw() {
    bindBufferData(colorDataArray(), colorBufferId)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, pointsLength)
}