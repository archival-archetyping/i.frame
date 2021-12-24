import React from 'react'
import tw from 'twin.macro'
import { useParams, useHistory } from 'react-router-dom'
import { useCollection } from "react-firebase-hooks/firestore";
import firebase, {collectionOptions} from "../configs/firebase";
import {getDocuments} from "../util";
import { ButtonBlock } from "../components/Button";
import { CardCurrentSession, CardCurrentInstallation } from "../components/Card";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import {useRecoilValue} from "recoil";
import {keyColorIdState} from "../store/app";
import {useI18n} from "use-mini18n";
dayjs.extend(isBetween)

const Container = tw.div`px-7 pt-4 pb-48 w-full`
const TagInfo = ({title, description}) => {
  const { t } = useI18n()
  const Wrapper = tw.div`mt-4`
  const Info = tw.p`text-xs text-black`
  const Title = tw.p`inline-block text-lg px-2 py-1 bg-gray-200 text-black tracking-wider mt-1`
  const Description = tw.p`flex items-center pl-5 border-l border-black text-black text-sm tracking-wider mt-3`
  return (
    <Wrapper>
      <Info>{t['tag_list']}</Info>
      <Title><span className="italic">#&nbsp;</span>{title}</Title>
      <Description>{description}</Description>
    </Wrapper>
  )
}

const Tag = () => {
  const { id } = useParams()
  const history = useHistory()
  const { t, lang } = useI18n()
  const keyColorId = useRecoilValue(keyColorIdState)
  const [tagCollection] = useCollection(firebase.collection('tag'), collectionOptions)
  const [installationCollection] = useCollection(firebase.collection('installation'), collectionOptions)
  const [sessionCollection] = useCollection(firebase.collection('session'), collectionOptions)
  const [adminCollection] = useCollection(firebase.collection('registered'), collectionOptions)
  const tags = getDocuments(tagCollection)
  const installations = installationCollection && getDocuments(installationCollection).filter(o => o.is_public)
  const sessions = sessionCollection && getDocuments(sessionCollection).filter(o => o.is_public)
  const admins = getDocuments(adminCollection)
  const tag = tags && tags.filter(t => t.id === Number(id))[0]
  const handleMoveToTimetable = () => history.push('/timetable')
  return (
    <Container>
      { tag && <TagInfo title={lang === 'en' ? tag.name_en : tag.name_ja} description={lang === 'en' ? tag.description_en : tag.description_ja} />}
      <CardCurrentSession sessions={sessions} tags={tags} admins={admins} tag_id={id} />
      <div className="mt-8 flex justify-end">
        <ButtonBlock keyColorId={keyColorId} onClick={handleMoveToTimetable}>{t['session_list']}</ButtonBlock>
      </div>
      <CardCurrentInstallation installations={installations} tags={tags} admins={admins} tag_id={id} />
    </Container>
  )
}

export default Tag
