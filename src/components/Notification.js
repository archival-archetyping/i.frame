import React, { useState, useEffect, useCallback } from 'react'
import tw, { styled } from 'twin.macro'
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "../configs/firebase";
import { CardNotification } from "./Card/";
import { getDocuments, latestDayReducerFromMaxDisplayTime } from "../util";
import dayjs from "dayjs";
import {useI18n} from "use-mini18n";

const Container = styled.div(({isShow}) => [
  tw`fixed -top-full z-50 left-1/2 w-11/12 transition-all duration-500 ease-in-out`,
  `transform: translateX(-50%);`,
  isShow && tw`top-3`
])

export const Notification = () => {
  const { lang } = useI18n()
  const [isShow, setIsShow] = useState(false)
  const [isShowId, setIsShowId] = useState(undefined)
  const [notificationsCollection] = useCollection(
    firebase.collection('notification'),
    {snapshotListenOptions: {includeMetadataChanges: true}}
  )
  const notifications = getDocuments(notificationsCollection)
  const isPublicNotifications = notifications && notifications.filter(item => item.is_public)
  const latestShownNotification =
    isPublicNotifications &&
    Array.isArray(isPublicNotifications) &&
    isPublicNotifications.length > 0 &&
    isPublicNotifications[0].max_display_time &&
    isPublicNotifications.reduce(latestDayReducerFromMaxDisplayTime)
  const handleCloseNotification = useCallback(() => setIsShow(false), [])
  useEffect(() => {
    if (latestShownNotification && isShowId !== latestShownNotification.id) {
      const notifyTime = dayjs.unix(latestShownNotification.max_display_time.seconds)
      if (notifyTime.isAfter(dayjs())) {
        setIsShow(true)
        setIsShowId(latestShownNotification.id)
      }
    }
  }, [latestShownNotification, isShowId])
  return (
    <>{
      latestShownNotification && (
        <Container isShow={isShow}>
          <CardNotification
            title={lang === 'en' ? latestShownNotification.title_en : latestShownNotification.title_ja}
            content={lang === 'en' ? latestShownNotification.content_en : latestShownNotification.content_ja}
            onClick={handleCloseNotification}
          />
        </Container>
      )
    }</>
  )
}
