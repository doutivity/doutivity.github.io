import {createAliasMap} from "./alias_map";

export interface Checkboxes {
    setState(aliases: Array<string>)
    onChange(handler: (state: Array<string>) => void)
}

export class InputCheckboxes implements Checkboxes{
    constructor(private readonly $elements: Array<HTMLInputElement>) {
    }

    setState(aliases: Array<string>) {
        const aliasMap = createAliasMap(aliases, true);

        this.$elements.forEach(function ($element) {
            $element.checked = aliasMap.hasOwnProperty($element.getAttribute("data-alias"));
        })
    }

    onChange(handler: (state: Array<string>) => void) {
        const getState = this.getState.bind(this);

        this.$elements.forEach(function ($element) {
            $element.addEventListener("change", function () {
                handler(getState());
            });
        });
    }

    private getState(): Array<string> {
        const result = new Array<string>();

        this.$elements.forEach(function ($element) {
            if ($element.checked) {
                result.push($element.getAttribute("data-alias"));
            }
        })

        return result;
    }
}

