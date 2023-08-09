const generateName = require("../Utils/Utils")

test("generate unique slug name" ,() => {
    expect(
        generateName("Hello")
    ).not.toBe("Hello");
})