/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          min: 1,
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <text />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
