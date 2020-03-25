interface FilterToken {
    raw: string,
    type?: 'objectIndex' | 'arrayIndex' | 'slice' | 'arrayIterate' | 'pipe',
    optional?: boolean,

    selector?: string,
    arrayIndex?: number,
    start?: number,
    end?: number
}
const tokenRegex = /\.(\[([\s\S]*?)\]|[a-zA-Z]*)?(\?)?|\|/g

function tokenizeFilter(filter: string): FilterToken[]{
    /*
        .           {raw: '.', selector: '*', type: 'objectIndex'}
        .foo        {raw: '.foo', selector: 'foo', type: 'objectIndex'}
        .foo?       {raw: '.foo?', selector: 'foo', optional: true, type: 'objectIndex'}
        .["foo"]    {raw: '.["foo"]', selector: 'foo', type: 'objectIndex'}
        .[2]        {raw: '.[2]', arrayIndex: 2, type: 'arrayIndex'}
        .[10:15]    {raw: '.[10:15]', start: 10, end: 15, type: 'slice'},
        .[]         {raw: '.[]', type: 'arrayIterate'}
        .[]?        {raw: '.[]?', type: 'arrayIterate', optional: true}
        |           {raw: '|', type: 'pipe'}
    */

    
    var matches = filter.match(tokenRegex)
    if(matches)
        return matches.map((match: string): FilterToken => {
            if(match == "|") return {raw: match, type: 'pipe'}

            let token:FilterToken = {raw: match};
            if(match[1] == "[") //Capture between
            {
                var betweenArr = match.match(/\[([\s\S]*?)\]/)
                if(!betweenArr) throw new Error("Error while parsing filter")
                const between = betweenArr[1]
                if(between[0] == "\""){
                    token.type = 'objectIndex'
                    token.selector = between.slice(1,-1)
                    if(match.endsWith("?")) token.optional = true
                    
                }
                else if(between == ""){
                    token.type = 'arrayIterate'
                    if(match.endsWith("?")) token.optional = true
                }
                else if(between.includes(":")){
                    var startFinish = between.split(":")
                    token.type = "slice"
                    token.start = parseInt(startFinish[0])
                    token.end = parseInt(startFinish[1])
                }
                else {
                    token.type = 'arrayIndex'
                    token.arrayIndex = parseInt(between)
                }

                return token


            }else { //Its direct
                token.type = 'objectIndex'
                var selectorMatch = match.match(/[a-zA-Z]+/)
                token.selector = selectorMatch ? selectorMatch[0] : "*"
                if((selectorMatch != null) && match.endsWith("?")) token.optional = true
            }

            return token
        })
    return []
}

interface FilterResult {
    newContext: any,
    iterateContext?: boolean
}

function runFilter(context: any, filter: FilterToken): FilterResult{
    //'slice' | 'arrayIterate'
    if(filter.type == 'pipe' || (filter.type == 'objectIndex' && filter.selector == "*")) return {newContext: context}
    if(filter.type == 'objectIndex'){
        if(!filter.selector) throw new Error("No selector was provided")
        var newContext = context[filter.selector]
        if(newContext) return {newContext}
        if(filter.optional) return {newContext: null}
        throw new Error("Object does not exist on current context")
    }
    if(filter.type == 'arrayIndex'){
        if(!filter.arrayIndex) throw new Error("No array index was provided")
        var newContext = context[filter.arrayIndex]
        if(newContext) return {newContext}
        if(filter.optional) return {newContext: null}
        throw new Error("Object does not exist on current context")
    }
    if(filter.type == 'arrayIterate'){
        return {newContext: context, iterateContext: true}
    }
    if(filter.type == 'slice'){
        return {newContext: (context as Array<any> | string).slice(filter.start, filter.end)}
    }

    return {newContext: null}

}

function evaluateFilters(context: any, filters: FilterToken[]): any{
    if(filters.length == 0) return context
    var filterz = filters.slice()
    var currentFilter: FilterToken = filterz.shift() as FilterToken

    var result = runFilter(context, currentFilter)
    if(result.iterateContext)
        return result.newContext.map((ctx:any) => {
            evaluateFilters(ctx, filterz)
        })
    return evaluateFilters(result.newContext, filterz)
}

export function filter(object: any, filter: string): any{
    var filters = tokenizeFilter(filter)
    return evaluateFilters(object, filters)
}