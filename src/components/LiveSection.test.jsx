import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LiveSection from './LiveSection'

describe('LiveSection', () => {
  it('renders nothing until real dates exist', () => {
    const { container } = render(<LiveSection />)
    expect(container).toBeEmptyDOMElement()
  })
})
