import mdfind from '..'

describe('mdfind', () => {
  it('does stuff', done => {
    const res = mdfind('kind:contact', {attributes: ['kMDItemDisplayName', 'kMDItemEmailAddresses']})
    res.on('end', done)
  })
})
