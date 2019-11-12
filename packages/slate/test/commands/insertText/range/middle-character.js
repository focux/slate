/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        w<cursor />ord
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wa<cursor />ord
      </block>
    
  </value>
)
