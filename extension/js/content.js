let ws, progress, params = [];

(async () => {

    await connectWs()

    // 获取 activity
    // ?activity=207041300
    console.log(location.search)
    let r = location.search.match(/\?activity=([\s\S]+)&?/)
    console.log(r)
    let activity = r[1]

    // 获取成绩数据 joinid 和 rn
    const trs = document.querySelectorAll('tbody>tr')
    console.log(trs)

    // 准备数据
    for (let i = 0; i < trs.length; i++) {
        const tr = trs[i]
        params.push({
            activity,
            joinid: tr.getAttribute('jid'),
            rn: tr.children[3].textContent
        })
    }

    console.log(params)

    // 插入元素
    const rightContainer = document.querySelector('.right.head-right')
    const myContainer = document.createElement('div')
    myContainer.className = 'my-container'
    rightContainer.appendChild(myContainer)
    myContainer.innerHTML = `
    <button type="button" class="download-all">批量下载</button>
    `
    progress = document.createElement('div')
    progress.textContent = `0/${params.length}`
    myContainer.appendChild(progress)

    const savePath = document.createElement('input')
    savePath.placeholder = '请输入保存路径'
    savePath.value = 'D:/'
    savePath.className = 'save-path'
    myContainer.appendChild(savePath)

    const btn = document.querySelector('.my-container .download-all')


    btn.addEventListener('click', ev => {
        console.log('click')
        fetch('http://127.0.0.1:8996/download', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({params, savePath: savePath.value})
        }).then(res => res.text()).then(data => {
            console.log(data)
            alert('下载完成')
        })
    })

})()

function connectWs() {
    return new Promise(resolve => {
        ws = new WebSocket('ws://127.0.0.1:8996/progress')
        ws.addEventListener('open', () => {
            resolve()
        })
        ws.addEventListener('message', messageHandler)
    })
}

function messageHandler(ev) {
    console.log(ev.data)
    progress.textContent = `${ev.data}/${params.length}`
}
