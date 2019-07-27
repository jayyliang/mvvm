function Watcher(child, vm) {
    this.update = function () {
        console.log('update')
    }
}

function Compiler(el, vm) {
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
                compilerTextNode(child, vm)
                //将vm与child传入一个新的Watcher中
                new Watcher(child, vm)
            }
        }
    }
    this.$el = document.querySelector(el)
    this.forDom(this.$el)
}
compilerTextNode = function (child, vm) {
    let reg = /\{\{(.*?)\}\}/g;
    const key = Array.from(reg.exec(child.innerText))[1] // console.log(key)//将返回的伪数组转成数组，获取数组的1元素，即为双大括号里面的内容
    if (vm.data[key]) {
        child.innerText = vm.data[key]
    } else {
        throw new Error(
            `${key} is not defined`
        )
    }
}