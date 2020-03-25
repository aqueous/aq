import { IFormat } from "./IFormat.ts";
import {parseYaml, yamlStringify} from "../deps.ts"
import { color, makeStyle, IANSIEscapeCodes } from "../color.ts";

function styleByType(type: string) : IANSIEscapeCodes{
    if(type == 'key') return makeStyle("blue", false, false, {bold:true})
    if(type == 'keySeparator') return makeStyle("white", false, false, {})
    if(type == 'value') return makeStyle("green", false, false, {})
    return makeStyle("white", false, false, {})
}


export class YAMLFormat extends IFormat {
    IsOfType(object: string): boolean {
        try{
            this.Unmarshal(object)
            return true 
        }catch(e){
            return false
        }
    }
        
    Marshal(object: any, useColor: boolean, compact: boolean): string {
        var yaml = yamlStringify(object)
        if(!useColor) return yaml
        return color(yaml.replace(/(?<key>[a-zA-Z ]+)[\s]*?:/g, function(match){

            //We could do better on highlighting yaml
            return color(match.slice(0,-1), styleByType('key')) + color(":", styleByType('keySeperator'), styleByType('value')[0].styleNumber)
        }),styleByType(""))
    }

    Unmarshal(object: string): any {
        return parseYaml(object)
    }
}
