interface IANSIEscapeCode {
    styleNumber: number,
}

export interface IANSIEscapeCodes extends Array<IANSIEscapeCode> { }

interface IANSIStyle {
    bold?:boolean,
    italic?: boolean,
    underline?: boolean,
    strikeThrough?: boolean
}

const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']

export function makeStyle( 
    color: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white',
    bright:boolean,
    background: boolean,
    style: IANSIStyle ): IANSIEscapeCodes{

    const escapeCodes:IANSIEscapeCodes = []

    escapeCodes.push({
        styleNumber: colors.indexOf(color) + (bright? 60 : 0) + (background? 10: 0) + 30
    })


    if(style.bold) escapeCodes.push({styleNumber: 1})
    if(style.italic) escapeCodes.push({styleNumber: 3})
    if(style.underline) escapeCodes.push({styleNumber: 4})
    if(style.strikeThrough) escapeCodes.push({styleNumber: 9})

    

    return escapeCodes
}

export var useColor: boolean = true

export function color(value: string, styles: IANSIEscapeCodes):string{
    if(!useColor) return value
    const escapeSequence = "\u001b[%sm";
    const escapedStyles = styles.map( s => escapeSequence.replace("%s", s.styleNumber.toString())).join('')
    const reset = escapeSequence.replace("%s", "0")
    return escapedStyles + value + reset
}