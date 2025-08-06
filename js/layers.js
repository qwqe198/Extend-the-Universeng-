function getEffect(id) {
    return layers.b.clickables[id].effect()
}
function getTimeSpeed() {
    var ts = n(1)
    ts = ts.mul(getEffect(12))
    if (hasUpgrade("p", 12)) ts = ts.mul(1.1)
if (hasUpgrade("p", 14)&&player.b.points.lt(60)) ts = ts.mul(upgradeEffect("p", 14))
if (hasUpgrade("p", 14)&&player.b.points.gte(60)) ts = ts.div(upgradeEffect("p", 14))
    return ts
}
addLayer("b", { //这是代码中的节点代码 例如player.p可以调用该层级的数据 尽量使用顺手的字母什么的 不建议数字开头
    symbol: "B", // 这是节点上显示的字母
    position: 0, // 节点顺序
    start() {
        var s = new ExpantaNum(10000)
      if(hasUpgrade("p",13))s=s.mul(upgradeEffect("p", 13))
        return s
    },
 
    startData() {
        return {
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
        }
    },

    color: "#4B4C83",
    resource: "平衡点", // 重置获得的资源名称
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown() { return true },
    effectDescription() { return `宇宙开始扩张...请勿让任何物质小于1,否则会导致宇宙塌缩.<br>标注c的资源要点击才能生成，且只能同时生成一个<br>第一次到60平衡点会解锁新层级` },
    clickables: {
        11: {
            display() {
                return `c开始生成物质(^1.03/s)...
            物质数:${format(player.b.m)}
            物质每秒/${format(layers.b.clickables[11].decay()[1])}
            `},
            onClick() {
                player.b.producing = this.id
            },
            decay() {
                var root = n(80)
                if (hasUpgrade("p", 11)) root = n(100)
                var am = player.b.am
                am = am.div(getEffect(14))
                am = powsoftcap(am, n(1e6), 0.5)
                var decay = am.root(root)
                return ["div", decay]
            },
            gain() {
                var gain = n(1.03)
                return ["pow", gain]
            },
            thing: "m",
            canClick: true,
            style() { return { "background-color": player.b.producing == this.id ? "gold" : "lime" } },
            unlocked() { return true },
        },
        12: {
            display() {
                return `开始发生能量(+${format(this.passive()[1])}/s)...
            能量:${format(player.b[this.thing])}
            能量每秒/${format(layers.b.clickables[this.id].decay()[1])}
            时间变快${format(this.effect())}倍
            基于物质/反物质的最小值
            `},
            onClick() {
                player.b.producing = this.id
            },
            decay() {
                var decay = player.b.e.root(16)
                return ["div", decay]
            },
            passive() {
                var gain = player.b.m.min(player.b.am).div(100000)
                return ["add", gain]
            },
            effect() {
                var effect = player.b.e.add(1).log10().add(1)
                return effect
            },
            thing: "e",
            canClick: false,
            unlocked() { return player.b.points.gte(5) },
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
        13: {
            display() {
                return `c开始生成反物质(^1.03/s)...
            反物质数:${format(player.b.am)}
            反物质每秒/${format(layers.b.clickables[13].decay()[1])}
            `},
            onClick() {
                player.b.producing = this.id
            },
            decay() {
                var root = n(80)
                if (hasUpgrade("p", 11)) root = n(100)
                var m = player.b.m
                m = powsoftcap(m, n(1e6), 0.5)
                m = m.div(getEffect(14))
                var decay = m.root(root)
                return ["div", decay]
            },
            gain() {
                var gain = n(1.03)
                return ["pow", gain]
            },
            thing: "am",
            canClick: true,
            style() {
                return { "background-color": player.b.producing == this.id ? "gold" : "lime" }
            },
            unlocked() { return true },
        },
        14: {
            display() {
                return `开始出现空间(x${format(this.passive()[1])}/s)...
            空间:${format(player.b[this.thing])}
            空间每秒/${format(layers.b.clickables[this.id].decay()[1])}
            反物质/物质的衰减基于原来/${format(this.effect())}的数量
            基于反物质和物质的最大值
            `},
            onClick() {
                player.b.producing = this.id
            },
            decay() {
                var decay = player.b.s.root(25)
                return ["div", decay]
            },
            passive() {
                var gain = player.b.m.max(player.b.am).log10().pow(5).div(100000).add(1)
                gain = gain.root(getEffect(21))
                return ["mul", gain]
            },
            effect() {
                var effect = player.b.s.root(2)
                return effect
            },
            thing: "s",
            canClick: false,
            unlocked() { return player.b.points.gte(15) },
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
        21: {
            display() {
                return `c开始出现陨石(+${format(this.gain()[1])}/s)...
            陨石:${format(player.b[this.thing])}
            陨石每秒/${format(layers.b.clickables[this.id].decay()[1])}
            空间产量开${format(this.effect())}次根
            基于空间,物质
            `},
            onClick() {
                player.b.producing = this.id
            },
            decay() {
                var decay = player.b.a.add(1).root(120)
                return ["div", decay]
            },
            gain() {
                var gain = player.b.m.log10().mul(player.b.s.log10().pow(1.6)).div(10)
                return ["add", gain]
            },
            effect() {
                var effect = player.b[this.thing].div(10).add(1).log10().div(2).add(1)
                return effect
            },
            thing: "a",
            canClick: true,
            unlocked() { return player.b.points.gte(35) },
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
        22: {
            display() {
                return `开始出现时间(+${format(this.passive()[1])}/s)...
            时间:${format(player.b[this.thing])}
            时间速率*${format(this.effect())}
            `},
            onClick() {
                player.b.producing = this.id
            },
            passive() {
                var gain = n(1)
                return ["add", gain]
            },
            effect() {
                var effect = player.b.t.div(10).add(1).pow(0.2)
                return effect
            },
            thing: "t",
            canClick: false,
            unlocked() { return player.b.points.gte(60) },
            /* style(){
                return {"background-color":player.b.producing==this.id?"gold":"lime"}
            }, */
        },
    },
    update(diff) {

        if ((player.b.m.lt(1) || player.b.am.lt(1))&&player.b.points.lt(60)) {
            layerDataReset(this.layer)
            player.points = n(0)
        }
 if ((player.b.m.lt(1) || player.b.am.lt(1))&&player.b.points.gte(60)) {
            doReset("p")
        }
        if (!player.b.producing) return
        diff = getTimeSpeed().mul(diff)
        player.b.points = player.b.points.max(player.b.m.min(player.b.am).log10().sub(4).mul(10))
        let clickables = this.clickables
        let producing = clickables[player.b.producing]
        if (producing.gain) {
            let gain = producing.gain()
            if (gain[0] == "add") player.b[producing.thing] = player.b[producing.thing][gain[0]](gain[1].mul(diff))
            else player.b[producing.thing] = player.b[producing.thing][gain[0]](gain[1].pow(diff))
        }
        for (i in clickables) {
            if (isNaN(Number(i))) break
            let clickable = clickables[i]
            if (clickable.unlocked()) {
                if (clickable.passive) {
                    let passive = clickable.passive()
                    if (passive[0] == "add") player.b[clickable.thing] = player.b[clickable.thing][passive[0]](passive[1].mul(diff))
                    else player.b[clickable.thing] = player.b[clickable.thing][passive[0]](passive[1].pow(diff))
                }
                if (clickable.decay) {
                    let decay = clickable.decay()
                    if (decay[0] == "add") player.b[clickable.thing] = player.b[clickable.thing][decay[0]](decay[1].mul(diff))
                    else player.b[clickable.thing] = player.b[clickable.thing][decay[0]](decay[1].pow(diff))
                }
            }
        }

    }
})
addLayer("p", { //这是代码中的节点代码 例如player.p可以调用该层级的数据 尽量使用顺手的字母什么的 不建议数字开头
    symbol: `P`, // 这是节点上显示的字母
    position: 0, // 节点顺序
    startData() {
        return {
            unlocked: true, //是否开始就解锁
            points: new ExpantaNum(0),
        }
    },
    onPrestige(resettingLayer) {
        player.b.m = n(layers.b.start())
player.b.am = n(layers.b.start())
    },
    requires() { return new ExpantaNum("60") },
    color: "lime",
    resource: "混沌点", // 重置获得的资源名称
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    passiveGeneration() {



        return 0
    },

    exponent: 0.25,
    baseAmount() { return player.b.points },//基础资源数量
    baseResource: "平衡点",//基础资源名称
    gainMult() { // 资源获取数量倍率
        mult = new ExpantaNum(1)

        return mult
    },
    gainExp() { // 资源获取指数加成(与exponent相乘)
        var exp = new ExpantaNum(1)

        return exp
    },
    layerShown() { return player.b.points.gte(60) || player.p.points.gte(1) || hasUpgrade("p", 11) },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    upgrades: {
        11: {
            description: "削弱物质与反物质互相湮灭除数(开80次根->开100次根).",
            cost() { return new ExpantaNum(1) },
            unlocked() { return true },

        },
        12: {
            description: "时间速率x1.1.",
            cost() { return new ExpantaNum(1) },
            unlocked() { return hasUpgrade("p", 11) },

        },
        13: {
            description: "在混沌点重置后，初始正反物质基于混沌点增加.",
            cost() { return new ExpantaNum(1) },
            effect() {
                var eff = player.p.points.add(1)
                return eff
            },
            effectDisplay() { return `x ${format(this.effect())}` },
            unlocked() { return hasUpgrade("p", 12) },

        },
 14: {
            description: "时间速率基于平衡点变化.",
effect() {
                var eff = player.b.points.add(10).log10()
                return eff
            },
            effectDisplay() { return player.b.points.gte(60)?`/ ${format(this.effect())}`:`x ${format(this.effect())}` },
            cost() { return new ExpantaNum(1) },
            unlocked() { return hasUpgrade("p", 13) },

        },
15: {
            description: "解锁变数（制作中）.",
            cost() { return new ExpantaNum(1) },
            unlocked() { return hasUpgrade("p", 14) },

        },
    },



})
