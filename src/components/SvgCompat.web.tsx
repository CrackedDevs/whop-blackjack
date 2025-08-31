import React from 'react'

const Svg = ({ width, height, viewBox, children, ...props }: any) => (
  <svg width={width} height={height} viewBox={viewBox} {...props}>
    {children}
  </svg>
)

const Path = ({ d, fill, ...props }: any) => (
  <path d={d} fill={fill} {...props} />
)

const Circle = ({ cx, cy, r, fill, ...props }: any) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} {...props} />
)

export default Svg
export { Path, Circle }