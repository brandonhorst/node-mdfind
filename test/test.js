import mdfind from '..'

const res = mdfind({query:'kind:contact', attributes: ['kMDItemDisplayName', 'kMDItemEmailAddresses'], limit: 10})
res.output.on('data', console.log)
res.output.on('end', () => console.log('done'))
