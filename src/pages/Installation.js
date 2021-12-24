import React, {useEffect} from 'react'
import IFrame from 'react-iframe'
import Icon from '@mdi/react'
import { mdiLoading } from "@mdi/js";
import tw, {styled} from 'twin.macro'
import { useHistory, useParams } from 'react-router-dom'
import { useCollection } from "react-firebase-hooks/firestore";
import firebase, { collectionOptions } from "../configs/firebase";
import { getDocuments } from "../util";
import {useRecoilState, useRecoilValue} from "recoil";
import {controllerOpenedState, keyColorIdState, modalMoreOpenState} from "../store/app";
import {joinedState} from "../store/agora";
import {ModalMoreInfo} from "../components/Modal";
import {ModalTitle, ModalAuthor, ModalContent} from "../components/Typography";
import {TagList} from "../components/TagList";
import {useI18n} from "use-mini18n";

const StyledIframeWrap = styled.div(({opened, joined}) => [
  tw`fixed top-10 left-0 w-full z-0 flex justify-center items-center transition-all duration-500 ease-in-out overflow-hidden`,
  `height: calc(100% - 11.25rem);
   @media (min-width: 768px) {
     width: calc(100% - 0.25rem);
     height: calc(100% - 2.5rem);
   }`,
  joined && `height: calc(100% - 9rem);`,
  opened && `
    @media (min-width: 768px) {
      width: calc(100% - 24rem);
    }
  `,
])
const Loading = tw.div`animate-spin`

const Installation = () => {
  const [moreIsOpen, setMoreIsOpen] = useRecoilState(modalMoreOpenState)
  const joined = useRecoilValue(joinedState)
  const controllerOpened = useRecoilValue(controllerOpenedState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const history = useHistory()
  const { id } = useParams()
  const { lang } = useI18n()
  const [adminCollection] = useCollection(firebase.collection('registered'), collectionOptions)
  const [installationCollection] = useCollection(firebase.collection('installation'), collectionOptions)
  const [tagCollection] = useCollection(firebase.collection('tag'), collectionOptions)
  const admins = getDocuments(adminCollection)
  const installations = getDocuments(installationCollection)
  const tags = getDocuments(tagCollection)
  const installation = installations && installations.filter(inst => inst.path === id)[0]
  const author = installation && admins && admins.filter(admin => admin.id === installation.user_id)[0]
  const installation_tags = installation && tags && tags.filter(tag => [installation.tag1, installation.tag2, installation.tag3].includes(Number(tag.id)))
  useEffect(() => {
    if (installation && !installation.is_public) history.push('/')
  }, [history, installation])
  const handleCloseModal = () => setMoreIsOpen(false)
  return (
    <>
      <StyledIframeWrap opened={controllerOpened} joined={joined}>
        {
          installation
            ? <IFrame width="100%" height="100%" src={installation && installation.iframe_url} allow="fullscreen" />
            : <Loading><Icon path={mdiLoading} size={2} color="rgba('0, 0, 0, .6)"/></Loading>
        }
        {
          installation && (
            <ModalMoreInfo isOpen={moreIsOpen} handleClose={handleCloseModal} keyColorId={keyColorId}>
              <ModalTitle>{lang === 'en' ? installation.title_en : installation.title_ja}</ModalTitle>
              <ModalAuthor>{author && lang === 'en' ? author.name_en : author.name_ja}</ModalAuthor>
              { installation.description_ja.length > 0 && <ModalContent>{lang === 'en' ? installation.description_en : installation.description_ja}</ModalContent> }
              { installation_tags && <TagList tags={installation_tags} /> }
            </ModalMoreInfo>
          )
        }
      </StyledIframeWrap>
    </>
  )
}

export default Installation
