import React, { useState, useEffect, useRef } from 'react'
import tw, { styled } from 'twin.macro'
import {
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiUnfoldMoreHorizontal,
  mdiPlus,
  mdiMagnify,
  mdiChatProcessingOutline,
  mdiLocationExit,
  mdiSend,
} from "@mdi/js";
import Icon from '@mdi/react';
import { CardListedChannel } from "../Card";
import { useRecoilState, useRecoilValue } from 'recoil';
import {controllerOpenedState, keyColorIdState, tutorialStepState,} from "../../store/app";
import { useI18n } from "use-mini18n"
import { UserIcon, ICONS } from "../Icon"
import { KEY_COLORS } from "../../configs/color";
import { sortBy } from "lodash-es";
import { admins, users, sessions, rooms, chats } from "./mock-data";

const Container = styled.div(({ isOpen, joined }) => [
  tw`fixed -bottom-1 left-0 w-full bg-gray-800 bg-opacity-95 z-40 h-36 transition-all duration-500 ease-in-out
     md:w-96 md:h-screen md:right-0 md:-right-96 md:left-auto md:bottom-0 md:bg-opacity-100 md:transform md:-translate-x-1`,
  `min-height: 9rem;`,
  joined && `
    min-height: 6.75rem;
    height: 6.75rem;
  `,
  isOpen && `min-height: 45vh;`,
  isOpen && tw`md:right-0 md:translate-x-0`,
])
const TutorialContainerTarget = styled.div(({tutorialStep}) => [
  tutorialStep === 0 && tw`absolute w-full z-40 top-0 left-0 border-4 border-key-orange animate-pulse`,
  tutorialStep === 0 && `
    height: 95%;
    @media (min-width: 768px) {
      height: 100%;
    }
  `,
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
const VCCContainer = ({loading, joined, muted, rooms, admins, users, deviceId, keyColorId, tutorialStep}) => {
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
  const JoinedVCCUser = tw.div`relative flex flex-col justify-center items-center`
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
  const TutorialMuteTarget = tw.div`absolute w-full h-full border-4 border-key-orange transform scale-x-110 scale-y-125 animate-pulse`
  const joinedRoom = rooms?.filter(room => room.id === joined)[0]
  const user = users && users.filter(user => user.device_id === deviceId)[0]
  const admin = user && user.registered_id && admins && admins.filter(admin => admin.id === Number(user.registered_id))[0]
  return (
    <Wrapper joined={joined}>
      {
        joined && joinedRoom ? (
          <JoinedVCC>
            <JoinedVCCUser>
              { tutorialStep === 1 && <TutorialMuteTarget /> }
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
              <LeaveChannelWrap keyColorId={keyColorId}><Icon path={mdiLocationExit} size={1.2} /></LeaveChannelWrap>
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
  const TabIcon = ({path, keyColorId}) => <Icon path={path} size={0.625} className="mr-1" style={{color: `rgb(${KEY_COLORS[keyColorId || 0].secondary})`}} />
  return (
    <Wrapper>
      { joined
        ? <Tab isSelected={selected === 'chat'}><TabIcon keyColorId={keyColorId} path={mdiChatProcessingOutline} />{t['chat_chat']}</Tab>
        : <Tab />
      }
      <Tab />
      <Tab isSelected={selected === 'search'}><TabIcon keyColorId={keyColorId} path={mdiMagnify} />{t['chat_search']}</Tab>
      <Tab isSelected={selected === 'create'}><TabIcon keyColorId={keyColorId} path={mdiPlus} />{t['chat_create']}</Tab>
    </Wrapper>
  )
}
const TabContent = ({children, type, isOpenMembers}) => {
  const $chatMessages = useRef(null)
  const Wrapper = tw.div`relative px-6 py-4 text-white overflow-y-scroll`
  const Content = tw.div`overflow-y-scroll`
  useEffect(() => {
    if (type === 'chat' && !isOpenMembers) $chatMessages.current.scrollTop = $chatMessages.current.scrollHeight
  }, [children])
  return (
    <Wrapper ref={$chatMessages} style={{ height: 'calc(100% - 10rem)'}}>
      <Content className={type === 'chat' && 'pb-12'}>{children}</Content>
    </Wrapper>
  )
}
const TabTitle = tw.h3`text-sm mt-4`
const TCCContainer = styled.div(({isOpen}) => [
  tw`bottom-0 left-0 w-full h-12 flex justify-between items-center px-6 bg-gray-900`,
  isOpen ? tw`fixed` : tw`absolute`
])
const TutorialTCCTarget = tw.div`absolute w-full h-full border-4 border-key-orange top-0 left-0 animate-pulse`
const TCCSendButton = styled.button(({keyColorId}) => [
  tw`text-white w-9 h-9 rounded flex justify-center items-center`,
  `background-color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`,
])
const TCCMessageInput = styled.input(() => [
  tw`bg-transparent border border-gray-300 rounded py-1 px-2 h-9 text-base text-white`,
  'width: calc(100% - 3rem);'
])
const TCCMessage = ({chat, users, admins, keyColorId}) => {
  const { lang } = useI18n()
  const Wrapper = tw.p`text-sm mt-2`
  const user = users.filter(user => user.device_id === chat.device_id)[0]
  const admin = user.registered_id && admins.filter(admin => admin.id === Number(user.registered_id))[0]
  const Author = styled.span(({keyColorId}) => [
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  return (
    <Wrapper>
      <Author keyColorId={keyColorId}>{admin ? lang === 'en' ? admin.name_en : admin.name_ja : lang === 'en' ? ICONS[user.icon_id].name_en : ICONS[user.icon_id].name_ja}: </Author>
      <span>{chat.content}</span>
    </Wrapper>
  )
}
const CCParticipantsContainer = tw.div``
const CCParticipantsTitle = tw.h2`text-sm text-white mb-4`
const CCParticipantsMembers = tw.div`pt-0 flex flex-wrap text-white border-b border-gray-400 overflow-y-scroll transition-all duration-500 max-h-0`

export const MockController = () => {
  const deviceId = '06DmOgNfX'
  const isOpenMembers = true
  const [joined, setJoined] = useState(undefined)
  const [isOpen, setIsOpen] = useRecoilState(controllerOpenedState)
  const [selectedTab, setSelectTab] = useState('search')
  const [muted, setMuted] = useState(true)
  const keyColorId = useRecoilValue(keyColorIdState)
  const tutorialStep = useRecoilValue(tutorialStepState)
  const { t } = useI18n();
  const joinedRoomChat = joined && chats &&
    chats.filter(chat => chat.room_id === joined).length > 0 &&
    chats.filter(chat => chat.room_id === joined)[0].posts
  const activeSessionIds = sessions && sessions.filter(session => session.is_active).map(session => session.room_id)
  const channels = rooms && rooms.filter(room => (room.member.length > 0 && room.type === 'anonymous') || (room.type === 'registered' && activeSessionIds && activeSessionIds.includes(room.id)))
  const orderedChannels = channels && sortBy(channels, [c => c.id !== joined, 'type'])

  useEffect(() => {
    switch (tutorialStep) {
      case 0:
        setIsOpen(true)
        setJoined(undefined)
        setSelectTab('search')
        break
      case 1:
        setIsOpen(true)
        setJoined('897b884c6768e153f8d24b0435d96dec')
        setSelectTab('chat')
        break
      case 2:
        setIsOpen(true)
        setJoined('897b884c6768e153f8d24b0435d96dec')
        setSelectTab('chat')
        break
      case 3:
        setIsOpen(false)
        setJoined('897b884c6768e153f8d24b0435d96dec')
        setSelectTab('chat')
        break
      default:
        return false
    }
  }, [setIsOpen, tutorialStep])

  return (
    <Container isOpen={isOpen} joined={joined}>
      <TutorialContainerTarget tutorialStep={tutorialStep} />
      <TopBar>
        <ButtonToggleOpen />
      </TopBar>
      <VCCContainer
        deviceId={deviceId}
        keyColorId={keyColorId}
        joined={joined}
        muted={muted}
        users={users}
        admins={admins}
        rooms={rooms}
        tutorialStep={tutorialStep}
      />
      <TabSelector selected={selectedTab} joined={joined} keyColorId={keyColorId} />
      {
        selectedTab === 'search' && (
          <TabContent>
            <TabTitle>{t['chat_active_channels']}</TabTitle>
            {
              orderedChannels && orderedChannels.map((channel, index) => (
                <CardListedChannel
                  key={`card-talk-room-${index}`}
                  isTutorial={true}
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
          <TabContent type="chat" isOpenMembers={isOpenMembers}>
            <CCParticipantsContainer>
              <CCParticipantsTitle>{t['chat_invisible_participant']}</CCParticipantsTitle>
              <CCParticipantsMembers />
            </CCParticipantsContainer>
            <div>
              <TabTitle>{t['chat_text_chat']}</TabTitle>
              {
                joinedRoomChat && admins && users && joinedRoomChat.filter(chat => chat.content.length > 0).map((chat, index) => (
                  <TCCMessage
                    key={`chat-${joined}-${index}`}
                    chat={chat}
                    users={users}
                    admins={admins}
                    keyColorId={keyColorId}
                  />
                ))
              }
              <TCCContainer isOpen={isOpen}>
                { tutorialStep === 2 && <TutorialTCCTarget /> }
                <TCCMessageInput type="text" placeholder={t['chat_text_placeholder']} />
                <TCCSendButton keyColorId={keyColorId}><Icon path={mdiSend} size={1.2} /></TCCSendButton>
              </TCCContainer>
            </div>
          </TabContent>
        )
      }
    </Container>
  )
}
