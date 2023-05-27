import React, {
  HTMLAttributes,
  useContext,
  useMemo,
} from 'react'
import classNames from 'classnames'
import { ButtonProps, CompoundedComponent } from './type'
import { ThemeContext } from '../ThemeProvider'
import { useStyle } from '@kylin-ui/hooks'
import {
  extractThemeConfig,
  omit,
  excludePreset,
} from '@kylin-ui/shared'

const InternalButton: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonProps
> = (props, ref) => {
  /**============================= 设置 props ============================= */
  const {
    type = 'default',
    shape,
    block,
    size,
    beforeIcon,
    afterIcon,
    disabled = false,
    ghost = false,
    loading = false,
    className,
    children,
    htmlType = 'button',
    onClick,
    ...rest
  } = props

  /**============================= 获取 当前主题色 | 自定义主题  ============================= */
  const { theme = {} } = useContext(ThemeContext)

  const shortcuts = useMemo(
    () => extractThemeConfig(theme, 'button', type),
    [theme]
  )
  /**============================= 注入预设(preset)配置  ============================= */
  const preset = process.env.KYLIN_CONFIG?.preset
  // TODO: Distinguish the preset and custom
  const presetClass = useStyle(preset, rest)

  // Omit the props which is not needed
  const restProps = omit(rest, excludePreset(preset))

  /**============================= 设置 className ============================= */

  const classes = classNames(
    // TODO: 判断 type 是否在预期之内
    {
      [`kylin-btn-${type}`]: !ghost && type,
      [`kylin-btn-shape-${shape}`]: shape,
      [`kylin-btn-size-${size}`]: size,
      [`kylin-btn-block`]: block,
      [`kylin-btn-ghost`]: ghost,
      [`kylin-btn-disabled`]: disabled || loading,
      // FLAG: 经过处理后的 Unocss 样式
      ...presetClass,
    },
    className,
    shortcuts ? shortcuts : ''
  )

  const BeforeIcon = () =>
    beforeIcon ? (
      <span className="kylin-btn-icon-before">
        {beforeIcon}
      </span>
    ) : null

  const AfterIcon = () =>
    beforeIcon ? (
      <span className="kylin-btn-icon-after">
        {afterIcon}
      </span>
    ) : null

  const LoadingIcon = () => {
    return loading ? (
      <span className="kylin-btn-loading"></span>
    ) : null
  }

  const IconNode = ({ loading = false, children }) => {
    return (
      <>
        {beforeIcon ? <BeforeIcon /> : null}
        {loading ? <LoadingIcon /> : null}
        {children}
        {afterIcon ? <AfterIcon /> : null}
      </>
    )
  }

  let buttonNode = (
    <button
      type={htmlType}
      className={classes}
      onClick={onClick}
      disabled={!!loading}
      {...restProps}
    >
      <IconNode loading={!!loading}>{children}</IconNode>
    </button>
  )

  return buttonNode
} /**============================= 设置 Button ============================= */
const Button = React.forwardRef<
  HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
  ButtonProps
>(InternalButton as any)

// Button.__KYLIN_BUTTON = true

export { Button }
