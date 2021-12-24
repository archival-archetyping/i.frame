import { atom } from 'recoil'
import shortid from 'shortid'
import { KEY_COLORS } from "../configs/color";

export const isAccessedState = atom({
  key: 'app/isAccessed',
  default:
    !!localStorage.getItem('isAccessed')
})

export const deviceIdState = atom({
  key: 'app/deviceId',
  default:
    localStorage.getItem('deviceId')
      ? localStorage.getItem('deviceId')
      : (() => {
        const uid = shortid.generate()
        localStorage.setItem('deviceId', uid)
        return uid
      })()
})

export const iconIdState = atom({
  key: 'app/iconId',
  default:
    localStorage.getItem('iconId')
      ? localStorage.getItem('iconId')
      : undefined
})

export const keyColorIdState = atom({
  key: 'app/keyColorId',
  default: (() => (Math.floor(Math.random() * KEY_COLORS.length - 1) + 1))()
})

export const isCoCAgreeState = atom({
  key: 'app/cocAgree',
  default:
    localStorage.getItem('isCoCAgree')
      ? localStorage.getItem('isCoCAgree')
      : undefined
})

export const cocOpenState = atom({
  key: 'app/cocOpen',
  default: false,
})

export const tutorialState = atom({
  key: 'app/tutorial',
  default: false,
})

export const tutorialStepState = atom({
  key: 'app/tutorialStep',
  default: 0,
})

export const controllerLoadingState = atom({
  key: 'app/controllerLoading',
  default: false,
})

export const controllerOpenedState = atom({
  key: 'app/controllerOpened',
  default: document.body.clientWidth > 768,
})

export const controllerTabSelectedState = atom({
  key: 'app/controllerTabSelected',
  default: 'search',
})

export const modalMoreOpenState = atom({
  key: 'app/modalMoreOpen',
  default: false,
})

export const channelNameState = atom({
  key: 'app/channelName',
  default: '',
})
