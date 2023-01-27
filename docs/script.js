let cfg = {
    isGrained: false,
    isTransparent: false,
    depth: {
        value: 10,
        min: 2,
        max: 10,
    },
    density: {
        value: 5,
        min: 2,
        max: 10,
    },
    point: {
        value: 2,
        min: 1,
        max: 5,
    },
    height: {
        value: 135,
        min: 1,
        max: 155,
    },
    solidity: {
        value: 97,
        min: 90,
        max: 99,
    },
};

let screen = document.getElementById('screen');
let scr = screen.getContext('2d');
scr.fillStyle = 'rgb(92, 207, 176)';

let btnGrain = document.querySelector('#grain');
btnGrain.innerHTML = cfg.isGrained ? 'hi-res' : 'lo-res';

let btnTransparent = document.querySelector('#transparent');
btnTransparent.innerHTML = cfg.isTransparent ? 'opaque' : 'transparent';

const handleSliderConfig = (propertyName) => {
    const selector = '#' + propertyName;
    let node = document.querySelector(selector);
    node.min = cfg[propertyName].min;
    node.max = cfg[propertyName].max;
    node.value = cfg[propertyName].value;
    return node;
};

let rangeDepth = handleSliderConfig('depth');
let rangeDensity = handleSliderConfig('density');
let rangePoint = handleSliderConfig('point');
let rangeHeight = handleSliderConfig('height');
let rangeSolidity = handleSliderConfig('solidity');

const plot = (x, y) => scr.fillRect(x * 2, 545 - y * 2, cfg.point.value, cfg.point.value);

const grain = (fn) => cfg.isGrained ? Math.round(fn) : fn;

const graph = (config) => {
    scr.clearRect(0, 0, screen.width, screen.height);
    let m = new Array(450).fill(0);
    let a = Math.cos(Math.PI / config.depth.value);
    let e, c, d, z, x1, y1;
    for (let y = 1; y <= 230; y = y + config.density.value) {
        e = a * y;
        c = y - 115;
        c = c * c;
        for (let x = 1; x <= 230; x++) {
            d = x - 115;
            z = config.height.value * Math.exp((config.solidity.value - 101) * 0.0001 * (c + d * d));
            x1 = grain(x + e);
            y1 = grain(z + e);
            if (y1 >= m[Math.round(x1)]) {
                m[Math.round(x1)] = y1;
                plot(x1, y1);
            } else {
                config.isTransparent && plot(x1, y1);
            }
        }
    }
}

graph({ ...cfg });

const handleBtn = ({
    propertyName,
    buttonNode,
    nameTrue,
    nameFalse,
}) => {
    cfg[propertyName] = !cfg[propertyName];
    graph(cfg);
    buttonNode.innerHTML = cfg[propertyName] ? nameTrue : nameFalse;
};

btnGrain.addEventListener('click', () =>
    handleBtn({
        propertyName: 'isGrained',
        buttonNode: btnGrain,
        nameTrue: 'hi-res',
        nameFalse: 'lo-res',
    })
);

btnTransparent.addEventListener('click', () =>
    handleBtn({
        propertyName: 'isTransparent',
        buttonNode: btnTransparent,
        nameTrue: 'opaque',
        nameFalse: 'transparent',
    })
);

const handleRange = (event, propertyName) => {
    cfg[propertyName].value = parseInt(event.target.value);
    graph(cfg);
};

rangeDepth.addEventListener('change', (e) => handleRange(e, 'depth'));
rangeDensity.addEventListener('change', (e) => handleRange(e, 'density'));
rangePoint.addEventListener('change', (e) => handleRange(e, 'point'));
rangeHeight.addEventListener('change', (e) => handleRange(e, 'height'));
rangeSolidity.addEventListener('change', (e) => handleRange(e, 'solidity'));