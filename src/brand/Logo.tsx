import type { SVGProps } from 'react'

export type LogoVariant = 'full' | 'stacked' | 'icon'

type LogoProps = {
  variant?: LogoVariant
  className?: string
}

const sign = 'M42 5.5h10a2 2 0 0 1 2 2V15H40V7.5a2 2 0 0 1 2-2Z'

const body =
  'M18 13h36a7 7 0 0 1 7 7v8a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5V20a7 7 0 0 1 7-7Zm-.25 4.5h12.5A1.75 1.75 0 0 1 32 19.25v5.5A1.75 1.75 0 0 1 30.25 26.5h-12.5A1.75 1.75 0 0 1 16 24.75v-5.5A1.75 1.75 0 0 1 17.75 17.5Zm19 0h8.5A1.75 1.75 0 0 1 47 19.25v5.5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 35 24.75v-5.5a1.75 1.75 0 0 1 1.75-1.75Zm15.75 0H55.8a1.4 1.4 0 0 1 1.4 1.4V29.6a1.4 1.4 0 0 1-1.4 1.4h-3.3a1.4 1.4 0 0 1-1.4-1.4v-10.2a1.4 1.4 0 0 1 1.4-1.4Z'

const wheels =
  'M15.5 36.8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 1 0-13 0zm4 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0zM36.5 36.8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 1 0-13 0zm4 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z'

function BusIcon({ label, ...props }: SVGProps<SVGSVGElement> & { label?: string }) {
  return (
    <svg viewBox="8 3 56 44" fill="currentColor" aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} {...props}>
      <path d={sign} />
      <path fillRule="evenodd" d={body} />
      <path fillRule="evenodd" d={wheels} />
    </svg>
  )
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return <BusIcon label="SEGA" className={['logo-mark', className].filter(Boolean).join(' ')} />
  }

  return (
    <span className={['logo', `logo-${variant}`, className].filter(Boolean).join(' ')} role="img" aria-label="SEGA">
      <BusIcon className="logo-mark" />
      <span className="logo-word" aria-hidden="true">
        SEGA
      </span>
    </span>
  )
}
