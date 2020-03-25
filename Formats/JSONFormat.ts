import { IFormat } from "./IFormat.ts";
import { color, makeStyle, IANSIEscapeCodes } from "../color.ts";

function styleByType(type: string) : IANSIEscapeCodes{
    if(type == 'number') return makeStyle("yellow", false, false, {})
    if(type == 'key') return makeStyle("blue", false, false, {bold:true})
    if(type == 'keySeparator') return makeStyle("white", false, false, {})
    if(type == 'string') return makeStyle("green", false, false, {})
    if(type == 'boolean') return makeStyle("magenta", false, false, {})
    if(type == 'null') return makeStyle("red", false, false, {bold: true})
    if(type == 'bracket') return makeStyle("white", false, false, {bold: true})
    return makeStyle("white", false, false, {})
}

export class JSONFormat extends IFormat {
    
    IsOfType(object: string): boolean {
        try{
            this.Unmarshal(object)
            return true 
        }catch(e){
            return false
        }
    }

    Marshal(object: any, useColor: boolean, compact: boolean): string {
        //https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript - take from here!
        const json = JSON.stringify(object, null, compact ? 0 : 2);
        if(!useColor) return json

        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{\[\]}])/g, function (match) {
            
            if(match == '{' || match == '}' || match == '[' || match == ']')
                return color(match, styleByType('bracket'))
            
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                    return color(match.slice(0,-1), styleByType(cls)) + color(":", styleByType(cls+'Seperator'))
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            
            return color(match,styleByType(cls))
        })
        }

    Unmarshal(object: string): any {
        return JSON.parse(object);
    }
}
