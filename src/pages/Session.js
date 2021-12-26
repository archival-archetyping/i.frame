import React, {useEffect, useState, useCallback} from 'react'
import IFrame from 'react-iframe'
import Icon from '@mdi/react'
import { mdiLoading, mdiAccountVoice } from "@mdi/js";
import tw, {styled} from 'twin.macro'
import { useHistory, useParams } from 'react-router-dom'
import { useCollection } from "react-firebase-hooks/firestore";
import firebase, {collectionOptions} from "../configs/firebase";
import {getDocuments} from "../util";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  controllerLoadingState,
  controllerOpenedState,
  controllerTabSelectedState,
  deviceIdState,
  keyColorIdState,
  modalMoreOpenState
} from "../store/app";
import {APP_ID, clientState, joinedState, userMuteState} from "../store/agora";
import {ModalMoreInfo} from "../components/Modal";
import {ModalTitle, ModalAuthor, ModalContent} from "../components/Typography";
import {TagList} from "../components/TagList";
import dayjs from "dayjs";
import Swal from 'sweetalert2'
import {fetchCreateRoom, fetchCreateVoiceToken, fetchJoinRoom, fetchLeaveRoom, fetchToggleVoice} from "../hooks/api";
import {useI18n} from "use-mini18n";
import {event} from "../configs/gtag";

const StyledIframeWrap = styled.div(({opened, joined}) => [
  tw`fixed top-10 left-0 w-full z-0 flex justify-center items-center transition-all duration-500 ease-in-out overflow-hidden`,
  `height: calc(100% - 11.25rem);
   @media (min-width: 768px) {
     width: calc(100% - 0.25rem);
     height: calc(100% - 2.5rem);
   }`,
  joined && `height: calc(100% - 9rem);`,
  opened && `
    @media (min-width: 768px) {
      width: calc(100% - 24rem);
    }
  `,
])
const Loading = tw.div`animate-spin`
const ModalIsNotOpen = styled.div(() => [
  tw`absolute whitespace-pre top-3 left-1/2 py-2 px-4 bg-gray-300 font-medium text-sm`,
  `transform: translateX(-50%);`
])

const Session = () => {
  const [isDecide, setIsDecide] = useState(false)
  const [moreIsOpen, setMoreIsOpen] = useRecoilState(modalMoreOpenState)
  const joined = useRecoilValue(joinedState)
  const client = useRecoilValue(clientState)
  const [controllerOpened, setControllerOpened] = useRecoilState(controllerOpenedState)
  const setControllerLoading = useSetRecoilState(controllerLoadingState)
  const setSelectTab = useSetRecoilState(controllerTabSelectedState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const deviceId = useRecoilValue(deviceIdState)
  const setJoined = useSetRecoilState(joinedState)
  const setMuted = useSetRecoilState(userMuteState)
  const history = useHistory()
  const { id } = useParams()
  const { t, lang } = useI18n()
  const [userCollection] = useCollection(firebase.collection('user'), collectionOptions)
  const [adminCollection] = useCollection(firebase.collection('registered'), collectionOptions)
  const [sessionCollection] = useCollection(firebase.collection('session'), collectionOptions)
  const [tagCollection] = useCollection(firebase.collection('tag'), collectionOptions)
  const admins = getDocuments(adminCollection)
  const users = getDocuments(userCollection)
  const sessions = getDocuments(sessionCollection)
  const tags = getDocuments(tagCollection)
  const session = sessions && sessions.filter(se => se.path === id)[0]
  const author = session && admins && admins.filter(admin => admin.id === session.user_id)[0]
  const session_tags = session && tags && tags.filter(tag => [session.tag1, session.tag2, session.tag3].includes(Number(tag.id)))
  const isOpenSession = session && dayjs().isBetween(dayjs.unix(session.start_time.seconds), dayjs.unix(session.end_time.seconds))
  const isLogin = users && users.filter(user => user.device_id === deviceId)[0]?.registered_id
  const handleLeaveChannel = async () => {
    const roomId = client.channelName
    client.localTracks.forEach((v) => v.close())
    await client.leave()
    setJoined(undefined)
    setTimeout(async () => {
      await fetchLeaveRoom(roomId, deviceId)
      const mute_result = await fetchToggleVoice(deviceId, true)
      if (mute_result.is_success) setMuted(true)
    }, 1000)
  }
  const handleJoinChannel = async () => {
    const token_result = await fetchCreateVoiceToken(session.room_id, deviceId)
    if (token_result && token_result.is_success) {
      const { token } = token_result
      const uid = await client.join(APP_ID, session.room_id, token)
      if (uid) {
        const join_result = await fetchJoinRoom(session.room_id, deviceId, uid)
        const mute_result = await fetchToggleVoice(deviceId, true)
        if (mute_result && mute_result.is_success) {
          setMuted(true)
        }
        if (join_result && join_result.is_success) {
          const action = 'join_existing_chat'
          const label = localStorage.getItem('isAdmin') ? 'registered' : 'anonymous'
          event({action, label, value: `session: ${session.room_id}`})
          setJoined(session.room_id)
          setSelectTab('chat')
          setControllerOpened(true)
          setControllerLoading(false)
        }
      } else {
        setControllerLoading(false)
      }
    } else {
      setControllerLoading(false)
    }
  }
  useEffect(() => {
    if (session && !session.is_public) history.push('/')
    const decideJoinActiveSession = async () => {
      if (session && session.is_active && !isDecide) {
        if (joined) {
          if (joined !== session.room_id) {
            setIsDecide(true)
            Swal.fire({
              text: t['session_switch_chat'],
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            }).then( async (result) => {
              if (result.isConfirmed) {
                setControllerLoading(true)
                await handleLeaveChannel()
                await handleJoinChannel()
              }
            })
          }
        } else {
          setControllerLoading(true)
          setIsDecide(true)
          setTimeout(handleJoinChannel, 3000)
        }
      }
    }
    decideJoinActiveSession()
  }, [handleJoinChannel, handleLeaveChannel, history, isDecide, joined, session, setControllerLoading])
  const handleCloseModal = () => setMoreIsOpen(false)
  const handleCreateAdminChannel = useCallback(async () => {
    if (session) {
      Swal.fire({
        text: "この機能は管理者専用です。このセッションに紐作けるためのチャンネルを作成します。作成したチャンネルはDatabaseシートと紐付ける必要があります。続行しますか？",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then( async (result) => {
        if (result.isConfirmed) {
          const result_create = await fetchCreateRoom('registered', 999, session.title_ja, true, true)
          if (result_create.is_success) {
            Swal.fire({text: `${result_create.id}`})
          } else {
            Swal.fire({text: 'チャンネル作成に失敗しました。'})
          }
        }
      })
    }
  }, [session])
  return (
    <>
      <StyledIframeWrap opened={controllerOpened} joined={joined}>
        { !isOpenSession && <ModalIsNotOpen>{t['session_is_not_open']}</ModalIsNotOpen> }
        { isLogin && <button className="absolute bottom-2 left-2 text-key-orange" onClick={handleCreateAdminChannel}><Icon path={mdiAccountVoice} size={1.4} /></button> }
        {
          session
            ? <IFrame width="100%" height="100%" src={session && session.iframe_url} allow="fullscreen" />
            : <Loading><Icon path={mdiLoading} size={2} color="rgba('0, 0, 0, .6)"/></Loading>
        }
        {
          session && (
            <ModalMoreInfo isOpen={moreIsOpen} handleClose={handleCloseModal} keyColorId={keyColorId}>
              <ModalTitle>{lang === 'en' ? session.title_en : session.title_ja}</ModalTitle>
              <ModalAuthor>{author && lang === 'en' ? author.name_en : author.name_ja}</ModalAuthor>
              { session.description_ja.length > 0 && <ModalContent>{lang === 'en' ? session.description_en : session.description_ja}</ModalContent> }
              { session_tags && <TagList tags={session_tags} /> }
            </ModalMoreInfo>
          )
        }
      </StyledIframeWrap>
    </>
  )
}

export default Session
