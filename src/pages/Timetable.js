import React, {useState} from 'react'
import tw, { styled } from 'twin.macro'
import { useCollection } from "react-firebase-hooks/firestore";
import firebase, { collectionOptions } from "../configs/firebase";
import {getDocuments} from "../util";
import { Heading1 } from "../components/Typography";
import dayjs from "dayjs";
import { sortBy } from "lodash-es";
import {CardSession} from "../components/Card";
import {useI18n} from "use-mini18n";

const Container = tw.div`px-7 pt-8 pb-40 md:pb-10 w-full md:w-10/12 mx-auto`
const TabSelector = ({ selector, selected }) => {
  const { lang } = useI18n()
  const Wrapper = tw.div`flex my-8`
  const Tab = styled.div(({isSelected}) => [
    tw`flex justify-center items-center border-b border-black font-bold text-white pl-1 pr-2 py-1 text-sm w-1/2 cursor-pointer`,
    isSelected && tw`border border-b-0`,
  ])
  const DateText = ({date}) => (
    <p className="text-2xl text-black tracking-widest text-center">
      <span>{date.slice(0, 2)}</span>
      <span className="text-xs">{date.slice(2)}</span>
    </p>
  )
  return (
    <Wrapper>
      <Tab isSelected={selected === '7/22'} onClick={() => selector('7/22')}>
        <DateText date={lang === 'en' ? '22(Thu)' : '22日(木)'} />
      </Tab>
      <Tab isSelected={selected === '7/23'} onClick={() => selector('7/23')}>
        <DateText date={lang === 'en' ? '23(Fri)' : '23日(金)'} />
      </Tab>
    </Wrapper>
  )
}

const TimeTable = () => {
  const { t } = useI18n()
  const [selectedTab, setSelectTab] = useState('7/23')
  const [sessionCollection] = useCollection(firebase.collection('session'), collectionOptions)
  const [tagCollection] = useCollection(firebase.collection('tag'), collectionOptions)
  const [adminCollection] = useCollection(firebase.collection('registered'), collectionOptions)
  const sessions =
    sessionCollection
    && sortBy(getDocuments(sessionCollection), [(o) => o.start_time.seconds])
      .filter(o => o.is_public)
  const tags = getDocuments(tagCollection)
  const admins = getDocuments(adminCollection)
  const handleChangeTab = (tab) => setSelectTab(tab)
  const filterFromDate = (o) => dayjs.unix(o.date.seconds).format('M/D') === selectedTab
  return (
    <Container>
      <Heading1>{t['session_schedule']}</Heading1>
      <TabSelector selector={handleChangeTab} selected={selectedTab} />
      {
        sessions &&
        tags &&
        admins &&
        sessions.filter(filterFromDate).map((session, index) => (
          <CardSession
            key={`card-session-${index}`}
            session={session}
            tags={tags}
            admins={admins}
            type="time"
          />
        ))
      }
    </Container>
  )
}

export default TimeTable
