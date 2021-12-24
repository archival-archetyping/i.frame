import React, {useCallback} from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {APP_ID, clientState, joinedState, userMuteState} from "../../store/agora";
import {controllerTabSelectedState, deviceIdState, keyColorIdState} from "../../store/app";
import Icon from '@mdi/react'
import tw, { styled } from 'twin.macro'
import { mdiCommentArrowRightOutline } from '@mdi/js'
import { UserIcon } from '../Icon/'
import { take } from "lodash-es";
import {fetchCreateVoiceToken, fetchJoinRoom, fetchToggleVoice} from "../../hooks/api";
import {KEY_COLORS} from "../../configs/color";
import {useI18n} from "use-mini18n";
import {event} from "../../configs/gtag";

const Container = styled.div(({ channelId, member, activeSessionIds}) => [
  tw`relative pt-4 pb-5 border-b border-white last:border-none`,
  activeSessionIds && !activeSessionIds.includes(channelId) && member.length === 0 && tw`bg-red-400 bg-opacity-30`
])
const Title = ({text, keyColorId, isSame, isTutorial}) => {
  const Wrapper = tw.div`relative`
  const Text = tw.h3`text-lg text-key-orange pr-8`
  const IconWrap = styled.div(({keyColorId}) => [
    tw`absolute right-2 top-1`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  const TutorialTarget = tw.div`absolute w-full h-full top-0 left-0 border-2 border-key-orange transform scale-150 animate-pulse`
  return (
    <Wrapper>
      <Text>{text}</Text>
      { !isSame && (
        <IconWrap keyColorId={keyColorId}>
          { isTutorial && <TutorialTarget />}
          <Icon path={mdiCommentArrowRightOutline} size={1} />
        </IconWrap>
      )}
    </Wrapper>
  )
}
const Exhibitor = tw.p`text-sm mt-1`
const Participants = ({members, admins, users}) => {
  const _members = members.map((member => {
    const user = users.filter(user => user.device_id === member.device_id)[0]
    if (user && user.registered_id) {
      const admin = admins.filter(admin => admin.id === Number(user.registered_id))[0]
      return {...user, ...admin}
    } else {
      return user
    }
  }))
  const front_members = take(_members, 3).filter(v => v)
  const back_members = _members.length > 3 && _members.slice(3)
  const Wrapper = tw.div`flex flex-wrap w-full px-2 pt-3`
  const FrontParticipantsWrap = tw.div`flex pr-4 justify-between`
  const BackParticipantsWrap = styled.div(() => [
    tw`flex flex-nowrap w-full`,
    `width: calc(100% / 12 * 4 - 3rem)`])
  const IconWrap = tw.div`relative w-14`
  return (
    <Wrapper>
      <FrontParticipantsWrap className={_members.length < 3 ? 'w-5/12' : 'w-8/12'}>
        {
          front_members.map((member, index) => (
            <UserIcon
              key={`front-participants-${index}`}
              size="small"
              name="true"
              user={member}
            />
          ))
        }
      </FrontParticipantsWrap>
      <BackParticipantsWrap>
        {
          back_members && back_members.map((member, index) => (
            <IconWrap
              key={`back-participants-${index}`}
              style={{zIndex: members.length - index}}
            >
              <UserIcon
                className="absolute top-0 left0"
                size="small"
                user={member}
              />
            </IconWrap>
          ))
        }
      </BackParticipantsWrap>
    </Wrapper>
  )
}

export const CardListedChannel = ({channel, admins, users, activeSessionIds, handleLeave, handleLoading, isTutorial}) => {
  const setJoined = useSetRecoilState(joinedState)
  const setMuted = useSetRecoilState(userMuteState)
  const setSelectTab = useSetRecoilState(controllerTabSelectedState)
  const client = useRecoilValue(clientState)
  const deviceId = useRecoilValue(deviceIdState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const { t } = useI18n()
  const { id, name, member, type } = channel
  const isAlreadyJoinedChannel = channel && client && channel.id === client.channelName
  const handleJoinChannel = useCallback(async () => {
    if (isTutorial) return false
    if (channel.id === client.channelName) return false
    if (client && client.channelName) handleLeave()
    handleLoading(true)
    const token_result =
      client &&
      !client.channelName &&
      channel &&
      await fetchCreateVoiceToken(channel.id, deviceId)
    if (token_result?.is_success) {
      const { token, room_id } = token_result
      const uid = await client.join(APP_ID, room_id, token)
      if (uid) {
        const join_result = await fetchJoinRoom(room_id, deviceId, uid)
        const mute_result = await fetchToggleVoice(deviceId, true)
        if (mute_result?.is_success) setMuted(true)
        if (join_result?.is_success) {
          const action = 'join_existing_chat'
          const label = localStorage.getItem('isAdmin') ? 'registered' : 'anonymous'
          event({action, label, value: `search: ${room_id}`})
          setSelectTab('chat')
          setJoined(room_id)
          handleLoading(false)
        } else {
          await client.leave()
          handleLoading(false)
        }
      }
    } else {
      handleLoading(false)
    }
  }, [channel, client, deviceId, handleLeave, handleLoading, isTutorial, setJoined, setMuted])
  return (
    <Container channelId={id} member={member} activeSessionIds={activeSessionIds}>
      <div className="cursor-pointer" onClick={handleJoinChannel}>
        <Title keyColorId={keyColorId} text={name} isSame={isAlreadyJoinedChannel} isTutorial={isTutorial} />
        <Exhibitor>{type === 'admin' ? t['chat_channel_for_session'] : t['chat_channel_for_general']}</Exhibitor>
      </div>
      {
        member &&
        admins &&
        users &&
          <Participants members={member} admins={admins} users={users} /> }
    </Container>
  )
}
