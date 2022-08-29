
/** 设置项与其对应的函数 */
const matchObj = {
    '#': showTip,
    '#bg': setBg,
    '#bgl': setLocalBg,
    '#eng': setEngine,
    '#pos': setPosition,
    '#trp': setBgTrp,
    '#pre': setPreImg,
    '#vl': setLocalVideo
}

/** 输入文本带有#时，判断要设置的选项，跳转到对应方法 */
function setting(text) {
    tip.innerHTML = ''
    // 如果满足类似#bg xxx这种正常格式
    if (/^#.+\s+.+/.test(box.value)) {
        text = text.replace(/\s+/g, ' ')
        let arr = text.split(' ')
        matchObj[arr[0]](arr[1])
    } else {
        // 非正常格式有#,#bg等
        matchObj[text] && matchObj[text]()
    }
}

/** 初始化设置 */
function initSetting() {
    let str = localStorage.getItem('customSetting')
    let obj = str ? JSON.parse(str) : {}
    // 初始化背景
    if (!obj.bg || (obj.bg.slice(0, 4) !== 'http' && obj.bg.slice(0, 22) !== 'data:image/jpeg;base64')) {
        body.style.background = `url('image/bg.jpg') 50% 50%/cover`;
    } else {
        body.style.background = `url(${obj.bg}) 50% 50%/cover`;
    }
    // 初始化引擎
    engine = obj.engine ? path[obj.engine] ? obj.engine : 'baidu' : 'baidu'
    // 初始化搜索位置
    if (obj.position == '2') {
        layoutChange()
    }
    // 初始化背景透明度
    const num = parseFloat(obj.trp)
    if (num.toString() === 'NaN' || num > 1 || num < 0) {
        wrap.style.backgroundColor = 'rgba(0,0,0,0)'
    } else {
        wrap.style.backgroundColor = `rgba(0,0,0,${num})`
    }
}

/**
 * 设置背景图，格式#bg 图片链接
 * 
 * 只有#bg代表设置默认图片
 */
function setBg(param) {
    let str = localStorage.getItem('customSetting')
    let obj = str ? JSON.parse(str) : {}
    if (!param || (param.slice(0, 4) !== 'http' && param.slice(0, 5) !== 'data:')) {
        body.style.background = `url('image/bg.jpg') 50% 50%/cover`
        obj.bg = ''
    } else {
        body.style.background = `url(${param}) 50% 50%/cover`
        obj.pre = obj.bg ? obj.bg : ''
        obj.bg = param
    }
    localStorage.setItem('customSetting', JSON.stringify(obj))
    showTip('背景设置成功')
}

/**
 * 设置背景——选用本地图片，格式#bgl
 * 
 * l时local的意思
 */
function setLocalBg() {
    const bgls = document.getElementsByClassName('bgl')
    if (bgls.length) {
        wrap.removeChild(bgls[0])
        return
    }
    let el = document.createElement('div');
    el.classList.add('bgl')
    el.innerHTML = `<input type="file" name="img" id="file"\
     accept="image/jpeg,image/jpg,image/png" onchange="fileImport()"></input>`
    wrap.appendChild(el)
}

/**
 * 设置背景透明度，格式#trp xx
 * 
 * 取值0-1，不写或写错默认为0
 */
function setBgTrp(param) {
    let str = localStorage.getItem('customSetting')
    let obj = str ? JSON.parse(str) : {}
    const num = parseFloat(param)
    if (num.toString() === 'NaN' || num > 1 || num < 0) {
        wrap.style.backgroundColor = 'rgba(0,0,0,0)'
        obj.trp = ''
    } else {
        wrap.style.backgroundColor = `rgba(0,0,0,${param})`
        obj.trp = param
    }
    localStorage.setItem('customSetting', JSON.stringify(obj))
    showTip('背景透明度设置成功')
}

/**
 * 设置搜索引擎，格式#eng xxx
 * 
 * 设置的参数需要与已设置的对应，不然会设置失败
 */
function setEngine(param) {
    let str = localStorage.getItem('customSetting')
    let obj = str ? JSON.parse(str) : {}
    if (param) {
        if (path[param]) {
            engine = param
            obj.engine = param
            localStorage.setItem('customSetting', JSON.stringify(obj))
            showTip(`搜索引擎已设置为${param ? param : 'baidu'}`)
        } else {
            showTip(`暂不支持此引擎，如需设置，请自行修改代码`)
        }
    } else {
        engine = 'baidu'
        obj.engine = 'baidu'
        localStorage.setItem('customSetting', JSON.stringify(obj))
        showTip(`搜索引擎已设置为baidu`)
    }
}

/** 设置input框的位置，格式#pos xx */
function setPosition(param) {
    let str = localStorage.getItem('customSetting')
    let obj = str ? JSON.parse(str) : {}
    if (!param) {
        obj.position = '1'
        localStorage.setItem('customSetting', JSON.stringify(obj))
        return
    }
    if (obj.position == param) {
        showTip('默认输入位置设置成功')
        return
    }
    if (param != '1' && param != '2') {
        showTip('设置无效，请正确输入1或2')
        return
    }
    obj.position = param
    localStorage.setItem('customSetting', JSON.stringify(obj))
    layoutChange()
    showTip('默认输入位置设置成功')
}

/** 切换到上一张图片 */
function setPreImg(val) {
    if (val) return
    let str = localStorage.getItem('customSetting')
    let obj = str ? JSON.parse(str) : {}
    if (obj.pre) {
        body.style.background = `url(${obj.pre}) 50% 50%/cover`;
        [obj.bg, obj.pre] = [obj.pre, obj.bg];
        localStorage.setItem('customSetting', JSON.stringify(obj))
        showTip('背景设置成功')
    } else {
        showTip('没有上一张图片哦')
    }
}

/** 播放视频 */
function setLocalVideo() {
    const vl = document.getElementsByClassName('vl');
    const videos = document.getElementsByTagName('video');
    if (vl.length) {
        vl[0].remove();
        videos[0].remove();
    } else {
        const div = document.createElement('div');
        const video = document.createElement('video');
        div.classList.add('vl');
        div.innerHTML = `<input type="file" name="video" id="video"\
            accept="video/mp4,image/flv,image/MKV" onchange="getVideo()"></input>`;
        div.appendChild(video);
        wrap.appendChild(div);
    }
}
