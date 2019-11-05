import React, { useEffect, useRef } from 'react'
import getDirection from 'direction'
import { Node, Range, Element as SlateElement, Path } from 'slate'

import Text from './text'
import Children from './children'
import { useEditor } from '../hooks/use-editor'
import { useReadOnly } from '../hooks/use-read-only'
import { SelectedContext } from '../hooks/use-selected'
import {
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_PARENT,
  NODE_TO_INDEX,
} from '../utils/weak-maps'

/**
 * Element.
 */

const Element = (props: {
  annotations: Range[]
  block: SlateElement | null
  decorations: Range[]
  node: SlateElement
  path?: Path
  selection: Range | null
}) => {
  const { annotations, block, decorations, node, selection } = props
  const ref = useRef<HTMLElement>(null)
  const editor = useEditor()
  const readOnly = useReadOnly()
  const isVoid = editor.isVoid(node)
  const isInline = editor.isInline(node)

  let children: JSX.Element | null = (
    <Children
      annotations={annotations}
      block={block}
      decorations={decorations}
      node={node}
      selection={selection}
    />
  )

  // Attributes that the developer must mix into the element in their
  // custom node renderer component.
  const attributes: {
    'data-slate-node': 'element'
    'data-slate-void'?: true
    contentEditable?: false
    dir?: 'rtl'
    ref: any
  } = {
    'data-slate-node': 'element',
    ref,
  }

  // If it's a block node with inline children, add the proper `dir` attribute
  // for text direction.
  if (!isInline && editor.hasInlines(node)) {
    const text = Node.text(node)
    const dir = getDirection(text)

    if (dir === 'rtl') {
      attributes.dir = dir
    }
  }

  // If it's a void node, wrap the children in extra void-specific elements.
  if (isVoid) {
    attributes['data-slate-void'] = true

    if (!readOnly && isInline) {
      attributes['contentEditable'] = false
    }

    const Tag = editor.isInline(node) ? 'span' : 'div'
    const [[text]] = Node.texts(node)
    children = readOnly ? null : (
      <Tag
        data-slate-spacer
        style={{
          height: '0',
          color: 'transparent',
          outline: 'none',
          position: 'absolute',
        }}
      >
        <Text
          annotations={[]}
          block={!isInline ? node : block}
          decorations={[]}
          node={text}
          parent={node}
        />
      </Tag>
    )

    NODE_TO_INDEX.set(text, 0)
    NODE_TO_PARENT.set(text, node)
  }

  // Update element-related weak maps with the DOM element ref.
  useEffect(() => {
    if (ref.current) {
      NODE_TO_ELEMENT.set(node, ref.current)
      ELEMENT_TO_NODE.set(ref.current, node)
    } else {
      NODE_TO_ELEMENT.delete(node)
    }
  })

  const child = editor.renderElement({
    attributes,
    children,
    element: node,
  })

  return (
    <SelectedContext.Provider value={!!selection}>
      {child}
    </SelectedContext.Provider>
  )
}

export default Element