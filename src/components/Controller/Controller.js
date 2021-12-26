import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react'
import tw, { styled } from 'twin.macro'
import {
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiUnfoldMoreHorizontal,
  mdiPlus,
  mdiMagnify,
  mdiChatProcessingOutline,
  mdiLocationExit,
  mdiLoading,
} from "@mdi/js";
import Icon from '@mdi/react';
import { useCollection } from "react-firebase-hooks/firestore";
import firebase, {collectionOptions} from '../../configs/firebase';
import { CardCreateRoom, CardListedChannel } from "../Card";
import {useRecoilState, useRecoilValue, useRecoilCallback} from 'recoil';
import { fetchEnter, fetchLeaveRoom, fetchToggleVoice } from "../../hooks/api";
import { clientState, joinedState, userMuteState } from "../../store/agora";
import {
  deviceIdState,
  controllerTabSelectedState,
  iconIdState,
  controllerOpenedState,
  keyColorIdState, isAccessedState, controllerLoadingState
} from "../../store/app";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useI18n } from "use-mini18n"
import { UserIcon, ICONS, getRandomIcon } from "../Icon"
import { getDocuments } from "../../util";
import { KEY_COLORS } from "../../configs/color";
import { sortBy, throttle } from "lodash-es";
import {event} from "../../configs/gtag";

const Container = styled.div(({ isOpen, joined }) => [
  tw`fixed -bottom-1 left-0 w-full bg-gray-800 bg-opacity-95 z-40 h-36 transition-all duration-500 ease-in-out
     md:w-96 md:h-screen md:right-0 md:-right-96 md:left-auto md:bottom-0 md:bg-opacity-100 md:transform md:-translate-x-1`,
  `min-height: 9rem;`,
  joined && `
    min-height: 6.75rem;
    height: 6.75rem;
  `,
  isOpen && `min-height: 80vh;`,
  isOpen && tw`md:right-0 md:translate-x-0`
])
const TopBar = tw.div`
  relative flex items-center bg-black h-2 py-1 md:h-screen md:w-1
  md:absolute md:top-0 md:left-0
`
const ButtonToggleOpen = (props) => {
  const Wrapper = tw.div`
    flex items-center justify-center bg-gray-800 text-white rounded-full w-10 h-10 transform
    active:bg-gray-600 z-50 absolute -top-5 right-4 md:top-4 md:-right-5 md:rotate-90
  `
  return (
    <Wrapper {...props}>
      <Icon path={mdiUnfoldMoreHorizontal} size={1} />
    </Wrapper>
  )
}
const VCCContainer = ({loading, joined, muted, rooms, admins, users, deviceId, keyColorId, handleLeave, handleToggleMute}) => {
  const { t } = useI18n()
  const Wrapper = styled.div(({joined}) => [
    tw`pl-2 py-3 h-24 w-full`,
    joined ? tw`pr-0` : tw`pr-4`,
  ])
  const NotJoinedVCC = tw.div`flex items-center pt-2 text-white`
  const NotJoinedVCCTitle = styled.p(({keyColorId}) => [
    tw`flex items-center text-sm mb-2`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].primary});`
  ])
  const JoinedVCC = tw.div`flex items-center text-white h-full w-full`
  const JoinedVCCUser = tw.div`flex flex-col justify-center items-center`
  const JoinedVCCInfo = tw.div`relative pr-16 pl-3 w-full`
  const JoinedVCCSectionTitle = tw.h3`text-xs text-white`
  const JoinedVCCTitle = styled.p(({keyColorId}) => [
    tw`mt-1 text-lg truncate`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].primary});
     max-width: 13rem;
     @media (max-width: 374px) {
       max-width: 10rem;
     }`
  ])
  const JoinedVCCAuthor = tw.p`mt-1 text-xs`
  const JoinedVCCMuteButton = styled.button(({muted}) => [
    tw`mt-2 bg-black text-xs text-white w-20 flex justify-center items-center`,
    !muted && tw`bg-key-green`
  ])
  const LeaveChannelWrap = styled.div(({keyColorId}) => [
    tw`absolute w-14 top-1/2 right-0 h-11 flex justify-center items-center border-l border-gray-400`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});
     transform: translateY(-50%);`,
  ])
  const joinedRoom = rooms?.filter(room => room.id === joined)[0]
  const user = users && users.filter(user => user.device_id === deviceId)[0]
  const admin = user && user.registered_id && admins && admins.filter(admin => admin.id === Number(user.registered_id))[0]
  return (
    <Wrapper joined={joined}>
      {
        joined && joinedRoom ? (
          <JoinedVCC>
            <JoinedVCCUser onClick={handleToggleMute}>
              {
                user && (
                  <UserIcon
                    size="small"
                    user={admin ? {...user, ...admin} : user}
                  />
                )
              }
              <JoinedVCCMuteButton muted={muted}>
                {muted
                    ? (<><Icon path={mdiMicrophoneOff} size={0.7} />{t['chat_is_mute']}</>)
                    : (<><Icon path={mdiMicrophone} size={0.7} />{t['chat_is_speaking']}</>)}
              </JoinedVCCMuteButton>
            </JoinedVCCUser>
            <JoinedVCCInfo>
              <JoinedVCCSectionTitle>{t['chat_in_chat']}</JoinedVCCSectionTitle>
              <JoinedVCCTitle keyColorId={keyColorId}>{ joinedRoom.name }</JoinedVCCTitle>
              <JoinedVCCAuthor>{joinedRoom.type === 'registered' ? t['chat_channel_for_session'] : t['chat_channel_for_general']}</JoinedVCCAuthor>
              <LeaveChannelWrap keyColorId={keyColorId} onClick={handleLeave}><Icon path={mdiLocationExit} size={1.2} /></LeaveChannelWrap>
            </JoinedVCCInfo>
          </JoinedVCC>
        ) : (
          <NotJoinedVCC>
            <div className="px-3">
              {
                user && (
                  <UserIcon
                    size="small"
                    user={admin ? {...user, ...admin} : user}
                  />
                )
              }
            </div>
            <div>
              <NotJoinedVCCTitle keyColorId={keyColorId}>{ loading ? t['chat_is_connecting'] : t['chat_not_in_chat']}</NotJoinedVCCTitle>
              <p className="text-sm">{ loading ? t['chat_is_connecting_wait'] : t['chat_desc']}</p>
            </div>
          </NotJoinedVCC>
        )
      }
    </Wrapper>
  )
}
const TabSelector = ({ selector, selected, joined, keyColorId }) => {
  const { t } = useI18n()
  const Wrapper = tw.div`flex px-2 h-10`
  const Tab = styled.div(({isSelected}) => [
    tw`flex justify-center items-center border-b border-gray-300 font-bold text-white pl-1 pr-2 py-1 text-sm cursor-pointer`,
    `min-width: calc(100% / 4);`,
    isSelected && tw`border border-b-0`,
  ])
  const TabIcon = ({path, keyColorId}) => <Icon path={path} size={0.625} className="mr-1" style={{color: `rgb(${KEY_COLORS[keyColorId] && KEY_COLORS[keyColorId].secondary})`}} />
  return (
    <Wrapper>
      { joined
        ? <Tab isSelected={selected === 'chat'} onClick={() => selector('chat')}><TabIcon keyColorId={keyColorId} path={mdiChatProcessingOutline} />{t['chat_chat']}</Tab>
        : <Tab />
      }
      <Tab />
      <Tab isSelected={selected === 'search'} onClick={() => selector('search')}><TabIcon keyColorId={keyColorId} path={mdiMagnify} />{t['chat_search']}</Tab>
      {/*{ localStorage.getItem('isAdmin') ? (*/}
      {/*  <Tab isSelected={selected === 'create'} onClick={() => selector('create')}><TabIcon keyColorId={keyColorId} path={mdiPlus} />{t['chat_create']}</Tab>*/}
      {/*) : (*/}
      {/*  <Tab/>*/}
      {/*)}*/}
      <Tab isSelected={selected === 'create'} onClick={() => selector('create')}><TabIcon keyColorId={keyColorId} path={mdiPlus} />{t['chat_create']}</Tab>
    </Wrapper>
  )
}
const TabContent = ({children, type}) => {
  const containerRef = useRef(null)
  const Wrapper = tw.div`relative px-6 py-4 text-white overflow-y-scroll`
  const Content = tw.div`overflow-y-scroll`
  const handleScroll = () => {
    if (type === 'search') localStorage.setItem('tabContentScroll', containerRef.current.scrollTop)
  }
  useLayoutEffect(() => {
    if (type === 'search') containerRef.current.scrollTop = Number(localStorage.getItem('tabContentScroll'))
  }, [children])
  return (
    <Wrapper ref={containerRef} style={{ height: 'calc(100% - 8.5rem)'}} onScroll={throttle(handleScroll, 200)}>
      <Content className={type === 'chat' && 'pb-12'}>{children}</Content>
    </Wrapper>
  )
}
const TabTitle = tw.h3`text-sm mt-4`
const TCCMessage = ({chat, users, admins, keyColorId}) => {
  const { lang } = useI18n()
  const Wrapper = tw.p`text-sm mt-2`
  const user = users && users.filter(user => user.device_id === chat.device_id)[0]
  const admin = user && user.registered_id && admins && admins.filter(admin => admin.id === Number(user.registered_id))[0]
  const Author = styled.span(({keyColorId}) => [
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  return (
    <Wrapper>
      <Author keyColorId={keyColorId}>{
        admin
          ? lang === 'en'
            ? admin.name_en
            : admin.name_ja
          : lang === 'en'
            ? user && user.icon_id ? ICONS[user.icon_id].name_en : 'だれか'
            : user && user.icon_id ? ICONS[user.icon_id].name_ja : 'Unknown'
      }: </Author>
      <span>{chat.content}</span>
    </Wrapper>
  )
}
const CCParticipantsContainer = tw.div``
const CCParticipantsTitle = tw.h2`text-sm text-white mb-4`
const CCParticipantsMembers = styled.div(({isOpen}) => [
  tw`pt-0 flex flex-wrap text-white border-b border-gray-400 overflow-y-scroll transition-all duration-500 max-h-0`,
  isOpen && tw`max-h-40 pt-1`
])
const CCParticipants = tw.div`flex justify-center w-1/5 mb-2`

const Loading = () => <div className="animate-spin text-white"><Icon path={mdiLoading} size={1.3} /></div>

export const Controller = () => {
  const [isLoading, setIsLoading] = useRecoilState(controllerLoadingState)
  const [isOpenMembers, setIsOpenMembers] = useState(true)
  const [isOpen, setIsOpen] = useRecoilState(controllerOpenedState)
  const [selectedTab, setSelectTab] = useRecoilState(controllerTabSelectedState)
  const [joined, setJoined] = useRecoilState(joinedState);
  const [muted, setMuted] = useRecoilState(userMuteState);
  const [isAccessed, setIsAccessed] = useRecoilState(isAccessedState)
  const client = useRecoilValue(clientState);
  const deviceId = useRecoilValue(deviceIdState);
  const [iconId, setIconId] = useRecoilState(iconIdState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const { t } = useI18n();
  const [roomCollection] = useCollection(firebase.collection('room'), collectionOptions)
  const [adminCollection] = useCollection(firebase.collection('registered'), collectionOptions)
  const [userCollection] = useCollection(firebase.collection('user'), collectionOptions)
  const [chatCollection] = useCollection(firebase.collection('chat'), collectionOptions)
  const [sessionCollection] = useCollection(firebase.collection('session'), collectionOptions)
  const rooms = getDocuments(roomCollection)
  const admins = getDocuments(adminCollection)
  const users = getDocuments(userCollection)
  const chats = getDocuments(chatCollection)
  const sessions = getDocuments(sessionCollection)
  const joinedRoom = joined && rooms && rooms.filter(room => room.id === joined)[0]
  const joinedRoomMember = joinedRoom && admins && users && joinedRoom.member.map(m => {
    const user = users.filter(user => user.device_id === m.device_id)[0]
    return user && user.registered_id ? {...admins.filter(admin => admin.id === Number(user.registered_id))[0], ...user} : user
  })
  const joinedRoomChat = joined && chats &&
    chats.filter(chat => chat.room_id === joined).length > 0 &&
    chats.filter(chat => chat.room_id === joined)[0].posts.reverse()
  const activeSessionIds = sessions && sessions.filter(session => session.is_active).map(session => session.room_id)
  const isLogin = users && users.filter(user => user.device_id === deviceId)[0]?.registered_id
  const channels = isLogin
      ? rooms && rooms.filter(room => (room.member.length > 0 && room.type === 'anonymous') || room.type === 'registered')
      : rooms && rooms.filter(room => (room.member.length > 0 && room.type === 'anonymous') || (room.type === 'registered' && activeSessionIds && activeSessionIds.includes(room.id)))
  const orderedChannels = channels && sortBy(channels, [c => c.id !== joined, 'type'])

  useEffect(() => {
    const setEnterApp = async () => {
      if (!isAccessed) {
        const randomIcon = getRandomIcon()
        localStorage.setItem('iconId', String(randomIcon.id))
        setIconId(randomIcon.id)
        localStorage.setItem('isAccessed', String(true))
        setIsAccessed(true)
        await fetchEnter(deviceId, randomIcon.id, keyColorId || 0)
      } else {
        const isExist = users && users.filter(user => user.device_id === deviceId)
        if (isExist && isExist.length === 0) {
          await fetchEnter(deviceId, iconId, keyColorId)
        }
      }
    }
    setEnterApp()
  }, [deviceId, iconId, isAccessed, keyColorId, setIconId, setIsAccessed, users])

  const handleLeave = useRecoilCallback(() => async () => {
    if (client && client.channelName) {
      const roomId = client.channelName
      client.localTracks.forEach((v) => v.close());
      await client.leave();
      setJoined(undefined)
      setSelectTab('search')
      setTimeout(async () => {
        await fetchLeaveRoom(roomId, deviceId);
        // roomから出てるのでいらないかも？
        const mute_result = await fetchToggleVoice(deviceId, true)
        if (mute_result.is_success) {
          setMuted(true)
        }
      }, 1000)
    }
  }, [client, deviceId])

  const handleToggleMute = useCallback(async () => {
    if (muted) {
      const action = 'speak_in_voice'
      const label = localStorage.getItem('isAdmin') ? 'registered' : 'anonymous'
      event({action, label})
      const result = await fetchToggleVoice(deviceId, false)
      if (result.is_success) {
        const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        await client.publish([localAudioTrack])
        setMuted(false)
      }
    } else {
      const result = await fetchToggleVoice(deviceId, true)
      if (result.is_success) {
        await client.unpublish()
        setMuted(true)
      }
    }
  }, [client, deviceId, muted, setMuted])

  const handleToggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen])
  const handleOpen = useCallback(() => setIsOpen(true), [setIsOpen])
  const handleChangeTab = useCallback((tab) => {
    handleOpen()
    setSelectTab(tab)
  }, [handleOpen, setSelectTab])
  const handleToggleOpenMembers = useCallback(() => setIsOpenMembers(!isOpenMembers), [isOpenMembers, setIsOpenMembers])
  return (
    <Container isOpen={isOpen} joined={joined}>
      <TopBar>
        <ButtonToggleOpen onClick={handleToggleOpen}/>
      </TopBar>
      <VCCContainer
        deviceId={deviceId}
        keyColorId={keyColorId}
        loading={isLoading}
        joined={joined}
        muted={muted}
        users={users}
        admins={admins}
        rooms={rooms}
        handleLeave={handleLeave}
        handleToggleMute={handleToggleMute}
      />
      <TabSelector selector={handleChangeTab} selected={selectedTab} joined={joined} keyColorId={keyColorId} />
      {
        selectedTab === 'create' && (
          <TabContent>
            <TabTitle>{t['chat_create_title']}</TabTitle>
            {
              isLoading
                ? (<div className="w-full h-40 flex justify-center items-center"><Loading /></div>)
                : <CardCreateRoom handleLeave={handleLeave} handleLoading={setIsLoading} />
            }
          </TabContent>
        )
      }
      {
        selectedTab === 'search' && (
          <TabContent type="search">
            <TabTitle>{t['chat_active_channels']}</TabTitle>
            {
              isLoading
                ? (<div className="w-full h-40 flex justify-center items-center"><Loading /></div>)
                : orderedChannels && orderedChannels.map((channel, index) => (
                    <CardListedChannel
                      key={`card-talk-room-${index}`}
                      handleLoading={setIsLoading}
                      handleLeave={handleLeave}
                      channel={channel}
                      admins={admins}
                      users={users}
                      activeSessionIds={activeSessionIds}
                    />
                  ))
            }
          </TabContent>
        )
      }
      {
        selectedTab === 'chat' && (
          <TabContent type="chat">
            <CCParticipantsContainer>
              <CCParticipantsTitle onClick={handleToggleOpenMembers}>
                { isOpenMembers ? t['chat_invisible_participant'] : t['chat_visible_participant']}
              </CCParticipantsTitle>
              <CCParticipantsMembers isOpen={isOpenMembers}>
                {
                  joinedRoomMember && joinedRoomMember.map((member, index) => (
                    <CCParticipants key={`joined-channel-member-${index}`}>
                      <UserIcon size="small" name="true" user={member} mute />
                    </CCParticipants>
                  ))
                }
              </CCParticipantsMembers>
            </CCParticipantsContainer>
            <CCParticipants members={joinedRoomMember} handleToggleOpenMembers={handleToggleOpenMembers} isOpen={isOpenMembers} />
            <div>
              <TabTitle>{t['chat_text_chat']}</TabTitle>
              {
                joinedRoomChat &&
                admins &&
                users &&
                joinedRoomChat.filter(chat => chat.content.length > 0).map((chat, index) => (
                  <TCCMessage
                    key={`chat-${joined}-${index}`}
                    chat={chat}
                    users={users}
                    admins={admins}
                    keyColorId={keyColorId}
                  />
                ))
              }
            </div>
          </TabContent>
        )
      }
    </Container>
  )
}
