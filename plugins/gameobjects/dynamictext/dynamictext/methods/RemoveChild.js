var RemoveChild = function (bob) {
    this.poolManager.free(bob);
    RemoveItem(this.children.list, bob);
    this.lastAppendedChildren.length = 0;
    this.lastOverChild = null;
    this.dirty = true;
    return this;
}

export default RemoveChild;