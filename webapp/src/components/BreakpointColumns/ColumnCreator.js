import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const DEFAULT_COLUMNS = 2

const Masonry = ({
  children,
  breakpointCols,
  columnClassName,
  columnAttrs,
  column,
  className,
  ...rest
}) => {
  const [columnCount, setColumnCount] = useState(DEFAULT_COLUMNS)

  const itemsInColumns = () => {
    const itemsInColumns = new Array(
      columnCount > 1 ? columnCount - 1 : columnCount
    )
    let counter = columnCount > 1 ? 1 : 0
    const items = React.Children.toArray(children)

    for (counter; counter < items.length; counter++) {
      const columnIndex = counter % columnCount

      if (!itemsInColumns[columnIndex]) {
        itemsInColumns[columnIndex] = []
      }

      itemsInColumns[columnIndex].push(items[counter])
    }

    return columnCount > 1 ? [items[0], ...itemsInColumns] : itemsInColumns
  }

  const reCalculateColumnCount = () => {
    const windowWidth = (window && window.innerWidth) || Infinity
    let breakpointColsObject = breakpointCols

    if (typeof breakpointColsObject !== 'object') {
      breakpointColsObject = {
        default: parseInt(breakpointColsObject) || DEFAULT_COLUMNS
      }
    }

    let matchedBreakpoint = Infinity
    let columns = breakpointColsObject.default || DEFAULT_COLUMNS

    for (const breakpoint in breakpointColsObject) {
      const optBreakpoint = parseInt(breakpoint)
      const isCurrentBreakpoint =
        optBreakpoint > 0 && windowWidth <= optBreakpoint

      if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
        matchedBreakpoint = optBreakpoint
        columns = breakpointColsObject[breakpoint]
      }
    }

    columns = Math.max(1, parseInt(columns) || 1)

    if (columnCount !== columns) {
      setColumnCount(columns)
    }
  }

  const reCalculateColumnCountDebounce = () => {
    if (!window || !window.requestAnimationFrame) {
      reCalculateColumnCount()

      return
    }

    const _lastRecalculateAnimationFrame = window.requestAnimationFrame(() => {
      reCalculateColumnCount()
    })

    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(_lastRecalculateAnimationFrame)
    }
  }

  const renderColumns = () => {
    const childrenInColumns = itemsInColumns()
    const columnWidth = `${100 / childrenInColumns.length}%`
    let className = columnClassName

    if (typeof className === 'undefined') {
      className = 'my-masonry-grid_column'
    }

    const columnAttributes = {
      ...column,
      ...columnAttrs,
      style: {
        ...columnAttrs.style,
        width: columnWidth
      },
      className
    }

    return childrenInColumns.map((items, i) => {
      return (
        <div {...columnAttributes} key={i}>
          {items}
        </div>
      )
    })
  }

  useEffect(() => {
    let columnCount

    if (!!breakpointCols && breakpointCols.default) {
      columnCount = breakpointCols.default
    } else {
      columnCount = parseInt(breakpointCols) || DEFAULT_COLUMNS
    }

    setColumnCount(columnCount)
    window.addEventListener('resize', reCalculateColumnCountDebounce)
    reCalculateColumnCount()

    return () => {
      window.removeEventListener('resize', reCalculateColumnCountDebounce)
    }
    // eslint-disable-next-line
  }, [])

  let classNameOutput = className

  if (typeof className === 'undefined') {
    classNameOutput = 'my-masonry-grid'
  }

  return (
    <div {...rest} className={classNameOutput}>
      {renderColumns()}
    </div>
  )
}

Masonry.propTypes = {
  breakpointCols: PropTypes.object,
  className: PropTypes.string,
  columnClassName: PropTypes.string,
  children: PropTypes.any,
  columnAttrs: PropTypes.object,
  column: PropTypes.any
}

Masonry.defaultProps = {
  breakpointCols: undefined,
  className: undefined,
  columnClassName: undefined,
  children: undefined,
  columnAttrs: {},
  column: undefined
}

export default Masonry
