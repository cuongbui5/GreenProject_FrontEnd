export class DeepSet<T> extends Set<T> {
    add(o: T): this {
        for (let i of this) {
            if (this.deepCompare(o, i)) {
                return this; // Nếu đã tồn tại phần tử tương tự, không thêm
            }
        }
        super.add(o); // Gọi phương thức add của lớp cha
        return this; // Trả về bản thân để hỗ trợ chuỗi phương thức
    }

    private deepCompare(o: T, i: T): boolean {
        return JSON.stringify(o) === JSON.stringify(i); // So sánh hai đối tượng
    }
}
