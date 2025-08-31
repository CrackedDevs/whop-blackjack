// Web stubs for React Native modules that don't work on web

export const trigger = () => {}
export const impactAsync = () => Promise.resolve()
export const notificationAsync = () => Promise.resolve()
export const selectionAsync = () => Promise.resolve()

export const Gesture = {
  Tap: () => ({
    onEnd: () => ({}),
    enabled: () => ({}),
  }),
}

export const GestureDetector = ({ children }: { children: React.ReactNode }) => children
export const GestureHandlerRootView = ({ children }: { children: React.ReactNode }) => children

export default {
  trigger,
  impactAsync,
  notificationAsync,
  selectionAsync,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
}