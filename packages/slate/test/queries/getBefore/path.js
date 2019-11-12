/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return editor.getBefore([1, 0])
}

export const output = { path: [0, 0], offset: 3 }
