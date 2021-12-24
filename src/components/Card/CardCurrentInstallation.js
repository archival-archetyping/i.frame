import React from 'react'
import tw, {styled} from "twin.macro";
import {CardInstallation} from "./CardInstallation";
import {useI18n} from "use-mini18n";
const InstallationWrap = styled.div(() => [
  tw`flex flex-col`,
  `@media (min-width: 768px) {
      display: grid!important;
      grid-template-columns: repeat(auto-fill,minmax(246px,1fr))!important;
      grid-gap: 22px!important;
    }`
])
export const CardCurrentInstallation = ({ installations, tags, admins, tag_id }) => {
  const { t } = useI18n()
  const Wrapper = tw.div`mt-12`
  const Title = tw.h2`text-lg font-bold tracking-wider mb-4`
  const tag_filter_current_installations = installations && tag_id &&
    installations.filter(installation => [installation.tag1, installation.tag2, installation.tag3].includes(Number(tag_id)))
  return (
    <Wrapper>
      <Title>{t['active_installations']}</Title>
      <InstallationWrap>
        {
          tag_filter_current_installations &&
          tags && admins &&
          tag_id &&
          tag_filter_current_installations.map((installation, index) => (
            <CardInstallation
              key={`card-installation-${index}`}
              installation={installation}
              tags={tags}
              admins={admins}
              type="thumb"
            />
          ))
        }
      </InstallationWrap>
      {
        tag_filter_current_installations && tag_filter_current_installations.length === 0 && (
          <p className="text-xs text-center">このタグで現在開催中の展示はありません</p>
        )
      }
    </Wrapper>
  )
}
