function getEffect(id){
    return layers.b.clickables[id].effect()
}
function getTimeSpeed(){
    var timespeed = n(1)
    timespeed = timespeed.mul(getEffect(12))
    return timespeed
}
addLayer("b", { //这是代码中的节点代码 例如player.p可以调用该层级的数据 尽量使用顺手的字母什么的 不建议数字开头
    symbol: "B", // 这是节点上显示的字母
    position: 0, // 节点顺序
    startData() { return {
        unlocked: true, //是否开始就解锁
		points: new ExpantaNum(0),
		producing: null,
        //row 1
		m: new ExpantaNum(10000),
		e: new ExpantaNum(0),
		am: new ExpantaNum(10000),
        s: new ExpantaNum(1),
        a: new ExpantaNum(0),
        t: new ExpantaNum(0),
    }},
    color: "lime",
    resource: "平衡点", // 重置获得的资源名称
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return true},
    effectDescription(){return `宇宙开始扩张...<br>心情不好做的 自闭了就关了吧<br>请勿让任何物体膨胀至无限大,否则会导致宇宙塌缩.`},
    clickables:{
        11:{
            display(){
            return `开始生成物质(^1.03/s)...
            物质数:${format(player.b.m)}
            物质每秒/${format(layers.b.clickables[11].decay()[1])}
            `},
            onClick(){
                player.b.producing = this.id
            },
            decay(){
                var am = player.b.am
                am = am.div(getEffect(14))
                am = powsoftcap(am,n(1e6),0.5)
                var decay = am.root(80)
                return ["div",decay]
            },
            gain(){
                var gain = n(1.03)
                return ["pow",gain]
            },
            thing:"m",
            canClick:true,
            style(){return {"background-color":player.b.producing==this.id?"gold":"lime"}},
            unlocked(){return true},
        },
        12:{
            display(){
            return `开始发生能量(+${format(this.passive()[1])}/s)...
            能量:${format(player.b[this.thing])}
            能量每秒/${format(layers.b.clickables[this.id].decay()[1])}
            时间变快${format(this.effect())}倍
            基于物质/反物质的最小值
            `},
            onClick(){
                player.b.producing = this.id
            },
            decay(){
                var decay = player.b.e.root(16)
                return ["div",decay]
            },
            passive(){
                var gain = player.b.m.min(player.b.am).div(100000)
                return ["add",gain]
            },
            effect(){
                var effect = player.b.e.add(1).log10().add(1)
                return effect
            },
            thing:"e",
            canClick:false,
            unlocked(){return player.b.points.gte(5)},
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
        13:{
            display(){
            return `开始生成反物质(^1.03/s)...
            反物质数:${format(player.b.am)}
            反物质每秒/${format(layers.b.clickables[13].decay()[1])}
            `},
            onClick(){
                player.b.producing = this.id
            }, 
            decay(){
                var m = player.b.m
                m = powsoftcap(m,n(1e6),0.5)
                m = m.div(getEffect(14))
                var decay = m.root(80)
                return ["div",decay]
            },
            gain(){
                var gain = n(1.03)
                return ["pow",gain]
            },
            thing:"am",
            canClick:true,
            style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            },
            unlocked(){return true},
        },
        14:{
            display(){
            return `开始出现空间(x${format(this.passive()[1])}/s)...
            空间:${format(player.b[this.thing])}
            空间每秒/${format(layers.b.clickables[this.id].decay()[1])}
            反物质/物质的衰减基于原来/${format(this.effect())}的数量
            基于反物质和物质的最大值
            `},
            onClick(){
                player.b.producing = this.id
            },
            decay(){
                var decay = player.b.s.root(25)
                return ["div",decay]
            },
            passive(){
                var gain = player.b.m.max(player.b.am).log10().pow(5).div(100000).add(1)
                gain = gain.root(getEffect(21))
                return ["mul",gain]
            },
            effect(){
                var effect = player.b.s.root(2)
                return effect
            },
            thing:"s",
            canClick:false,
            unlocked(){return player.b.points.gte(15)},
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
        21:{
            display(){
            return `开始出现陨石(+${format(this.gain()[1])}/s)...
            陨石:${format(player.b[this.thing])}
            陨石每秒/${format(layers.b.clickables[this.id].decay()[1])}
            空间产量开${format(this.effect())}次根
            基于空间,物质
            `},
            onClick(){
                player.b.producing = this.id
            },
            decay(){
                var decay = player.b.a.add(1).root(120)
                return ["div",decay]
            },
            gain(){
                var gain = player.b.m.log10().mul(player.b.s.log10().pow(1.6)).div(10)
                return ["add",gain]
            },
            effect(){
                var effect = player.b[this.thing].div(10).add(1).log10().div(2).add(1)
                return effect
            },
            thing:"a",
            canClick:true,
            unlocked(){return player.b.points.gte(35)},
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
        22:{
            display(){
            return `开始出现时间(+${format(this.passive()[1])}/s)...
            时间:${format(player.b[this.thing])}
            时间速率*${format(this.effect())}
            `},
            onClick(){
                player.b.producing = this.id
            },
            passive(){
                var gain = n(1)
                return ["add",gain]
            },
            effect(){
                var effect = player.b.t.div(10).add(1).pow(0.2)
                return effect
            },
            thing:"t",
            canClick:false,
            unlocked(){return player.b.points.gte(60)},
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
    },
    update(diff){
        if(player.b.m.isInfinite() || player.b.am.isInfinite() || player.b.m.isNaN() || player.b.m.isNaN()){
            layerDataReset(this.layer)
            player.points = n(0)
        }
        if(!player.b.producing) return
        diff = getTimeSpeed().mul(diff)
        player.b.points = player.b.points.max(player.b.m.min(player.b.am).log10().sub(4).mul(10))
        let clickables = this.clickables
        let producing = clickables[player.b.producing]
        if(producing.gain){
            let gain = producing.gain()
            if(gain[0] == "add") player.b[producing.thing] = player.b[producing.thing][gain[0]](gain[1].mul(diff))
            else player.b[producing.thing] = player.b[producing.thing][gain[0]](gain[1].pow(diff))
        }
        for(i in clickables){
            if(isNaN(Number(i))) break
            let clickable = clickables[i]
            if(clickable.unlocked()){
                if(clickable.passive){
                    let passive = clickable.passive()
                    if(passive[0] == "add") player.b[clickable.thing] = player.b[clickable.thing][passive[0]](passive[1].mul(diff))
                    else player.b[clickable.thing] = player.b[clickable.thing][passive[0]](passive[1].pow(diff))
                }
                if(clickable.decay){
                    let decay = clickable.decay()
                    if(decay[0] == "add") player.b[clickable.thing] = player.b[clickable.thing][decay[0]](decay[1].mul(diff))
                    else player.b[clickable.thing] = player.b[clickable.thing][decay[0]](decay[1].pow(diff))
                }
            }
        }
        
    }
})


//save:
/*
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
*/
