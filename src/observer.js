function Dep() {
    //订阅的数组
    this.subs = []
    this.add = function (watcher) {
        this.subs.push(watcher)
    }
    this.notify = function () {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}

function Observer(data) {
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
                    dep.notify()
                }
            }
        })
    }
    this.observe(data)
    console.log(data)
}