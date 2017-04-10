/**
 * 动物类
 * @class Animal
 */
class Animal {

    /**
     * Creates an instance of Animal.
     *
     * @memberOf Animal
     */
    constructor() {
        this.name = name; // 动物名
    }


    /**
     *
     * 获取动物品种
     * @returns name
     * @memberOf Animal
     */
    getName() {
        return `This is a ${this.name} animal!`;
    }
}


let dog = new Animal('dog');
dog.getName();
