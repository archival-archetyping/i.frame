import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import {CardInstallation, CardCurrentSession} from "../components/Card/";
import {useI18n} from 'use-mini18n'
import tw, {styled} from 'twin.macro'
import {useCollection} from "react-firebase-hooks/firestore";
import firebase, {collectionOptions} from "../configs/firebase";
import { getDocuments } from "../util";
import {ButtonBlock} from "../components/Button";
import {useRecoilValue} from "recoil";
import {keyColorIdState} from "../store/app";

const Container = tw.div`px-4 pb-40 md:pb-10`

const TopLinksNavigation = () => {
  const { t } = useI18n()
  const Wrapper = tw.div`flex w-full border-b border-black md:w-80`
  const LinkWrapper = tw.div`
    flex w-1/2 justify-center items-center text-black text-sm font-bold tracking-widest py-2 md:py-3`
  return (
    <Wrapper>
      <LinkWrapper>
        <Link to={'/about'}>{t['home_link_about']}</Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link to={'/timetable'}>{t['session_list']}</Link>
      </LinkWrapper>
    </Wrapper>
  )
}

const TagList = (props) => {
  const { t, lang } = useI18n()
  const { tags, handleMoveToTag } = props
  const Wrapper = tw.div`mt-10`
  const Info = tw.p`text-xs text-black`
  const TagWrapper = tw.div`mt-2 pl-3 border-l border-black`
  const Tag = ({name, id, lang}) => (
    <button
      className="text-sm bg-gray-200 px-2 py-1 my-1 mr-2"
      onClick={() => handleMoveToTag(id)}
    >
      <span className="italic">#</span>&nbsp;{name}
    </button>
  )
  return (
    <Wrapper {...props}>
      <Info>{t['tag_list']}</Info>
      <TagWrapper>
        {
          tags && tags.map((tag, index) => (
            <Tag
              key={`home-tags-${index}`}
              id={tag.id}
              name={lang === 'en' ? tag.name_en : tag.name_ja}
            />
          ))
        }
      </TagWrapper>
    </Wrapper>
  )
}

const InstallationTitle = tw.h2`text-lg font-bold tracking-wider mt-12 mb-4`
const InstallationWrap = styled.div(() => [
  tw`flex flex-col`,
  `@media (min-width: 768px) {
      display: grid!important;
      grid-template-columns: repeat(auto-fill,minmax(246px,1fr))!important;
      grid-gap: 22px!important;
    }`
])
const Home = () => {
  const history = useHistory()
  const {t} = useI18n()
  const keyColorId = useRecoilValue(keyColorIdState)
  const [installationCollection] = useCollection(firebase.collection('installation'), collectionOptions)
  const [sessionCollection] = useCollection(firebase.collection('session'), collectionOptions)
  const [adminCollection] = useCollection(firebase.collection('registered'), collectionOptions)
  const [tagCollection] = useCollection(firebase.collection('tag'), collectionOptions)
  const installations = installationCollection && getDocuments(installationCollection).filter(o => o.is_public)
  const sessions = sessionCollection && getDocuments(sessionCollection).filter(o => o.is_public)
  const admins = getDocuments(adminCollection)
  const tags = getDocuments(tagCollection)
  const handleMoveToTimetable = () => history.push('/timetable')
  const handleMoveToTag = (id) => history.push(`/tag/${id}`)

  return (
    <Container>
      <TopLinksNavigation />
      <TagList tags={tags} handleMoveToTag={handleMoveToTag} />
      {
        tags && admins && sessions && (
          <CardCurrentSession
            tags={tags}
            admins={admins}
            sessions={sessions}
          />
        )
      }
      <div className="mt-8 flex justify-end">
        <ButtonBlock keyColorId={keyColorId} onClick={handleMoveToTimetable}>{t['session_list']}</ButtonBlock>
      </div>
      <InstallationTitle>{t['active_installations']}</InstallationTitle>
      <InstallationWrap>
        {
          admins &&
          tags &&
          installations &&
          installations.map((installation, index) => (
            <CardInstallation
              key={`card-installation-${index}`}
              installation={installation}
              admins={admins}
              tags={tags}
            />
          ))
        }
      </InstallationWrap>
    </Container>
  )
}

export default Home
