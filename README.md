# node-mdfind
Node module for searching OSX Spotlight, using the built-in `mdfind` shell command.

## Installation

```sh
npm install mdfind
```

## Example

```js
var mdfind = require('mdfind')

var res = mdfind({query:'kind:contact', attributes: ['kMDItemDisplayName', 'kMDItemEmailAddresses'], limit: 2})
res.output.on('data', console.log)
res.output.on('end', function () {console.log('**done**')})

/*
{ kMDItemPath: '/Users/myuser/Library/Application Support/AddressBook/Sources/some_guid/Metadata/some_guid1:ABPerson.abcdp',
  kMDItemDisplayName: 'Steve Jobs'
  kMDItemEmailAddresses: [ 'sjobs@apple.com' ] }
{ kMDItemPath: '/Users/myuser/Library/Application Support/AddressBook/Sources/some_guid/Metadata/some_guid2:ABPerson.abcdp',
  kMDItemDisplayName: 'Bill Gates',
  kMDItemEmailAddresses: [ 'billg@microsoft.com' ] }
**done**
*/
```

## Docs

`mdfind` is a single function which accepts a single `options` argument, which can include the following options. These are parallels of the arguments to the `mdfind` command, so check run `man mdfind` to see more details.

- `query`: String
  * This can use operators, wildcards, kind specifiers, and more. See `man mdfind`
- `attributes`: [String]
  * Array of attributes that should be collected for each match. Note that `kMDItemPath` is exported for every file and does not need to be manually specified.
- `limit`: Integer
  * Maximum number of results to return
- `directories`: [String]
  * Array of directory paths to limit the search to
- `names`: [String]
  * Array of filenames (without paths) to limit the search to
- `interpret`: Boolean
  * Force the provided query string to be interpreted as if the user had typed the string into the Spotlight menu.  For example, the `query` string `search` would produce the following query string: `(* = search* cdw || kMDItemTextContent = search* cdw)`

Note that the `live` option, while supported by the shell command, is not currently supported.

The `mdfind` function returns object with two keys:

- `output` this is a Stream that outputs objects. Each file found will be passed to the `data` handler as an object with keys for all specified `attributes`.
- `terminate` is a function which can be called to stop the search at any time.
