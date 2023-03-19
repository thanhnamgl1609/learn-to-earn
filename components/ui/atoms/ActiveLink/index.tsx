
import Link from "next/link"
import React, { FunctionComponent, memo, ReactElement } from "react"
import { useRouter } from "next/router"

type LinkProps = {
  href: string
  children: ReactElement | string;
  className?: string;
  activeClass: string
}

const ActiveLink: FunctionComponent<LinkProps> = ({children, className = "", activeClass, ...props}) => {
  const { pathname } = useRouter()
  let _defaultClass = `${className} text-gray-100`

  if (pathname === props.href) {
    className = `${className} text-indigo-400 ${activeClass}`
  } else {
    className = _defaultClass;
  }

  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  )
}

export default memo(ActiveLink);
