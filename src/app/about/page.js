import AboutForm from './ContactForm'
import { getLocale, t } from '@/lib/i18n-server'

export default function AboutPage() {
  const locale = getLocale();
  const tr = (key, p) => t(locale, key, p);
  return (
    <div className="cloud-bg">
      {/* Hero */}
      <section className="bg-chinese-ink py-20 relative overflow-hidden">
        <div className="lattice-pattern absolute inset-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-block border border-chinese-gold/50 px-4 py-1 mb-6">
            <span className="text-chinese-gold text-xs tracking-[0.3em]">{tr('about.title')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
            {tr('about.title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {tr('about.desc')}
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-full aspect-square bg-chinese-ivory-dark border border-chinese-gold/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 border-2 border-chinese-gold flex items-center justify-center mx-auto mb-4">
                  <span className="text-chinese-gold text-3xl font-serif">禅</span>
                </div>
                <p className="text-gray-400 text-sm">品牌形象展示</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-chinese-ink mb-6">{tr('about.brand')}</h2>
            <div className="w-16 h-0.5 bg-chinese-gold mb-6" />
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                禅意手作诞生于对中国传统文化的热爱。我们相信，每一块木材、每一颗石材都有它独特的纹理和故事。
              </p>
              <p>
                我们的工匠团队遍访中国各地，精选紫檀、黄花梨、和田玉、玛瑙等优质原材料，
                以传统手工技艺精心打磨，保留材质的天然美感。
              </p>
              <p>
                每一串手串都承载着东方美学的精髓——简约而不简单，内敛而不失韵味。
                我们希望通过这些手作，让更多人感受到自然与匠心的温度。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="chinese-section-title">{tr('about.craft')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: tr('about.craft1'), desc: '精选优质天然木材与石材，严格筛选每一块原材料' },
              { step: '02', title: tr('about.craft2'), desc: '依照纹理精细切割，最大程度保留材质的天然美感' },
              { step: '03', title: tr('about.craft3'), desc: '多道手工打磨工序，确保每一颗珠子圆润光滑' },
              { step: '04', title: tr('about.craft4'), desc: '匠心串制，精心搭配，成就值得珍藏的手作精品' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="w-16 h-16 border-2 border-chinese-gold flex items-center justify-center mx-auto mb-4">
                  <span className="text-chinese-gold font-serif text-xl">{item.step}</span>
                </div>
                <h3 className="font-serif text-lg text-chinese-ink mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-3xl text-chinese-ink mb-6">{tr('about.contactForm')}</h2>
            <div className="w-16 h-0.5 bg-chinese-gold mb-6" />
            <div className="space-y-4 text-gray-600">
              <p>有任何问题或合作意向，欢迎随时联系我们。</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-chinese-gold">✉</span>
                  <span>hello@zencraft.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-chinese-gold">✆</span>
                  <span>+86 400-888-8888</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-chinese-gold">◉</span>
                  <span>中国 · 苏州 · 工业园区</span>
                </div>
              </div>
            </div>
          </div>
          <AboutForm />
        </div>
      </section>
    </div>
  )
}
