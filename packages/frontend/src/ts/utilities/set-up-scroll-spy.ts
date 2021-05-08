export function setUpScrollSpy(options: {
  activeClassName: string
  contentElement: HTMLElement
  menuElement: HTMLElement
  scrollMarginTopOffset: number
  topBarElement: HTMLElement
}): void {
  const {
    activeClassName,
    contentElement,
    menuElement,
    scrollMarginTopOffset,
    topBarElement
  } = options

  function getIdElements(): Array<HTMLElement> {
    return [...contentElement.querySelectorAll<HTMLElement>('[id]')]
  }

  function updateContentElementPaddingBottom() {
    // Set bottom padding on `contentElement` so that the last element with an `id` can be directly scrolled to
    const idElements = getIdElements()
    const element = idElements[idElements.length - 1]
    const paddingBottom =
      window.innerHeight -
      (topBarElement.offsetHeight + scrollMarginTopOffset) -
      (contentElement.offsetHeight - element.offsetTop)
    if (paddingBottom < 0) {
      contentElement.removeAttribute('style')
      return
    }
    contentElement.style.paddingBottom = `${paddingBottom}px`
  }
  updateContentElementPaddingBottom()

  let timeoutId: number
  function handleWindowResize() {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(function () {
      updateContentElementPaddingBottom()
    }, 200)
  }
  window.addEventListener('resize', handleWindowResize)

  function handleWindowScroll() {
    const idElements = getIdElements()

    const activeId = computeActiveId({
      idElements,
      scrollMarginTop: topBarElement.offsetHeight + scrollMarginTopOffset
    })
    updateActiveItem({
      activeClassName,
      element: menuElement,
      id: activeId
    })

    const activeSectionId = computeActiveSectionId({
      activeId,
      idElements
    })
    updateActiveItem({
      activeClassName,
      element: topBarElement,
      id: activeSectionId
    })
  }
  window.addEventListener('scroll', handleWindowScroll)
}

function computeActiveId(options: {
  idElements: Array<HTMLElement>
  scrollMarginTop: number
}): null | string {
  const { idElements, scrollMarginTop } = options
  const reversed = idElements.slice().reverse()
  const scrollY = window.scrollY
  for (const element of reversed) {
    if (element.offsetTop - scrollMarginTop <= scrollY) {
      return element.getAttribute('id')
    }
  }
  return null
}

function computeActiveSectionId(options: {
  activeId: null | string
  idElements: Array<HTMLElement>
}): null | string {
  const { idElements, activeId } = options
  if (activeId === null) {
    return null
  }
  const index = idElements.findIndex(function (element: HTMLElement) {
    return element.getAttribute('id') === activeId
  })
  const sectionIdElement = idElements
    .slice(0, index + 1)
    .reverse()
    .find(function (element: HTMLElement) {
      return element.tagName === 'H1'
    })
  if (typeof sectionIdElement !== 'undefined') {
    return sectionIdElement.getAttribute('id') as string
  }
  const firstHeaderElement = idElements.find(function (element: HTMLElement) {
    return element.tagName === 'H1'
  })
  if (typeof firstHeaderElement === 'undefined') {
    return null
  }
  return firstHeaderElement.getAttribute('id') as string
}

function updateActiveItem(options: {
  element: HTMLElement
  id: null | string
  activeClassName: string
}): void {
  const { element, id, activeClassName } = options
  const previousActiveElement = element.querySelector(`.${activeClassName}`)
  if (previousActiveElement !== null) {
    previousActiveElement.classList.remove(activeClassName)
  }
  if (id === null) {
    return
  }
  const activeElement = element.querySelector(
    `[href="#${id === null ? '' : id}"]`
  )
  if (activeElement === null) {
    return
  }
  activeElement.classList.add(activeClassName)
}