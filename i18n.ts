import {info} from './info.ts'

/**
 * A big object containing all our internationalization
 */
const languages: I18N = {
    english: {
        unknownOption: '${this.executable}: unknown option ${this.flag}',
        useHelp: 'Use ${this.executable} --help for help with command-line options',
        helpMessage: [
            '${this.executable} - commandline JSON, YAML and TOML processor [version ${this.info.version}]',
            'Usage: ${this.executable} [options] <filter> [file]',
            '',
            ...[
                'Aqueous (${this.executable}) is a tool for processing many input types, applying a given filter to its inputs,',
                'and responding with the filter\'s results as the given format (JSON by default)',
                '',
                'Options:',
                ...[
                    {
                        flags: ['--help'],
                        description: 'Displays this help message'
                    },
                    {
                        flags: ['--compact', '-c'],
                        description: 'Compact mode'
                    },
                    {
                        flags: ['--json', '-j'],
                        description: 'Outputs in JSON'
                    },
                    {
                        flags: ['--toml', '-t'],
                        description: 'Outputs in TOML'
                    },
                    {
                        flags: ['--yaml', '-y'],
                        description: 'Outputs in YAML'
                    },
                    {
                        flags: ['--color', '-c'],
                        description: 'Output in color'
                    }
                ].map(z=> z.flags.join(", ").padEnd(20,' ') + z.description)
            ].map(z=>'\t' + z)
        ].join('\n'),
        formatNotDetected: 'format error: Could not detect format of input',
        formatNoMatch: 'format error: Format of input does not match ${this.format}'
    }
}


//Actual code

interface I18NLanguage {
    unknownOption: string,
    useHelp: string,
    helpMessage: string,
    formatNotDetected: string,
    formatNoMatch: string,
    [key: string]: string
}

interface I18N {
    english: I18NLanguage,
    [key: string]: I18NLanguage
}

const language: string = 'english' //I have no idea how to update this dynamically Sorry 😶

const baseTemplate = {
    executable: 'aq',
    info: info
}

export function i18n(key: string, template?: any) : string{
    let myLanguage: I18NLanguage = languages[language];
    let str: string = myLanguage[key];
    
    return new Function("return `" + str + "`;").call({...template, ...baseTemplate})
}
