import { BREAKPOINT_XXL } from './breakpoints'
import { setUpToc } from './utilities/set-up-toc'
import { setUpTocToggleButton } from './utilities/set-up-toggle-button'

function main(): void {
  const tocVisibleClassName = '--toc-visible'
  const tocItemActiveClassName = 'toc__item--active'

  const tocElement = document.querySelector('[data-js="toc"]') as Element
  const toggleButtonElement = document.querySelector(
    '[data-js="toc-toggle-button"]'
  ) as Element
  const contentElement = document.querySelector(
    '[data-js="content"]'
  ) as Element

  setUpTocToggleButton(toggleButtonElement, tocElement, {
    breakpoint: BREAKPOINT_XXL,
    tocVisibleClassName
  })
  setUpToc(tocElement, contentElement, {
    breakpoint: BREAKPOINT_XXL,
    tocItemActiveClassName,
    tocVisibleClassName
  })
}
main()
