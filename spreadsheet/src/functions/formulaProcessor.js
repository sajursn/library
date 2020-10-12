export default function FormulaProcessor(expression) {
    const calculationObject = {
        operation: "",
        columnArray: []
    };
    const columnArray = [];
    if (
        expression.match(
            /^=(sum|mul|diff|add|prod|sub|max|min)\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/i
        )
    ) {
        const RegCode = /^=(sum|mul|diff|add|prod|sub|max|min)\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/i;
        const exp = RegCode.exec(expression);
        const parameter1 = exp.groups.one;
        const parameter2 = exp.groups.more;
        if (parameter1.match(/^(c\d*?)$/i)) {
            const RegCode1 = /^c(?<column>\d*?)$/i;
            const exper1 = RegCode1.exec(parameter1);
            columnArray.push(Number(exper1.groups.column));
        }
        if (parameter2.length > 3) {
            const moreParameters = parameter2.split(",");
            moreParameters.forEach((item) => {
                if (item.match(/^(c\d*?)$/i)) {
                    const RegCodes = /^c(?<column>\d*?)$/i;
                    const expers = RegCodes.exec(item);
                    columnArray.push(Number(expers.groups.column));
                }
            });
        } else if (parameter2.match(/^(c\d*?)$/i)) {
            const RegCode2 = /^c(?<column>\d*?)$/i;
            const exper2 = RegCode2.exec(parameter2);
            columnArray.push(Number(exper2.groups.column));
        }
    }

    if (columnArray.length > 1) {
        if (
            expression.match(
                /^=(sum|add)\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/i
            )
        ) {
            calculationObject.operation = "SUM";
        } else if (
            expression.match(
                /^=(diff|sub)\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/i
            )
        ) {
            calculationObject.operation = "DIFF";
        } else if (
            expression.match(
                /^=(mul|prod)\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/i
            )
        ) {
            calculationObject.operation = "MUL";
        } else if (
            expression.match(/^=max\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/i)
        ) {
            calculationObject.operation = "MAX";
        } else if (
            expression.match(/^=min\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/i)
        ) {
            calculationObject.operation = "MIN";
        }
        calculationObject.columnArray = [...columnArray];
        return calculationObject;
    }
    return [];
}
