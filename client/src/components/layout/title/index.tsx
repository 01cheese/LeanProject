import { useRouterContext, TitleProps } from '@pankod/refine-core'
import { Button } from '@pankod/refine-mui'
import { logo, yariga } from 'assets/'
import { ColorModeContext } from 'contexts'

import React, { useContext } from 'react'

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext()
  const { mode } = useContext(ColorModeContext)

  const image = mode === 'dark' ? logo : yariga
  const width = mode === 'dark' ? '28px' : '140px'

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={logo} alt="Yariga" width="28px" />
        ) : (
          <img src={image} alt="yariga" width={width} />
        )}
      </Link>
    </Button>
  )
}
