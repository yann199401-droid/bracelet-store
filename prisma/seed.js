const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充种子数据...')

  // 1. Admin User
  const adminPassword = bcrypt.hashSync('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zencraft.com' },
    update: {},
    create: { name: '禅意管理员', email: 'admin@zencraft.com', password: adminPassword, role: 'ADMIN' },
  })
  console.log('✅ 管理员账号: admin@zencraft.com / admin123')

  // 2. Guest user
  await prisma.user.upsert({
    where: { email: 'guest@zencraft.com' },
    update: {},
    create: { name: '手串爱好者', email: 'guest@zencraft.com', password: 'guest', role: 'USER' },
  })

  // 3. Sample users
  const sampleUsers = [
    { name: '清风明月', email: 'user1@test.com' },
    { name: '木石之心', email: 'user2@test.com' },
    { name: '东方雅集', email: 'user3@test.com' },
    { name: '禅修者', email: 'user4@test.com' },
    { name: '文玩达人', email: 'user5@test.com' },
  ]
  for (const u of sampleUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: bcrypt.hashSync('test123', 10) },
    })
  }
  console.log('✅ 示例用户创建完成')

  // 4. Products
  const products = [
    { name: '小叶紫檀手串 · 金星', slug: 'red-sandalwood-goldstar', material: 'WOOD', price: 68.00, sku: 'WD-001', stock: 15, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/wood-bracelet-01.jpg']), description: '精选印度小叶紫檀老料，金星丰富，油性充足。经典8mm圆珠，适合日常佩戴。\n\n【材质】印度小叶紫檀\n【珠径】8mm\n【手围】18cm（含弹性绳）\n【颗数】27+1颗\n\n保养建议：避免接触水、汗液和化学物品，定期用软布擦拭即可保持光泽。' },
    { name: '黄花梨手串 · 鬼脸纹', slug: 'huanghuali-ghostface', material: 'WOOD', price: 128.00, sku: 'WD-002', stock: 8, diameter: 10, lengthCm: 19, featured: true, images: JSON.stringify(['/images/products/wood-bracelet-01.jpg']), description: '海南黄花梨，鬼脸纹理清晰，香气淡雅。10mm大珠，手感厚重。\n\n【材质】海南黄花梨\n【珠径】10mm\n【手围】19cm\n【颗数】21+1颗\n\n每一串的纹理都是独一无二的，自然之美尽在掌握。' },
    { name: '沉香手串 · 惠安系', slug: 'agarwood-huian', material: 'WOOD', price: 258.00, sku: 'WD-003', stock: 5, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/prayer-beads-zen.jpg']), description: '越南惠安系沉香，油脂丰富，香味清甜悠远。8mm圆珠，男女皆宜。\n\n【材质】惠安沉香\n【珠径】8mm\n【手围】18cm\n【颗数】27+1颗\n\n沉香被誉为"众香之首"，佩戴沉香手串不仅是一种装饰，更是一种修行。' },
    { name: '檀木手串 · 老山檀香', slug: 'sandalwood-mysore', material: 'WOOD', price: 88.00, sku: 'WD-004', stock: 20, diameter: 8, lengthCm: 18, featured: false, images: JSON.stringify(['/images/products/wood-bracelet-01.jpg']), description: '印度老山檀香，香味醇厚持久。经典8mm款式，适合作为入门款。\n\n【材质】印度老山檀香\n【珠径】8mm\n【手围】18cm\n【颗数】27+1颗' },
    { name: '血檀手串 · 非洲紫檀', slug: 'african-padauk', material: 'WOOD', price: 38.00, sku: 'WD-005', stock: 30, diameter: 10, lengthCm: 19, featured: false, images: JSON.stringify(['/images/products/wood-bracelet-01.jpg']), description: '非洲血檀，颜色红润，性价比之选。10mm大珠，硬朗大气。\n\n【材质】非洲血檀\n【珠径】10mm\n【手围】19cm' },
    { name: '金丝楠手串 · 水波纹', slug: 'gold-phoebe-waterwave', material: 'WOOD', price: 98.00, sku: 'WD-006', stock: 12, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/wood-bracelet-01.jpg']), description: '金丝楠木水波纹，金光闪闪，纹理如流水般灵动。8mm圆珠。\n\n【材质】金丝楠木\n【珠径】8mm\n【手围】18cm' },
    { name: '绿檀手串 · 玉化料', slug: 'green-sandalwood-jade', material: 'WOOD', price: 48.00, sku: 'WD-007', stock: 25, diameter: 8, lengthCm: 18, featured: false, images: JSON.stringify(['/images/products/wood-bracelet-01.jpg']), description: '南美绿檀，遇光变绿，玉化质感。性价比极高的日常佩戴款。\n\n【材质】南美绿檀\n【珠径】8mm\n【手围】18cm' },
    { name: '和田玉手串 · 白玉', slug: 'hetian-white-jade', material: 'STONE', price: 198.00, sku: 'ST-001', stock: 10, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/jade-beads-assortment.jpg']), description: '新疆和田玉，温润细腻，白度上乘。8mm圆珠，经典不过时。\n\n【材质】新疆和田玉\n【珠径】8mm\n【手围】18cm\n【颗数】27+1颗\n\n古人云"君子比德于玉"，佩戴和田玉手串，彰显君子之风。' },
    { name: '玛瑙手串 · 南红', slug: 'agate-nanhong', material: 'STONE', price: 128.00, sku: 'ST-002', stock: 15, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/bracelets-set-01.jpg']), description: '四川凉山南红玛瑙，色泽红润饱满。8mm圆珠，喜庆吉祥。\n\n【材质】四川南红玛瑙\n【珠径】8mm\n【手围】18cm' },
    { name: '翡翠手串 · 冰种飘花', slug: 'jadeite-ice-flower', material: 'STONE', price: 388.00, sku: 'ST-003', stock: 3, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/jade-bracelets-row.jpg']), description: '缅甸翡翠冰种飘花，质地通透，飘花灵动。高端收藏级手串。\n\n【材质】缅甸翡翠\n【珠径】8mm\n【手围】18cm\n【颗数】27+1颗' },
    { name: '青金石手串 · 帝王蓝', slug: 'lapis-lazuli-royal', material: 'STONE', price: 168.00, sku: 'ST-004', stock: 8, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/bracelets-set-01.jpg']), description: '阿富汗青金石，帝王蓝色泽，金星均匀分布。8mm圆珠。\n\n【材质】阿富汗青金石\n【珠径】8mm\n【手围】18cm' },
    { name: '绿松石手串 · 高瓷蓝', slug: 'turquoise-high-ceramic', material: 'STONE', price: 298.00, sku: 'ST-005', stock: 6, diameter: 6, lengthCm: 17, featured: false, images: JSON.stringify(['/images/products/jade-beads-assortment.jpg']), description: '湖北十堰高瓷蓝绿松石，瓷度极高，颜色艳丽。6mm小珠款。\n\n【材质】湖北绿松石\n【珠径】6mm\n【手围】17cm' },
    { name: '石榴石手串 · 紫牙乌', slug: 'garnet-rhodolite', material: 'STONE', price: 58.00, sku: 'ST-006', stock: 20, diameter: 8, lengthCm: 18, featured: false, images: JSON.stringify(['/images/products/bracelets-set-01.jpg']), description: '巴西紫牙乌石榴石，色泽深邃。8mm圆珠，性价比之选。\n\n【材质】巴西紫牙乌\n【珠径】8mm\n【手围】18cm' },
    { name: '碧玉手串 · 俄罗斯碧玉', slug: 'jadeite-russian-green', material: 'STONE', price: 148.00, sku: 'ST-007', stock: 10, diameter: 8, lengthCm: 18, featured: false, images: JSON.stringify(['/images/products/jade-bracelets-row.jpg']), description: '俄罗斯碧玉，颜色浓郁均匀。8mm圆珠，温润如玉。\n\n【材质】俄罗斯碧玉\n【珠径】8mm\n【手围】18cm' },
    { name: '木石混搭 · 紫檀配玛瑙', slug: 'mixed-sandalwood-agate', material: 'MIXED', price: 88.00, sku: 'MX-001', stock: 12, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/bracelet-dark-beads.jpg']), description: '小叶紫檀搭配南红玛瑙，经典红黑配色，时尚大方。\n\n【材质】小叶紫檀 + 南红玛瑙\n【珠径】8mm\n【手围】18cm' },
    { name: '木石混搭 · 沉香配翡翠', slug: 'mixed-agarwood-jadeite', material: 'MIXED', price: 328.00, sku: 'MX-002', stock: 4, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/bracelet-dark-beads.jpg']), description: '惠安沉香搭配冰种翡翠，低调奢华，香气与玉质的完美结合。\n\n【材质】惠安沉香 + 缅甸翡翠\n【珠径】8mm\n【手围】18cm\n【限量款】仅剩4串' },
    { name: '木石混搭 · 檀木配青金', slug: 'mixed-sandalwood-lapis', material: 'MIXED', price: 108.00, sku: 'MX-003', stock: 10, diameter: 8, lengthCm: 18, featured: false, images: JSON.stringify(['/images/products/bracelet-dark-beads.jpg']), description: '老山檀香搭配青金石，蓝金配色，独具匠心。\n\n【材质】老山檀香 + 青金石\n【珠径】8mm\n【手围】18cm' },
    { name: '木石混搭 · 黄花梨配碧玉', slug: 'mixed-huanghuali-jade', material: 'MIXED', price: 158.00, sku: 'MX-004', stock: 7, diameter: 8, lengthCm: 18, featured: false, images: JSON.stringify(['/images/products/bracelet-dark-beads.jpg']), description: '黄花梨搭配碧玉，木色的温润与绿色的清新相得益彰。\n\n【材质】海南黄花梨 + 俄罗斯碧玉\n【珠径】8mm\n【手围】18cm' },
    { name: '金刚菩提手串 · 尼泊尔', slug: 'bodhi-rudraksha-nepal', material: 'WOOD', price: 68.00, sku: 'WD-008', stock: 20, diameter: 10, lengthCm: 19, featured: false, images: JSON.stringify(['/images/products/bracelet-hand-worn.jpg']), description: '尼泊尔金刚菩提，五瓣经典款。10mm尺寸，适合盘玩。\n\n【材质】金刚菩提\n【珠径】10mm\n【手围】19cm' },
    { name: '星月菩提手串 · 海南', slug: 'bodhi-starmoon-hainan', material: 'WOOD', price: 48.00, sku: 'WD-009', stock: 25, diameter: 8, lengthCm: 18, featured: false, images: JSON.stringify(['/images/products/bracelet-hand-worn.jpg']), description: '海南星月菩提，正月正星。入门级文玩首选。\n\n【材质】星月菩提\n【珠径】8mm\n【手围】18cm' },
    { name: '砗磲手串 · 白玉砗磲', slug: 'giant-clam-white', material: 'STONE', price: 78.00, sku: 'ST-008', stock: 15, diameter: 10, lengthCm: 19, featured: false, images: JSON.stringify(['/images/products/jade-beads-assortment.jpg']), description: '深海白玉砗磲，洁白无瑕。佛家七宝之一，寓意吉祥。\n\n【材质】砗磲\n【珠径】10mm\n【手围】19cm' },
    { name: '蜜蜡手串 · 波罗的海', slug: 'amber-baltic', material: 'STONE', price: 218.00, sku: 'ST-009', stock: 8, diameter: 8, lengthCm: 18, featured: true, images: JSON.stringify(['/images/products/bracelets-set-01.jpg']), description: '波罗的海天然蜜蜡，鸡油黄色泽。每一颗都是千万年的时光结晶。\n\n【材质】波罗的海蜜蜡\n【珠径】8mm\n【手围】18cm' },
  ]

  for (const p of products) {
    const { sku, ...productData } = p
    await prisma.product.upsert({
      where: { sku },
      update: productData,
      create: p,
    })
  }
  console.log(`✅ ${products.length} 款产品创建完成`)

  // 5. Forum Categories
  const forumCategories = [
    { name: '材质讨论', slug: 'material-discussion', description: '讨论各种木材和石材的特性、鉴别、养护', sortOrder: 1 },
    { name: '搭配分享', slug: 'style-sharing', description: '分享手串搭配心得和日常穿搭', sortOrder: 2 },
    { name: '养护知识', slug: 'care-tips', description: '手串保养、盘玩、存放经验交流', sortOrder: 3 },
    { name: '新品预告', slug: 'new-arrivals', description: '获取最新产品资讯和限量款信息', sortOrder: 4 },
  ]

  for (const cat of forumCategories) {
    await prisma.forumCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ 论坛板块创建完成')

  // 6. Sample Forum Posts
  const users = await prisma.user.findMany({ take: 5, skip: 1 }) // skip admin
  const categories = await prisma.forumCategory.findMany()

  const posts = [
    { title: '新手请教：小叶紫檀怎么盘玩最好？', content: '刚入手一串小叶紫檀，请问各位大神盘玩有什么技巧吗？需要戴手套吗？多久能包浆？', categorySlug: 'care-tips' },
    { title: '分享我的南红玛瑙搭配心得', content: '最近入了一串南红玛瑙，搭配我的和田玉吊坠，效果出奇的好。给大家分享几张照片，欢迎交流！', categorySlug: 'style-sharing' },
    { title: '黄花梨和紫檀哪个更适合日常佩戴？', content: '想入手一款日常佩戴的手串，在黄花梨和紫檀之间犹豫。黄花梨纹理好看但听说容易裂？紫檀怕汗？求建议。', categorySlug: 'material-discussion' },
    { title: '沉香手串怎么分辨真假？', content: '最近想入手沉香手串，但市场上假货太多。请教各位行家，怎么分辨沉香的产地和真假？惠安和星洲的区别是什么？', categorySlug: 'material-discussion' },
    { title: '【预告】下月将推出限量款沉香配翡翠手串', content: '感谢各位一直以来的支持！下个月我们将推出一款限量新品——惠安沉香搭配冰种翡翠，数量极少，敬请期待！', categorySlug: 'new-arrivals' },
  ]

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const category = categories.find((c) => c.slug === post.categorySlug) || categories[0]
    await prisma.forumPost.create({
      data: {
        title: post.title,
        content: post.content,
        categoryId: category.id,
        userId: users[i % users.length].id,
        viewCount: Math.floor(Math.random() * 200) + 50,
        createdAt: new Date(Date.now() - (posts.length - i) * 86400000),
      },
    })
  }
  console.log(`✅ ${posts.length} 篇论坛帖子创建完成`)

  // 7. Sample Reviews
  const allProducts = await prisma.product.findMany()

  const reviews = [
    { rating: 5, content: '品质非常好！珠子的油性很足，光泽度很高，戴在手上很有质感。包装也很精美，送礼也很合适。', productIndex: 0 },
    { rating: 5, content: '第二次购买了，这次帮朋友带的。质量一如既往的好，物流也很快。客服态度也很好，非常推荐！', productIndex: 0 },
    { rating: 4, content: '手串很不错，纹理清晰美观。就是稍微小了一点，不过客服很耐心的帮我换了合适的尺寸。', productIndex: 1 },
    { rating: 5, content: '沉香的味道非常好闻，淡淡的，不刺鼻。珠子做工精细，没有任何瑕疵。下次还会再来。', productIndex: 2 },
    { rating: 4, content: '和田玉很温润，白度也不错。这个价格买到这样的品质很满意了。', productIndex: 7 },
    { rating: 5, content: '南红颜色很正，满肉满色。搭配我的绿松石手串效果特别好。', productIndex: 8 },
    { rating: 3, content: '翡翠手串整体不错，冰种确实很透，但飘花的位置不是我最喜欢的款式。品质还是可以的。', productIndex: 9 },
    { rating: 5, content: '木石混搭的款式太有意思了！紫檀配玛瑙非常时尚，同事都问我哪买的。', productIndex: 14 },
    { rating: 4, content: '蜜蜡颜色很好，鸡油黄很正。物流包装也很专业。建议出个更大的尺寸。', productIndex: 21 },
    { rating: 5, content: '已经是老顾客了，这次买的是新品。一如既往的高品质，会一直支持的！', productIndex: 3 },
  ]

  for (const r of reviews) {
    const product = allProducts[r.productIndex]
    if (product) {
      await prisma.productReview.create({
        data: {
          productId: product.id,
          userId: users[r.productIndex % users.length].id,
          rating: r.rating,
          content: r.content,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        },
      })
    }
  }
  console.log(`✅ ${reviews.length} 条评价创建完成`)

  console.log('\n🎉 种子数据填充完成！')
  console.log('📧 管理员: admin@zencraft.com / admin123')
  console.log('📧 测试用户: user1@test.com ~ user5@test.com / test123')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
