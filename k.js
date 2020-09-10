//k-means
var test_config = {
    max_klen:3,
    vector_len:100,
    width:700,
    height:680,
    max_iter:5,
    ks:[]
}

async function start(canvasID){
    document.getElementById("msg").style.visibility="hidden"
    test_config.max_iter = parseInt(document.getElementById("max_iter").value) || 5
    test_config.vector_len = parseInt(document.getElementById("vector_len").value) || 100
    test_config.max_klen = parseInt(document.getElementById("max_klen").value) || 3
    
    test_config.stage = document.getElementById(canvasID).getContext("2d")
    
    //随机数据
    test_config.vectors = []

    //生成随机数据
    for(let i=0;i<test_config.vector_len;i++){
        let i_head = Math.ceil(Math.random()*test_config.width)
        let j_head = Math.ceil(Math.random()*test_config.height)
        test_config.vectors.push([i_head,j_head])
    }
    
    //随机k
    test_config.ks = []

    //生成随机k
    for(let i=0;i<test_config.max_klen;i++){
        let i_head = Math.ceil(Math.random()*test_config.width)
        let j_head = Math.ceil(Math.random()*test_config.height)
        test_config.ks.push({
            k:[i_head,j_head],
            childs:[]
        })
    }

    //开始迭代
    var ok = false
    while(!ok){

        //遍历节点并入簇
        test_config.vectors.map(item=>{
            var k = test_config.ks[0].k,
            n = Math.abs(item[0] - k[0]) + Math.abs(item[1]-k[1]),
            id =0

            test_config.ks.map((kt,index)=>{
                let _n = Math.abs(item[0] - kt.k[0]) + Math.abs(item[1]-kt.k[1])
                if (_n < n) {
                    k = kt
                    n = _n
                    id = index
                }
            })
            test_config.ks[id].childs.push(item)
        })

        //重绘
        await draw()
        

        //更改根据节点均值，修改k的位置
        test_config.ks.map((item,index)=>{
            let i_head=0,j_head=0,max = item.childs.length
            item.childs.map(v=>{
                i_head += v[0]
                j_head += v[1]
            })
            test_config.ks[index].childs = []
            test_config.ks[index].k = [i_head/max,j_head/max]
        })
        
        //迭代次数
        test_config.max_iter--
        if(test_config.max_iter <= 0){
            ok=true
        }
    }
    document.getElementById("msg").style.visibility="visible"
}

async function draw(){
    test_config.stage.clearRect(0,0,test_config.width,test_config.height)
    await Promise.all(test_config.ks.map(async (item,index)=>{

        test_config.stage.beginPath();
        test_config.stage.fillStyle="#dd0000"
        test_config.stage.arc(item.k[0], item.k[1], 6, 0, Math.PI*2, 1)
        test_config.stage.fill()

        await Promise.all(item.childs.map(async (child)=>{
            test_config.stage.beginPath();
            test_config.stage.fillStyle="#000000"
            test_config.stage.arc(child[0], child[1], 6, 0, Math.PI*2, 1)
            test_config.stage.fill()
            test_config.stage.closePath()

            test_config.stage.beginPath();
            test_config.stage.strokeStyle ="#dd0000"
            test_config.stage.moveTo(item.k[0], item.k[1]);
            test_config.stage.lineTo(child[0], child[1]);
            test_config.stage.stroke();
            test_config.stage.closePath()
           await wait(.5) 
        }))
        test_config.stage.closePath()
    }))
    
}

function wait(second) {
    return new Promise(function(r,j){
        setTimeout(r,second*1e3)
    })
}