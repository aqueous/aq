import { IFormat } from "./IFormat.ts";
import {parseToml, tomlStringify} from "../deps.ts"
import { color, makeStyle, IANSIEscapeCodes } from "../color.ts";


function styleByType(type: string) : IANSIEscapeCodes{
    if(type == 'array') return makeStyle("blue", false, false, {bold:true})
    if(type == 'bracket') return makeStyle("white", false, false, {bold: true})
    if(type == 'key') return makeStyle("blue", false, false, {bold:true})
    if(type == 'keySeparator') return makeStyle("white", false, false, {bold: true})
    if(type == 'value') return makeStyle("green", false, false, {})
    return makeStyle("white", false, false, {})
}


export class TOMLFormat extends IFormat {
    IsOfType(object: string): boolean {
        try{
            this.Unmarshal(object)
            return true 
        }catch(e){
            return false
        }
    }
        
    Marshal(object: any, useColor: boolean, compact: boolean): string {
        var toml = tomlStringify(object)
        if (!useColor) return toml

        return toml.replace(/[a-zA-Z_" ]+[\s]*?=|\[+[a-zA-Z_]+\]+/g, function(match: string){
            if(match.startsWith("[")){ 
                var openingBrackets = match.slice(match.indexOf("["),match.lastIndexOf("[")+1)
                var closingBrackets = match.slice(match.indexOf("]"),match.lastIndexOf("]")+1)
                
                return [
                    color(openingBrackets, styleByType('bracket')),
                    color(match.slice(openingBrackets.length,-closingBrackets.length), styleByType('array')),
                    color(closingBrackets, styleByType('bracket'))
                ].join('')
            }
            return color(match.slice(0,-1), styleByType('key')) + color(match[match.length-1], styleByType('keySeperator'))
        })
        
    }

    Unmarshal(object: string): any {
        return parseToml(object)
    }
}
