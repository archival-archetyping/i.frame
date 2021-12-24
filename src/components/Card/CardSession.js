import React from "react";
import {useHistory} from "react-router-dom";
import tw, { styled } from "twin.macro";
import dayjs from "dayjs";
import {useI18n} from "use-mini18n";
import {event} from "../../configs/gtag";

export const CardSession = ({session, tags, admins, type}) => {
  const { lang } = useI18n()
  const history = useHistory()
  const handleMoveToSession = (e) => {
    e.stopPropagation()
    const action = 'view_session'
    const label = localStorage.getItem('isAdmin') ? 'registered' : 'anonymous'
    const value = `/session/${session.path}`
    event({action, label, value})
    history.push(value)
  }
  const handleMoveToTag = (e, id) => {
    e.stopPropagation()
    history.push(`/tag/${id}`)
  }
  const Wrapper = styled.div(({type}) => [
    tw`flex py-4 border-b border-gray-400 cursor-pointer`,
    type === 'time' && tw``,
    type === 'thumb' && tw`md:w-full md:flex-col md:border md:pt-0`
  ])
  const DetailInformation = tw.div`pl-2 md:px-4`
  const Title = tw.p`font-bold text-base tracking-widest`
  const AdminName = tw.p`border-l-2 border-black pl-4 font-light text-sm tracking-widest mt-2 flex items-center`
  const TagWrapper = tw.div`flex flex-wrap md:pt-2`
  const OpenCloseTime = () => {
    const startTime = dayjs.unix(session.start_time.seconds).format('H:mm')
    const endTime = dayjs.unix(session.end_time.seconds).format('H:mm')
    const TimeText = tw.p`italic font-light text-xs text-black w-20 whitespace-nowrap`
    return (
      <TimeText>{`${startTime}-${endTime}`}</TimeText>
    )
  }
  const Thumbnail = tw.img`w-24 h-24 object-cover md:w-full md:h-40`
  const Tag = ({name, id}) => (
    <button
      className="text-xs bg-gray-200 px-1 mb-2 mr-2 relative z-20"
      onClick={(e) => handleMoveToTag(e, id)}
    >
      <span className="italic">#</span>&nbsp;{name}
    </button>
  )
  const exhibitor = admins.filter(o => o.id === session.user_id)[0]
  const session_tags = [session.tag1, session.tag2, session.tag3]
    .filter(v => v)
    .map(id => tags.filter(tag => tag.id === id)[0])
  return (
    <Wrapper onClick={handleMoveToSession} type={type}>
      { type === 'time' && <OpenCloseTime />}
      { type === 'thumb' && <Thumbnail src={session.thumbnail} />}
      <DetailInformation>
        <TagWrapper>
          {
            session_tags && session_tags.map((tag, index) => (
              <Tag key={`session-tag-${index}`} name={lang === 'en' ? tag.name_en : tag.name_ja} id={tag.id} />
            ))
          }
        </TagWrapper>
        { session && <Title>{lang === 'en' ? session.title_en : session.title_ja }</Title> }
        { exhibitor && <AdminName>{lang === 'en' ? exhibitor.name_en : exhibitor.name_ja }</AdminName>}
      </DetailInformation>
    </Wrapper>
  )
}
