function createBox(parent, val) {
    const rect = document.createElement('div');
    const rectStyle = rect.style;
    rectStyle.position = 'absolute';
    rectStyle.width = parent.offsetWidth + 2 * val + 'px';
    rectStyle.height = parent.offsetHeight + 2 * val + 'px';
    rectStyle.boxShadow = '0 0 1px 1px rgb(32 32 210)';
    parent.appendChild(rect);
    rectStyle.transform = `translate(-${val}px, -${val}px)`;
}

class CanvasStack {
    constructor(...layers) {
        layers.forEach(layer => {
            this[layer] = document.createElement('canvas').getContext('2d');
        });
    }
    appendTo(parent) {
        createBox(parent, 4);
        createBox(parent, 10);
        const bbox = parent.getBoundingClientRect(parent);
        for(const i in this) {
            parent.appendChild(this[i].canvas);
            this[i].canvas.width = bbox.width;
            this[i].canvas.height = bbox.height;
        }
    }
}

export default CanvasStack;