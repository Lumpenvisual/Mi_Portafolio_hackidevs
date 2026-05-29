// Code-split Motion's feature bundle into a lazy chunk loaded after mount.
// Keeps the initial JS bundle small; LazyMotion pulls this in on demand.
import { domAnimation } from 'motion/react'

export default domAnimation
