import { atom, selector } from 'recoil'
import AgoraRTC from 'agora-rtc-sdk-ng'

export const APP_ID = process.env.REACT_APP_AGORA_APP_ID

export const usersState = atom({
  key: 'agora/users',
  default: [],
})

export const joinedState = atom({
  key: 'agora/joined',
  default: undefined,
})

export const userMuteState = atom({
  key: 'agora/user-mute',
  default: true,
})

export const clientState = atom({
  key: 'agora/client',
  default: AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
})

export const remoteUsersState = selector({
  key: 'agora/remote-users',
  get: ({get}) => {
    const client = get(clientState)
    return client.remoteUsers
  },
})
