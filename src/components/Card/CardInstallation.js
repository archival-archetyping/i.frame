import React from "react";
import {useHistory} from "react-router-dom";
import tw from "twin.macro";
import {useI18n} from "use-mini18n";
import { event } from "../../configs/gtag";

export const CardInstallation = ({installation, tags, admins}) => {
  const { lang } = useI18n()
  const history = useHistory()
  const handleMoveToInstallation = (e) => {
    e.stopPropagation()
    const action = 'view_installation'
    const label = localStorage.getItem('isAdmin') ? 'registered' : 'anonymous'
    const value = `/installation/${installation.path}`
    event({action, label, value})
    history.push(value)
  }
  const handleMoveToTag = (e, id) => {
    e.stopPropagation()
    history.push(`/tag/${id}`)
  }
  const Wrapper = tw.div`flex py-4 border-b border-gray-400 md:w-full md:flex-col md:border md:pt-0 cursor-pointer`
  const DetailInformation = tw.div`pl-2 md:px-4`
  const Title = tw.p`font-bold text-base tracking-widest`
  const AdminName = tw.p`border-l-2 border-black pl-4 font-light text-sm tracking-widest mt-2 flex items-center`
  const TagWrapper = tw.div`flex flex-wrap md:pt-2`
  const Thumbnail = tw.img`w-24 h-24 object-cover md:w-full md:h-40`
  const Tag = ({name, id}) => (
    <button
      className="text-xs bg-gray-200 px-1 mb-2 mr-2 relative z-20"
      onClick={(e) => handleMoveToTag(e, id)}
    >
      <span className="italic">#</span>&nbsp;{name}
    </button>
  )
  const exhibitor = admins.filter(o => o.id === installation.user_id)[0]
  const session_tags = [installation.tag1, installation.tag2, installation.tag3]
    .filter(v => v)
    .map(id => tags.filter(tag => tag.id === id)[0])
  return (
    <Wrapper onClick={handleMoveToInstallation}>
      <Thumbnail src={installation.thumbnail} />
      <DetailInformation>
        <TagWrapper>
          {
            session_tags && session_tags.map((tag, index) => (
              <Tag key={`installation-tag-${index}`} name={lang === 'en' ? tag.name_en : tag.name_ja} id={tag.id} />
            ))
          }
        </TagWrapper>
        { installation && <Title>{ lang === 'en' ? installation.title_en : installation.title_ja }</Title> }
        { exhibitor && <AdminName>{ lang === 'en' ? exhibitor.name_en : exhibitor.name_ja }</AdminName>}
      </DetailInformation>
    </Wrapper>
  )
}
