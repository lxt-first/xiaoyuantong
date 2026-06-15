const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  // 0. Clear existing data
  await prisma.foodReview.deleteMany();
  await prisma.secondhand.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.report.deleteMany();
  await prisma.image.deleteMany();
  await prisma.verificationCode.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared all existing data');

  // 1. Create test users
  const users = await Promise.all([
    prisma.user.create({ data: { phone: "13800000001", nickname: "小张爱学习", school: "华北理工大学", major: "计算机科学与技术", certified: true, avatar: "" } }),
    prisma.user.create({ data: { phone: "13800000002", nickname: "李同学", school: "华北理工大学", major: "土木工程", certified: true, avatar: "" } }),
    prisma.user.create({ data: { phone: "13800000003", nickname: "考研小王", school: "华北理工大学", major: "机械工程", certified: true, avatar: "" } }),
    prisma.user.create({ data: { phone: "13800000004", nickname: "美食探店家", school: "华北理工大学", major: "会计学", certified: false, avatar: "" } }),
    prisma.user.create({ data: { phone: "13800000005", nickname: "毕业生转租", school: "华北理工大学", major: "英语", certified: true, avatar: "" } }),
  ]);
  console.log(`Created ${users.length} users`);

  const [u1, u2, u3, u4, u5] = users;

  // 2. Referrals (校招内推)
  await prisma.referral.createMany({ data: [
    { userId: u1.id, company: "字节跳动", position: "前端开发实习生", referralCode: "NTAX2024", description: "急招前端实习生，组内氛围好，有mentor带，坐标北京海淀。要求：熟悉React/TS，有实际项目经验优先。", deadline: "2026-07-15", status: "active" },
    { userId: u2.id, company: "华为", position: "算法工程师", referralCode: "HW2026NLP", description: "华为2012实验室NLP方向校招内推，base深圳，需要硕士及以上学历。", deadline: "2026-09-01", status: "active" },
    { userId: u1.id, company: "腾讯", position: "产品经理", referralCode: "", description: "腾讯CDG事业群产品岗内推，需要有产品sense，会SQL加分。", status: "active" },
  ]});

  // 3. Interviews (面经)
  await prisma.interview.createMany({ data: [
    { userId: u1.id, title: "字节跳动前端实习面经", company: "字节跳动", position: "前端开发实习生", round: "二面", passed: true, experience: "一面：问JS原型链、Promise、React Hooks原理、手写防抖节流\n二面：项目深挖、算法题（LRU缓存）、Vue vs React选型讨论\n三面HR：聊职业规划、实习时间", questions: "LRU缓存实现、Promise.all手写" },
    { userId: u3.id, title: "百度机器学习岗面试经历", company: "百度", position: "机器学习工程师", round: "一面", passed: false, experience: "问了很多数学基础：矩阵求导、概率论、信息熵。手写Kmeans。建议准备充分再去面", questions: "手写K-means聚类、推导交叉熵损失" },
  ]});

  // 4. Rentals (租房)
  await prisma.rental.createMany({ data: [
    { userId: u5.id, title: "校内教师公寓两室一厅整租", area: "校内", community: "教师公寓", price: 1800, layout: "2室1厅1卫", size: 70, description: "因毕业离校转租，教师公寓环境安静，家电齐全，带空调热水器洗衣机。离教学楼步行5分钟。", contact: "13800000005", status: "active" },
    { userId: u2.id, title: "理工北门单间出租", area: "理工北门", community: "阳光花苑", price: 800, layout: "1室0厅1卫", size: 25, description: "北门步行2分钟，朝南单间，带独立卫浴，适合单人居住，水电网均摊。", contact: "13800000002", status: "active" },
    { userId: u4.id, title: "三食堂附近找合租室友（限女生）", area: "校内", community: "学生公寓", price: 600, layout: "合租", size: 15, description: "学生公寓两室，次卧出租，仅限女生合租。本人会计大三，作息规律。", contact: "13800000004", status: "active" },
  ]});

  // 5. Secondhand (二手)
  await prisma.secondhand.createMany({ data: [
    { userId: u1.id, category: "书本", title: "王道考研408全套四本", price: 120, description: "2025版王道408考研全书+真题+模拟题，基本全新，仅数据结构有几页笔记，其他三本全新。", campus: "本部校区", status: "active" },
    { userId: u5.id, category: "生活用品", title: "小冰箱转让 九成新", price: 350, description: "容声92L小冰箱，去年9月买的，因毕业转让，无任何问题，需自取。", campus: "本部校区", status: "active" },
    { userId: u3.id, category: "书本", title: "机械设计基础（第七版）教材", price: 25, description: "期末考完出手，书况8成新，有笔记但不影响阅读。", campus: "本部校区", status: "active" },
    { userId: u4.id, category: "非实体", title: "出校园网流量 50G", price: 15, description: "校园网套餐剩余流量，用不完转出，50G，有效期到月底。", campus: "线上", status: "active" },
  ]});

  // 6. FoodReviews (美食)
  await prisma.foodReview.createMany({ data: [
    { userId: u4.id, restaurant: "三食堂二楼 麻辣香锅", rating: 5, review: "全校最好吃的麻辣香锅没有之一！人均20吃撑，微辣刚好，中辣就有川味了。推荐加藕片和豆皮，特别入味。排队一般要15-20分钟。" },
    { userId: u2.id, restaurant: "一食堂一楼 兰州拉面", rating: 4, review: "面条劲道，汤底浓郁，14块一碗性价比高。牛肉给得也够，就是饭点人太多。建议课间去。" },
    { userId: u1.id, restaurant: "二食堂三楼 黄焖鸡米饭", rating: 3, review: "中规中矩，鸡肉有点少，土豆偏多。小份15大份20，加辣味道还行。偶尔想吃重口味的时候会来。" },
    { userId: u5.id, restaurant: "北门外 烤冷面摊", rating: 5, review: "每天晚上7点出摊，加蛋加肠才8块！阿姨人好料足，酱料是秘制的，比学校里面的好吃太多了。强烈推荐！" },
    { userId: u3.id, restaurant: "三食堂一楼 自选快餐", rating: 3, review: "选择多但偏咸，份量根据阿姨心情浮动。优点是快，不用等。两荤一素12块左右。" },
  ]});

  console.log("Seed complete! Created:");
  console.log(`  - ${users.length} users`);
  console.log("  - 3 referrals, 2 interviews, 3 rentals, 4 secondhand, 5 food reviews");
}

seed().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
