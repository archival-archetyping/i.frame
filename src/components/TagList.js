import React from 'react'
import tw from 'twin.macro'
import { useHistory } from 'react-router-dom'
import {useI18n} from "use-mini18n";

const Container = tw.div`mt-10`
const Title = tw.p`mb-2 text-xs text-black tracking-widest`
const TagContainer = tw.div`flex flex-wrap`
const Tag = ({name, id, handleMoveTag}) => {
  const Wrapper = tw.button`flex items-center justify-center text-base font-medium bg-gray-300 py-1 px-2 mr-2 mb-2 last:mr-0`
  return (
    <Wrapper onClick={() => handleMoveTag(id)}>
      <span className="italic mr-1">#</span>
      <span>{name}</span>
    </Wrapper>
  )
}

export const TagList = (props) => {
  const { t, lang } = useI18n()
  const history = useHistory()
  const { tags } = props
  const handleMoveTag = (id) => history.push(`/tag/${id}`)
  return (
    <Container>
      <Title>{t['tag_list']}</Title>
      <TagContainer>
        {
          tags && tags.map((tag, index) => (
            <Tag key={`tag-${index}`}
                 name={lang === 'en' ? tag.name_en : tag.name_ja}
                 id={tag.id}
                 handleMoveTag={handleMoveTag}
            />)
          )
        }
      </TagContainer>
    </Container>
  )
}
