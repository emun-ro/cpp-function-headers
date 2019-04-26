export interface FunctionParameter {
  name: string
  type: string
  dimensions: number
}

export interface FunctionHeader {
  functionName: string
  returnType: string
  parameters: FunctionParameter[]
}

/*
 * Given a function name, extract the signature (return type, parameters).
 * If there is no function matching with the provided name, null is returned.
 */
export function ExtractFunctionHeader(
  functionName: string,
  cppSource: string
): FunctionHeader | null {
  let regex = `([A-Za-z0-9_]+)[\\n\\r\\s]*${functionName}[\\n\\r\\s]*\((.|\\n|\\s|\\r)*?\)[\\n\\r\\s]*{`
  let match = cppSource.match(regex)
  if (!match) {
    return null
  }
  let paramMatches = match[2]
    .replace('(', '')
    .replace(')', '')
    .split(',')
  let parameters = []
  for (let paramMatch of paramMatches) {
    let paramType = ''
    let paramName = ''
    let foundParamType = false
    let foundParamName = false
    for (let chr of paramMatch) {
      if ([' ', '\n', '\r', '\t'].indexOf(chr) > -1) {
        if (paramType.length > 0) {
          foundParamType = true
        }
        continue
      }
      if (!foundParamType) {
        paramType += chr
      } else if (!foundParamName && chr === '[') {
        foundParamName = true
        paramType += chr
      } else if (!foundParamName) {
        paramName += chr
      } else if (foundParamName) {
        if (chr === '[' || chr === ']' || (chr >= '0' && chr <= '9')) {
          paramType += chr
        }
      }
    }

    // filter empty strings
    if (!paramName) {
      continue
    }

    parameters.push({
      name: paramName,
      type: paramType,
      dimensions: paramType.split('').filter(x => x === '[').length
    })
  }

  return {
    functionName: functionName,
    parameters: parameters,
    returnType: match[1] ? match[1] : 'void'
  }
}
