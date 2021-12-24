import fetch from 'isomorphic-unfetch'

const API_HOST = process.env.REACT_APP_FIREBASE_FUNCTIONS_HOST

const ENTER = 'enter'
const CREATE_ROOM = 'create-room'
const CREATE_VOICE_TOKEN = 'create-voice-token'
const JOIN_ROOM = 'join-room'
const LEAVE_ROOM = 'leave-room'
const TOGGLE_VOICE = 'toggle-voice'
const LOGIN = 'login'
const POST = 'post'
const CHANGE_ICON = 'change-icon'

const apiFactory = (endpoint) => (`${API_HOST}/${endpoint}`)

const queryFactory = (data) => {
  return {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({data})
  }
}

export const fetchEnter = async (device_id, icon_id, key_color_id) => (
  await fetch(apiFactory(ENTER), queryFactory({device_id, icon_id, key_color_id})).then(res => res.json()).then(data => data)
)

export const fetchCreateRoom = async (type, limit, name, is_voice, is_chat) => (
  await fetch(apiFactory(CREATE_ROOM), queryFactory({type, limit, name, is_voice, is_chat})).then(res => res.json()).then(data => data)
)

export const fetchCreateVoiceToken = async (room_id, device_id) => (
  await fetch(apiFactory(CREATE_VOICE_TOKEN), queryFactory({room_id, device_id})).then(res => res.json()).then(data => data)
)

export const fetchJoinRoom = async (room_id, device_id, agora_uid) => (
  await fetch(apiFactory(JOIN_ROOM), queryFactory({room_id, device_id, agora_uid})).then(res => res.json()).then(data => data)
)

export const fetchLeaveRoom = async (room_id, device_id) => (
  await fetch(apiFactory(LEAVE_ROOM), queryFactory({room_id, device_id})).then(res => res.json()).then(data => data)
)

export const fetchToggleVoice = async (device_id, be_mute) => (
  await fetch(apiFactory(TOGGLE_VOICE), queryFactory({device_id, be_mute})).then(res => res.json()).then(data => data)
)

export const fetchLoginAdmin = async (device_id, registered_id, registered_secret) => (
  await fetch(apiFactory(LOGIN), queryFactory({device_id, registered_id, registered_secret})).then(res => res.json()).then(data => data)
)

export const fetchPost = async (device_id, room_id, content) => (
  await fetch(apiFactory(POST), queryFactory({device_id, room_id, content})).then(res => res.json()).then(data => data)
)

export const fetchChangeIcon = async (device_id, icon_id, key_color_id) => (
  await fetch(apiFactory(CHANGE_ICON), queryFactory({device_id, icon_id, key_color_id})).then(res => res.json()).then(data => data)
)
