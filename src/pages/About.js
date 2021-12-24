import React from 'react'
import tw from 'twin.macro'
import {useI18n} from "use-mini18n";

const Container = tw.div`w-full h-full overflow-y-scroll bg-white pb-40 max-w-4xl md:pb-10 md:w-10/12 mx-auto`
const SectionTitle = tw.h2`text-black font-bold tracking-widest text-base`
const SectionParagraph = tw.p`text-black text-sm tracking-wider leading-6`

const About = () => {
  const { lang } = useI18n()
  return (
    <Container>
      <div className="px-7 pb-5">
        {
          lang === 'en'
            ? (
              <>
                <div>
                  <SectionTitle className="mt-10">Purpose of the event</SectionTitle>
                  <SectionParagraph className="mt-6">A forum is a place where all participants engage in a discussion. "iamas open_house: 2021" is a "forum" for the Graduate School of Media Creation, where all faculty members and current students will present the results of their diverse research.</SectionParagraph>
                  <SectionParagraph className="mt-6">Rather than exhibiting complete works or introducing the results of well-developed research, we hope that this will be a place where all participants can discuss prototypes that are in the process of trial and error, and ideas that have yet to be theorized. Through this, we hope that you will feel the diversity and the constant attitude of thinking at the Graduate School of Creation.</SectionParagraph>
                  <SectionParagraph className="flex justify-end mt-6">Matsui Shigeru, Chair of the Open House 2021 Organizing Committee</SectionParagraph>
                </div>
                <div>
                  <SectionTitle className="mt-10">About i.frame</SectionTitle>
                  <SectionParagraph className="mt-6">We, the human race, have spent most of our time in physical space. Therefore, we tend to think that physical space is the only reality and assume the customs that have been fostered there. For example, when creating an event in an information space, we tend to think of events held in museums, theaters, halls, etc., as models. However, through various examples, discussions, and practices over the past year, we have become aware that the conditions in physical space do not directly apply to information space.</SectionParagraph>
                  <SectionParagraph className="mt-6">For instance, the scarcity that museums and other buildings have in physical space disappears in information space. In information space, everything feels flat because it can be accessed uniformly regardless of where it is published. Also, it is often forgotten that the key to performing arts is collectivity, when individuals gather together in the same place and share experiences. This is because it is all too natural in physical space. Based on these findings, we have created "i.frame" on a DIY basis as a platform for events in an information space.</SectionParagraph>
                  <SectionParagraph className="mt-6">The name "i.frame" is derived from "iframe" (inline frame), one of the basic HTML elements of web technology, which is used to embed pages into other pages. Using this technology, the platform provides a sense of coherence and cohesion throughout the duration of the event to the various sessions and installations occurring on the Internet without collecting in one place. It also provides chat via two media, voice and text, so that individual visitors from different places can feel as if they are gathered in the same place.</SectionParagraph>
                  <SectionParagraph className="mt-6">We hope that you will enjoy the fun and diverse activities of IAMAS not only by viewing and browsing but also by actively participating in them, for example, by chatting with faculty and students. As a side note, after this event, we plan to make "i.frame" available as open source.</SectionParagraph>
                  <SectionParagraph className="flex justify-end mt-6">The i.frame development team (Kobayashi Shigeru, Kato Akihiro, Nagamatsu Ayumu)</SectionParagraph>
                </div>
                <div>
                  <SectionTitle className="mt-10">Credits</SectionTitle>
                  <SectionParagraph className="mt-6">The Open House 2021 Organizing Committee:</SectionParagraph>
                  <SectionParagraph>Akabane Kyo, Juan Manuel Castro, Kuwakubo Ryota, Kobayashi Shigeru (The i.frame supervisor), Segawa Akira (Design supervisor), Hirabayashi Masami, Matsui Shigeru (Chair) and Yamada Koji</SectionParagraph>
                  <SectionParagraph className="mt-6">i.frame development: <br className="md:hidden" />Kato Akihiro, Nagamatsu Ayumu and Hibino Mitsuhiro</SectionParagraph>
                  <SectionParagraph className="mt-6">Management: <br className="md:hidden" />Sasaki Hiroko (RCIC) and Sasaki Miki (RCIC)</SectionParagraph>
                  <SectionParagraph className="mt-6">Cooperation: <br className="md:hidden" />James Gibson and Hunter Nelson</SectionParagraph>
                </div>
                <div>
                  <SectionTitle className="mt-10">About the Institute of Advanced Media Arts and Sciences [IAMAS]</SectionTitle>
                  <SectionParagraph className="mt-6">The Institute of Advanced Media Arts and Sciences [IAMAS] is a graduate school established by Gifu Prefecture in 2001. Our goal is to contribute to the progress of academic culture and the promotion of the region. IAMAS’ faculty engages in scholarship that combines scientific understanding with artistic sensibility while striving to educate high-level creators who will plunge into the depths of this combination and find inventive ways to improve society.</SectionParagraph>
                  <SectionParagraph className="mt-6">IAMAS offers a single graduate course in Media Creation consisting of a master’s program and a doctoral program. The number of capacity per year is limited to 20 masters students and 3 doctoral students. With 19 accomplished professors teaching a select number of students, IAMAS has earned a global reputation. Our graduates are active in cutting-edge fields like media, culture, art, design, industry, research, and education.</SectionParagraph>
                  <a className="block mt-6" href="https://www.iamas.ac.jp/" target="_blank" rel="noreferrer">
                    <img className="w-60" src="signature.jpg" alt="Institute of Advanced Media Arts and Sciences"/>
                  </a>
                </div>
              </>
            )
            : (
              <>
                <div>
                  <SectionTitle className="mt-10">開催趣旨</SectionTitle>
                  <SectionParagraph className="mt-6">参加者全員が討論に参加することを「フォーラム」と言います。「iamas open_house: 2021」は、メディア表現研究科の全教員と在学生が、多様な研究成果を発表する、メディア表現研究科の「フォーラム」です。</SectionParagraph>
                  <SectionParagraph className="mt-6">完璧な作品の展示、錬成された研究成果の紹介というより、試行錯誤中のプロトタイプや、理論には至らないアイデアについて、参加者全員で討論する場となることを期待しています。このことを通じて、メディア表現研究科の多様さと、一貫する思考の態度に触れていただければ幸いです。</SectionParagraph>
                  <SectionParagraph className="flex justify-end mt-6">オープンハウス実行委員長　松井茂</SectionParagraph>
                </div>
                <div>
                  <SectionTitle className="mt-10">i.Frameについて</SectionTitle>
                  <SectionParagraph className="mt-6">私たち人類は、ほとんどの時間を物理空間で過ごしてきました。このため、物理空間こそが現実であると感じ、そこで醸成された習慣を前提としてしまう習性があります。例えば、情報空間でイベントをつくろうという時においても、美術館や劇場、ホールなどで開催されてきたイベントをモデルとして考えてしまいがちです。しかしながら、この一年間におけるさまざまな事例、議論、実践を通して私たちは、物理空間における条件は情報空間にそのまま適用できないと気付くに至りました。</SectionParagraph>
                  <SectionParagraph className="mt-6">例えば、物理空間において美術館などの建物が持つ希少性は、情報空間においては消失します。情報空間では、どこで公開されているかに関わらず一律にアクセスできるため、すべてがフラットに感じられるからです。また、パフォーミングアーツでは、個々の人間が同じ場所に集まり、一緒に体験するという「共集性」が鍵であることが、情報空間においては忘れられがちです。物理空間ではあまりにも自然なことだからです。これらの知見を基に私たちは、情報空間におけるイベントのプラットフォームとして「i.frame」をDIYで制作しました。</SectionParagraph>
                  <SectionParagraph className="mt-6">「i.frame」という名前は、ウェブ技術の基本的なHTML要素のひとつで、ページの中に他のページを埋め込むために用いられる「iframe」（インラインフレーム）に由来しています。この技術を用いることにより、インターネット上で展開している様々なセッションや展示を一箇所に集めることなく、イベント期間中に繋がりと纏まりを提供します。また、音声とテキストの2つのメディアを使ったチャットを提供することで、別々の場所から訪れた人々が、あたかも同じ場に集まっているかのように感じることができます。</SectionParagraph>
                  <SectionParagraph className="mt-6">ぜひ、鑑賞や閲覧するだけでなく、チャットを活用して教員や学生と話してみるなど、積極的に参加することにより、IAMASの多様な活動の楽しさをより深く味わっていただきたいと思います。なお、今回のイベント終了後、「i.frame」をオープンソースで公開する予定です。</SectionParagraph>
                  <SectionParagraph className="flex justify-end mt-6">《i.frame》開発チーム（小林茂 × 加藤明洋 × 永松歩）</SectionParagraph>
                </div>
                <div>
                  <SectionTitle className="mt-10">クレジット</SectionTitle>
                  <SectionParagraph className="mt-6">オープンハウス2021実行委員会：</SectionParagraph>
                  <SectionParagraph>赤羽亨、ホアン・マヌエル・カストロ、クワクボリョウタ、小林茂（《i.frame》監修）、瀬川晃（デザイン監修）、平林真実、松井茂（委員長）、山田晃嗣</SectionParagraph>
                  <SectionParagraph className="mt-6">《i.frame》開発：<br className="md:hidden" />加藤明洋、永松歩、日比野光紘</SectionParagraph>
                  <SectionParagraph className="mt-6">運営：<br className="md:hidden" />佐々木紘子（RCIC）、佐々木樹（RCIC）</SectionParagraph>
                  <SectionParagraph className="mt-6">協力：<br className="md:hidden" />ジェームズ ギブソン、ハンター・ネルソン</SectionParagraph>
                </div>
                <div>
                  <SectionTitle className="mt-10">情報科学芸術大学院大学［IAMAS］について</SectionTitle>
                  <SectionParagraph className="mt-6">情報科学芸術大学院大学［IAMAS］は、科学的知性と芸術的感性の融合を目指した学術の理論及び応用を教授研究し、その深奥をきわめ、未来社会の新しいあり方を創造的に開拓する「高度な表現者」を養成するとともに、学術文化の向上及び地域の振興に寄与することを目的に、岐阜県が2001年に開学した大学院大学です。</SectionParagraph>
                  <SectionParagraph className="mt-6">研究科はメディア表現研究科（一専攻）、課程は博士前期課程（修士）と博士後期課程（博士）、1学年の入学定員はそれぞれ20名と3名です。英語名称Institute of Advanced Media Arts and Sciencesの頭文字から通称IAMAS（イアマス）と呼ばれて親しまれており、19名の充実した講師陣による少数精鋭の大学院大学として、国内のみならず海外でも広く知られています。卒業生は、メディア・文化・芸術・デザイン・産業・研究・教育といった広汎な分野の第一線で活躍しています。</SectionParagraph>
                  <a className="block mt-6" href="https://www.iamas.ac.jp/" target="_blank" rel="noreferrer">
                    <img className="w-60" src="signature.jpg" alt="情報科学芸術大学院大学"/>
                  </a>
                </div>
              </>
            )
        }
      </div>
    </Container>
  )
}

export default About
