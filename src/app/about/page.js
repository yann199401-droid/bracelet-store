import Link from 'next/link'
import AboutForm from './ContactForm'
import { getLocale } from '@/lib/i18n-server'
import { timingPath } from '@/lib/timing'

export default function AboutPage() {
  const en = getLocale() === 'en'

  return (
    <div className="timing-page">
      <div className="timing-shell max-w-4xl py-12 md:py-16">
        <p className="timing-kicker">{en ? 'Zen Craft Bracelets' : '禅意手作'}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{en ? 'Time in Detail' : '时间有迹'}</h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-stone-700">{en
          ? 'A bracelet can mark a quiet daily ritual, the start of something new, or a moment shared with someone else. Time in Detail is how we bring those occasions together.'
          : '一串手串，可以陪你度过平常的一天，也可以记住一次出发，或送给一个重要的人。「时间有迹」把这些佩戴的理由放在一起。'}</p>
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="timing-card p-5">
            <h2 className="text-xl">{en ? 'Design inspiration' : '设计灵感'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">{en
              ? 'Stillness, New Paths and Connections are three ways to choose a bracelet by the occasion you have in mind.'
              : '山序、行迹、相赠，对应日常、出发与赠礼。按你想记下的时刻选一串。'}</p>
            <Link href={timingPath} className="timing-link mt-3 inline-block text-sm">{en ? 'Explore the collection' : '浏览系列'}</Link>
          </div>
          <div className="timing-card p-5">
            <h2 className="text-xl">{en ? 'How we describe materials' : '我们如何介绍材质'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">{en
              ? 'Our archive identifies which details come from product listings and which come from supplier imagery.'
              : '产品档案标明当前资料来自商品记录还是供应商图片。能公开的检测或批次资料会注明适用范围。'}</p>
            <Link href="/archive" className="timing-link mt-3 inline-block text-sm">{en ? 'Open the archive' : '查阅产品档案'}</Link>
          </div>
        </section>
        <section id="contact" className="mt-12 scroll-mt-24">
          <h2 className="timing-heading">{en ? 'Contact us' : '联系我们'}</h2>
          <AboutForm />
        </section>
      </div>
    </div>
  )
}
