import { parse ,ArgParsingOptions, lines} from "./deps.ts";
import {i18n} from './i18n.ts'
import {IFormat, TOMLFormat, JSONFormat, YAMLFormat} from './Formats/index.ts'
import { filter } from "./filter.ts";
import {color, makeStyle} from "./color.ts"

const arguementParserOptions : ArgParsingOptions = {
  unknown: (i) => {
      if((i as string)[0] != '-') return true
    console.error(i18n('unknownOption', {flag: i}))
    console.error(i18n('useHelp'))
    Deno.exit(-1)
    return false;
  },
  boolean: [
    'compact',
    'help',
    'json',
    'toml',
    'yaml',
    'color',
    ],
  alias: {
      'compact': 'c',
      'help': 'h',
      'toml': 't',
      'yaml': 'y',
      'json': 'j',
      'color': 'C'
  }

}

const argments = parse(Deno.args, arguementParserOptions);

if(argments['help']){
    console.error(i18n('helpMessage'))
    Deno.exit(0);
}
if(argments["_"].length == 0)
{
    console.error(i18n(''))
    Deno.exit(-4)
}

const userFilter = argments["_"].shift() as string

let inputFiles: Deno.File[] = []

if(argments["_"].length == 0)
    inputFiles = [Deno.stdin]
else
    inputFiles = []

let outputFormat: IFormat = new JSONFormat();
if(argments['json']) outputFormat = new JSONFormat()
else if(argments['toml']) outputFormat = new TOMLFormat()
else if(argments['yaml']) outputFormat = new YAMLFormat()


inputFiles.forEach(async file => {
    const file_lines: string[] = [];
    for await(const line of lines(file)){
        file_lines.push(line)
    }
    const input = file_lines.join('\n')
    
    
    let format: IFormat;

    var detectedFormat = [new JSONFormat(), new TOMLFormat(), new YAMLFormat()].find(f => f.IsOfType(input))
    if(detectedFormat)
        format = detectedFormat
    else{
        console.error(i18n('formatNotDetected'))
        Deno.exit(-2)
    }

    

    if(!format.IsOfType(input)) {
        console.error(i18n('formatNoMatch', {format: format.constructor.name}))
        Deno.exit(-3)
    }

    var object:any = format.Unmarshal(input)

    var filtered:any = filter(object, userFilter)

    var marshaled = outputFormat.Marshal(filtered, argments['color'], argments['compact'])
    console.log(marshaled)

});
