import React from 'react'
import tw, { styled } from "twin.macro";
import dayjs from "dayjs";
import {CardSession} from "./CardSession";
import {useI18n} from "use-mini18n";

export const CardCurrentSession = ({ sessions, tags, admins, tag_id }) => {
  const { t } = useI18n()
  const Wrapper = tw.div`mt-12`
  const CardWrapper = styled.div(() => [
    tw`mt-12`,
    `@media (min-width: 768px) {
      display: grid!important;
      grid-template-columns: repeat(auto-fill,minmax(246px,1fr))!important;
      grid-gap: 22px!important;
    }`
  ])
  const Title = tw.h2`text-lg font-bold tracking-wider mb-4`
  const current_sessions = sessions && sessions
    .filter(session => dayjs().isBetween(dayjs.unix(session.start_time.seconds), dayjs.unix(session.end_time.seconds)) && session)
  const tag_filter_current_sessions = tag_id && current_sessions &&
    current_sessions.filter(session => [session.tag1, session.tag2, session.tag3].includes(Number(tag_id)))
  return (
    <Wrapper>
      {
        current_sessions && tags && admins && (
          <>
            <Title>{t['active_sessions']}</Title>
            <CardWrapper>
              {
                tag_id
                  ? tag_filter_current_sessions.map((session, index) => (
                    <CardSession
                      key={`card-session-${index}`}
                      session={session}
                      tags={tags}
                      admins={admins}
                      type="thumb"
                    />
                  ))
                  : current_sessions.map((session, index) => (
                    <CardSession
                      key={`card-session-${index}`}
                      session={session}
                      tags={tags}
                      admins={admins}
                      type="thumb"
                    />
                  ))
              }
            </CardWrapper>
          </>
        )
      }
      {
        ((current_sessions && current_sessions.length === 0) ||
        (tag_filter_current_sessions && tag_filter_current_sessions.length === 0)) && (
          <p className="text-xs text-center">{t['active_sessions_none']}</p>
        )
      }
    </Wrapper>
  )
}
