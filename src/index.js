import _ from 'lodash'
import {spawn} from 'child_process'
import {map, split, through} from 'event-stream'

function extractData (attrs, line) {
  let splitLine = [line]
  for (let attr of attrs) {
    const lastBit = splitLine[splitLine.length - 1]
    const searchFor = `   ${attr} = `
    const thisIndex = lastBit.indexOf(searchFor)
    if (thisIndex === -1) {
      console.log(`Something went wrong with Spotlight Source - line: ${line} - attr: ${attr}`)
      return {}
    }
    const endIndex = thisIndex + searchFor.length

    splitLine.splice(splitLine.length - 1, 1, lastBit.substring(0, thisIndex), lastBit.substring(endIndex))
  }

  const adjustedLine = splitLine.map(getItem)

  const keys = ['path'].concat(attrs)
  const result = _.zipObject(keys, adjustedLine)
  this.emit('data', result)
}

function getItem (item) {
  if (item === '(null)') {
    return null
  } else if (_.startsWith(item, '(\n    "') && _.endsWith(item, '"\n)')) {
    const actual = item.slice(7, -3)
    const lines = actual.split('",\n    "')
    return lines
  } else {
    return item
  }
}

function filterEmpty (data, done) {
  if (data === '') {
    done()
  } else {
    done(null, data)
  }
}

export default function mdfind (query, {attributes = [], names = [], directories = [], live = false} = {}) {
  const dirArgs = makeArgs(directories, '-onlyin')
  const nameArgs = makeArgs(names, '-name')
  const attrArgs = makeArgs(attributes, '-attr')

  const args = ['-0'].concat(dirArgs, nameArgs, attrArgs, [query], live ? ['-live', '-reprint'] : [])

  const child = spawn('mdfind', args)
  const jsonify = _.partial(extractData, attributes)

  return {
    output: child.stdout
      .pipe(split('\0'))
      .pipe(map(filterEmpty))
      .pipe(through(jsonify)),
    terminate: () => child.kill()
  }
}

function makeArgs(array, argName) {
  return _.chain(array)
    .map(item => [argName, item])
    .flatten()
    .value()
}
