import React, { useEffect } from 'react'
import { clientState } from '../store/agora'
import { useRecoilValue } from 'recoil'

export const AgoraApp = () => {
  const client = useRecoilValue(clientState)
  const remoteUsers = {}

  const subscribe = async (user, mediaType) => {
    await client.subscribe(user, mediaType)
    if (mediaType === 'audio') {
      user.audioTrack.play()
    }
  }

  const handleUserPublished = async (user, mediaType) => {
    const id = user.uid
    remoteUsers[id] = user
    await subscribe(user, mediaType)
  }

  // const handleUserUnpublished = (user, mediaType) => {
  //   const id = user.uid
  //   delete remoteUsers[id]
  // }

  const handleTokenPrivilegeDidExpire = async () => {
    client.localTracks.forEach((v) => v.close())
    await client.leave()
  }

  const handleUserLeft = async (user) => {
    // setUsers(client)
  }

  const handleUserJoin = async (user) => {
    // setUsers(client)
  }

  useEffect(() => {
    client.on("user-published", handleUserPublished)
    // client.on("user-unpublished", handleUserUnpublished)
    client.on("token-privilege-did-expire", handleTokenPrivilegeDidExpire)
    client.on('user-joined', handleUserJoin)
    client.on("user-left", handleUserLeft)
  })

  return <></>

}
