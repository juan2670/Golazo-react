import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin)

gsap.defaults({ ease: 'power3.out', duration: 0.65 })

ScrollTrigger.config({ ignoreMobileResize: true })

if (import.meta.env.DEV) {
  window.gsap = gsap
  window.ScrollTrigger = ScrollTrigger
}

export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 992px)',
  fine: '(hover: hover) and (pointer: fine)',
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP }
