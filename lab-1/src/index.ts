console.log(`
Usage:
triangle(value1, type1, value2, type2)

Types:
"leg"
"hypotenuse"
"adjacent angle"
"opposite angle"
"angle"

Angles must be in degrees.
`);

function triangle(
    value1: number = 3,
    type1: string = "leg",
    value2: number = 4,
    type2: string = "leg"
): string {

    const validTypes = [
        "leg",
        "hypotenuse",
        "adjacent angle",
        "opposite angle",
        "angle",
    ];

    if (!validTypes.includes(type1) || !validTypes.includes(type2)) {
        console.log("Please read the instruction again. Invalid type.");
        return "failed";
    }

    if (value1 <= 0 || value2 <= 0) {
        return "All values must be positive.";
    }

    let a: number | undefined;
    let b: number | undefined;
    let c: number | undefined;
    let alpha: number | undefined;
    let beta: number | undefined;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const assignLeg = (val: number) => {
        if (a === undefined) a = val;
        else b = val;
    };

    const process = (value: number, type: string) => {
        if (type === "leg") assignLeg(value);
        if (type === "hypotenuse") c = value;
        if (type === "angle") alpha = value;
        if (type === "adjacent angle") beta = value;
        if (type === "opposite angle") alpha = value;
    };

    process(value1, type1);
    process(value2, type2);

    if (alpha !== undefined && alpha >= 90) return "Angles must be acute.";
    if (beta !== undefined && beta >= 90) return "Angles must be acute.";

    if (a !== undefined && b !== undefined) {
        c = Math.sqrt(a * a + b * b);
        alpha = toDeg(Math.atan(a / b));
        beta = 90 - alpha;
    } else if (a !== undefined && c !== undefined) {
        if (a >= c) return "Leg must be smaller than hypotenuse.";
        b = Math.sqrt(c * c - a * a);
        alpha = toDeg(Math.asin(a / c));
        beta = 90 - alpha;
    } else if (c !== undefined && alpha !== undefined) {
        if (alpha >= 90) return "Angle must be acute.";
        a = c * Math.sin(toRad(alpha));
        b = c * Math.cos(toRad(alpha));
        beta = 90 - alpha;
    } else if (a !== undefined && alpha !== undefined) {
        if (alpha >= 90) return "Angle must be acute.";
        c = a / Math.sin(toRad(alpha));
        b = Math.sqrt(c * c - a * a);
        beta = 90 - alpha;
    } else {
        console.log("Please read the instruction again. Incompatible types.");
        return "failed";
    }

    console.log(`a = ${a?.toFixed(4)}`);
    console.log(`b = ${b?.toFixed(4)}`);
    console.log(`c = ${c?.toFixed(4)}`);
    console.log(`alpha = ${alpha?.toFixed(4)}°`);
    console.log(`beta = ${beta?.toFixed(4)}°`);

    return "success";
}

triangle();