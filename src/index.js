class MVVM {
    constructor(options) {
        this.$el = options.$el
        this.data = options.data
        if (document.querySelector(this.$el)) {
            const wathcers = new Compiler(this.$el, this)
            new Observer(this.data, wathcers)
        }
    }
}


function Observer(data, watchers) {
    this.observe = function (data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            this.observe(data[key]) //递归深度劫持
        })
    }
    this.defineReactive = function (obj, key, value) {
        let that = this
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                return value
            },
            set(newValue) {
                if (newValue !== value) {
                    that.observe(newValue)
                    value = newValue
                    //重新赋值之后 应该通知编译器
                    watchers.forEach(watcher => {
                        watcher.update(key)
                    })
                }
            }
        })
    }
    this.observe(data)
    console.log(data)
}


function Watcher(child, vm, initKey) {
    this.initKey = initKey
    this.update = function (key) {
        if (key === initKey) {
            compilerTextNode(child, vm, initKey)
        }
    }
}

function Compiler(el, vm) {
    const watchers = []
    this.forDom = function (root) {
        const childrens = root.children
        this.forChildren(childrens)
    }
    this.forChildren = function (children) {
        for (let i = 0; i < children.length; i++) {
            //每个子节点
            let child = children[i];
            //判断child下面有没有子节点,如果还有子节点,那么就继续的遍历
            if (child.children.length !== 0) {
                this.forDom(child);
            } else {
                //将vm与child传入一个新的Watcher中
                let key = child.innerText.replace(/^\{\{/g, "").replace(/\}\}$/g, "")
                let watcher = new Watcher(child, vm, key)
                //初始转换模板
                compilerTextNode(child, vm)
                watchers.push(watcher)
            }
        }
    }
    this.$el = document.querySelector(el)
    this.forDom(this.$el)
    return watchers
}
compilerTextNode = function (child, vm, initKey) {
    if (!initKey) {
        //第一次初始化
        const keyPrev = child.innerText.replace(/^\{\{/g, "").replace(/\}\}$/g, "") //获取key的内容
        if (vm.data[keyPrev]) {
            child.innerText = vm.data[keyPrev]
        } else {
            throw new Error(
                `${key} is not defined`
            )
        }
    } else {
        child.innerText = vm.data[initKey]
    }
}